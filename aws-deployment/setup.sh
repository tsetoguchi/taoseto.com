#!/bin/bash

# Setup script for AWS deployment
# This script helps you set up the prerequisites for deploying your portfolio website

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

echo "🔧 Portfolio Website AWS Setup"
echo "=============================="
echo

# Check if AWS CLI is installed
check_aws_cli() {
    print_status "Checking AWS CLI installation..."
    
    if command -v aws &> /dev/null; then
        AWS_VERSION=$(aws --version)
        print_success "AWS CLI is installed: $AWS_VERSION"
        return 0
    else
        print_error "AWS CLI is not installed"
        return 1
    fi
}

# Install AWS CLI on macOS
install_aws_cli_macos() {
    print_status "Installing AWS CLI on macOS..."
    
    if command -v brew &> /dev/null; then
        print_status "Using Homebrew to install AWS CLI..."
        brew install awscli
    else
        print_status "Downloading AWS CLI installer..."
        curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
        sudo installer -pkg AWSCLIV2.pkg -target /
        rm AWSCLIV2.pkg
    fi
    
    print_success "AWS CLI installed successfully"
}

# Install AWS CLI on Linux
install_aws_cli_linux() {
    print_status "Installing AWS CLI on Linux..."
    
    if command -v apt-get &> /dev/null; then
        # Ubuntu/Debian
        sudo apt-get update
        sudo apt-get install -y awscli
    elif command -v yum &> /dev/null; then
        # CentOS/RHEL
        sudo yum install -y awscli
    else
        print_error "Unsupported Linux distribution. Please install AWS CLI manually."
        print_status "Visit: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
        exit 1
    fi
    
    print_success "AWS CLI installed successfully"
}

# Configure AWS CLI
configure_aws() {
    print_status "Configuring AWS CLI..."
    
    if aws sts get-caller-identity &> /dev/null; then
        print_success "AWS CLI is already configured"
        return 0
    fi
    
    print_warning "AWS CLI is not configured. You'll need to set up your credentials."
    echo
    print_status "You have two options:"
    echo "1. Run 'aws configure' to set up access keys"
    echo "2. Use AWS SSO or IAM roles if you're on an EC2 instance"
    echo
    
    read -p "Would you like to run 'aws configure' now? (y/n): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        aws configure
        print_success "AWS CLI configured successfully"
    else
        print_warning "Please configure AWS CLI before running the deployment script"
        print_status "Run: aws configure"
        exit 1
    fi
}

# Check Node.js and npm
check_node() {
    print_status "Checking Node.js installation..."
    
    if command -v node &> /dev/null && command -v npm &> /dev/null; then
        NODE_VERSION=$(node --version)
        NPM_VERSION=$(npm --version)
        print_success "Node.js is installed: $NODE_VERSION"
        print_success "npm is installed: $NPM_VERSION"
        return 0
    else
        print_error "Node.js or npm is not installed"
        return 1
    fi
}

# Install Node.js on macOS
install_node_macos() {
    print_status "Installing Node.js on macOS..."
    
    if command -v brew &> /dev/null; then
        brew install node
    else
        print_error "Homebrew is not installed. Please install Node.js manually."
        print_status "Visit: https://nodejs.org/"
        exit 1
    fi
    
    print_success "Node.js installed successfully"
}

# Install Node.js on Linux
install_node_linux() {
    print_status "Installing Node.js on Linux..."
    
    if command -v apt-get &> /dev/null; then
        # Ubuntu/Debian
        curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif command -v yum &> /dev/null; then
        # CentOS/RHEL
        curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
        sudo yum install -y nodejs
    else
        print_error "Unsupported Linux distribution. Please install Node.js manually."
        print_status "Visit: https://nodejs.org/"
        exit 1
    fi
    
    print_success "Node.js installed successfully"
}

# Check if zip is available
check_zip() {
    print_status "Checking zip utility..."
    
    if command -v zip &> /dev/null; then
        print_success "zip utility is available"
        return 0
    else
        print_error "zip utility is not available"
        return 1
    fi
}

# Install zip on macOS
install_zip_macos() {
    print_status "Installing zip on macOS..."
    brew install zip
    print_success "zip installed successfully"
}

# Install zip on Linux
install_zip_linux() {
    print_status "Installing zip on Linux..."
    
    if command -v apt-get &> /dev/null; then
        sudo apt-get install -y zip
    elif command -v yum &> /dev/null; then
        sudo yum install -y zip
    else
        print_error "Unsupported Linux distribution. Please install zip manually."
        exit 1
    fi
    
    print_success "zip installed successfully"
}

# Detect OS and install dependencies
detect_and_install() {
    print_status "Detecting operating system..."
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        print_status "Detected macOS"
        OS="macos"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        print_status "Detected Linux"
        OS="linux"
    else
        print_error "Unsupported operating system: $OSTYPE"
        exit 1
    fi
    
    # Check and install AWS CLI
    if ! check_aws_cli; then
        if [[ "$OS" == "macos" ]]; then
            install_aws_cli_macos
        else
            install_aws_cli_linux
        fi
    fi
    
    # Check and install Node.js
    if ! check_node; then
        if [[ "$OS" == "macos" ]]; then
            install_node_macos
        else
            install_node_linux
        fi
    fi
    
    # Check and install zip
    if ! check_zip; then
        if [[ "$OS" == "macos" ]]; then
            install_zip_macos
        else
            install_zip_linux
        fi
    fi
}

# Test AWS connectivity
test_aws() {
    print_status "Testing AWS connectivity..."
    
    if aws sts get-caller-identity &> /dev/null; then
        ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text)
        USER_ARN=$(aws sts get-caller-identity --query 'Arn' --output text)
        print_success "Connected to AWS Account: $ACCOUNT_ID"
        print_success "User: $USER_ARN"
        return 0
    else
        print_error "Failed to connect to AWS"
        return 1
    fi
}

# Test website build
test_build() {
    print_status "Testing website build..."
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Are you in the correct directory?"
        exit 1
    fi
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies..."
        npm install
    fi
    
    # Test build
    print_status "Building website..."
    npm run build
    
    if [ $? -eq 0 ]; then
        print_success "Website builds successfully"
        return 0
    else
        print_error "Website build failed"
        return 1
    fi
}

# Main setup process
main() {
    # Detect OS and install dependencies
    detect_and_install
    
    # Configure AWS
    configure_aws
    
    # Test AWS connectivity
    if ! test_aws; then
        print_error "AWS setup failed. Please check your configuration."
        exit 1
    fi
    
    # Test website build
    if ! test_build; then
        print_error "Website build failed. Please fix the issues before deploying."
        exit 1
    fi
    
    # Make deployment script executable
    chmod +x aws-deployment/deploy.sh
    
    print_success "Setup completed successfully!"
    echo
    print_status "Next steps:"
    echo "1. Get your Resend API key from https://resend.com"
    echo "2. Run the deployment script: ./aws-deployment/deploy.sh"
    echo "3. Or use npm: npm run deploy"
    echo
    print_warning "Make sure you have sufficient AWS permissions to create:"
    echo "- S3 buckets"
    echo "- CloudFront distributions"
    echo "- Lambda functions"
    echo "- API Gateway"
    echo "- IAM roles"
}

# Run the main function
main "$@"
