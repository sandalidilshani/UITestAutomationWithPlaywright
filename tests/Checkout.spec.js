const { test, expect } = require('../fixtures/addProductToCartFixture');
const CheckoutPage = require('../pages/CheckoutPage');
const checkoutTestData = require('../test-data/checkout-test-data');
const cartTestData = require('../test-data/cart-test-data');

test.describe('Checkout Functionality Tests - TS004', () => {
  let checkoutPage;

  test.beforeEach(async ({ page, addProductToCartFixture }) => {
    checkoutPage = new CheckoutPage(page);
    await addProductToCartFixture.clearCart();
  });

  // TS004_TC01: Guest checkout with single product
  test('TS004_TC01 - Verify single product checkout flow as guest user', async ({ addProductToCartFixture }) => {
    const testData = checkoutTestData.checkoutTestData.guestCheckout;
    const productToAdd = cartTestData.specificProducts[0];

    // Add product to cart
    await addProductToCartFixture.addSpecificProductToCart(productToAdd, 1);
    await addProductToCartFixture.verifyProductInCart(productToAdd.name, 1);

    // Navigate to checkout
    await checkoutPage.navigateToCheckout();
    
    await expect(checkoutPage.guestCheckoutRadio).toBeVisible();
    await checkoutPage.selectGuestCheckout();
    
    await expect(checkoutPage.guestCheckoutTitle).toBeVisible();
    
    await checkoutPage.fillPersonalDetails(testData.personalDetails);
    await checkoutPage.fillShippingAddress(testData.shippingAddress);
    await checkoutPage.proceedToNextStep();

    await expect(checkoutPage.confirmationTitle).toBeVisible();
    const orderSummary = await checkoutPage.getOrderSummary();
    expect(orderSummary.subTotal).toBeTruthy();
    expect(orderSummary.total).toBeTruthy();
  });

  test('TS004_TC02 - Verify single product checkout flow as logged-in user', async ({ addProductToCartFixture }) => {
    const productToAdd = cartTestData.specificProducts[0];

    await addProductToCartFixture.addProductToCartWithLogin(productToAdd, 1);
    
    await checkoutPage.navigateToCheckout();
    
    await checkoutPage.verifyShippingAddressAutoFilled();
    
    const expectedAddressData = {
      name: 'Sandali Dilshani',
      phone: '0711579375',
      address: 'Jayanthi Kirinda Rathkarawwa Jayanthi',
      city: 'Haputale',
      zipCode: '90164',
      country: 'Sri Lanka'
    };
    
    await checkoutPage.verifyShippingAddressContains(expectedAddressData);
    
    // Verify edit button is present
    const editButtonPresent = await checkoutPage.isEditShippingButtonPresent();
    expect(editButtonPresent).toBeTruthy();  
  });

  test('TS004_TC03 - Verify checkout with product quantity modification', async ({ addProductToCartFixture }) => {
    const testData = checkoutTestData.checkoutTestData.quantityModification;
    const productToAdd = cartTestData.specificProducts[0];
  
    await addProductToCartFixture.addSpecificProductToCart(productToAdd, testData.initialQuantity);
    await addProductToCartFixture.verifyProductInCart(productToAdd.name, testData.initialQuantity);
  
    await checkoutPage.modifyQuantity(testData.modifiedQuantity);
    
    const updatedQuantity = await checkoutPage.getQuantity();
    expect(updatedQuantity).toBe(testData.modifiedQuantity.toString());
  
    // Now navigate to checkout
    await checkoutPage.navigateToCheckout();
    await checkoutPage.selectGuestCheckout();
    
    await checkoutPage.fillPersonalDetails(testData.personalDetails);
    await checkoutPage.fillShippingAddress(testData.shippingAddress);
    await checkoutPage.proceedToNextStep();
  
    await expect(checkoutPage.confirmationTitle).toBeVisible();
  });

  test('TS004_TC04 - Verify checkout with product removal during process', async ({ addProductToCartFixture }) => {
    const testData = checkoutTestData.checkoutTestData.productRemoval;
    const productToAdd = cartTestData.specificProducts[0];

    await addProductToCartFixture.addSpecificProductToCart(productToAdd, 1);
    await addProductToCartFixture.verifyProductInCart(productToAdd.name, 1);

    await checkoutPage.navigateToCheckout();
    await checkoutPage.selectGuestCheckout();
    
    await checkoutPage.removeProduct(productToAdd.name);
    
    const isEmpty = await checkoutPage.isCartEmpty();
    expect(isEmpty).toBeTruthy();
    
    const emptyCartMessage = await checkoutPage.getEmptyCartMessage();
    expect(emptyCartMessage).toContain('empty');
  });

  test('TS004_TC05 - Verify checkout with valid shipping address', async ({ addProductToCartFixture }) => {
    const testData = checkoutTestData.checkoutTestData.validShippingAddress;
    const productToAdd = cartTestData.specificProducts[0];
  
    await addProductToCartFixture.addSpecificProductToCart(productToAdd, 1);
    await addProductToCartFixture.verifyProductInCart(productToAdd.name, 1);
  
    await checkoutPage.navigateToCheckout();
    await checkoutPage.selectGuestCheckout();
    
    await checkoutPage.fillPersonalDetails(testData.personalDetails);
    await checkoutPage.fillShippingAddress(testData.shippingAddress);
    await checkoutPage.proceedToNextStep();
  
    await expect(checkoutPage.confirmationTitle).toBeVisible();
    
    const shippingInfo = checkoutPage.page.getByRole('cell', { name: 'Flat Shipping Rate', exact: true });
    await expect(shippingInfo).toBeVisible();
    
    const orderSummary = await checkoutPage.getOrderSummary();
    expect(orderSummary.subTotal).toBeTruthy();
    expect(orderSummary.shipping).toBeTruthy();
    expect(orderSummary.total).toBeTruthy();
  });


  // TS004_TC06: Invalid shipping address
  test('TS004_TC06 - Verify checkout with invalid shipping address', async ({ addProductToCartFixture }) => {
    const testData = checkoutTestData.checkoutTestData.invalidShippingAddress;
    const productToAdd = cartTestData.specificProducts[0];

    
    await addProductToCartFixture.addSpecificProductToCart(productToAdd, 1);
    await addProductToCartFixture.verifyProductInCart(productToAdd.name, 1);

    await checkoutPage.navigateToCheckout();
    await checkoutPage.selectGuestCheckout();
    
    await checkoutPage.fillPersonalDetails(testData.personalDetails);
    await checkoutPage.fillShippingAddress(testData.shippingAddress);
    
    await checkoutPage.proceedToNextStep();
    
    const validationErrors = await checkoutPage.getValidationErrors();
    expect(validationErrors.length).toBeGreaterThan(0);
    
    const canProceed = await checkoutPage.canProceedToNextStep();
    expect(canProceed).toBeFalsy();
  });

  // TS004_TC07: Multiple shipping options
  test('TS004_TC07 - Verify checkout with multiple shipping options', async ({ addProductToCartFixture }) => {
    const testData = checkoutTestData.checkoutTestData.multipleShippingOptions;
    const productToAdd = cartTestData.specificProducts[0];

    // Add product to cart
    await addProductToCartFixture.addSpecificProductToCart(productToAdd, 1);
    await addProductToCartFixture.verifyProductInCart(productToAdd.name, 1);

    // Navigate to checkout
    await checkoutPage.navigateToCheckout();
    await checkoutPage.selectGuestCheckout();
    
    // Fill checkout form
    await checkoutPage.fillPersonalDetails(testData.personalDetails);
    await checkoutPage.fillShippingAddress(testData.shippingAddress);
    await checkoutPage.proceedToNextStep();

    // Verify checkout proceeds normally and shipping method is displayed
    await expect(checkoutPage.confirmationTitle).toBeVisible();
    
    // Verify shipping method is displayed in the confirmation table
    const shippingMethod = checkoutPage.page.locator('tr:has-text("Flat Shipping Rate:")');
    await expect(shippingMethod).toBeVisible();
    
    // Verify order summary contains shipping information
    const orderSummary = await checkoutPage.getOrderSummary();
    expect(orderSummary.subTotal).toBeTruthy();
    expect(orderSummary.shipping).toBeTruthy();
    expect(orderSummary.total).toBeTruthy();
  });

  test('TS004_TC08 - Verify checkout with free shipping threshold', async ({ addProductToCartFixture }) => {
    const testData = checkoutTestData.checkoutTestData.freeShippingThreshold;
    const productToAdd = cartTestData.specificProducts[0];

    await addProductToCartFixture.addSpecificProductToCart(productToAdd, 1);
    await addProductToCartFixture.verifyProductInCart(productToAdd.name, 1);

    await checkoutPage.navigateToCheckout();
    await checkoutPage.selectGuestCheckout();
    
    await checkoutPage.fillPersonalDetails(testData.personalDetails);
    await checkoutPage.fillShippingAddress(testData.shippingAddress);
    await checkoutPage.proceedToNextStep();

    const orderSummary = await checkoutPage.getOrderSummary();
    expect(orderSummary.shipping).not.toContain('$0.00');
    
    // Go back and add high-value product to exceed threshold
    await checkoutPage.goBackToCart();
    await addProductToCartFixture.addSpecificProductToCart(testData.highValueProduct, 1);
    
    // Return to checkout
    await checkoutPage.navigateToCheckout();
    await checkoutPage.selectGuestCheckout();
    await checkoutPage.fillPersonalDetails(testData.personalDetails);
    await checkoutPage.fillShippingAddress(testData.shippingAddress);
    await checkoutPage.proceedToNextStep();

    // Verify free shipping is applied
    const updatedOrderSummary = await checkoutPage.getOrderSummary();
    expect(updatedOrderSummary.shipping).toContain('$0.00');
  });

  test('TS004_TC09 - Verify order summary accuracy with single product', async ({ addProductToCartFixture }) => {
    const testData = checkoutTestData.checkoutTestData.orderSummaryAccuracy;
    const productToAdd = cartTestData.specificProducts[0];

    // Add product to cart
    await addProductToCartFixture.addSpecificProductToCart(productToAdd, 1);
    await addProductToCartFixture.verifyProductInCart(productToAdd.name, 1);

    // Navigate to checkout
    await checkoutPage.navigateToCheckout();
    await checkoutPage.selectGuestCheckout();
    
    // Fill checkout form
    await checkoutPage.fillPersonalDetails(testData.personalDetails);
    await checkoutPage.fillShippingAddress(testData.shippingAddress);
    await checkoutPage.proceedToNextStep();

    // Verify order summary accuracy
    const orderSummary = await checkoutPage.getOrderSummary();
    expect(orderSummary.subTotal).toBeTruthy();
    expect(orderSummary.shipping).toBeTruthy();
    expect(orderSummary.total).toBeTruthy();
    
    // Verify all line items are accurate
    const lineItems = await checkoutPage.getOrderLineItems();
    expect(lineItems.length).toBeGreaterThan(0);
  });

  // TS004_TC10: Order summary with discount
  test('TS004_TC10 - Verify order summary with product discount', async ({ addProductToCartFixture }) => {
    const testData = checkoutTestData.checkoutTestData.orderSummaryWithDiscount;
    const productToAdd = cartTestData.specificProducts[0];

    // Add discounted product to cart
    await addProductToCartFixture.addSpecificProductToCart(productToAdd, 1);
    await addProductToCartFixture.verifyProductInCart(productToAdd.name, 1);

    // Navigate to checkout
    await checkoutPage.navigateToCheckout();
    await checkoutPage.selectGuestCheckout();
    
    // Fill checkout form
    await checkoutPage.fillPersonalDetails(testData.personalDetails);
    await checkoutPage.fillShippingAddress(testData.shippingAddress);
    await checkoutPage.proceedToNextStep();

    // Verify order summary shows discount
    const orderSummary = await checkoutPage.getOrderSummary();
    expect(orderSummary.subTotal).toBeTruthy();
    expect(orderSummary.total).toBeTruthy();
    
    // Verify discount is displayed if applicable
    const discountInfo = await checkoutPage.getDiscountInfo();
    if (discountInfo) {
      expect(discountInfo).toContain('discount');
    }
  });

  // TS004_TC11: Invalid coupon code
  test('TS004_TC11 - Verify checkout with invalid coupon code', async ({ addProductToCartFixture }) => {
    const testData = checkoutTestData.checkoutTestData.invalidCoupon;
    const productToAdd = cartTestData.specificProducts[0];

    // Add product to cart
    await addProductToCartFixture.addSpecificProductToCart(productToAdd, 1);
    await addProductToCartFixture.verifyProductInCart(productToAdd.name, 1);

    // Navigate to checkout
    await checkoutPage.navigateToCheckout();
    await checkoutPage.selectGuestCheckout();
    
    // Fill checkout form
    await checkoutPage.fillPersonalDetails(testData.personalDetails);
    await checkoutPage.fillShippingAddress(testData.shippingAddress);
    await checkoutPage.proceedToNextStep();

    // Enter invalid coupon code
    await checkoutPage.enterCouponCode(testData.couponCode);
    await checkoutPage.applyCoupon();
    
    // Verify error message is displayed
    const errorMessage = await checkoutPage.getCouponErrorMessage();
    expect(errorMessage).toContain('invalid');
    
    // Verify no discount is applied
    const orderSummary = await checkoutPage.getOrderSummary();
    expect(orderSummary.subTotal).toBeTruthy();
  });

  // TS004_TC12: Required field validation
  test('TS004_TC12 - Verify required field validation in checkout', async ({ addProductToCartFixture }) => {
    const testData = checkoutTestData.checkoutTestData.requiredFieldValidation;
    const productToAdd = cartTestData.specificProducts[0];

    // Add product to cart
    await addProductToCartFixture.addSpecificProductToCart(productToAdd, 1);
    await addProductToCartFixture.verifyProductInCart(productToAdd.name, 1);

    // Navigate to checkout
    await checkoutPage.navigateToCheckout();
    await checkoutPage.selectGuestCheckout();
    
    // Leave required fields empty and attempt to proceed
    await checkoutPage.proceedToNextStep();
    
    // Verify validation messages appear for each required field
    const validationErrors = await checkoutPage.getValidationErrors();
    expect(validationErrors.length).toBeGreaterThan(0);
    
    // Fill in one required field at a time
    for (const field of testData.requiredFields) {
      await checkoutPage.fillRequiredField(field, 'test value');
      
      // Verify validation clears for completed fields
      const remainingErrors = await checkoutPage.getValidationErrors();
      expect(remainingErrors.length).toBeLessThan(validationErrors.length);
    }
  });

  test('TS004_TC13 - Verify email format validation in checkout', async ({ addProductToCartFixture }) => {
    const testData = checkoutTestData.checkoutTestData.emailValidation;
    const productToAdd = cartTestData.specificProducts[0];
    await addProductToCartFixture.addSpecificProductToCart(productToAdd, 1);
    await addProductToCartFixture.verifyProductInCart(productToAdd.name, 1);    await checkoutPage.navigateToCheckout();
    await checkoutPage.selectGuestCheckout();
    
    // Test invalid email formats
    for (const invalidEmail of testData.invalidEmails) {
      await checkoutPage.fillEmailField(invalidEmail);
      await checkoutPage.proceedToNextStep();
      
      const emailError = await checkoutPage.getEmailValidationError();
      expect(emailError).toContain('invalid');
    }
    
    // Enter valid email
    await checkoutPage.fillEmailField(testData.validEmail);
    await checkoutPage.proceedToNextStep();
    
    // Verify validation passes
    const emailError = await checkoutPage.getEmailValidationError();
    expect(emailError).toBeNull();
  });

  // TS004_TC14: Phone number validation
  test('TS004_TC14 - Verify phone number validation in checkout', async ({ addProductToCartFixture }) => {
    const testData = checkoutTestData.checkoutTestData.phoneValidation;
    const productToAdd = cartTestData.specificProducts[0];

    // Add product to cart
    await addProductToCartFixture.addSpecificProductToCart(productToAdd, 1);
    await addProductToCartFixture.verifyProductInCart(productToAdd.name, 1);

    // Navigate to checkout
    await checkoutPage.navigateToCheckout();
    await checkoutPage.selectGuestCheckout();
    
    // Test invalid phone numbers
    for (const invalidPhone of testData.invalidPhones) {
      await checkoutPage.fillPhoneField(invalidPhone);
      await checkoutPage.proceedToNextStep();
      
      // Verify phone validation error messages
      const phoneError = await checkoutPage.getPhoneValidationError();
      expect(phoneError).toContain('invalid');
    }
    
    // Enter valid phone number
    await checkoutPage.fillPhoneField(testData.validPhone);
    await checkoutPage.proceedToNextStep();
    
    // Verify validation passes
    const phoneError = await checkoutPage.getPhoneValidationError();
    expect(phoneError).toBeNull();
  });

  // TS004_TC15: Guest checkout option availability
  test('TS004_TC15 - Verify guest checkout option availability', async ({ addProductToCartFixture }) => {
    const testData = checkoutTestData.checkoutTestData.guestCheckoutAvailability;
    const productToAdd = cartTestData.specificProducts[0];

    // Add product to cart
    await addProductToCartFixture.addSpecificProductToCart(productToAdd, 1);
    await addProductToCartFixture.verifyProductInCart(productToAdd.name, 1);

    // Navigate to checkout
    await checkoutPage.navigateToCheckout();
    
    // Verify guest checkout option is available
    const guestCheckoutAvailable = await checkoutPage.isGuestCheckoutAvailable();
    expect(guestCheckoutAvailable).toBeTruthy();
    
    // Verify create account option is also available
    const createAccountAvailable = await checkoutPage.isCreateAccountAvailable();
    expect(createAccountAvailable).toBeTruthy();
    
    // Select guest checkout
    await checkoutPage.selectGuestCheckout();
    
    // Verify guest information form appears
    await expect(checkoutPage.guestCheckoutTitle).toBeVisible();
  });

  // TS004_TC16: Account creation during checkout
  test('TS004_TC16 - Verify account creation during checkout', async ({ addProductToCartFixture }) => {
    const testData = checkoutTestData.checkoutTestData.accountCreation;
    const productToAdd = cartTestData.specificProducts[0];

    // Add product to cart
    await addProductToCartFixture.addSpecificProductToCart(productToAdd, 1);
    await addProductToCartFixture.verifyProductInCart(productToAdd.name, 1);

    // Navigate to checkout
    await checkoutPage.navigateToCheckout();
    
    // Select create account option
    await checkoutPage.selectCreateAccountOption();
    
    // Fill in account information
    await checkoutPage.fillPersonalDetails(testData.personalDetails);
    await checkoutPage.fillAccountDetails(testData.accountDetails);
    await checkoutPage.fillShippingAddress(testData.shippingAddress);
    await checkoutPage.proceedToNextStep();

    // Verify account is created and user is logged in
    const isLoggedIn = await checkoutPage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();
    
    // Verify order is associated with the new account
    await expect(checkoutPage.confirmationTitle).toBeVisible();
  });

  // TS004_TC17: Saved address usage for logged-in user
  test('TS004_TC17 - Verify checkout with saved address usage for logged-in user', async ({ addProductToCartFixture }) => {
    const testData = checkoutTestData.checkoutTestData.savedAddressUsage;
    const productToAdd = cartTestData.specificProducts[0];

    // Add product to cart with login
    await addProductToCartFixture.addProductToCartWithLogin(productToAdd, 1);
    
    // Navigate to checkout
    await checkoutPage.navigateToCheckout();
    
    // Verify saved addresses are available
    const savedAddresses = await checkoutPage.getSavedAddresses();
    expect(savedAddresses.length).toBeGreaterThan(0);
    
    // Select primary saved address
    await checkoutPage.selectSavedAddress(savedAddresses[0]);
    
    // Verify address details populate
    const addressDetails = await checkoutPage.getSelectedAddressDetails();
    expect(addressDetails).toBeTruthy();
    
    // Complete checkout
    await checkoutPage.proceedToNextStep();
    await expect(checkoutPage.confirmationTitle).toBeVisible();
  });

 

  // TS004_TC20: Browser back button navigation
  test('TS004_TC20 - Verify checkout with browser back button navigation', async ({ addProductToCartFixture }) => {
    const testData = checkoutTestData.checkoutTestData.browserNavigation;
    const productToAdd = cartTestData.specificProducts[0];

    // Add product to cart
    await addProductToCartFixture.addSpecificProductToCart(productToAdd, 1);
    await addProductToCartFixture.verifyProductInCart(productToAdd.name, 1);

    // Navigate to checkout
    await checkoutPage.navigateToCheckout();
    await checkoutPage.selectGuestCheckout();
    
    // Fill some information
    await checkoutPage.fillPersonalDetails(testData.personalDetails);
    await checkoutPage.fillShippingAddress(testData.shippingAddress);
    
    // Use browser back button
    await checkoutPage.goBack();
    
    // Verify data is preserved
    const preservedData = await checkoutPage.getPreservedData();
    expect(preservedData).toBeTruthy();
    
    // Modify information and proceed forward again
    await checkoutPage.modifyShippingAddress(testData.shippingAddress);
    await checkoutPage.proceedToNextStep();
    
    // Verify checkout integrity is maintained
    await expect(checkoutPage.confirmationTitle).toBeVisible();
  });

  // TS004_TC21: Session timeout handling
  test('TS004_TC21 - Verify checkout with session timeout', async ({ addProductToCartFixture }) => {
   
  });

  // Multiple products checkout
  test('Multiple products checkout', async ({ addProductToCartFixture }) => {
    const testData = checkoutTestData.checkoutTestData.multipleProducts;
    const productsToAdd = cartTestData.specificProducts.slice(0, 2);

    // Add multiple products to cart
    for (const product of productsToAdd) {
    await addProductToCartFixture.addSpecificProductToCart(product, 1);
    await addProductToCartFixture.verifyProductInCart(product.name, 1);
    }

    // Navigate to checkout
    await checkoutPage.navigateToCheckout();
    await checkoutPage.selectGuestCheckout();
    
    // Fill checkout form
    await checkoutPage.fillPersonalDetails(testData.personalDetails);
    await checkoutPage.fillShippingAddress(testData.shippingAddress);
    await checkoutPage.proceedToNextStep();

    // Verify checkout completion
    await expect(checkoutPage.confirmationTitle).toBeVisible();
    await expect(checkoutPage.guestCheckoutTitle).toBeVisible();

    // Verify order summary
    const orderSummary = await checkoutPage.getOrderSummary();
    expect(orderSummary.subTotal).toBeTruthy();
    expect(orderSummary.total).toBeTruthy();
  });
});
