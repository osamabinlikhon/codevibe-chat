import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

async function deployToVercel() {
  try {
    console.log('Starting Vercel deployment...');

    // For Git-based deployment using the SDK
    const deployment = await vercel.deployments.createDeployment({
      requestBody: {
        name: 'codevibe-chat',
        target: 'production',
        gitSource: {
          type: 'github',
          repo: 'codevibe-chat',
          ref: 'main',
          org: process.env.GITHUB_USERNAME || 'user', // For personal account
        },
        projectSettings: {
          framework: 'nextjs',
        },
      },
    });

    console.log(`Deployment created: ${deployment.id}`);
    console.log(`Status: ${deployment.status}`);
    console.log(`URL: ${deployment.url}`);

    return deployment;
  } catch (error) {
    console.error(
      error instanceof Error ? `Error: ${error.message}` : String(error)
    );
    throw error;
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  deployToVercel()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { deployToVercel };
