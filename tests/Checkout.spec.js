const { test, expect } = require('../fixtures/addProductToCartFixture');
const CheckoutPage = require('../pages/CheckoutPage');
const CartPage = require('../pages/CartPage');
const HomePage = require('../pages/HomePage');
const LoginPage = require('../pages/LoginPage');
const checkoutTestData = require('../test-data/checkout-test-data');
const cartTestData = require('../test-data/cart-test-data');

test.describe('Checkout Functionality Tests - TS004', () => {
  let checkoutPage;
  let cartPage;
  let homePage;
  let loginPage;

  test.beforeEach(async ({ page, addProductToCartFixture }) => {
    checkoutPage = new CheckoutPage(page);
    cartPage = new CartPage(page);
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);

    const testTitle = test.info().title;
    if (!testTitle.includes('@authenticate')) {
      await homePage.navigate();
    }

    await addProductToCartFixture.clearCart();
  });

  // ✅ TS004_TC01 - Guest Checkout
  test('TS004_TC01 - Verify single product checkout flow as guest user', async ({ addProductToCartFixture }) => {
    const testData = checkoutTestData.checkoutTestData.TS003_TC01; 
    const productToAdd = cartTestData.specificProducts[0];

    await addProductToCartFixture.addSpecificProductToCart(productToAdd, 1);
    await addProductToCartFixture.verifyProductInCart(productToAdd.name, 1);

    await checkoutPage.navigateToCheckout();
    await checkoutPage.selectGuestCheckout();
    await checkoutPage.fillPersonalDetails(testData.personalDetails);
    await checkoutPage.fillShippingAddress(testData.shippingAddress);
    await checkoutPage.proceedToNextStep();

    await expect(checkoutPage.guestCheckoutTitle).toBeVisible();

    const orderSummary = await checkoutPage.getOrderSummary();
    expect(orderSummary.subTotal).toContain('$29.50');
    expect(orderSummary.total).toContain('$31.50');

    const shippingAddress = await checkoutPage.getShippingAddressDetails();
    expect(shippingAddress).toContain(testData.shippingAddress.address1);
  });

  test('TS004_TC02 - Verify single product checkout flow as logged-in user', async ({ addProductToCartFixture }) => {
    const testData = checkoutTestData.checkoutTestData.TS003_TC01;
    const productToAdd = cartTestData.specificProducts[0];

    await addProductToCartFixture.addProductToCartWithLogin(productToAdd, 1);
    
    await checkoutPage.navigateToCheckout();
    
    // Verify that shipping address is automatically filled for registered user
    await checkoutPage.verifyShippingAddressAutoFilled();
    
    // Verify the specific address details match expected registered user data
    const expectedAddressData = {
      name: 'Sandali Dilshani',
      phone: '0711579375',
      address: 'Jayanthi Kirinda Rathkarawwa Jayanthi',
      city: 'Haputale',
      zipCode: '90164',
      country: 'Sri Lanka'
    };
    
    const shippingAddress = await checkoutPage.verifyShippingAddressContains(expectedAddressData);
    console.log('Auto-filled shipping address verified:', shippingAddress);
    const editButtonPresent = await checkoutPage.isEditShippingButtonPresent();
    expect(editButtonPresent).toBeTruthy();  
    await checkoutPage.confirmOrder(); 

    
  });

  // ✅ TS004_TC02A - Verify auto-filled address details for registered user
  test('TS004_TC02A - Verify shipping and payment addresses are auto-filled for registered user', async ({ addProductToCartFixture }) => {
    const productToAdd = cartTestData.specificProducts[0];

    await addProductToCartFixture.addProductToCartWithLogin(productToAdd, 1);
    
    await checkoutPage.navigateToCheckout();
    
    // Verify shipping address table is visible and contains expected data
    await checkoutPage.verifyShippingAddressAutoFilled();
    
    const shippingDetails = await checkoutPage.getPrefilledShippingAddress();
    
    // Verify customer info contains name and phone
    expect(shippingDetails.customerInfo).toContain('Sandali Dilshani');
    expect(shippingDetails.customerInfo).toContain('0711579375');
    
    // Verify address contains all components
    expect(shippingDetails.address).toContain('Jayanthi Kirinda Rathkarawwa Jayanthi');
    expect(shippingDetails.address).toContain('Haputale');
    expect(shippingDetails.address).toContain('90164');
    expect(shippingDetails.address).toContain('Sri Lanka');
    
    // Verify shipping method is displayed
    expect(shippingDetails.shippingMethod).toContain('Flat Shipping Rate');
    
    // Verify payment address is also auto-filled (if applicable)
    const hasPaymentAddress = await authCheckoutPage.verifyPaymentAddressAutoFilled();
    if (hasPaymentAddress) {
      const paymentAddress = await authCheckoutPage.getPrefilledPaymentAddress();
      expect(paymentAddress).not.toBeNull();
      console.log('Payment address auto-filled:', paymentAddress);
    }
    
    console.log('✅ All address details successfully auto-filled for registered user');
  });

  test('TS004_TC03 - Verify multiple product checkout flow as guest user', async ({ addProductToCartFixture }) => {
    const testData = checkoutTestData.checkoutTestData.TS003_TC01;
    const productsToAdd = cartTestData.specificProducts.slice(0, 2);

    for (const product of productsToAdd) {
    await addProductToCartFixture.addSpecificProductToCart(product, 1);
    await addProductToCartFixture.verifyProductInCart(product.name, 1);

    }

    await checkoutPage.navigateToCheckout();
    await checkoutPage.selectGuestCheckout();
    await checkoutPage.fillPersonalDetails(testData.personalDetails);
    await checkoutPage.fillShippingAddress(testData.shippingAddress);
    await checkoutPage.proceedToNextStep();

    await expect(checkoutPage.confirmationTitle).toBeVisible();
    await expect(checkoutPage.guestCheckoutTitle).toBeVisible();

    const orderSummary = await checkoutPage.getOrderSummary();
    expect(orderSummary.subTotal).not.toBeNull();
    expect(orderSummary.total).not.toBeNull();
  });

  


  
});
