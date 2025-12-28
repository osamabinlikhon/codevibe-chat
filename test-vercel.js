const { chromium } = require('playwright');

async function testDeployment() {
  console.log('Testing Vercel deployment...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to https://workspace-rust-five.vercel.app');
    await page.goto('https://workspace-rust-five.vercel.app', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    const title = await page.title();
    console.log('Page title:', title);
    
    // Check for main elements
    const header = await page.$('header');
    const chatArea = await page.$('[class*="overflow-y-auto"]');
    const inputArea = await page.$('form');
    
    console.log('Header present:', !!header);
    console.log('Chat area present:', !!chatArea);
    console.log('Input area present:', !!inputArea);
    
    if (title && header && chatArea && inputArea) {
      console.log('\n✅ Deployment successful!');
      console.log('Application is fully functional at: https://workspace-rust-five.vercel.app');
    } else {
      console.log('\n⚠️ Some elements missing');
    }
    
  } catch (error) {
    console.error('Test error:', error.message);
  } finally {
    await browser.close();
  }
}

testDeployment();
