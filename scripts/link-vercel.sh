#!/bin/bash

# Vercel Project Linking Script
# Links the CodeVibe Chat project to Vercel for automatic deployments
#
# Usage: ./scripts/link-vercel.sh
#
# Environment Variables:
#   VERCEL_TOKEN - Vercel access token
#   VERCEL_TELEMETRY_DISABLED - Set to 1 to opt-out of telemetry

set -e

echo "=========================================="
echo "🔗 Vercel Project Linking Script"
echo "=========================================="
echo ""

# Configuration
PROJECT_DIR="/workspace/codevibe-chat"
PROJECT_NAME="codevibe-chat"
VERCEL_TOKEN="${VERCEL_TOKEN:-}"
TELEMETRY_DISABLED="${VERCEL_TELEMETRY_DISABLED:-}"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "ℹ️  Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Handle telemetry settings
if [ "$TELEMETRY_DISABLED" = "1" ]; then
    echo "ℹ️  Telemetry disabled via environment variable"
    export VERCEL_TELEMETRY_DISABLED=1
fi

# Verify token is set
if [ -z "$VERCEL_TOKEN" ]; then
    echo "⚠️  VERCEL_TOKEN not set"
    echo ""
    echo "Please set your Vercel token:"
    echo "  export VERCEL_TOKEN=your_token_here"
    echo ""
    echo "You can create a token at:"
    echo "  https://vercel.com/account/tokens"
    exit 1
fi

# Configure Vercel CLI
echo "ℹ️  Configuring Vercel CLI..."
echo "$VERCEL_TOKEN" | vercel login --token=stdin 2>/dev/null || true

# Opt-out of telemetry if requested
if [ "$TELEMETRY_DISABLED" = "1" ]; then
    echo "ℹ️  Disabling telemetry..."
    vercel telemetry disable 2>/dev/null || true
fi

# Navigate to project directory
cd "$PROJECT_DIR"

echo ""
echo "ℹ️  Linking to Vercel project..."
echo ""

# Link to the existing project
vercel link --project "$PROJECT_NAME" --yes

echo ""
echo "✅ Project linked successfully!"

# Display the linking result
if [ -d ".vercel" ]; then
    echo ""
    echo "📁 Vercel configuration created:"
    ls -la .vercel/
    
    echo ""
    echo "🔗 Project linked to:"
    cat .vercel/project.json 2>/dev/null || cat .vercel/*.json 2>/dev/null || echo "Configuration stored in .vercel/"
fi

echo ""
echo "=========================================="
echo "🚀 Deployment Options"
echo "=========================================="
echo ""
echo "To deploy to production:"
echo "  cd $PROJECT_DIR"
echo "  vercel --prod"
echo ""
echo "To deploy from GitHub:"
echo "  1. Push code to GitHub"
echo "  2. Vercel will auto-detect the repository"
echo "  3. Deployments happen automatically on push"
echo ""
echo "📖 Documentation:"
echo "  https://vercel.com/docs/cli/link"
echo "=========================================="
