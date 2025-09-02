# Portfolio Website AWS Deployment

This directory contains everything needed to deploy your portfolio website to AWS using Lambda functions, API Gateway, S3, and CloudFront.

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   CloudFront    │    │   API Gateway    │    │   Lambda        │
│   (CDN)         │    │   (REST API)     │    │   Functions     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   S3 Bucket     │    │   Contact Form   │    │   Resend Email  │
│   (Static Files)│    │   Endpoint       │    │   Service       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Components:

1. **S3 Bucket**: Hosts your static website files (HTML, CSS, JS, images)
2. **CloudFront**: Global CDN for fast content delivery
3. **API Gateway**: REST API endpoints for your Lambda functions
4. **Lambda Functions**: Serverless backend for contact form and health checks
5. **Resend**: Email service for contact form functionality

## Prerequisites

1. **AWS CLI** installed and configured
   ```bash
   # Install AWS CLI
   curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
   sudo installer -pkg AWSCLIV2.pkg -target /
   
   # Configure AWS CLI
   aws configure
   ```

2. **Resend API Key**
   - Sign up at [resend.com](https://resend.com)
   - Get your API key from the dashboard
   - Verify your domain (taoseto.com)

3. **Node.js and npm** (for building the website)

## Quick Deployment

1. **Make the deployment script executable:**
   ```bash
   chmod +x aws-deployment/deploy.sh
   ```

2. **Run the deployment:**
   ```bash
   ./aws-deployment/deploy.sh
   ```

3. **Follow the prompts:**
   - Enter your Resend API key when prompted
   - Wait for the deployment to complete (5-10 minutes)

## Manual Deployment Steps

If you prefer to deploy manually or need to troubleshoot:

### 1. Build the Website
```bash
npm install
npm run build
```

### 2. Deploy Infrastructure
```bash
# Deploy CloudFormation stack
aws cloudformation deploy \
  --template-file aws-deployment/cloudformation-template.yaml \
  --stack-name portfolio-website \
  --parameter-overrides ResendApiKey=your_resend_api_key \
  --capabilities CAPABILITY_IAM \
  --region us-east-1
```

### 3. Get Stack Outputs
```bash
# Get S3 bucket name
S3_BUCKET=$(aws cloudformation describe-stacks \
  --stack-name portfolio-website \
  --region us-east-1 \
  --query 'Stacks[0].Outputs[?OutputKey==`WebsiteBucketName`].OutputValue' \
  --output text)

# Get CloudFront distribution ID
CLOUDFRONT_ID=$(aws cloudformation describe-stacks \
  --stack-name portfolio-website \
  --region us-east-1 \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
  --output text)
```

### 4. Upload Website Files
```bash
# Upload static assets
aws s3 sync dist/ s3://$S3_BUCKET/ \
  --delete \
  --cache-control "max-age=31536000,public" \
  --exclude "*.html"

# Upload HTML files
aws s3 sync dist/ s3://$S3_BUCKET/ \
  --delete \
  --cache-control "no-cache,no-store,must-revalidate" \
  --include "*.html"
```

### 5. Update Lambda Functions
```bash
# Create deployment packages
cd lambda_functions
npm install --production
zip -r contact-lambda.zip resend_backend_lambda.js package.json node_modules/
zip -r health-lambda.zip lambda_health.js package.json node_modules/

# Update Lambda functions
aws lambda update-function-code \
  --function-name portfolio-website-contact \
  --zip-file fileb://contact-lambda.zip \
  --region us-east-1

aws lambda update-function-code \
  --function-name portfolio-website-health \
  --zip-file fileb://health-lambda.zip \
  --region us-east-1
```

### 6. Invalidate CloudFront Cache
```bash
aws cloudfront create-invalidation \
  --distribution-id $CLOUDFRONT_ID \
  --paths "/*" \
  --region us-east-1
```

## Configuration

### Environment Variables

The deployment script uses these environment variables (optional):

```bash
export AWS_REGION=us-east-1
export DOMAIN_NAME=taoseto.com
export RESEND_API_KEY=your_resend_api_key
```

### Custom Domain Setup

If you have a custom domain:

1. **Update the deployment script:**
   ```bash
   # Edit aws-deployment/deploy.sh
   DOMAIN_NAME="taoseto.com"
   ```

2. **Add SSL Certificate:**
   - Request a certificate in AWS Certificate Manager
   - Add the certificate ARN to the CloudFormation template

3. **Update DNS:**
   - Point your domain to the CloudFront distribution
   - Add CNAME record: `taoseto.com` → CloudFront domain

## API Endpoints

After deployment, your API endpoints will be:

- **Contact Form**: `https://[api-id].execute-api.us-east-1.amazonaws.com/prod/api/contact`
- **Health Check**: `https://[api-id].execute-api.us-east-1.amazonaws.com/prod/api/health`

## Monitoring and Logs

### CloudWatch Logs
```bash
# View Lambda function logs
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/portfolio-website"

# Get recent logs
aws logs filter-log-events \
  --log-group-name "/aws/lambda/portfolio-website-contact" \
  --start-time $(date -d '1 hour ago' +%s)000
```

### CloudFront Monitoring
- View metrics in AWS CloudWatch
- Monitor cache hit rates and performance
- Set up alarms for errors

## Cost Optimization

### Estimated Monthly Costs (us-east-1):
- **S3**: ~$0.50 (for small website)
- **CloudFront**: ~$0.85 (first 1TB free)
- **Lambda**: ~$0.20 (1M requests free)
- **API Gateway**: ~$3.50 (1M requests free)
- **Total**: ~$5-10/month

### Cost Reduction Tips:
1. Use CloudFront caching effectively
2. Optimize images and assets
3. Consider using Lambda@Edge for edge computing
4. Monitor usage with AWS Cost Explorer

## Troubleshooting

### Common Issues:

1. **Lambda Function Errors**
   ```bash
   # Check Lambda logs
   aws logs tail /aws/lambda/portfolio-website-contact --follow
   ```

2. **CORS Issues**
   - Verify CORS headers in Lambda functions
   - Check API Gateway CORS settings

3. **Email Not Sending**
   - Verify Resend API key
   - Check Lambda function logs
   - Ensure domain is verified in Resend

4. **CloudFront Not Updating**
   - Wait 5-10 minutes for propagation
   - Create cache invalidation
   - Check CloudFront distribution status

### Useful Commands:

```bash
# Check stack status
aws cloudformation describe-stacks --stack-name portfolio-website

# List Lambda functions
aws lambda list-functions --query 'Functions[?contains(FunctionName, `portfolio-website`)]'

# Test API endpoints
curl -X POST https://[api-id].execute-api.us-east-1.amazonaws.com/prod/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","service":"Web Design","message":"Test message"}'

curl https://[api-id].execute-api.us-east-1.amazonaws.com/prod/api/health
```

## Security Best Practices

1. **Environment Variables**: Never commit API keys to version control
2. **IAM Roles**: Use least privilege principle
3. **HTTPS**: Always use HTTPS (enabled by default)
4. **CORS**: Configure CORS properly for your domain
5. **Input Validation**: Validate all inputs in Lambda functions

## Updates and Maintenance

### Updating the Website:
```bash
# Rebuild and redeploy
npm run build
./aws-deployment/deploy.sh
```

### Updating Lambda Functions:
```bash
# Edit lambda functions
# Then run deployment script or manual steps above
```

### Infrastructure Updates:
```bash
# Update CloudFormation template
# Then redeploy
aws cloudformation deploy \
  --template-file aws-deployment/cloudformation-template.yaml \
  --stack-name portfolio-website \
  --capabilities CAPABILITY_IAM
```

## Support

For issues with:
- **AWS Services**: Check AWS documentation and support
- **Resend**: Contact Resend support
- **Deployment Script**: Check the script logs and AWS CLI output

## License

This deployment setup is provided as-is for educational purposes.
