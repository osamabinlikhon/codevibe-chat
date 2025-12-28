import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

async function setupAndDeployProject() {
  try {
    const projectName = 'codevibe-chat';

    console.log('Setting up CodeVibe Chat project on Vercel...\n');

    // Step 1: Create or get the project
    console.log('1. Creating project...');
    let project;
    try {
      project = await vercel.projects.createProject({
        requestBody: {
          name: projectName,
          framework: 'nextjs',
        },
      });
      console.log(`   ✓ Project created: ${project.id}`);
    } catch (error: any) {
      if (error?.message?.includes('already exists')) {
        console.log(`   ✓ Project already exists`);
        // Get existing project
        const projects = await vercel.projects.getProjects({});
        project = projects.projects?.find((p: any) => p.name === projectName);
      } else {
        throw error;
      }
    }

    if (!project) {
      throw new Error('Could not find or create project');
    }

    // Step 2: Add environment variables
    console.log('\n2. Adding environment variables...');
    const envVars = [
      {
        key: 'GROQ_API_KEY',
        value: process.env.GROQ_API_KEY || '',
        type: 'encrypted' as const,
        target: ['production', 'preview', 'development'] as const,
      },
      {
        key: 'E2B_API_KEY',
        value: process.env.E2B_API_KEY || '',
        type: 'encrypted' as const,
        target: ['production', 'preview', 'development'] as const,
      },
    ];

    for (const env of envVars) {
      if (env.value) {
        try {
          await vercel.projects.createProjectEnv({
            idOrName: project.name,
            upsert: 'true',
            requestBody: [env],
          });
          console.log(`   ✓ Added ${env.key}`);
        } catch (error) {
          console.log(`   ⚠ Could not add ${env.key}: ${error}`);
        }
      } else {
        console.log(`   ⚠ ${env.key} not found in environment`);
      }
    }

    // Step 3: Display deployment instructions
    console.log('\n3. Deployment Options:');
    console.log('   ===========================================');
    console.log('   The project is configured. To deploy, choose one option:');
    console.log('');
    console.log('   Option A - GitHub Integration (Recommended):');
    console.log('   - Push your code to a GitHub repository');
    console.log('   - Connect the repo in Vercel dashboard');
    console.log('   - Deployments will happen automatically');
    console.log('');
    console.log('   Option B - Vercel CLI:');
    console.log('   vercel --prod');
    console.log('');
    console.log('   Option C - Manual Deploy from Dashboard:');
    console.log('   - Go to https://vercel.com/dashboard');
    console.log('   - Click "Add New Project"');
    console.log('   - Import from GitHub');
    console.log('   ===========================================\n');

    console.log('Project setup complete! 🎉');
    console.log(`Project URL will be: https://${projectName}.vercel.app`);

    return project;
  } catch (error) {
    console.error(
      error instanceof Error ? `Error: ${error.message}` : String(error)
    );
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  setupAndDeployProject()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { setupAndDeployProject };
