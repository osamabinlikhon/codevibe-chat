#!/bin/bash

# ===========================================
# CodeVibe Chat - Complete Setup Script
# ===========================================
#
# This script performs complete setup including:
# - Git configuration and push to GitHub
# - Vercel project linking
# - Integration management
# - Telemetry configuration
#
# Usage: ./scripts/complete-setup.sh
#
# ===========================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/workspace/codevibe-chat"
PROJECT_NAME="codevibe-chat"
GITHUB_ORG="osamabinlikhon"
GITHUB_REPO="codevibe-chat"

# Vercel CLI Commands Reference
show_vercel_help() {
    echo -e "${BLUE}📖 Vercel CLI Commands:${NC}"
    echo ""
    echo "  vercel help              - List all available commands"
    echo "  vercel help [command]    - Detailed info about specific command"
    echo "  vercel --help            - Quick help for any command"
    echo ""
    echo "  vercel                   - Deploy to preview"
    echo "  vercel --prod            - Deploy to production"
    echo "  vercel link              - Link to existing project"
    echo "  vercel unlink            - Unlink from project"
    echo "  vercel logs [url]        - View deployment logs"
    echo "  vercel list              - List deployments"
    echo "  vercel integration add   - Add integration"
    echo "  vercel integration open  - Open integration dashboard"
    echo "  vercel integration list  - List integrations"
    echo "  vercel integration remove- Remove integration"
    echo ""
}

# Vercel Integration Commands
show_integration_help() {
    echo -e "${BLUE}🔗 Vercel Integration Commands:${NC}"
    echo ""
    echo "  vercel integration add [name]    - Add integration resource"
    echo "  vercel integration open [name]   - Open provider dashboard"
    echo "  vercel integration list          - List installed resources"
    echo "  vercel integration remove [name] - Remove integration"
    echo ""
}

# Print banner
print_banner() {
    echo -e "${GREEN}"
    echo "=========================================="
    echo "🚀 CodeVibe Chat - Complete Setup"
    echo "=========================================="
    echo -e "${NC}"
    echo ""
}

# Check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}📋 Checking prerequisites...${NC}"
    
    # Check git
    if ! command -v git &> /dev/null; then
        echo -e "${RED}❌ Git not installed${NC}"
        exit 1
    fi
    echo "  ✅ Git installed"
    
    # Check node
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js not installed${NC}"
        exit 1
    fi
    echo "  ✅ Node.js installed ($(node --version))"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm not installed${NC}"
        exit 1
    fi
    echo "  ✅ npm installed ($(npm --version))"
    
    echo ""
}

# Configure git safe directory
configure_git() {
    echo -e "${YELLOW}🔧 Configuring Git...${NC}"
    
    git config --global --add safe.directory "$PROJECT_DIR" 2>/dev/null || true
    git config --global user.name "CodeVibe Bot" 2>/dev/null || true
    git config --global user.email "bot@codevibe.chat" 2>/dev/null || true
    
    echo "  ✅ Git configured"
    echo ""
}

# Push to GitHub
push_to_github() {
    echo -e "${YELLOW}📤 Pushing to GitHub...${NC}"
    
    cd "$PROJECT_DIR"
    
    # Check if remote exists
    if git remote get-url origin &>/dev/null; then
        echo "  ℹ️  Remote 'origin' already exists"
    else
        echo "  ℹ️  Adding remote 'origin'..."
        git remote add origin "https://github.com/$GITHUB_ORG/$GITHUB_REPO.git" 2>/dev/null || true
    fi
    
    # Rename branch to main if needed
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    if [ "$CURRENT_BRANCH" != "main" ]; then
        echo "  ℹ️  Renaming branch to 'main'..."
        git branch -M main 2>/dev/null || true
    fi
    
    # Push to GitHub
    echo "  ℹ️  Pushing to GitHub..."
    if git push -u origin main 2>&1; then
        echo -e "  ✅ Pushed to https://github.com/$GITHUB_ORG/$GITHUB_REPO"
    else
        echo -e "  ⚠️  Push failed - may require authentication"
        echo "  💡 Run locally: git push -u origin main"
    fi
    
    echo ""
}

# Link to Vercel
link_vercel() {
    echo -e "${YELLOW}🔗 Linking to Vercel...${NC}"
    
    cd "$PROJECT_DIR"
    
    # Check if already linked
    if [ -d ".vercel" ]; then
        echo "  ℹ️  Already linked to Vercel project"
        cat .vercel/project.json 2>/dev/null || true
    else
        echo "  ℹ️  Run locally: vercel link --project $PROJECT_NAME --yes"
        echo "  💡 Or use: ./scripts/link-vercel.sh"
    fi
    
    echo ""
}

# Install Vercel CLI
install_vercel_cli() {
    echo -e "${YELLOW}📦 Checking Vercel CLI...${NC}"
    
    if ! command -v vercel &> /dev/null; then
        echo "  ℹ️  Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    echo "  ✅ Vercel CLI ready"
    echo ""
}

# Configure telemetry
configure_telemetry() {
    echo -e "${YELLOW}🔒 Configuring privacy settings...${NC}"
    
    # Opt-out of telemetry
    export VERCEL_TELEMETRY_DISABLED=1
    export NEXT_TELEMETRY_DISABLED=1
    
    echo "  ✅ Telemetry disabled"
    echo "  ✅ Environment configured"
    echo ""
}

# Display summary
display_summary() {
    echo -e "${GREEN}"
    echo "=========================================="
    echo "✅ Setup Complete!"
    echo "=========================================="
    echo -e "${NC}"
    
    echo ""
    echo -e "${BLUE}📦 Repository:${NC} https://github.com/$GITHUB_ORG/$GITHUB_REPO"
    echo -e "${BLUE}🚀 App URL:${NC} https://codevibe-chat.vercel.app"
    echo ""
    
    echo -e "${YELLOW}📖 Useful Commands:${NC}"
    echo ""
    echo "  # View all Vercel commands"
    echo "  vercel help"
    echo ""
    echo "  # Deploy to production"
    echo "  vercel --prod"
    echo ""
    echo "  # View deployment logs"
    echo "  vercel logs <deployment-url>"
    echo ""
    echo "  # List deployments"
    echo "  vercel list"
    echo ""
    echo "  # Manage integrations"
    echo "  vercel integration list"
    echo "  vercel integration add [name]"
    echo ""
    
    echo -e "${YELLOW}📁 Project Structure:${NC}"
    echo ""
    echo "  $PROJECT_DIR/"
    echo "  ├── .vercel/           # Vercel project config"
    echo "  ├── .vscode/           # MCP server configs"
    echo "  ├── scripts/           # Setup scripts"
    echo "  ├── src/               # Application source"
    echo "  ├── MCP_INTEGRATION.md # MCP documentation"
    echo "  └── package.json       # Dependencies"
    echo ""
    
    echo -e "${GREEN}🎉 Start coding with Vibe Coding!${NC}"
    echo "   Describe what you want, let AI build it!"
    echo ""
}

# Main execution
main() {
    print_banner
    show_vercel_help
    show_integration_help
    check_prerequisites
    configure_git
    push_to_github
    install_vercel_cli
    configure_telemetry
    link_vercel
    display_summary
}

# Run main function
main
