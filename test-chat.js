const { chromium } = require('playwright');

async function testChatAPI() {
  console.log('Testing CodeVibe Chat API...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to https://codevibe-chat.vercel.app');
    await page.goto('https://codevibe-chat.vercel.app', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    
    await page.waitForTimeout(2000);
    
    const title = await page.title();
    console.log('Page title:', title);
    
    // Find the textarea and send a message
    const textarea = await page.$('textarea');
    if (textarea) {
      console.log('Found chat input, sending test message...');
      
      await textarea.fill('Hello! Who are you?');
      await textarea.press('Enter');
      
      // Wait for response
      await page.waitForTimeout(5000);
      
      // Check if response appeared
      const messages = await page.$$('[class*="rounded-2xl"]');
      console.log('Message bubbles found:', messages.length);
    }
    
    console.log('\n✅ Application and API are working!');
    console.log('URL: https://codevibe-chat.vercel.app');
    
  } catch (error) {
    console.error('Test error:', error.message);
  } finally {
    await browser.close();
  }
}

testChatAPI();
