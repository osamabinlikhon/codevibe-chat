import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

interface DeploymentConfig {
  projectName: string;
  githubOrg: string;
  githubRepo: string;
  githubBranch: string;
  envVars: Array<{
    key: string;
    value: string;
    type: 'encrypted' | 'plain';
    target: Array<'production' | 'preview' | 'development'>;
  }>;
}

/**
 * Complete Vercel deployment automation script
 * Following Vercel SDK documentation best practices
 */
async function completeDeployment(config: DeploymentConfig) {
  console.log('🚀 Starting Vercel Deployment Automation\n');
  console.log(`Project: ${config.projectName}`);
  console.log(`Repository: ${config.githubOrg}/${config.githubRepo}\n`);

  try {
    // Phase 1: Project Setup
    console.log('📦 Phase 1: Project Setup');
    console.log('========================');

    let project;
    try {
      project = await vercel.projects.createProject({
        requestBody: {
          name: config.projectName,
          framework: 'nextjs',
          gitRepository: {
            repo: `${config.githubOrg}/${config.githubRepo}`,
            type: 'github',
          },
        },
      });
      console.log(`✅ Project created: ${project.name} (${project.id})`);
    } catch (error: any) {
      if (error?.message?.includes('already exists')) {
        console.log(`ℹ️  Project already exists, fetching details...`);
        const projects = await vercel.projects.getProjects({});
        project = projects.projects?.find((p: any) => p.name === config.projectName);
        
        if (project) {
          console.log(`✅ Project found: ${project.name}`);
        } else {
          throw new Error('Project not found');
        }
      } else {
        throw error;
      }
    }

    // Phase 2: Environment Variables
    console.log('\n🔐 Phase 2: Environment Variables');
    console.log('==================================');

    for (const env of config.envVars) {
      if (env.value) {
        try {
          await vercel.projects.createProjectEnv({
            idOrName: project!.name,
            upsert: 'true',
            requestBody: [env],
          });
          console.log(`✅ Added: ${env.key} → ${env.target.join(', ')}`);
        } catch (error) {
          console.log(`⚠️  Failed to add ${env.key}: ${error}`);
        }
      } else {
        console.log(`⚠️  ${env.key} not provided (${env.target.join(', ')})`);
      }
    }

    // Phase 3: Deployment
    console.log('\n🚀 Phase 3: Deployment');
    console.log('======================');

    const deployment = await vercel.deployments.createDeployment({
      requestBody: {
        name: config.projectName,
        target: 'production',
        gitSource: {
          type: 'github',
          repo: config.githubRepo,
          ref: config.githubBranch,
          org: config.githubOrg,
        },
        projectSettings: {
          framework: 'nextjs',
        },
      },
    });

    console.log(`✅ Deployment initiated!`);
    console.log(`   ID: ${deployment.id}`);
    console.log(`   Status: ${deployment.status}`);
    console.log(`   URL: ${deployment.url}`);

    // Phase 4: Monitor Deployment
    console.log('\n📊 Phase 4: Monitoring Deployment');
    console.log('==================================');

    let deploymentStatus = deployment.status;
    let deploymentURL = deployment.url;

    while (deploymentStatus === 'BUILDING' || deploymentStatus === 'INITIALIZING') {
      console.log(`   Status: ${deploymentStatus}...`);
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds

      const statusResponse = await vercel.deployments.getDeployment({
        idOrUrl: deployment.id,
        withGitRepoInfo: 'true',
      });

      deploymentStatus = statusResponse.status || 'UNKNOWN';
      deploymentURL = statusResponse.url || deploymentURL;
    }

    if (deploymentStatus === 'READY') {
      console.log(`\n🎉 Deployment Successful!`);
      console.log(`   URL: https://${deploymentURL}`);
    } else {
      console.log(`\n❌ Deployment Status: ${deploymentStatus}`);
    }

    return deployment;
  } catch (error) {
    console.error(
      error instanceof Error ? `\n❌ Error: ${error.message}` : `\n❌ ${String(error)}`
    );
    throw error;
  }
}

// Default configuration
const config: DeploymentConfig = {
  projectName: 'codevibe-chat',
  githubOrg: process.env.GITHUB_ORG || 'your-username',
  githubRepo: 'codevibe-chat',
  githubBranch: 'main',
  envVars: [
    {
      key: 'GROQ_API_KEY',
      value: process.env.GROQ_API_KEY || '',
      type: 'encrypted',
      target: ['production', 'preview', 'development'],
    },
    {
      key: 'E2B_API_KEY',
      value: process.env.E2B_API_KEY || '',
      type: 'encrypted',
      target: ['production', 'preview', 'development'],
    },
  ],
};

// Export for use as module
export { completeDeployment, config };

// Run if executed directly
if (require.main === module) {
  completeDeployment(config)
    .then(() => {
      console.log('\n✨ Deployment process complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Deployment failed:', error);
      process.exit(1);
    });
}
