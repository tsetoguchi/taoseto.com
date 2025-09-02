#!/bin/bash

# Portfolio Website AWS Deployment Script
# This script builds and deploys your portfolio website to AWS

set -e  # Exit on any error

# Configuration
STACK_NAME="portfolio-website"
REGION="us-east-1"  # Change to your preferred region
DOMAIN_NAME=""  # Leave empty if you don't have a custom domain
RESEND_API_KEY=""  # You'll be prompted for this

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if AWS CLI is installed
check_aws_cli() {
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed. Please install it first."
        print_status "Visit: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
        exit 1
    fi
    print_success "AWS CLI is installed"
}

# Check if user is authenticated with AWS
check_aws_auth() {
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "You are not authenticated with AWS. Please run 'aws configure' first."
        exit 1
    fi
    print_success "AWS authentication verified"
}

# Get Resend API key
get_resend_api_key() {
    # First check if config.env exists and load it
    if [ -f "aws-deployment/config.env" ]; then
        print_status "Loading configuration from config.env..."
        source aws-deployment/config.env
    fi
    
    if [ -z "$RESEND_API_KEY" ]; then
        echo "Please enter your Resend API key:"
        echo "You can paste it using Cmd+V (macOS) or Ctrl+V (Linux/Windows)"
        echo "Or create a config.env file with your API key (see config.env.example)"
        echo -n "API Key: "
        # Try without -s first (visible input)
        read RESEND_API_KEY
        
        # If still empty, try with -s (hidden input)
        if [ -z "$RESEND_API_KEY" ]; then
            echo "Trying hidden input mode..."
            echo -n "API Key (hidden): "
            read -s RESEND_API_KEY
            echo
        fi
        
        # If still empty, try a different approach
        if [ -z "$RESEND_API_KEY" ]; then
            echo "If pasting didn't work, try typing it manually:"
            echo -n "API Key: "
            read RESEND_API_KEY
        fi
    fi
    
    if [ -z "$RESEND_API_KEY" ]; then
        print_error "Resend API key is required"
        print_status "You can also:"
        print_status "1. Set it as an environment variable: export RESEND_API_KEY='your_api_key_here'"
        print_status "2. Create aws-deployment/config.env with your API key"
        print_status "3. Copy aws-deployment/config.env.example to config.env and edit it"
        exit 1
    fi
}

# Build the website
build_website() {
    print_status "Building website..."
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies..."
        npm install
    fi
    
    # Build the project
    npm run build
    
    if [ $? -eq 0 ]; then
        print_success "Website built successfully"
    else
        print_error "Failed to build website"
        exit 1
    fi
}

# Deploy CloudFormation stack
deploy_infrastructure() {
    print_status "Deploying AWS infrastructure..."
    
    # Prepare CloudFormation parameters
    PARAMETERS=""
    if [ ! -z "$DOMAIN_NAME" ]; then
        PARAMETERS="$PARAMETERS DomainName=$DOMAIN_NAME"
    fi
    PARAMETERS="$PARAMETERS ResendApiKey=$RESEND_API_KEY"
    
    # Deploy the stack
    aws cloudformation deploy \
        --template-file aws-deployment/cloudformation-template-minimal.yaml \
        --stack-name $STACK_NAME \
        --parameter-overrides $PARAMETERS \
        --capabilities CAPABILITY_IAM \
        --region $REGION
    
    if [ $? -eq 0 ]; then
        print_success "Infrastructure deployed successfully"
    else
        print_error "Failed to deploy infrastructure"
        exit 1
    fi
}

# Get stack outputs
get_stack_outputs() {
    print_status "Getting stack outputs..."
    
    # Get S3 bucket name
    S3_BUCKET=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --region $REGION \
        --query 'Stacks[0].Outputs[?OutputKey==`WebsiteBucketName`].OutputValue' \
        --output text)
    

    
    # Get API Gateway URL
    API_GATEWAY_URL=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --region $REGION \
        --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayUrl`].OutputValue' \
        --output text)
    
    print_success "S3 Bucket: $S3_BUCKET"
    print_success "API Gateway URL: $API_GATEWAY_URL"
}

# Upload website files to S3
upload_to_s3() {
    print_status "Uploading website files to S3..."
    
    # Sync dist folder to S3
    aws s3 sync dist/ s3://$S3_BUCKET/ \
        --delete \
        --cache-control "max-age=31536000,public" \
        --exclude "*.html" \
        --region $REGION
    
    # Upload HTML files with no-cache
    aws s3 sync dist/ s3://$S3_BUCKET/ \
        --delete \
        --cache-control "no-cache,no-store,must-revalidate" \
        --include "*.html" \
        --region $REGION
    
        print_success "Website files uploaded to S3"
  }

  # Apply S3 bucket policy manually
  apply_bucket_policy() {
    print_status "Applying S3 bucket policy..."
    
    # Create bucket policy JSON
    cat > /tmp/bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$S3_BUCKET/*"
    }
  ]
}
EOF
    
    # Apply the policy
    aws s3api put-bucket-policy \
        --bucket $S3_BUCKET \
        --policy file:///tmp/bucket-policy.json \
        --region $REGION
    
    # Clean up
    rm /tmp/bucket-policy.json
    
    print_success "S3 bucket policy applied"
  }

# Invalidate CloudFront cache
invalidate_cloudfront() {
    print_status "Invalidating CloudFront cache..."
    
    aws cloudfront create-invalidation \
        --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
        --paths "/*" \
        --region $REGION
    
    print_success "CloudFront cache invalidated"
}

# Update Lambda functions with actual code
update_lambda_functions() {
    print_status "Updating Lambda functions with actual code..."
    
    # Create temporary directory for Lambda deployment
    TEMP_DIR=$(mktemp -d)
    
    # Copy Lambda functions
    cp lambda_functions/resend_backend_lambda.js $TEMP_DIR/
    cp lambda_functions/lambda_health.js $TEMP_DIR/
    cp lambda_functions/package.json $TEMP_DIR/
    
    # Install dependencies
    cd $TEMP_DIR
    npm install --production
    
    # Create deployment packages
    zip -r contact-lambda.zip resend_backend_lambda.js package.json node_modules/
    zip -r health-lambda.zip lambda_health.js package.json node_modules/
    
    # Update Lambda functions
    aws lambda update-function-code \
        --function-name "${STACK_NAME}-contact" \
        --zip-file fileb://contact-lambda.zip \
        --region $REGION
    
    aws lambda update-function-code \
        --function-name "${STACK_NAME}-health" \
        --zip-file fileb://health-lambda.zip \
        --region $REGION
    
    # Clean up
    cd -
    rm -rf $TEMP_DIR
    
    print_success "Lambda functions updated"
}

# Update website configuration with API endpoints
update_website_config() {
    print_status "Updating website configuration with API endpoints..."
    
    # Create a config file with API endpoints
    cat > dist/api-config.js << EOF
// Auto-generated API configuration
window.API_CONFIG = {
    baseUrl: '$API_GATEWAY_URL',
    endpoints: {
        contact: '$API_GATEWAY_URL/api/contact',
        health: '$API_GATEWAY_URL/api/health'
    }
};
EOF
    
    # Upload the config file
    aws s3 cp dist/api-config.js s3://$S3_BUCKET/api-config.js \
        --cache-control "no-cache,no-store,must-revalidate" \
        --region $REGION
    
    print_success "Website configuration updated"
}

# Display final information
display_final_info() {
    print_success "Deployment completed successfully!"
    echo
    print_status "Your website is now available at:"
    
    if [ ! -z "$DOMAIN_NAME" ]; then
        echo "  https://$DOMAIN_NAME"
    else
        CLOUDFRONT_DOMAIN=$(aws cloudformation describe-stacks \
            --stack-name $STACK_NAME \
            --region $REGION \
            --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDomainName`].OutputValue' \
            --output text)
        echo "  https://$CLOUDFRONT_DOMAIN"
    fi
    
    echo
    print_status "API Endpoints:"
    echo "  Contact Form: $API_GATEWAY_URL/api/contact"
    echo "  Health Check: $API_GATEWAY_URL/api/health"
    echo
    print_warning "Note: CloudFront distribution may take 5-10 minutes to fully deploy"
}

# Main deployment process
main() {
    echo "🚀 Portfolio Website AWS Deployment"
    echo "=================================="
    echo
    
    # Pre-deployment checks
    check_aws_cli
    check_aws_auth
    get_resend_api_key
    
    # Deployment steps
    build_website
    deploy_infrastructure
    get_stack_outputs
    apply_bucket_policy
    upload_to_s3
    update_lambda_functions
    update_website_config
    
    # Final information
    display_final_info
}

# Run the main function
main "$@"
