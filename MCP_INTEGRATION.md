# Vercel MCP Server Integration

## Overview

Vercel MCP (Model Context Protocol) Server is Vercel's official MCP server that provides AI tools with secure access to your Vercel projects. Available at https://mcp.vercel.com, it enables seamless integration with popular AI assistants like Claude, Cursor, and other MCP-compatible clients.

## Features

### Documentation Search
- Search and navigate Vercel documentation using natural language
- Get instant answers about Vercel features, best practices, and APIs
- Access code examples and implementation guides

### Project Management
- List and search your Vercel projects
- View project settings and configurations
- Manage project domains and environment variables

### Deployment Management
- Monitor deployment status and history
- Analyze deployment logs and errors
- Trigger new deployments
- Rollback to previous deployments

### Authentication

Vercel MCP implements the latest MCP Authorization and Streamable HTTP specifications, providing secure OAuth-based authentication.

## Installation

### 1. Configure MCP Client

Create a configuration file in your VS Code settings directory:

```json
{
  "servers": {
    "vercel": {
      "type": "http",
      "url": "https://mcp.vercel.com",
      "auth": "oauth"
    }
  }
}
```

### 2. Set Environment Variables

Create a `.env` file in your project root:

```bash
# Vercel MCP Authentication (if using PAT instead of OAuth)
VERCEL_MCP_TOKEN=your_vercel_token

# GitHub MCP Authentication
GITHUB_MCP_TOKEN=your_github_personal_access_token
```

### 3. Restart Your AI Assistant

After configuration, restart your AI assistant to establish the connection.

## Available Tools

### Public Tools (No Authentication Required)

| Tool | Description |
|------|-------------|
| `vercel_docs_search` | Search Vercel documentation |
| `vercel_docs_get` | Get specific documentation page |
| `vercel_guides_list` | List available guides |

### Authenticated Tools (Vercel Authentication Required)

| Tool | Description |
|------|-------------|
| `vercel_projects_list` | List all your Vercel projects |
| `vercel_project_get` | Get project details |
| `vercel_deployments_list` | List project deployments |
| `vercel_deployment_get` | Get deployment details |
| `vercel_deployment_logs` | View deployment logs |
| `vercel_domains_list` | List project domains |
| `vercel_envvars_list` | List environment variables |
| `vercel_deploy` | Trigger a new deployment |

## Usage Examples

### Searching Documentation

```
User: "How do I configure environment variables in Next.js?"
AI: (Uses vercel_docs_search)
→ Returns relevant documentation about environment variables
```

### Managing Deployments

```
User: "Show me the latest deployment status"
AI: (Uses vercel_deployments_list and vercel_deployment_get)
→ Displays deployment status, duration, and any errors
```

### Analyzing Logs

```
User: "Check for errors in the production deployment"
AI: (Uses vercel_deployment_logs with error filter)
→ Returns filtered logs containing errors
```

## GitHub MCP Server

In addition to Vercel MCP, you can integrate the GitHub MCP Server for repository management capabilities.

### GitHub MCP Features

- **Repository Management**: Browse, search, and analyze code
- **Issue & PR Automation**: Create, update, and manage issues and pull requests
- **CI/CD Insights**: Monitor GitHub Actions workflows
- **Code Analysis**: Examine security findings and Dependabot alerts

### GitHub MCP Configuration

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

## Configuration Files

This project includes several MCP configuration files:

| File | Purpose |
|------|---------|
| `.vscode/mcp-vercel.json` | Vercel MCP configuration |
| `.vscode/mcp-github.json` | GitHub MCP configuration |
| `.vscode/mcp-complete.json` | Combined MCP configuration |
| `.env.example` | Environment variable template |

## Environment Variables

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description |
|----------|-------------|
| `VERCEL_TOKEN` | Vercel access token for authenticated tools |
| `GITHUB_TOKEN` | GitHub personal access token |
| `GITHUB_ORG` | GitHub organization or username |

## Security Considerations

1. **Token Storage**: Store tokens in environment variables, never in config files
2. **OAuth Flow**: Use OAuth authentication when available for better security
3. **Token Scope**: Use tokens with minimal required scopes
4. **Token Rotation**: Regularly rotate access tokens
5. **Audit Logs**: Monitor Vercel and GitHub audit logs for unusual activity

## Troubleshooting

### Authentication Issues

```
Error: Authentication failed
Solution: Verify your token is valid and has correct scopes
```

### Connection Timeouts

```
Error: Connection timeout
Solution: Check network connectivity and firewall rules
```

### Missing Tools

```
Error: Tool not found
Solution: Ensure authentication is complete and tools are enabled
```

## Related Resources

- [Vercel MCP Documentation](https://vercel.com/docs/mcp)
- [MCP Specification](https://modelcontextprotocol.io/)
- [Vercel API Documentation](https://vercel.com/docs/api)
- [GitHub MCP Server](https://github.com/github/mcp)

## License

This configuration is provided as part of the CodeVibe Chat project.
