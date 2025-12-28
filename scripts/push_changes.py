#!/usr/bin/env python3
"""
Git Push Script for CodeVibe Chat

This script handles git operations including:
- Adding changes
- Committing with a message
- Pushing to remote repository

Usage:
    python push_changes.py [commit_message]

Author: CodeVibe Chat
"""

import subprocess
import os
import sys
import getpass
from pathlib import Path


def run_command(cmd, cwd=None, env=None):
    """Run a command and return the result."""
    try:
        result = subprocess.run(
            cmd,
            cwd=cwd or os.getcwd(),
            env=env or os.environ,
            capture_output=True,
            text=True,
            check=True
        )
        return True, result.stdout
    except subprocess.CalledProcessError as e:
        return False, f"Error: {e.stderr}\n{e.stdout}"
    except FileNotFoundError:
        return False, f"Command not found: {cmd[0]}"


def get_github_token():
    """Get GitHub token from environment or user input."""
    token = os.environ.get('GITHUB_TOKEN')
    if token:
        return token
    
    # Try to get from .env file
    env_path = Path(__file__).parent.parent / '.env.local'
    if env_path.exists():
        with open(env_path, 'r') as f:
            for line in f:
                if line.startswith('GITHUB_TOKEN='):
                    return line.strip().split('=', 1)[1].strip()
    
    return None


def configure_git_credentials(token):
    """Configure git to use the token for authentication."""
    # Set up credential helper
    run_command(['git', 'config', 'credential.helper', 'store'])
    
    # Configure user
    run_command(['git', 'config', 'user.name', 'CodeVibe Bot'])
    run_command(['git', 'config', 'user.email', 'bot@codevibe.chat'])
    
    # Store credentials in .git-credentials
    cred_file = Path.home() / '.git-credentials'
    cred_file.parent.mkdir(parents=True, exist_ok=True)
    
    cred_url = f"https://x-access-token:{token}@github.com"
    with open(cred_file, 'w') as f:
        f.write(cred_url)
    
    # Set permissions
    os.chmod(str(cred_file), 0o600)
    
    return True


def stage_changes(repo_path='.'):
    """Stage all changes."""
    print("📦 Staging changes...")
    success, output = run_command(['git', 'add', '-A'], cwd=repo_path)
    if success:
        print("   ✅ Changes staged successfully")
        return True
    else:
        print(f"   ❌ Failed to stage changes: {output}")
        return False


def commit_changes(message, repo_path='.'):
    """Commit changes with a message."""
    print(f"💾 Committing changes...")
    
    # Check if there are changes to commit
    success, output = run_command(['git', 'status', '--porcelain'], cwd=repo_path)
    if not success:
        print(f"   ❌ Failed to check status: {output}")
        return False
    
    if not output.strip():
        print("   ℹ️  No changes to commit")
        return True
    
    success, output = run_command(
        ['git', 'commit', '-m', message],
        cwd=repo_path
    )
    
    if success:
        print("   ✅ Changes committed successfully")
        print(f"   📝 Commit message: {message}")
        return True
    else:
        print(f"   ❌ Failed to commit: {output}")
        return False


def push_to_remote(remote='origin', branch='main', token=None):
    """Push changes to remote repository."""
    print(f"🚀 Pushing to {remote}/{branch}...")
    
    # Configure git to use token
    if token:
        configure_git_credentials(token)
    
    # Try pushing with different methods
    
    # Method 1: Use stored credentials
    success, output = run_command(
        ['git', 'push', remote, branch],
        cwd=os.getcwd()
    )
    
    if success:
        print(f"   ✅ Successfully pushed to {remote}/{branch}")
        return True
    
    # Method 2: Try with explicit URL
    print("   🔄 Trying alternative authentication method...")
    
    repo_url = f"https://x-access-token:{token}@github.com/osamabinlikhon/codevibe-chat.git"
    success, output = run_command(
        ['git', 'push', repo_url, branch],
        cwd=os.getcwd()
    )
    
    if success:
        print(f"   ✅ Successfully pushed to {remote}/{branch}")
        return True
    
    print(f"   ⚠️  Push failed: {output}")
    print("   💡 You may need to push manually from your local terminal")
    return False


def get_current_branch():
    """Get the current git branch."""
    success, output = run_command(['git', 'rev-parse', '--abbrev-ref', 'HEAD'])
    if success:
        return output.strip()
    return 'main'


def show_status():
    """Show current git status."""
    print("\n📊 Git Status:")
    
    # Current branch
    branch = get_current_branch()
    print(f"   Branch: {branch}")
    
    # Commit status
    success, output = run_command(['git', 'log', '-1', '--oneline'])
    if success:
        print(f"   Last commit: {output.strip()}")
    
    # Working tree status
    success, output = run_command(['git', 'status', '--short'])
    if success:
        lines = output.strip().split('\n') if output.strip() else []
        print(f"   Changes: {len(lines)} files")
    
    print()


def main():
    """Main function to handle git push operations."""
    print("\n" + "="*60)
    print("🚀 CodeVibe Chat - Git Push Script")
    print("="*60 + "\n")
    
    # Show current status
    show_status()
    
    # Get commit message
    if len(sys.argv) > 1:
        commit_message = ' '.join(sys.argv[1:])
    else:
        commit_message = "Update: CodeVibe Chat with Ant Design X integration"
    
    print(f"📝 Commit message: {commit_message}\n")
    
    # Get GitHub token
    token = get_github_token()
    if not token:
        print("⚠️  No GitHub token found in environment or .env.local")
        print("   Please set GITHUB_TOKEN environment variable\n")
    else:
        print("✅ GitHub token found\n")
    
    # Step 1: Stage changes
    if not stage_changes():
        print("\n❌ Failed to stage changes")
        return 1
    
    # Step 2: Commit changes
    if not commit_changes(commit_message):
        print("\n❌ Failed to commit changes")
        return 1
    
    # Step 3: Push to remote
    if push_to_remote(token=token):
        print("\n✅ Successfully pushed all changes!")
        print("\n📌 Next Steps:")
        print("   1. Vercel will automatically deploy your changes")
        print("   2. Visit https://codevibe-chat.vercel.app to see the updates")
        print("   3. Your new features are now live! 🎉")
    else:
        print("\n⚠️  Push failed, but changes are committed locally")
        print("   You can push manually from your local terminal:")
        print("   $ git push origin main")
    
    print("\n" + "="*60)
    return 0


if __name__ == "__main__":
    sys.exit(main())
