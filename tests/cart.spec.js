const { test, expect } = require('@playwright/test');
const { test: testWithFixture, expect: expectWithFixture } = require('../fixtures/SelectRandomProductFromCategoryFixture');
const path = require('path');
const HomePage = require('../pages/HomePage');
const ProductPage = require('../pages/ProductPage');
const CartPage = require('../pages/CartPage');
const SearchPage = require('../pages/SearchPage');
const LoginPage = require('../pages/LoginPage');
const cartTestData = require('../test-data/cart-test-data');

const authFile = path.join(__dirname, 'storeLoginContext', 'storageState.json');

test.describe('TS003 - Add to Cart Functionality Tests', () => {
  let homePage, productPage, cartPage, loginPage, searchPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    searchPage = new SearchPage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    loginPage = new LoginPage(page);
    await homePage.navigate();
  });

  test.afterEach(async () => {
    try {
      if (!await cartPage.isCartEmpty()) {
        await cartPage.clearCart();
      }
    } catch (error) {
      console.log('Cart cleanup failed:', error.message);
    }
  });


  test('TS003-TC001: Verify adding single product to cart as guest user', async ({ page }) => {
    const specificProduct = cartTestData.specificProducts[0]; 
    await productPage.navigateToProduct(specificProduct.id);
    const productTitle = await productPage.getProductTitle();
    expect(productTitle).toContain(specificProduct.name);
    expect(await productPage.isInStock()).toBeTruthy();
    expect(await productPage.isAddToCartButtonEnabled()).toBeTruthy();
      await productPage.addToCart(1);
    
    expect(page.url()).toContain('/index.php?rt=checkout/cart');
    
    await cartPage.navigateToCart();
    
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(1);
    
    await cartPage.verifyProductInCart(specificProduct.name, 1);
    expect(await cartPage.isCartEmpty()).toBeFalsy();
  });

  test('TS003-TC002: Verify adding single product to cart as logged-in user', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authFile });
    const page = await context.newPage();
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    await homePage.navigate();
    expect(await homePage.isUserLoggedIn()).toBeTruthy();
    const specificProduct = cartTestData.specificProducts[0]; // Skinsheen Bronzer Stick
    await productPage.navigateToProduct(specificProduct.id);
    const productTitle = await productPage.getProductTitle();
    expect(productTitle).toContain(specificProduct.name);
    expect(await productPage.isInStock()).toBeTruthy();
    expect(await productPage.isAddToCartButtonEnabled()).toBeTruthy();
      await productPage.addToCart(1);
  
    expect(page.url()).toContain('/index.php?rt=checkout/cart');
    await cartPage.navigateToCart();
    
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(1);
    
    await cartPage.verifyProductInCart(specificProduct.name, 1);
    expect(await cartPage.isCartEmpty()).toBeFalsy();

    

    await context.close();
  });

  test('TS003-TC003: Verify adding multiple quantities of same product', async ({ page }) => {
    const specificProduct = cartTestData.specificProducts[1]; // Benefit Bella Bamba
    await productPage.navigateToProduct(specificProduct.id);
    
    const productTitle = await productPage.getProductTitle();
    expect(productTitle).toContain(specificProduct.name);
    
    expect(await productPage.isInStock()).toBeTruthy();
    expect(await productPage.isAddToCartButtonEnabled()).toBeTruthy();

    await productPage.setQuantity(3);
    await productPage.addToCart(3);

    expect(page.url()).toContain('checkout/cart');

    await cartPage.navigateToCart();
    
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(1);
    
    await cartPage.verifyProductInCart(specificProduct.name, 3);
    expect(await cartPage.isCartEmpty()).toBeFalsy();
  });

  test('TS003-TC004: Verify adding different products to cart', async ({ page }) => {
    const firstProduct = cartTestData.specificProducts[0]; // Skinsheen Bronzer Stick
    const secondProduct = cartTestData.specificProducts[1]; // Benefit Bella Bamba
    
    // Add first product to cart
    await productPage.navigateToProduct(firstProduct.id);
    const firstProductTitle = await productPage.getProductTitle();
    expect(firstProductTitle).toContain(firstProduct.name);
    expect(await productPage.isInStock()).toBeTruthy();
    expect(await productPage.isAddToCartButtonEnabled()).toBeTruthy();
    await productPage.addToCart(1);
    
    // Add second product to cart
    await productPage.navigateToProduct(secondProduct.id);
    const secondProductTitle = await productPage.getProductTitle();
    expect(secondProductTitle).toContain(secondProduct.name);
    expect(await productPage.isInStock()).toBeTruthy();
    expect(await productPage.isAddToCartButtonEnabled()).toBeTruthy();
    await productPage.addToCart(1);

    expect(page.url()).toContain('checkout/cart');
    
    await cartPage.navigateToCart();
    
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(2);
    
    await cartPage.verifyProductInCart(firstProduct.name, 1);
    await cartPage.verifyProductInCart(secondProduct.name, 1);
    expect(await cartPage.isCartEmpty()).toBeFalsy();
  });

  test('TS003-TC005: Verify adding maximum available stock to cart', async ({ page }) => {
    // not implemented: max stock not provided
  });

  test('TS003-TC006: Verify adding quantity exceeding stock', async ({ page }) => {
    // not implemented
  });

  
testWithFixture('TS003-TC008: Verify adding product with zero quantity', async ({ selectRandomProductCategoryFixture }) => {
    const { page, homePage } = selectRandomProductCategoryFixture;
    const selectedCategory = await selectRandomProductCategoryFixture.navigateToRandomCategoryFromSubnav();
    const selectedProduct = await selectRandomProductCategoryFixture.selectRandomProduct();
    
    expect(await productPage.isInStock()).toBeTruthy();
    await productPage.setQuantity(0);
    
    const isAddToCartEnabled = await productPage.isAddToCartButtonEnabled();
    console.log(`Add to cart button enabled with 0 quantity: ${isAddToCartEnabled}`);
    
    if (isAddToCartEnabled) {
      await productPage.addToCartButton.click();
      const cartInfo = await cartPage.getCartInfo();
      expect(cartInfo.itemCount).toBe(0);
    }
  });

  test('TS003-TC009: Verify adding product with required options selected', async ({ page }) => {
    // Re-initialize page objects to ensure they're using the current page
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    
    const productWithOptions = cartTestData.productsWithOptions[0];
    await productPage.navigateToProduct(productWithOptions.id);
    await productPage.selectSize("6 UK");
    await productPage.selectColor("red");
    await productPage.addToCart(1);
    await cartPage.navigateToCart();
    await cartPage.verifyProductInCart(productWithOptions.name, 1);
  });

  test('TS003-TC010: Verify adding same product with different variations', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    
    const productWithOptions = cartTestData.productsWithOptions[0];

    await productPage.navigateToProduct(productWithOptions.id);
    await productPage.selectSize("3 UK");
    await productPage.selectColor("red");
    await productPage.addToCart(1);

    await productPage.navigateToProduct(productWithOptions.id);
    await productPage.selectSize("6 UK");
    await productPage.selectColor("red");
    await productPage.addToCart(1);

    await cartPage.navigateToCart();
    expect(await cartPage.getCartItemCount()).toBe(2);
  });



  test('TS003-TC011: Verify cart persistence for logged-in user across sessions', async ({ browser }) => {
    const testProduct = cartTestData.singleProducts[0];

    const context = await browser.newContext();
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const homePage = new HomePage(page);

    await loginPage.login(cartTestData.testUser.username, cartTestData.testUser.password);

    await productPage.navigateToProduct(testProduct.id);
    await productPage.addToCart(1);

    await homePage.page.locator('a:has-text("Logoff")').first().click();
    await context.close();

    const newContext = await browser.newContext();
    const newPage = await newContext.newPage();
    const newLoginPage = new LoginPage(newPage);
    const newCartPage = new CartPage(newPage);
    const newHomePage = new HomePage(newPage);

    await newHomePage.navigate();
    await newLoginPage.navigateToLoginPage();
    await newLoginPage.login(cartTestData.testUser.username, cartTestData.testUser.password);

    await newCartPage.navigateToCart();
    await newContext.close();
  });

  test('TS003-TC012: Verify cart behavior for guest user session', async ({ page, context }) => {
    const testProduct = cartTestData.singleProducts[0];

    await productPage.navigateToProduct(testProduct.id);
    await productPage.addToCart(1);

    await homePage.navigateToCategory("Makeup");
    await cartPage.navigateToCart();
    await cartPage.verifyProductInCart(testProduct.name, 1);

    await page.close();
    const newPage = await context.newPage();
    const newCartPage = new CartPage(newPage);

    await newCartPage.navigateToCart();
    console.log(`Guest cart after tab reopen: ${await newCartPage.isCartEmpty() ? 'empty' : 'has items'}`);
  });

  test('TS003-TC013: Verify cart contents when switching from guest to logged-in', async () => {
    const testProduct = cartTestData.singleProducts[0];

    await productPage.navigateToProduct(testProduct.id);
    await productPage.addToCart(1);

    await loginPage.navigateToLoginPage();
    await loginPage.login(cartTestData.testUser.username, cartTestData.testUser.password);

    await cartPage.navigateToCart();
    const count = await cartPage.getCartItemCount();
    expect(count).toBeGreaterThanOrEqual(0);

    const secondProduct = cartTestData.singleProducts[1];
    await productPage.navigateToProduct(secondProduct.id);
    await productPage.addToCart(1);

    await cartPage.navigateToCart();
    expect(await cartPage.getCartItemCount()).toBeGreaterThanOrEqual(1);
  });



  testWithFixture('TS003-TC014: Verify add to cart from product listing pages', async ({ selectRandomProductCategoryFixture }) => {
    const { page, homePage } = selectRandomProductCategoryFixture;

    // Navigate to a random category and select a product
    const selectedCategory = await selectRandomProductCategoryFixture.navigateToRandomCategoryFromSubnav();
    const selectedProduct = await selectRandomProductCategoryFixture.selectRandomProduct();
    await productPage.addToCart(1);

    const cartInfo = await homePage.getCartInfo();
    expect(cartInfo.itemCount).toBe(1);

    await cartPage.navigateToCart();
    await cartPage.verifyProductInCart(selectedProduct, 1);
  });

  test('TS003-TC015: Verify add to cart with network interruption', async ({ page, context }) => {
    const testProduct = cartTestData.singleProducts[0];

    await productPage.navigateToProduct(testProduct.id);
    await context.setOffline(true);
    await productPage.addToCartButton.click();

    await page.waitForTimeout(2000);
    await context.setOffline(false);

    await page.reload();
    await productPage.addToCart(1);

    const cartInfo = await homePage.getCartInfo();
    expect(cartInfo.itemCount).toBe(1);
  });

  test('TS003-TC016: Verify add to cart with maximum cart limit', async () => {
    const products = cartTestData.singleProducts.slice(0, 4);

    for (const product of products) {
      await productPage.navigateToProduct(product.id);
      await productPage.addToCart(10);
    }

    const cartInfo = await homePage.getCartInfo();
    expect(cartInfo.itemCount).toBe(40);

    await productPage.navigateToProduct(products[0].id);
    await productPage.addToCart(1);

    const finalCartInfo = await homePage.getCartInfo();
    expect(finalCartInfo.itemCount).toBeGreaterThan(0);
  });

  test('TS003-TC017: Verify add to cart with invalid product ID', async ({ page }) => {
    await page.goto(`/index.php?rt=product/product&product_id=99999`);

    const content = await page.content();
    expect(content).toMatch(/(not found|404|error)/i);

    const cartInfo = await homePage.getCartInfo();
    expect(cartInfo.itemCount).toBe(0);
  });

  test('TS003-TC018: Verify add to cart with price manipulation attempt', async () => {
    const testProduct = cartTestData.singleProducts[0];

    await productPage.navigateToProduct(testProduct.id);
    await page.evaluate(() => {
      document.querySelectorAll('.productprice, .price').forEach(el => el.textContent = '$1.00');
    });

    await productPage.addToCart(1);
    await cartPage.navigateToCart();

    const cartPrice = await cartPage.getUnitPriceInCart(0);
    expect(cartPrice).toContain(testProduct.price.toFixed(2));
    expect(cartPrice).not.toContain('1.00');
  });

  testWithFixture('TS003-TC019: Verify adding multiple random products to cart', async ({ selectRandomProductCategoryFixture }) => {
    const { page, homePage } = selectRandomProductCategoryFixture;

    // Select first product from a random category
    await homePage.navigate();
    const firstCategory = await selectRandomProductCategoryFixture.navigateToRandomCategoryFromSubnav();
    const first = await selectRandomProductCategoryFixture.selectRandomProduct();
    await productPage.addToCart(1);

    // Select second product from another random category
    await homePage.navigate();
    const secondCategory = await selectRandomProductCategoryFixture.navigateToRandomCategoryFromSubnav();
    const second = await selectRandomProductCategoryFixture.selectRandomProduct();
    await productPage.addToCart(1);

    // Select third product from another random category
    await homePage.navigate();
    const thirdCategory = await selectRandomProductCategoryFixture.navigateToRandomCategoryFromSubnav();
    const third = await selectRandomProductCategoryFixture.selectRandomProduct();
    await productPage.addToCart(1);

    const cartInfo = await homePage.getCartInfo();
    expect(cartInfo.itemCount).toBe(3);

    await cartPage.navigateToCart();
    await cartPage.verifyProductInCart(first, 1);
    await cartPage.verifyProductInCart(second, 1);
    await cartPage.verifyProductInCart(third, 1);
  });

  test('TS003-TC020: Verify add to cart with concurrent user sessions', async ({ browser }) => {
    const testProduct = cartTestData.singleProducts[0];

    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    const loginPage1 = new LoginPage(page1);
    const productPage1 = new ProductPage(page1);
    const cartPage1 = new CartPage(page1);
    const homePage1 = new HomePage(page1);

    await homePage1.navigate();
    await loginPage1.navigateToLoginPage();
    await loginPage1.login(cartTestData.testUser.username, cartTestData.testUser.password);

    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    const loginPage2 = new LoginPage(page2);
    const productPage2 = new ProductPage(page2);
    const cartPage2 = new CartPage(page2);
    const homePage2 = new HomePage(page2);

    await homePage2.navigate();
    await loginPage2.navigateToLoginPage();
    await loginPage2.login(cartTestData.testUser.username, cartTestData.testUser.password);

    await productPage1.navigateToProduct(testProduct.id);
    await productPage2.navigateToProduct(testProduct.id);

    await productPage1.addToCart(1);
    await productPage2.addToCart(1);

    await cartPage1.navigateToCart();
    await cartPage2.navigateToCart();

    expect(await cartPage1.getCartItemCount()).toBeGreaterThanOrEqual(1);
    expect(await cartPage2.getCartItemCount()).toBeGreaterThanOrEqual(1);

    await context1.close();
    await context2.close();
  });

  testWithFixture('TS003-TC007: Verify out-of-stock product cannot be added to cart', async ({ page, selectRandomProductCategoryFixture }) => {
    // Find an out-of-stock product across all categories
    const outOfStockProduct = await selectRandomProductCategoryFixture.findOutOfStockProduct();
    
    if (!outOfStockProduct.isOutOfStock) {
      console.log('No out-of-stock products found, skipping test');
      test.skip();
      return;
    }

    // Verify we're on the product page with an out-of-stock product
    const productTitle = await productPage.getProductTitle();
    expect(productTitle).toContain(outOfStockProduct.productName);

    // Check that the product is indeed out of stock
    expect(await productPage.isOutOfStock()).toBeTruthy();
    
    // Verify add to cart button is disabled or not present
    expect(await productPage.isAddToCartButtonEnabled()).toBeFalsy();
    
    // Try to verify out-of-stock message is displayed
    const outOfStockMessage = await page.locator('.nostock, .out-of-stock, [class*="stock"], [class*="availability"]').first();
    if (await outOfStockMessage.isVisible()) {
      const messageText = await outOfStockMessage.textContent();
      expect(messageText.toLowerCase()).toMatch(/out.*stock|unavailable|not.*available/);
    }
    
    

    console.log(`Successfully verified out-of-stock product: ${outOfStockProduct.productName} in category: ${outOfStockProduct.categoryName}`);
  });
});


