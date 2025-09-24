// Comprehensive test data for checkout functionality
const guestUserData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@test.com',
    telephone: '555-123-4567'
};

const shippingAddressData = {
    address1: '456 Oak Avenue',
    city: 'Los Angeles',
    zipCode: '90210',
    country: 'United States',
    region: 'California'
};

const invalidShippingAddress = {
    address1: '',
    city: '',
    zipCode: '00000',
    country: 'XX',
    region: ''
};

const invalidData = {
    emptyEmail: '',
    invalidEmail: 'invalid-email',
    emptyPhone: '',
    invalidPhone: '123',
    invalidEmails: [
        'invalid-email',
        'test@',
        '@domain.com',
        'test..test@domain.com'
    ],
    invalidPhones: [
        '123',
        'abc-def-ghij',
        '123-45-678'
    ]
};

const validData = {
    validEmail: 'test@example.com',
    validPhone: '(555) 123-4567'
};

const couponData = {
    invalid: 'INVALID123',
    expired: 'EXPIRED2023',
    valid: 'SAVE10'
};

const shippingMethods = {
    standard: { name: 'Standard Shipping', cost: '$5.99' },
    express: { name: 'Express Shipping', cost: '$12.99' },
    overnight: { name: 'Overnight Shipping', cost: '$24.99' },
    free: { name: 'Free Shipping', cost: '$0.00' }
};

const testProducts = {
    lowPrice: { name: 'Test Product Low', price: 15.99 },
    mediumPrice: { name: 'Test Product Medium', price: 45.00 },
    highPrice: { name: 'Test Product High', price: 120.00 },
    discounted: { name: 'Discounted Product', originalPrice: 50.00, discountedPrice: 35.00 }
};

// Comprehensive test case data
const checkoutTestData = {
    // TS004_TC01: Guest checkout with single product
    guestCheckout: {
        userType: 'guest',
        personalDetails: guestUserData,
        shippingAddress: shippingAddressData
    },
    
    // TS004_TC02: Logged-in user checkout
    loggedInCheckout: {
        userType: 'logged_in'
    },
    
    // TS004_TC03: Quantity modification during checkout
    quantityModification: {
        userType: 'guest',
        personalDetails: guestUserData,
        shippingAddress: shippingAddressData,
        initialQuantity: 3,
        modifiedQuantity: 2
    },
    
    // TS004_TC04: Product removal during checkout
    productRemoval: {
        userType: 'guest',
        personalDetails: guestUserData,
        shippingAddress: shippingAddressData
    },
    
    // TS004_TC05: Valid shipping address
    validShippingAddress: {
        userType: 'guest',
        personalDetails: guestUserData,
        shippingAddress: shippingAddressData
    },
    
    // TS004_TC06: Invalid shipping address
    invalidShippingAddress: {
        userType: 'guest',
        personalDetails: guestUserData,
        shippingAddress: invalidShippingAddress
    },
    
    // TS004_TC07: Multiple shipping options
    multipleShippingOptions: {
        userType: 'guest',
        personalDetails: guestUserData,
        shippingAddress: shippingAddressData,
        shippingMethods: [shippingMethods.standard, shippingMethods.express, shippingMethods.overnight]
    },
    
    // TS004_TC08: Free shipping threshold
    freeShippingThreshold: {
        userType: 'guest',
        personalDetails: guestUserData,
        shippingAddress: shippingAddressData,
        product: testProducts.lowPrice,
        freeShippingThreshold: 100.00,
        highValueProduct: testProducts.highPrice
    },
    
    // TS004_TC09: Order summary accuracy
    orderSummaryAccuracy: {
        userType: 'guest',
        personalDetails: guestUserData,
        shippingAddress: shippingAddressData,
        product: { name: 'Test Product', price: 25.99 },
        shippingCost: 5.99
    },
    
    // TS004_TC10: Order summary with discount
    orderSummaryWithDiscount: {
        userType: 'guest',
        personalDetails: guestUserData,
        shippingAddress: shippingAddressData,
        product: testProducts.discounted
    },
    
    // TS004_TC11: Invalid coupon code
    invalidCoupon: {
        userType: 'guest',
        personalDetails: guestUserData,
        shippingAddress: shippingAddressData,
        couponCode: couponData.invalid
    },
    
    // TS004_TC12: Required field validation
    requiredFieldValidation: {
        userType: 'guest',
        requiredFields: ['firstName', 'lastName', 'email', 'address1', 'city', 'region', 'zipCode', 'country']
    },
    
    // TS004_TC13: Email format validation
    emailValidation: {
        userType: 'guest',
        personalDetails: { ...guestUserData, email: '' },
        shippingAddress: shippingAddressData,
        invalidEmails: invalidData.invalidEmails,
        validEmail: validData.validEmail
    },
    
    // TS004_TC14: Phone number validation
    phoneValidation: {
        userType: 'guest',
        personalDetails: { ...guestUserData, telephone: '' },
        shippingAddress: shippingAddressData,
        invalidPhones: invalidData.invalidPhones,
        validPhone: validData.validPhone
    },
    
    // TS004_TC15: Guest checkout option availability
    guestCheckoutAvailability: {
        userType: 'guest',
        personalDetails: guestUserData,
        shippingAddress: shippingAddressData
    },
    
    // TS004_TC16: Account creation during checkout
    accountCreation: {
        userType: 'create_account',
        personalDetails: guestUserData,
        shippingAddress: shippingAddressData,
        accountDetails: {
            password: 'TestPassword123!',
            confirmPassword: 'TestPassword123!'
        }
    },
    
    // TS004_TC17: Saved address usage
    savedAddressUsage: {
        userType: 'logged_in',
        useSavedAddress: true
    },
    
    // TS004_TC18: Stock depletion during checkout
    stockDepletion: {
        userType: 'guest',
        personalDetails: guestUserData,
        shippingAddress: shippingAddressData,
        product: 'last_available_item'
    },
    
    // TS004_TC20: Browser back button navigation
    browserNavigation: {
        userType: 'guest',
        personalDetails: guestUserData,
        shippingAddress: shippingAddressData,
        testBrowserNavigation: true
    },
    
    // TS004_TC21: Session timeout handling
    sessionTimeout: {
        userType: 'guest',
        personalDetails: guestUserData,
        shippingAddress: shippingAddressData,
        sessionTimeout: 30000
    },
    
    // Multiple products checkout
    multipleProducts: {
        userType: 'guest',
        personalDetails: guestUserData,
        shippingAddress: shippingAddressData,
        productCount: 2
    }
};

module.exports = {
    guestUserData,
    shippingAddressData,
    invalidShippingAddress,
    invalidData,
    validData,
    couponData,
    shippingMethods,
    testProducts,
    checkoutTestData
};