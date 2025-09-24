const { test: base } = require('@playwright/test');
const CheckoutPage = require('../pages/CheckoutPage');
const CartPage = require('../pages/CartPage');
const HomePage = require('../pages/HomePage');
const LoginPage = require('../pages/LoginPage');
const checkoutTestData = require('../test-data/checkout-test-data');

// Define the fixture with checkout-specific setup
const test = base.extend({
    checkoutPage: async ({ page }, use) => {
        const checkoutPage = new CheckoutPage(page);
        await use(checkoutPage);
    },

    cartPage: async ({ page }, use) => {
        const cartPage = new CartPage(page);
        await use(cartPage);
    },

    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },

    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },

    // Fixture to set up cart with a product before each test
    cartWithProduct: async ({ page, homePage }, use) => {
        // Navigate to homepage and add a product to cart
        await homePage.navigateToHomePage();
        
        // Add the Tropiques Minerale Loose Bronzer to cart (commonly available product)
        try {
            await homePage.addProductToCart('Tropiques Minerale Loose Bronzer');
        } catch (error) {
            // If that specific product is not available, add the first available product
            await homePage.addFirstAvailableProductToCart();
        }
        
        await use(page);
        
        // Cleanup: Clear cart after test
        try {
            await page.goto('/index.php?rt=checkout/cart');
            const cartItems = await page.locator('.cart-info table tbody tr:not(:first-child)').count();
            for (let i = 0; i < cartItems; i++) {
                const removeLink = page.locator('a[href*="remove"]').first();
                if (await removeLink.isVisible()) {
                    await removeLink.click();
                    await page.waitForLoadState('networkidle');
                }
            }
        } catch (error) {
            console.log('Cart cleanup failed:', error.message);
        }
    },

    // Fixture for guest user checkout with pre-filled data
    guestCheckoutSetup: async ({ page, checkoutPage, cartWithProduct }, use) => {
        // Navigate to checkout and select guest option
        await checkoutPage.navigateToCheckout();
        await checkoutPage.selectGuestCheckout();
        
        // Fill basic guest information
        await checkoutPage.fillPersonalDetails(checkoutTestData.validGuestUser);
        await checkoutPage.fillShippingAddress(checkoutTestData.validShippingAddress);
        
        await use(checkoutPage);
    },

    // Fixture for logged-in user checkout
    loggedInCheckoutSetup: async ({ page, checkoutPage, loginPage, cartWithProduct }, use) => {
        // Navigate to checkout (will redirect to login)
        await checkoutPage.navigateToCheckout();
        
        // Login with valid credentials
        await checkoutPage.loginExistingUser(
            checkoutTestData.checkoutTestData.TS003_TC02.credentials.username,
            checkoutTestData.checkoutTestData.TS003_TC02.credentials.password
        );
        
        await use(checkoutPage);
    },

    // Fixture for checkout confirmation setup
    checkoutConfirmationSetup: async ({ guestCheckoutSetup }, use) => {
        // Proceed to confirmation step
        await guestCheckoutSetup.proceedToNextStep();
        
        await use(guestCheckoutSetup);
    },

    // Fixture for multiple products in cart
    multipleProductCart: async ({ page, homePage }, use) => {
        await homePage.navigateToHomePage();
        
        // Add multiple products to cart
        const productsToAdd = [
            'Tropiques Minerale Loose Bronzer',
            'Skinsheen Bronzer Stick',
            'Benefit Bella Bamba'
        ];
        
        for (const productName of productsToAdd) {
            try {
                await homePage.addProductToCart(productName);
            } catch (error) {
                console.log(`Could not add ${productName}, skipping...`);
            }
        }
        
        await use(page);
        
        // Cleanup
        try {
            await page.goto('/index.php?rt=checkout/cart');
            const removeLinks = page.locator('a[href*="remove"]');
            const count = await removeLinks.count();
            for (let i = 0; i < count; i++) {
                const removeLink = removeLinks.first();
                if (await removeLink.isVisible()) {
                    await removeLink.click();
                    await page.waitForLoadState('networkidle');
                }
            }
        } catch (error) {
            console.log('Multiple product cleanup failed:', error.message);
        }
    },

    // Fixture for high-value cart (for free shipping tests)
    highValueCart: async ({ page, homePage }, use) => {
        await homePage.navigateToHomePage();
        
        // Add high-value products to reach free shipping threshold
        try {
            // Navigate to a high-value product category
            await page.goto('/index.php?rt=product/category&path=43'); // Skincare category
            
            // Add expensive products
            const expensiveProducts = await page.locator('.product-item .price').all();
            let cartValue = 0;
            const targetValue = checkoutTestData.freeShippingThreshold;
            
            for (const product of expensiveProducts) {
                if (cartValue >= targetValue) break;
                
                const productContainer = product.locator('../../..');
                const addToCartButton = productContainer.locator('a:has-text("Add to Cart"), .btn:has-text("Add to Cart")').first();
                
                if (await addToCartButton.isVisible()) {
                    await addToCartButton.click();
                    await page.waitForLoadState('networkidle');
                    cartValue += 50; // Approximate value
                }
            }
        } catch (error) {
            // Fallback: add the same product multiple times
            await homePage.addProductToCart('Tropiques Minerale Loose Bronzer');
            await page.goto('/index.php?rt=checkout/cart');
            
            // Update quantity to reach threshold
            const quantityField = page.locator('input[name*="quantity"]').first();
            await quantityField.fill('3'); // 3 * $38.50 = $115.50 > $100 threshold
            await page.locator('button:has-text("Update")').click();
        }
        
        await use(page);
    },

    // Fixture for empty cart scenario
    emptyCart: async ({ page }, use) => {
        // Navigate to cart and clear all items
        await page.goto('/index.php?rt=checkout/cart');
        
        const removeLinks = page.locator('a[href*="remove"]');
        const count = await removeLinks.count();
        
        for (let i = 0; i < count; i++) {
            const removeLink = removeLinks.first();
            if (await removeLink.isVisible()) {
                await removeLink.click();
                await page.waitForLoadState('networkidle');
            }
        }
        
        await use(page);
    }
});

module.exports = { test };