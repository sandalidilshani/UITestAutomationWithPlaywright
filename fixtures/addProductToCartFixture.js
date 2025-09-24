const { test: base, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const ProductPage = require('../pages/ProductPage');
const CartPage = require('../pages/CartPage');
const LoginPage = require('../pages/LoginPage');
const config = require('../config/config');
const cartTestData = require('../test-data/cart-test-data');

// Create fixture for adding products to cart
const test = base.extend({
  addProductToCartFixture: async ({ page, browser }, use) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const loginPage = new LoginPage(page);

    const fixture = {
      page,
      homePage,
      productPage,
      cartPage,
      loginPage,

    
      async addSpecificProductToCart(productData, quantity = 1, options = {}) {
        await productPage.navigateToProduct(productData.id);
        
        // Verify product is loaded
        const productTitle = await productPage.getProductTitle();
        expect(productTitle).toContain(productData.name);
        
        // Check if product is in stock
        expect(await productPage.isInStock()).toBeTruthy();
        expect(await productPage.isAddToCartButtonEnabled()).toBeTruthy();
        
        // Set quantity if different from 1
        if (quantity !== 1) {
          await productPage.setQuantity(quantity);
        }
        
        // Select options if provided
        if (options.size) {
          await productPage.selectSize(options.size);
        }
        if (options.color) {
          await productPage.selectColor(options.color);
        }
        
        // Add to cart
        await productPage.addToCart(quantity);
        
        // Verify redirect to cart page
        expect(page.url()).toContain('/index.php?rt=checkout/cart');
        
        return {
          productName: productData.name,
          quantity: quantity,
          options: options
        };
      },

      
      async addProductToCartWithLogin(productData, quantity = 1, options = {}) {
        await homePage.navigate();
        await homePage.clickLoginOrRegister();
        await loginPage.login(config.credentials.username, config.credentials.password);
        expect(await homePage.isUserLoggedIn()).toBeTruthy();
        
        await productPage.navigateToProduct(productData.id);
        
        // Verify product is loaded
        const productTitle = await productPage.getProductTitle();
        expect(productTitle).toContain(productData.name);
        
        // Check if product is in stock
        expect(await productPage.isInStock()).toBeTruthy();
        expect(await productPage.isAddToCartButtonEnabled()).toBeTruthy();
        
        // Set quantity if different from 1
        if (quantity !== 1) {
          await productPage.setQuantity(quantity);
        }
        
        // Select options if provided
        if (options.size) {
          await productPage.selectSize(options.size);
        }
        if (options.color) {
          await productPage.selectColor(options.color);
        }
        
        // Add to cart
        await productPage.addToCart(quantity);
        
        // Verify redirect to cart page
        expect(page.url()).toContain('/index.php?rt=checkout/cart');
        
        return {
          productName: productData.name,
          quantity: quantity,
          options: options
        };
      },

   
      

   
      async verifyProductInCart(productName, expectedQuantity = 1) {
        await cartPage.navigateToCart();
        await cartPage.verifyProductInCart(productName, expectedQuantity);
        
        const cartItemCount = await cartPage.getCartItemCount();
        expect(cartItemCount).toBeGreaterThanOrEqual(1);
        expect(await cartPage.isCartEmpty()).toBeFalsy();
      },

      async clearCart() {
        try {
          if (!await cartPage.isCartEmpty()) {
            await cartPage.clearCart();
          }
        } catch (error) {
          console.log('Cart cleanup failed:', error.message);
        }
      },

      
      async getCartInfo() {
        return await homePage.getCartInfo();
      }
    };

    await use(fixture);
    
    // Cleanup after each test
    await fixture.clearCart();
  }
});

module.exports = { test, expect };
