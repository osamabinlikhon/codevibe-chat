const { chromium } = require('playwright');

async function testApp() {
  console.log('Starting browser test...');
  
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const errors = [];
  
  // Listen for console errors
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(`Console Error: ${msg.text()}`);
    }
  });
  
  // Listen for page errors
  page.on('pageerror', (error) => {
    errors.push(`Page Error: ${error.message}`);
  });
  
  try {
    // Navigate to the app
    console.log('Navigating to http://localhost:3001...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait for the page to be fully loaded
    await page.waitForSelector('text=CodeVibe', { timeout: 10000 });
    
    console.log('Page loaded successfully!');
    console.log('Page title:', await page.title());
    
    // Check if main elements are present
    const header = await page.$('header');
    const chatArea = await page.$('[class*="overflow-y-auto"]');
    const inputArea = await page.$('form');
    
    console.log('Header present:', !!header);
    console.log('Chat area present:', !!chatArea);
    console.log('Input area present:', !!inputArea);
    
    // Check for API key related messages or errors in console
    const consoleMessages = [];
    page.on('console', (msg) => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    });
    
    if (errors.length > 0) {
      console.log('\nErrors found:');
      errors.forEach((error) => console.log(error));
      process.exit(1);
    } else {
      console.log('\nNo console errors found!');
      console.log('Test passed successfully!');
    }
    
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

testApp();
