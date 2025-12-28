# GitHub MCP Server Configuration

## Remote GitHub MCP Server Setup

### Option 1: Using OAuth

```json
{
  "servers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "auth": "oauth"
    }
  }
}
```

### Option 2: Using GitHub PAT (Personal Access Token)

```json
{
  "servers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer ${env:GITHUB_MCP_TOKEN}"
      }
    }
  }
}
```

### Option 3: VS Code Configuration (version 1.101 or greater)

```json
{
  "servers": {
    "github": {
      "type": "http",
      "url": ""
    }
  }
}
```

### VS Code with Headers Authentication

```json
{
  "servers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer ${input:github_mcp_pat}"
      }
    }
  },
  "inputs": [
    {
      "type": "promptString",
      "id": "github_mcp_pat",
      "description": "GitHub Personal Access Token",
      "password": true
    }
  ]
}
```

## Environment Setup

Create a `.env` file:

```bash
# GitHub Personal Access Token for MCP
GITHUB_MCP_TOKEN=ghp_your_token_here

# GitHub username or organization
GITHUB_ORG=your-username

# Repository name
GITHUB_REPO=codevibe-chat
```

## Creating a GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes:
   - `repo` - Full control of private repositories
   - `read:org` - Read org and team membership
   - `workflow` - Update GitHub Actions workflows
4. Set expiration (recommended: 30 days)
5. Copy and save the token securely

## Available GitHub MCP Tools

### Repository Management
- `github_list_repos` - List repositories
- `github_get_repo` - Get repository details
- `github_search_code` - Search code in repositories
- `github_list_files` - List files in repository

### Issue Management
- `github_list_issues` - List repository issues
- `github_create_issue` - Create a new issue
- `github_update_issue` - Update an existing issue
- `github_close_issue` - Close an issue

### Pull Request Management
- `github_list_prs` - List pull requests
- `github_get_pr` - Get pull request details
- `github_create_pr` - Create a pull request
- `github_merge_pr` - Merge a pull request

### Workflow Management
- `github_list_workflows` - List GitHub Actions workflows
- `github_get_workflow_run` - Get workflow run details
- `github_run_workflow` - Trigger a workflow

## Usage Examples

### Browse Repository

```
User: "Show me the project structure"
AI: (Uses github_list_files)
→ Returns file tree of the repository
```

### Create Issue

```
User: "Create a bug report for the login issue"
AI: (Uses github_create_issue)
→ Creates issue with title and description
```

### Check CI/CD Status

```
User: "What's the status of the latest workflow run?"
AI: (Uses github_get_workflow_run)
→ Returns workflow status and results
```

## Security Best Practices

1. **Never commit tokens** to version control
2. **Use environment variables** for sensitive data
3. **Set appropriate scopes** - use minimum required permissions
4. **Rotate tokens regularly** - especially if compromised
5. **Use OAuth** when available for better security
