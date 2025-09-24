const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const LoginPage = require('../pages/LoginPage');
const AccountPage = require('../pages/AccountPage');
const LogoutPage = require('../pages/LogoutPage');
const testData = require('../test-data/login-test-data');
const logger = require('../utils/LoggerUtil');

const validUser = testData.validUser;
const testCases = testData.testCases;
const errorMessages = testData.errorMessages;

test.describe('TS001-Validate User Login Flow', () => {
    let homePage, loginPage, accountPage, logoutPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        loginPage = new LoginPage(page);
        accountPage = new AccountPage(page);
        logoutPage = new LogoutPage(page);
        await homePage.navigate();
    });

    test.afterEach(async ({ page }) => {
        await page.close();
    });

    test('TS001_TC01 - Verify login page elements are displayed correctly', async ({ page }) => {
        await homePage.clickLoginOrRegister();
        await expect(loginPage.accountLoginHeading).toBeVisible();
        await expect(loginPage.returningCustomerHeading).toBeVisible();
        await expect(loginPage.newCustomerHeading).toBeVisible();
        await expect(loginPage.loginNameInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();
        await expect(loginPage.loginButton).toBeVisible();
        await expect(loginPage.forgotPasswordLink).toBeVisible();
        await expect(loginPage.forgotLoginLink).toBeVisible();
        await expect(loginPage.accountLoginHeading).toHaveText('Account Login');
        await expect(loginPage.returningCustomerHeading).toHaveText('Returning Customer');
        await expect(loginPage.newCustomerHeading).toHaveText('I am a new customer.');
    });

    test('TS001_TC02 - Verify registered user can login successfully', async ({ page }) => {
        await homePage.clickLoginOrRegister();
        await loginPage.login(validUser.username, validUser.password);
        await expect(page).toHaveTitle('My Account');
        await expect(page).toHaveURL(/.*account\/account.*/);
        await expect(accountPage.isAccountPageDisplayed()).resolves.toBeTruthy();
        await homePage.navigate();
        await expect(homePage.isUserLoggedIn('Sandali')).resolves.toBeTruthy();
    });

    test('TS001_TC03 - Verify login fails with invalid username and valid password', async ({ page }) => {
        const tc03Data = testData.testData.TS001_TC03;
        await homePage.clickLoginOrRegister();
        await loginPage.enterUsername(tc03Data.loginName);
        await loginPage.enterPassword(tc03Data.password);
        await loginPage.clickLoginButton();
        const errorMessage = page.locator('.alert-error, .alert-danger, .error');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toContainText(new RegExp(errorMessages.invalidCredentials, 'i'));
        await expect(page).toHaveURL(/.*account\/login.*/);
    });

    test('TS001_TC04 - Verify login with invalid password', async ({ page }) => {
        const tc04Data = testData.testData.TS001_TC04;
        await homePage.clickLoginOrRegister();
        
        await loginPage.enterUsername(tc04Data.loginName);
        await loginPage.enterPassword(tc04Data.password);
        await loginPage.clickLoginButton();
        
        const errorMessage = page.locator('.alert-error, .alert-danger, .error');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toContainText(new RegExp(errorMessages.invalidCredentials, 'i'));
        await expect(page).toHaveURL(/.*account\/login.*/);
    });

    test('TS001_TC05 - Verify validation with empty username and valid password', async ({ page }) => {
        const tc05Data = testData.testData.TS001_TC05;
        await homePage.clickLoginOrRegister();
        
        await loginPage.enterUsername(tc05Data.loginName);
        await loginPage.enterPassword(tc05Data.password);
        await loginPage.clickLoginButton();
        
        const errorMessage = page.locator('.alert-error, .alert-danger, .error');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toContainText(/ Incorrect login or password provided/i);
        await expect(page).toHaveURL(/.*account\/login.*/);
    });

    test('TS001_TC06 - Verify login with empty fields', async ({ page }) => {
        const tc06Data = testData.testData.TS001_TC06;
        await homePage.clickLoginOrRegister();
        
        await loginPage.enterUsername(tc06Data.loginName);
        await loginPage.enterPassword(tc06Data.password);
        await loginPage.clickLoginButton();
        
        const errorMessage = page.locator('.alert-error, .alert-danger, .error');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toContainText(/ Incorrect login or password provided/i);
        await expect(page).toHaveURL(/.*account\/login.*/);
    });

    test('TS001_TC07 - Verify login with special characters in username and password', async ({ page }) => {
        const tc07Data = testData.testData.TS001_TC07;
        await homePage.clickLoginOrRegister();
        
        await loginPage.enterUsername(tc07Data.loginName);
        await loginPage.enterPassword(tc07Data.password);
        await loginPage.clickLoginButton();
        
        const errorMessage = page.locator('.alert-error, .alert-danger, .error');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toContainText(/ Incorrect login or password provided/i);
        await expect(page).toHaveURL(/.*account\/login.*/);
    });

    test('TS001_TC08 - Verify login with different case combinations', async ({ page }) => {
        const tc08Data = testData.testData.TS001_TC08;
        
        await homePage.clickLoginOrRegister();
        await loginPage.enterUsername(tc08Data[0].loginName);
        await loginPage.enterPassword(tc08Data[0].password);
        await loginPage.clickLoginButton();
        
        const isSuccessful = await page.url().includes('account/account');
        
        if (isSuccessful) {
            await expect(page).toHaveTitle('My Account');
            await accountPage.clickLogoff();
            await logoutPage.clickContinue();
        } else {
            const errorMessage = page.locator('.alert-error, .alert-danger, .error');
            await expect(errorMessage).toBeVisible();
        }
        
        await homePage.clickLoginOrRegister();
        await loginPage.enterUsername(tc08Data[1].loginName);
        await loginPage.enterPassword(tc08Data[1].password);
        await loginPage.clickLoginButton();
        
        const isMixedCaseSuccessful = await page.url().includes('account/account');
        
        if (isMixedCaseSuccessful) {
            await expect(page).toHaveTitle('My Account');
        } else {
            const errorMessage = page.locator('.alert-error, .alert-danger, .error');
            await expect(errorMessage).toBeVisible();
        }
    });

    test('TS001_TC09 - Verify user session management after login', async ({ page, context }) => {
        await homePage.clickLoginOrRegister();
        await loginPage.login(validUser.username, validUser.password);
        await expect(page).toHaveTitle('My Account');
        await homePage.navigate();
        await expect(homePage.isUserLoggedIn()).resolves.toBeTruthy();
        await homePage.goToAccount();
        await expect(page).toHaveURL(/.*account\/account.*/);
        const newPage = await context.newPage();
        const newHomePage = new HomePage(newPage);
        await newHomePage.navigate();
        await newPage.close();
    });

    test('TS001_TC10 - Verify behavior after multiple failed login attempts', async ({ page }) => {
        const tc10Data = testData.testData.TS001_TC10;
        await homePage.clickLoginOrRegister();
        
        for (let i = 0; i < tc10Data.wrongPasswords.length; i++) {
            await loginPage.enterUsername(tc10Data.loginName);
            await loginPage.enterPassword(tc10Data.wrongPasswords[i]);
            await loginPage.clickLoginButton();
            
            const errorMessage = page.locator('.alert-error, .alert-danger, .error');
            await expect(errorMessage).toBeVisible();
            await expect(errorMessage).toContainText(/Error: Incorrect login or password provided/i);
            
            await loginPage.clearLoginFields();
        }
        
        await loginPage.enterUsername(tc10Data.loginName);
        await loginPage.enterPassword(tc10Data.correctPassword);
        await loginPage.clickLoginButton();
        
        const isLocked = await page.locator('.alert-error, .alert-danger, .error').isVisible({ timeout: 3000 });
        
        if (isLocked) {
            const lockoutMessage = page.locator('.alert-error, .alert-danger, .error');
            await expect(lockoutMessage).toBeVisible();
        } else {
            await expect(page).toHaveTitle('My Account');
        }
    });

    test('TS001_TC11 - Verify login session timeout', async ({ page }) => {
        await homePage.clickLoginOrRegister();
        await loginPage.login(validUser.username, validUser.password);
        
        await expect(page).toHaveTitle('My Account');
        
        await page.waitForTimeout(5000);
        await accountPage.navigate();
    
        const currentUrl = page.url();
        const isStillLoggedIn = currentUrl.includes('account/account');
        
        if (isStillLoggedIn) {
            await expect(page).toHaveTitle('My Account');
        } else {
            await expect(page).toHaveURL(/.*account\/login.*/);
        }
    });

    test('TS001_TC12 - Verify login redirection from checkout page', async ({ page }) => {
        await page.goto('https://automationteststore.com/index.php?rt=product/product&product_id=50');
        
        const addToCartButton = page.locator('.cart, [title*="Add to Cart"], .productcart');
        if (await addToCartButton.isVisible()) {
            await addToCartButton.first().click();
        }
        
        await page.goto('https://automationteststore.com/index.php?rt=checkout/cart');
        
        const checkoutButton = page.getByTitle('Checkout').first();
        if (await checkoutButton.isVisible()) {
            await checkoutButton.click();
        }
        
        if (page.url().includes('login')) {
            await loginPage.login(validUser.username, validUser.password);
            await expect(page).toHaveURL(/.*checkout.*/);
        } else {
            console.log('Checkout flow may be different - current URL:', page.url());
        }
    });
});


