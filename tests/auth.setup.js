// tests/auth.setup.js
const { test } = require('@playwright/test');
const path = require('path');
const config = require('../config/config.js');

const authFile = path.join(__dirname, 'storeLoginContext/storageState.json');

test('authenticate and store session', async ({ page }) => {
  await page.goto('https://automationteststore.com/index.php?rt=account/login');

  // Login using credentials from config
  await page.fill('input[name="loginname"]', config.credentials.username);
  await page.fill('input[name="password"]', config.credentials.password);
  await page.click('button[title="Login"]');

  // Wait for account dashboard
  await page.waitForURL('**/account/account');

  // Save session state to authFile
  await page.context().storageState({ path: authFile });
});
