#!/bin/bash

# Portfolio Website AWS Deployment Script
# This script builds and deploys your portfolio website to AWS

set -e  # Exit on any error

# Configuration
# The live resources carry this prefix but are NOT tracked by a CloudFormation
# stack, so they are discovered by name rather than read from stack outputs.
RESOURCE_PREFIX="portfolio-website"
STACK_NAME="$RESOURCE_PREFIX"
REGION="us-east-1"  # Change to your preferred region
DOMAIN_NAME=""  # Leave empty if you don't have a custom domain
RESEND_API_KEY=""  # Only needed when deploying infrastructure

# Infrastructure and Lambda updates are opt-in; a plain run builds the site,
# publishes it, and invalidates the cache.
DEPLOY_INFRA=false
UPDATE_LAMBDAS=false

usage() {
    cat <<'USAGE'
Usage: ./aws-deployment/deploy.sh [options]

  (no options)   Build, sync to S3, invalidate CloudFront.
  --with-infra   Also update the CloudFormation stack. Requires the stack to
                 already exist; this script will not create one.
  --with-lambda  Also repackage and update the contact/health Lambdas.
  --all          Both of the above.
  -h, --help     Show this message.
USAGE
}

while [ $# -gt 0 ]; do
    case "$1" in
        --with-infra)  DEPLOY_INFRA=true ;;
        --with-lambda) UPDATE_LAMBDAS=true ;;
        --all)         DEPLOY_INFRA=true; UPDATE_LAMBDAS=true ;;
        -h|--help)     usage; exit 0 ;;
        *)             echo "Unknown option: $1"; usage; exit 1 ;;
    esac
    shift
done

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
    # Only the CloudFormation template consumes this; a content deploy does not
    # need it, so don't block on a prompt.
    if [ "$DEPLOY_INFRA" != true ]; then
        if [ -f "aws-deployment/config.env" ]; then
            source aws-deployment/config.env
        fi
        return 0
    fi

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

# Echoes the stack's status, or nothing when it does not exist. Exit codes are
# not reliable here — some AWS CLI wrappers return 0 even on a ValidationError —
# so callers must test the returned string.
stack_status() {
    local status
    status=$(aws cloudformation describe-stacks         --stack-name "$STACK_NAME" --region "$REGION"         --query 'Stacks[0].StackStatus' --output text 2>/dev/null || true)
    case "$status" in
        ""|None|*error*|*Error*) echo "" ;;
        *) echo "$status" ;;
    esac
}

# Deploy CloudFormation stack
deploy_infrastructure() {
    if [ "$DEPLOY_INFRA" != true ]; then
        print_status "Skipping infrastructure (pass --with-infra to include it)"
        return 0
    fi

    # Only ever update an existing stack. Creating one from here would
    # provision a duplicate set of resources under the same names.
    if [ -z "$(stack_status)" ]; then
        print_error "CloudFormation stack '$STACK_NAME' not found in $REGION."
        print_status "This script updates an existing stack; it will not create one."
        exit 1
    fi

    # ResendApiKey is a stack parameter wired straight into the contact
    # Lambda's environment. Deploying with it empty overwrites the live key
    # with an empty string and silently breaks the contact form, so refuse.
    if [ -z "$RESEND_API_KEY" ]; then
        print_error "RESEND_API_KEY is empty."
        print_status "Deploying the stack without it would blank the contact Lambda's"
        print_status "key and break the contact form. Set it in aws-deployment/config.env"
        print_status "or export RESEND_API_KEY before running with --with-infra."
        exit 1
    fi

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

# Discover the live resources
get_stack_outputs() {
    print_status "Locating deployed resources..."

    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

    # Prefer stack outputs when a stack exists; otherwise fall back to the
    # documented naming convention and verify each resource really is there.
    if [ -n "$(stack_status)" ]; then
        S3_BUCKET=$(aws cloudformation describe-stacks             --stack-name "$STACK_NAME" --region "$REGION"             --query 'Stacks[0].Outputs[?OutputKey==`WebsiteBucketName`].OutputValue'             --output text)
        API_GATEWAY_URL=$(aws cloudformation describe-stacks             --stack-name "$STACK_NAME" --region "$REGION"             --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayUrl`].OutputValue'             --output text)
    else
        print_warning "No CloudFormation stack '$STACK_NAME'; discovering resources by name"
        S3_BUCKET="${RESOURCE_PREFIX}-${ACCOUNT_ID}"

        API_ID=$(aws apigateway get-rest-apis --region "$REGION"             --query "items[?name=='${RESOURCE_PREFIX}-api'].id" --output text)
        if [ -n "$API_ID" ] && [ "$API_ID" != "None" ]; then
            API_GATEWAY_URL="https://${API_ID}.execute-api.${REGION}.amazonaws.com/prod"
        else
            API_GATEWAY_URL=""
        fi
    fi

    if [ -z "$S3_BUCKET" ] || ! aws s3 ls "s3://${S3_BUCKET}" > /dev/null 2>&1; then
        print_error "S3 bucket '$S3_BUCKET' not found or not accessible."
        print_status "Set RESOURCE_PREFIX at the top of this script to match your bucket."
        exit 1
    fi
    print_success "S3 Bucket: $S3_BUCKET"

    if [ -z "$API_GATEWAY_URL" ]; then
        print_warning "API Gateway not found; api-config.js will be left as-is"
    else
        print_success "API Gateway URL: $API_GATEWAY_URL"
    fi

    # The CloudFront distribution is managed outside CloudFormation, so find it
    # by matching its origin to the bucket.
    CF_INFO=$(aws cloudfront list-distributions         --query "DistributionList.Items[?contains(Origins.Items[0].DomainName, '${S3_BUCKET}')].[Id,DomainName]"         --output text)
    CLOUDFRONT_DISTRIBUTION_ID=$(echo "$CF_INFO" | awk 'NR==1{print $1}')
    CLOUDFRONT_DOMAIN=$(echo "$CF_INFO" | awk 'NR==1{print $2}')

    if [ -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
        print_warning "No CloudFront distribution found for bucket $S3_BUCKET; cache invalidation will be skipped"
        CLOUDFRONT_ALIASES=""
    else
        print_success "CloudFront distribution: $CLOUDFRONT_DISTRIBUTION_ID ($CLOUDFRONT_DOMAIN)"
        CLOUDFRONT_ALIASES=$(aws cloudfront list-distributions             --query "DistributionList.Items[?Id=='${CLOUDFRONT_DISTRIBUTION_ID}'].Aliases.Items[]"             --output text)
    fi
}

# Upload website files to S3
upload_to_s3() {
    print_status "Uploading website files to S3..."

    # Sync all non-HTML assets with long-term cache, excluding api-config.js from deletion
    aws s3 sync dist/ s3://$S3_BUCKET/ \
        --delete \
        --cache-control "max-age=31536000,public" \
        --exclude "*.html" \
        --exclude "api-config.js" \
        --region $REGION

    # Upload HTML files with no-cache (must exclude everything else first, then include *.html)
    aws s3 sync dist/ s3://$S3_BUCKET/ \
        --cache-control "no-cache,no-store,must-revalidate" \
        --exclude "*" \
        --include "*.html" \
        --region $REGION

    print_success "Website files uploaded to S3"
}

  # Apply S3 bucket policy manually
  apply_bucket_policy() {
    print_status "Applying S3 bucket policy..."
    
    # Apply the policy inline (avoids Windows /tmp path issues with AWS CLI)
    aws s3api put-bucket-policy \
        --bucket $S3_BUCKET \
        --policy "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Sid\":\"PublicReadGetObject\",\"Effect\":\"Allow\",\"Principal\":\"*\",\"Action\":\"s3:GetObject\",\"Resource\":\"arn:aws:s3:::${S3_BUCKET}/*\"}]}" \
        --region $REGION
    
    print_success "S3 bucket policy applied"
  }

# Invalidate CloudFront cache
invalidate_cloudfront() {
    if [ -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
        print_warning "Skipping CloudFront invalidation (no distribution found)"
        return
    fi

    print_status "Invalidating CloudFront cache..."

    aws cloudfront create-invalidation \
        --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
        --paths "/*" \
        > /dev/null

    print_success "CloudFront cache invalidated"
}

# Update Lambda functions with actual code
update_lambda_functions() {
    if [ "$UPDATE_LAMBDAS" != true ]; then
        print_status "Skipping Lambda update (pass --with-lambda to include it)"
        return 0
    fi

    for fn in "${RESOURCE_PREFIX}-contact" "${RESOURCE_PREFIX}-health"; do
        if ! aws lambda get-function --function-name "$fn" --region "$REGION" > /dev/null 2>&1; then
            print_error "Lambda '$fn' not found; skipping Lambda update"
            return 0
        fi
    done

    print_status "Updating Lambda functions with actual code..."

    # Use a local dir (avoid /tmp — AWS CLI on Windows can't resolve Git Bash /tmp paths)
    TEMP_DIR="./lambda-deploy-tmp"
    rm -rf "$TEMP_DIR"
    mkdir -p "$TEMP_DIR"

    # Copy Lambda functions
    cp lambda_functions/resend_backend_lambda.js "$TEMP_DIR/"
    cp lambda_functions/lambda_health.js "$TEMP_DIR/"
    cp lambda_functions/package.json "$TEMP_DIR/"

    # Install dependencies
    cd "$TEMP_DIR"
    npm install --production

    # Get Windows-style absolute path (forward slashes) for PowerShell and AWS CLI
    TEMP_WIN=$(cygpath -m "$(pwd)")

    # Create deployment packages via PowerShell (zip not available in Git Bash on Windows)
    powershell -Command "Compress-Archive -Path '${TEMP_WIN}/resend_backend_lambda.js','${TEMP_WIN}/package.json','${TEMP_WIN}/node_modules' -DestinationPath '${TEMP_WIN}/contact-lambda.zip' -Force"
    powershell -Command "Compress-Archive -Path '${TEMP_WIN}/lambda_health.js','${TEMP_WIN}/package.json','${TEMP_WIN}/node_modules' -DestinationPath '${TEMP_WIN}/health-lambda.zip' -Force"

    # Update Lambda functions
    aws lambda update-function-code \
        --function-name "${RESOURCE_PREFIX}-contact" \
        --zip-file "fileb://${TEMP_WIN}/contact-lambda.zip" \
        --region $REGION

    aws lambda update-function-code \
        --function-name "${RESOURCE_PREFIX}-health" \
        --zip-file "fileb://${TEMP_WIN}/health-lambda.zip" \
        --region $REGION

    # Clean up
    cd -
    rm -rf "$TEMP_DIR"

    print_success "Lambda functions updated"
}

# Update website configuration with API endpoints
update_website_config() {
    # Overwriting this with an empty URL would break the contact form, so leave
    # the deployed copy alone when the API could not be found.
    if [ -z "$API_GATEWAY_URL" ]; then
        print_warning "Skipping api-config.js (no API Gateway URL discovered)"
        return 0
    fi

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

    if [ ! -z "$CLOUDFRONT_ALIASES" ]; then
        for alias in $CLOUDFRONT_ALIASES; do
            echo "  https://$alias"
        done
    elif [ ! -z "$CLOUDFRONT_DOMAIN" ]; then
        echo "  https://$CLOUDFRONT_DOMAIN"
    else
        echo "  (CloudFront distribution not found — check the S3 bucket website endpoint)"
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
    invalidate_cloudfront

    # Final information
    display_final_info
}

# Run the main function
main "$@"
