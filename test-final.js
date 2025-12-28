const { chromium } = require('playwright');

async function testDeployment() {
  console.log('Testing CodeVibe Chat deployment...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const errors = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  
  try {
    console.log('Navigating to https://codevibe-chat.vercel.app');
    await page.goto('https://codevibe-chat.vercel.app', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    
    await page.waitForTimeout(3000);
    
    const title = await page.title();
    console.log('Page title:', title);
    
    // Check for main elements
    const header = await page.$('header');
    const chatArea = await page.$('[class*="overflow-y-auto"]');
    const inputArea = await page.$('form');
    const codeVibeLogo = await page.$('text=CodeVibe');
    
    console.log('Header present:', !!header);
    console.log('Chat area present:', !!chatArea);
    console.log('Input area present:', !!inputArea);
    console.log('CodeVibe logo found:', !!codeVibeLogo);
    
    if (errors.length > 0) {
      console.log('\nConsole errors:', errors);
    } else {
      console.log('\nNo console errors!');
    }
    
    if (title && header && chatArea && inputArea) {
      console.log('\n✅ Deployment SUCCESSFUL!');
      console.log('Application URL: https://codevibe-chat.vercel.app');
    }
    
  } catch (error) {
    console.error('Test error:', error.message);
  } finally {
    await browser.close();
  }
}

testDeployment();
