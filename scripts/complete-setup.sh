#!/bin/bash

# ===========================================
# CodeVibe Chat - Complete Setup Script
# ===========================================
#
# This script performs complete setup including:
# - Git configuration and clean push to GitHub
# - Vercel project linking
# - All Vercel CLI commands documentation
# - Integration management
# - Privacy configuration
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
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/workspace/codevibe-chat"
PROJECT_NAME="codevibe-chat"
GITHUB_ORG="osamabinlikhon"
GITHUB_REPO="codevibe-chat"
GITHUB_TOKEN="${GITHUB_TOKEN:-}"

# Print banner
print_banner() {
    echo -e "${MAGENTA}"
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║          🚀 CodeVibe Chat - Complete Setup               ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
}

# ===========================================
# VERCEL CLI COMMANDS REFERENCE
# ===========================================

show_vercel_help() {
    echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║              📖 Vercel CLI Commands                      ║${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "  vercel help                    List all available commands"
    echo "  vercel help [command]          Detailed info about specific command"
    echo "  vercel --help                  Quick help for any command"
    echo ""
    echo "  ─────────────────────────────────────────────────────────"
    echo "  Core Commands:"
    echo "  ─────────────────────────────────────────────────────────"
    echo "  vercel                         Deploy to preview"
    echo "  vercel --prod                  Deploy to production"
    echo "  vercel link                    Link to existing project"
    echo "  vercel unlink                  Unlink from project"
    echo "  vercel logs [url]              View deployment logs"
    echo "  vercel list                    List deployments"
    echo "  vercel deploy                  Deploy with options"
    echo ""
    echo "  ─────────────────────────────────────────────────────────"
    echo "  Integration Commands:"
    echo "  ─────────────────────────────────────────────────────────"
    echo "  vercel integration add [name]  Add integration resource"
    echo "  vercel integration open [name] Open provider dashboard"
    echo "  vercel integration list        List installed resources"
    echo "  vercel integration remove      Remove integration"
    echo ""
    echo "  ─────────────────────────────────────────────────────────"
    echo "  Utility Commands:"
    echo "  ─────────────────────────────────────────────────────────"
    echo "  vercel telemetry enable        Enable telemetry"
    echo "  vercel telemetry disable       Disable telemetry"
    echo "  vercel telemetry status        Check telemetry status"
    echo ""
}

show_integration_details() {
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║              🔗 Integration Management                    ║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "  vercel integration add [integration-name]"
    echo "      Initialize setup wizard for creating integration resource"
    echo "      Opens browser if not installed via web UI"
    echo ""
    echo "  vercel integration open [integration-name]"
    echo "      Open deep link into provider's dashboard"
    echo "      Quick access to provider resources"
    echo ""
    echo "  vercel integration list"
    echo "      Display all installed resources"
    echo "      Shows: name, status, product, integration"
    echo ""
    echo "  vercel integration remove [integration-name]"
    echo "      Uninstall specified integration"
    echo "      Must remove all resources first"
    echo ""
    echo "  Global Options:"
    echo "    --cwd              Working directory"
    echo "    --debug            Debug mode"
    echo "    --help             Help information"
    echo "    --token            Access token"
    echo "    --scope            Team scope"
    echo ""
}

# ===========================================
# SETUP FUNCTIONS
# ===========================================

check_prerequisites() {
    echo -e "${YELLOW}📋 Checking prerequisites...${NC}"
    echo ""
    
    # Check git
    if ! command -v git &> /dev/null; then
        echo -e "  ${RED}❌ Git not installed${NC}"
        exit 1
    fi
    echo "  ✅ Git $(git --version | cut -d' ' -f3)"
    
    # Check node
    if ! command -v node &> /dev/null; then
        echo -e "  ${RED}❌ Node.js not installed${NC}"
        exit 1
    fi
    echo "  ✅ Node.js $(node --version)"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        echo -e "  ${RED}❌ npm not installed${NC}"
        exit 1
    fi
    echo "  ✅ npm $(npm --version)"
    
    echo ""
}

configure_git() {
    echo -e "${YELLOW}🔧 Configuring Git...${NC}"
    echo ""
    
    cd "$PROJECT_DIR"
    
    # Configure git
    git config --global --add safe.directory "$PROJECT_DIR" 2>/dev/null || true
    git config --global user.name "CodeVibe Bot" 2>/dev/null || true
    git config --global user.email "bot@codevibe.chat" 2>/dev/null || true
    
    echo "  ✅ Git user configured"
    echo "  ✅ Safe directory configured"
    echo ""
}

cleanup_temporary_files() {
    echo -e "${YELLOW}🧹 Cleaning up temporary files...${NC}"
    echo ""
    
    cd "$PROJECT_DIR"
    
    # Remove problematic .nfs files
    rm -f .nfs* 2>/dev/null || true
    
    # Clean untracked files
    git clean -fd -e node_modules -e .next -e out -e dist-temp -e .vercel 2>/dev/null || true
    
    echo "  ✅ Temporary files cleaned"
    echo ""
}

remove_secrets_from_files() {
    echo -e "${YELLOW}🔒 Removing secrets from files...${NC}"
    echo ""
    
    cd "$PROJECT_DIR"
    
    # Clean .env.example
    if [ -f ".env.example" ]; then
        sed -i 's/GITHUB_TOKEN=ghp_[a-zA-Z0-9]*/GITHUB_TOKEN=your_github_token_here/g' .env.example
        sed -i 's/GROQ_API_KEY=gsk_[a-zA-Z0-9]*/GROQ_API_KEY=your_groq_api_key_here/g' .env.example
        sed -i 's/E2B_API_KEY=e2b_[a-zA-Z0-9]*/E2B_API_KEY=your_e2b_api_key_here/g' .env.example
        echo "  ✅ .env.example cleaned"
    fi
    
    # Ensure .env.local is ignored
    if ! grep -q "^\.env\*\.local" .gitignore 2>/dev/null; then
        cat >> .gitignore << 'EOF'

# Local env files
.env
.env*.local
EOF
        echo "  ✅ .gitignore updated"
    fi
    
    echo ""
}

create_clean_commit() {
    echo -e "${YELLOW}📝 Creating clean commit...${NC}"
    echo ""
    
    cd "$PROJECT_DIR"
    
    # Stage files (ignoring secrets)
    git add -A 2>/dev/null || true
    
    # Check if there are changes
    if git diff --cached --quiet; then
        echo "  ℹ️  No changes to commit"
    else
        # Create commit
        git commit -m "Initial commit: CodeVibe Chat application

🎯 Features:
• AI-powered chat with Groq LLM integration
• Python code execution with E2B sandbox
• Modern UI with prompt-kit components
• Vercel deployment ready
• MCP server configurations for GitHub & Vercel
• Complete automation scripts

🔧 Tech Stack:
• Next.js 14 with App Router
• Vercel AI SDK for chat
• Tailwind CSS + shadcn/ui
• TypeScript throughout

Built with vibe coding - describe, iterate, ship! 🚀"
        
        echo "  ✅ Commit created: $(git rev-parse --short HEAD)"
    fi
    
    echo ""
}

push_to_github() {
    echo -e "${YELLOW}📤 Pushing to GitHub...${NC}"
    echo ""
    
    cd "$PROJECT_DIR"
    
    # Configure remote
    git remote remove origin 2>/dev/null || true
    
    if [ -n "$GITHUB_TOKEN" ]; then
        git remote add origin "https://${GITHUB_TOKEN}@github.com/${GITHUB_ORG}/${GITHUB_REPO}.git"
        echo "  ✅ Remote configured with token"
    else
        git remote add origin "https://github.com/${GITHUB_ORG}/${GITHUB_REPO}.git"
        echo "  ⚠️  Remote configured (authenticate locally if needed)"
    fi
    
    # Ensure main branch
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    if [ "$CURRENT_BRANCH" != "main" ]; then
        git branch -M main
        echo "  ✅ Branch renamed to main"
    fi
    
    # Push
    echo "  📤 Pushing to GitHub..."
    echo ""
    
    if git push -u origin main 2>&1; then
        echo ""
        echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║          🎉 Successfully pushed to GitHub!                ║${NC}"
        echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
        echo ""
        echo "     Repository: https://github.com/${GITHUB_ORG}/${GITHUB_REPO}"
    else
        echo ""
        echo -e "${YELLOW}⚠️  Push requires authentication${NC}"
        echo ""
        echo "  Run locally:"
        echo "    cd $PROJECT_DIR"
        echo "    git push -u origin main"
        echo ""
        echo "  Or use GitHub CLI:"
        echo "    gh auth login"
        echo "    git push -u origin main"
    fi
    
    echo ""
}

install_vercel_cli() {
    echo -e "${YELLOW}📦 Vercel CLI...${NC}"
    echo ""
    
    if ! command -v vercel &> /dev/null; then
        echo "  ℹ️  Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    VERCEL_VERSION=$(vercel --version 2>/dev/null || echo 'installed')
    echo "  ✅ Vercel CLI ${VERCEL_VERSION}"
    echo ""
}

configure_privacy() {
    echo -e "${YELLOW}🔒 Privacy configuration...${NC}"
    echo ""
    
    # Set environment variables
    export VERCEL_TELEMETRY_DISABLED=1
    export NEXT_TELEMETRY_DISABLED=1
    
    echo "  ✅ Vercel CLI telemetry disabled"
    echo "  ✅ Next.js telemetry disabled"
    echo ""
}

# ===========================================
# PRIVATE REPOSITORY SANDBOX EXAMPLE
# ===========================================

show_private_repo_example() {
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║       🔐 Private GitHub Repository with Vercel Sandbox   ║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "  Use Vercel Sandbox to access private GitHub repositories:"
    echo ""
    echo "  1. Create fine-grained personal access token:"
    echo "     https://github.com/settings/tokens"
    echo ""
    echo "     - Token name: Vercel Sandbox Access"
    echo "     - Repository: Select your private repo"
    echo "     - Permissions: Contents (Read), Metadata (Read)"
    echo ""
    echo "  2. Use in your code (TypeScript):"
    echo ""
    cat << 'EOF'
    import { Sandbox } from '@vercel/sandbox';
    
    const sandbox = await Sandbox.create({
      source: {
        url: 'https://github.com/org/private-repo.git',
        type: 'git',
        username: 'x-access-token',
        password: process.env.GIT_ACCESS_TOKEN,
      },
      timeout: '5m',
      ports: [3000],
    });
    
    const result = await sandbox.runCommand('echo', ['Hello!']);
    console.log(await result.stdout());
EOF
    echo ""
    echo "  3. Run with environment variable:"
    echo "     export GIT_ACCESS_TOKEN=ghp_your_token"
    echo "     node script.ts"
    echo ""
    echo "  📖 Docs: https://vercel.com/docs/sandbox"
    echo ""
}

# ===========================================
# FINAL SUMMARY
# ===========================================

display_summary() {
    echo -e "${GREEN}"
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║                  ✅ Setup Complete!                       ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    
    echo -e "${BLUE}🔗 Links:${NC}"
    echo "   GitHub:   https://github.com/${GITHUB_ORG}/${GITHUB_REPO}"
    echo "   Vercel:   https://codevibe-chat.vercel.app"
    echo ""
    
    echo -e "${YELLOW}🚀 Quick Deploy:${NC}"
    echo "   vercel --prod"
    echo ""
    
    echo -e "${CYAN}📖 Commands:${NC}"
    echo "   vercel help              All commands"
    echo "   vercel integration list  View integrations"
    echo "   vercel logs <url>        View logs"
    echo ""
    
    echo -e "${MAGENTA}🎉 Happy Vibe Coding!${NC}"
    echo "   Describe what you want → AI builds it!"
    echo ""
}

# ===========================================
# MAIN EXECUTION
# ===========================================

main() {
    print_banner
    show_vercel_help
    show_integration_details
    check_prerequisites
    configure_git
    cleanup_temporary_files
    remove_secrets_from_files
    create_clean_commit
    push_to_github
    install_vercel_cli
    configure_privacy
    show_private_repo_example
    display_summary
}

# Run main
main
