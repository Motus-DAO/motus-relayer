#!/bin/bash

# Script to set up relayer as a separate Git repository
# Usage: ./setup-separate-repo.sh

set -e

echo "🚀 Setting up Motus Relayer as separate repository..."
echo ""

# Check if we're in the relayer directory
if [ ! -f "package.json" ] || [ ! -f "src/index.ts" ]; then
    echo "❌ Error: Please run this script from the relayer directory"
    exit 1
fi

# Check if git is already initialized
if [ -d ".git" ]; then
    echo "⚠️  Git is already initialized in this directory"
    read -p "Do you want to remove existing .git and start fresh? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf .git
        echo "✅ Removed existing .git directory"
    else
        echo "ℹ️  Keeping existing git repository"
    fi
fi

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    echo "✅ Git initialized"
fi

# Add all files
echo "📝 Adding files to git..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "ℹ️  No changes to commit"
else
    echo "💾 Creating initial commit..."
    git commit -m "Initial commit: Motus Relayer Service for EVVM gasless transactions"
    echo "✅ Initial commit created"
fi

echo ""
echo "✅ Relayer repository is ready!"
echo ""
echo "📋 Next steps:"
echo "1. Create a new repository on GitHub (e.g., 'motus-relayer')"
echo "2. Run these commands:"
echo ""
echo "   git remote add origin https://github.com/YOUR_USERNAME/motus-relayer.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "Or if you want to set the remote now, provide your GitHub repository URL:"
read -p "GitHub repository URL (or press Enter to skip): " REPO_URL

if [ ! -z "$REPO_URL" ]; then
    # Remove existing origin if it exists
    git remote remove origin 2>/dev/null || true
    
    echo "🔗 Adding remote repository..."
    git remote add origin "$REPO_URL"
    echo "✅ Remote added: $REPO_URL"
    
    echo ""
    echo "📤 Pushing to GitHub..."
    git branch -M main
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully pushed to GitHub!"
        echo ""
        echo "🎉 Your relayer is now in a separate repository!"
        echo "📖 See DEPLOY.md for deployment instructions"
    else
        echo "❌ Failed to push. Make sure:"
        echo "   - The repository exists on GitHub"
        echo "   - You have push access"
        echo "   - You're authenticated (git credential helper or SSH key)"
    fi
fi
