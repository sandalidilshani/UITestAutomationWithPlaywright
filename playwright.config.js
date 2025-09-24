// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const config = require('./config/config.js');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? config.test.retries : 0,
  workers: process.env.CI ? config.test.workers : undefined,
  reporter: 'html',
  use: {
    baseURL: config.app.baseUrl,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
  { name: 'all', testMatch: /.*\.js/ } // matches both setup.js and spec.js
]

});
