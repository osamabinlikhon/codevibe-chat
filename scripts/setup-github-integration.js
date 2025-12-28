/**
 * GitHub Integration Setup Script
 * 
 * This script connects your CodeVibe Chat project to GitHub for automatic deployments
 * 
 * Usage:
 *   node scripts/setup-github-integration.js
 */

const { execSync } = require('child_process');
const https = require('https');

// Configuration
const config = {
  githubToken: process.env.GITHUB_TOKEN || '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',
  githubOrg: process.env.GITHUB_ORG || 'osamabinlikhon-2301',
  githubRepo: 'codevibe-chat',
};

/**
 * Log helper function
 */
function log(message, type = 'info') {
  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };
  console.log(`${icons[type]} ${message}`);
}

/**
 * Make GitHub API request
 */
function githubRequest(endpoint, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: endpoint,
      method: method,
      headers: {
        Authorization: `Bearer ${config.githubToken}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'CodeVibe-Deploy-Script',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(data);
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

/**
 * Check if GitHub repository exists
 */
async function checkGitHubRepo() {
  log('Checking GitHub repository...', 'info');
  
  try {
    const repo = await githubRequest(
      `/repos/${config.githubOrg}/${config.githubRepo}`
    );
    
    if (repo.id) {
      log(`Found repository: ${repo.full_name}`, 'success');
      return repo;
    }
    return null;
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.status === 404) {
      log(`Repository ${config.githubOrg}/${config.githubRepo} does not exist`, 'warning');
      return null;
    }
    log(`Failed to check repository: ${error.message}`, 'error');
    return null;
  }
}

/**
 * Create GitHub repository
 */
async function createGitHubRepo() {
  log('Creating GitHub repository...', 'info');
  
  try {
    const repo = await githubRequest('/user/repos', 'POST', {
      name: config.githubRepo,
      description: 'CodeVibe Chat - AI-powered chat application with code execution',
      private: false,
      auto_init: false,
    });
    
    log(`Repository created: ${repo.full_name}`, 'success');
    return repo;
  } catch (error) {
    log(`Failed to create repository: ${error.message}`, 'error');
    throw error;
  }
}

/**
 * Configure git and prepare for push
 */
function configureGit() {
  log('Configuring git repository...', 'info');
  
  try {
    execSync('git config user.name "CodeVibe Bot"', { cwd: '/workspace/codevibe-chat' });
    execSync('git config user.email "bot@codevibe.chat"', { cwd: '/workspace/codevibe-chat' });
    log('Git user configured', 'success');
  } catch (error) {
    log(`Failed to configure git: ${error.message}`, 'warning');
  }
}

/**
 * Add files to git
 */
function addGitFiles() {
  log('Staging files...', 'info');
  
  try {
    execSync('git add .', { cwd: '/workspace/codevibe-chat' });
    log('Files staged', 'success');
  } catch (error) {
    log(`Failed to stage files: ${error.message}`, 'warning');
  }
}

/**
 * Create initial commit
 */
function createCommit() {
  log('Creating initial commit...', 'info');
  
  try {
    execSync('git commit -m "Initial commit: CodeVibe Chat application\\n\\nFeatures:\\n- AI-powered chat with Groq\\n- Python code execution with E2B\\n- Modern UI with prompt-kit\\n- Vercel deployment ready"', { 
      cwd: '/workspace/codevibe-chat',
      stdio: 'ignore'
    });
    log('Initial commit created', 'success');
  } catch (error) {
    log('No changes to commit or commit failed', 'warning');
  }
}

/**
 * Display setup summary
 */
function displaySummary(repo) {
  console.log('\n' + '='.repeat(60));
  console.log('🎉 GitHub Integration Setup Complete!');
  console.log('='.repeat(60));
  
  console.log('\n📦 Repository Information:');
  console.log(`   Name: ${repo.full_name}`);
  console.log(`   URL: ${repo.html_url}`);
  console.log(`   Default Branch: ${repo.default_branch || 'main'}`);
  
  console.log('\n🚀 Next Steps:');
  console.log('');
  console.log('   1. Add remote and push to GitHub:');
  console.log(`      cd /workspace/codevibe-chat`);
  console.log(`      git remote add origin https://github.com/${config.githubOrg}/${config.githubRepo}.git`);
  console.log(`      git branch -M main`);
  console.log(`      git push -u origin main`);
  console.log('');
  console.log('   2. Connect repository in Vercel:');
  console.log('      - Go to https://vercel.com/dashboard');
  console.log('      - Import your GitHub repository');
  console.log('      - Deployments will happen automatically');
  console.log('');
  console.log('   3. Configure MCP servers in your AI assistant');
  console.log('      - Use the files in .vscode/ directory');
  
  console.log('\n🔗 Useful Links:');
  console.log(`   Repository: ${repo.html_url}`);
  console.log(`   Vercel: https://vercel.com/dashboard`);
  console.log(`   Actions: ${repo.html_url}/actions`);
  
  console.log('\n' + '='.repeat(60));
}

/**
 * Main setup function
 */
async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('🔗 GitHub Integration Setup');
  console.log('='.repeat(60) + '\n');
  
  // Validate GitHub token
  if (!config.githubToken) {
    log('GITHUB_TOKEN not set', 'error');
    process.exit(1);
  }
  
  try {
    // Check/create repository
    let repo = await checkGitHubRepo();
    
    if (!repo) {
      repo = await createGitHubRepo();
    }
    
    // Configure git
    configureGit();
    addGitFiles();
    createCommit();
    
    // Display summary
    displaySummary(repo);
    
    log('GitHub integration setup complete!', 'success');
  } catch (error) {
    log(`Setup failed: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = {
  checkGitHubRepo,
  createGitHubRepo,
  configureGit,
  addGitFiles,
  createCommit,
};
