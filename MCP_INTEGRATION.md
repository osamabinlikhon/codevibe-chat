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

---

## Chrome DevTools MCP Server

### Overview

Chrome DevTools MCP Server provides AI tools with direct access to Chrome DevTools Protocol, enabling browser automation, debugging, and testing capabilities through natural language commands. This integration allows AI assistants to interact with web pages, take screenshots, execute JavaScript, and debug applications.

### Features

- **Browser Control**: Navigate, refresh, and manage browser tabs
- **Page Interaction**: Click elements, fill forms, and scroll pages
- **JavaScript Execution**: Run custom scripts in browser context
- **Screenshots**: Capture page screenshots and DOM snapshots
- **Console Access**: Read and interact with browser console
- **Network Monitoring**: Inspect HTTP requests and responses
- **Performance Analysis**: Access performance metrics and timelines

### Configuration

#### Step 1: Configure MCP Client

Add the Chrome DevTools MCP server to your MCP configuration:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp@latest",
        "--browser-url=http://127.0.0.1:9222"
      ]
    }
  }
}
```

#### Step 2: Start Chrome with Remote Debugging

⚠️ **Security Warning**: Enabling the remote debugging port opens a debugging port on your browser. Any application on your machine can connect to this port and control the browser. Make sure not to browse sensitive websites while the debugging port is open.

Start Chrome with remote debugging enabled:

**macOS:**
```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-debug
```

**Linux:**
```bash
google-chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-debug
```

**Windows:**
```cmd
chrome.exe --remote-debugging-port=9222 --user-data-dir="C:\temp\chrome-debug"
```

#### Step 3: Verify Connection

Check if Chrome is listening on the debugging port:
```bash
curl http://127.0.0.1:9222/json/version
```

You should see JSON response with browser information.

### Usage Examples

#### Navigation and Interaction

```
User: "Navigate to https://example.com"
AI: Uses chrome-devtools to navigate the browser

User: "Take a screenshot of the page"
AI: Captures and returns page screenshot

User: "Click the submit button"
AI: Locates and clicks the button element
```

#### JavaScript Execution

```
User: "Run JavaScript to get page title"
AI: Executes script and returns result

User: "Extract all links from the page"
AI: Runs script to collect href attributes

User: "Check if login form exists"
AI: Queries DOM and verifies element presence
```

#### Console and Debugging

```
User: "Show me the console logs"
AI: Retrieves browser console output

User: "Clear local storage"
AI: Executes clear() on localStorage

User: "Get all session cookies"
AI: Returns cookie information
```

### Available Tools

| Tool | Description |
|------|-------------|
| `navigate` | Navigate to a URL |
| `screenshot` | Capture page screenshot |
| `click` | Click on an element |
| `type` | Type text into input field |
| `scroll` | Scroll page or element |
| `evaluate` | Execute JavaScript |
| `console` | Read console messages |
| `network` | Monitor network requests |

### Troubleshooting

#### Connection Refused

```
Error: Cannot connect to Chrome debugging port
Solution: Ensure Chrome is started with --remote-debugging-port=9222
```

#### No Targets Found

```
Error: No browser targets available
Solution: Check if browser is running and debugging port is correct
```

#### Permission Denied

```
Error: Permission denied accessing port
Solution: Use a different port number or check firewall settings
```

### Security Best Practices

1. **Use isolated profile**: Always use `--user-data-dir` for debugging
2. **Limit exposure**: Don't expose debugging port to network
3. **Close when done**: Stop Chrome instance after debugging
4. **Avoid sensitive sites**: Don't browse sensitive websites with debugging enabled
5. **Use localhost**: Only bind to 127.0.0.1, not 0.0.0.0

### Advanced Configuration

#### Custom Port

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp@latest",
        "--browser-url=http://127.0.0.1:9333"
      ]
    }
  }
}
```

Start Chrome on port 9333:
```bash
chrome --remote-debugging-port=9332
```

#### Headless Mode

```bash
chrome \
  --remote-debugging-port=9222 \
  --headless \
  --user-data-dir=/tmp/chrome-headless
```

### Integration with AI Assistants

#### Claude Desktop

Add to `~/.config/claude/mcp.json`:
```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest", "--browser-url=http://127.0.0.1:9222"]
    }
  }
}
```

#### Cursor IDE

Add to `.cursor/mcp.json` in your project:
```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest", "--browser-url=http://127.0.0.1:9222"]
    }
  }
}
```

### Complete MCP Configuration

Your complete `.vscode/mcp-complete.json`:

```json
{
  "servers": {
    "vercel": {
      "type": "http",
      "url": "https://mcp.vercel.com",
      "auth": "oauth",
      "enabled": true
    },
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer ${env:GITHUB_MCP_TOKEN}"
      },
      "enabled": true
    },
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp@latest",
        "--browser-url=http://127.0.0.1:9222"
      ],
      "enabled": true
    }
  }
}
```

### Resources

- [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/)
- [chrome-devtools-mcp Repository](https://github.com/macOS-notarize/chrome-devtools-mcp)
- [MCP Documentation](https://modelcontextprotocol.io/)

## License

This configuration is provided as part of the CodeVibe Chat project.
