const config = require('../config/config.js');

// Valid test data for checkout scenarios
const validGuestUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@test.com',
    telephone: '555-123-4567',
    fax: '555-123-4568'
};

const validShippingAddress = {
    company: 'Test Company',
    address1: '456 Oak Avenue',
    address2: 'Suite 100',
    city: 'Los Angeles',
    region: 'Greater London',
    zipCode: 'SW1A 1AA',
    country: 'United Kingdom'
};

const validShippingAddressUS = {
    company: 'Test Company',
    address1: '456 Oak Avenue',
    address2: 'Suite 100',
    city: 'Los Angeles',
    region: 'California',
    zipCode: '90210',
    country: 'United States'
};

const invalidShippingAddress = {
    company: '',
    address1: '',
    address2: '',
    city: '',
    region: '',
    zipCode: '00000',
    country: 'XX'
};

// Invalid email formats for validation testing
const invalidEmails = [
    'invalid-email',
    'test@',
    '@domain.com',
    'test..test@domain.com',
    'test@domain',
    'test@.com',
    'test space@domain.com'
];

const validEmail = 'test@example.com';

// Invalid phone numbers for validation testing
const invalidPhones = [
    '123',
    'abc-def-ghij',
    '123-45-678',
    '+44-invalid',
    '00000000000000000000'
];

const validPhone = '(555) 123-4567';

// Coupon codes for testing
const coupons = {
    invalid: 'INVALID123',
    expired: 'EXPIRED2023',
    valid: 'SAVE10',
    used: 'ALREADYUSED'
};

// Shipping methods
const shippingMethods = {
    standard: { value: 'flat.flat', name: 'Standard Shipping', cost: '$5.99', days: '5-7 days' },
    express: { value: 'express.express', name: 'Express Shipping', cost: '$12.99', days: '2-3 days' },
    overnight: { value: 'overnight.overnight', name: 'Overnight Shipping', cost: '$24.99', days: '1 day' },
    free: { value: 'free.free', name: 'Free Shipping', cost: '$0.00', days: '7-10 days' }
};

// Payment methods
const paymentMethods = {
    cod: { value: 'cod', name: 'Cash On Delivery' },
    bank: { value: 'bank_transfer', name: 'Bank Transfer' },
    cheque: { value: 'cheque', name: 'Cheque' }
};

// Free shipping threshold (for testing TS003_TC08)
const freeShippingThreshold = 100.00;

// Test products with different price points
const testProducts = {
    lowPrice: { name: 'Test Product Low', price: 15.99, id: 'product_low' },
    mediumPrice: { name: 'Test Product Medium', price: 45.00, id: 'product_medium' },
    highPrice: { name: 'Test Product High', price: 120.00, id: 'product_high' },
    discounted: { 
        name: 'Discounted Product', 
        originalPrice: 50.00, 
        discountedPrice: 35.00, 
        discount: 15.00,
        id: 'product_discounted' 
    }
};

// Tax calculation data (if applicable)
const taxData = {
    taxRate: 0.08, // 8% tax rate
    taxJurisdictions: ['California', 'New York', 'Texas']
};

// Validation error messages
const errorMessages = {
    requiredField: 'This field is required',
    invalidEmail: 'Invalid email format',
    invalidPhone: 'Invalid phone number format',
    invalidAddress: 'Invalid address',
    invalidZipCode: 'Invalid ZIP/Post Code',
    invalidCoupon: 'Invalid coupon code',
    expiredCoupon: 'Coupon has expired',
    outOfStock: 'Product is out of stock',
    sessionExpired: 'Your session has expired',
    emptyCart: 'Your cart is empty'
};

// Test case data mapping
const checkoutTestData = {
    // TS003_TC01: Guest user single product checkout
    TS003_TC01: {
        userType: 'guest',
        personalDetails: validGuestUser,
        shippingAddress: validShippingAddress,
        expectedFlow: 'guest_checkout_complete'
    },

    // TS003_TC02: Logged-in user single product checkout
    TS003_TC02: {
        userType: 'logged_in',
        credentials: config.credentials,
        expectedFlow: 'logged_in_checkout_complete'
    },

    // TS003_TC03: Quantity modification during checkout
    TS003_TC03: {
        initialQuantity: 3,
        modifiedQuantity: 2,
        personalDetails: validGuestUser,
        shippingAddress: validShippingAddress
    },

    // TS003_TC04: Product removal during checkout
    TS003_TC04: {
        personalDetails: validGuestUser,
        shippingAddress: validShippingAddress,
        expectedBehavior: 'empty_cart_handling'
    },

    // TS003_TC05: Valid shipping address
    TS003_TC05: {
        personalDetails: validGuestUser,
        shippingAddress: validShippingAddress,
        product: testProducts.mediumPrice
    },

    // TS003_TC06: Invalid shipping address
    TS003_TC06: {
        personalDetails: validGuestUser,
        shippingAddress: invalidShippingAddress,
        expectedErrors: ['address_validation_error']
    },

    // TS003_TC07: Multiple shipping options
    TS003_TC07: {
        personalDetails: validGuestUser,
        shippingAddress: validShippingAddress,
        shippingMethods: [shippingMethods.standard, shippingMethods.express, shippingMethods.overnight]
    },

    // TS003_TC08: Free shipping threshold
    TS003_TC08: {
        personalDetails: validGuestUser,
        shippingAddress: validShippingAddress,
        product: testProducts.lowPrice,
        freeShippingThreshold: freeShippingThreshold,
        highValueProduct: testProducts.highPrice
    },

    // TS003_TC09: Order summary accuracy
    TS003_TC09: {
        personalDetails: validGuestUser,
        shippingAddress: validShippingAddress,
        product: { name: 'Test Product', price: 25.99 },
        shippingCost: 5.99,
        taxRate: taxData.taxRate
    },

    // TS003_TC10: Order summary with discount
    TS003_TC10: {
        personalDetails: validGuestUser,
        shippingAddress: validShippingAddress,
        product: testProducts.discounted
    },

    // TS003_TC11: Invalid coupon code
    TS003_TC11: {
        personalDetails: validGuestUser,
        shippingAddress: validShippingAddress,
        couponCode: coupons.invalid,
        expectedError: errorMessages.invalidCoupon
    },

    // TS003_TC12: Required field validation
    TS003_TC12: {
        requiredFields: ['firstName', 'lastName', 'email', 'address1', 'city', 'region', 'zipCode', 'country'],
        expectedError: errorMessages.requiredField
    },

    // TS003_TC13: Email format validation
    TS003_TC13: {
        personalDetails: { ...validGuestUser, email: '' },
        shippingAddress: validShippingAddress,
        invalidEmails: invalidEmails,
        validEmail: validEmail
    },

    // TS003_TC14: Phone number validation
    TS003_TC14: {
        personalDetails: { ...validGuestUser, telephone: '' },
        shippingAddress: validShippingAddress,
        invalidPhones: invalidPhones,
        validPhone: validPhone
    },

    // TS003_TC15: Guest checkout availability
    TS003_TC15: {
        expectedOptions: ['guest_checkout', 'create_account'],
        personalDetails: validGuestUser,
        shippingAddress: validShippingAddress
    },

    // TS003_TC16: Account creation during checkout
    TS003_TC16: {
        userType: 'create_account',
        personalDetails: validGuestUser,
        shippingAddress: validShippingAddress,
        accountDetails: {
            password: 'TestPassword123!',
            confirmPassword: 'TestPassword123!'
        }
    },

    // TS003_TC17: Saved address usage
    TS003_TC17: {
        userType: 'logged_in',
        credentials: config.credentials,
        useSavedAddress: true,
        expectedBehavior: 'address_auto_populate'
    },

    // TS003_TC18: Stock depletion during checkout
    TS003_TC18: {
        personalDetails: validGuestUser,
        shippingAddress: validShippingAddress,
        product: 'last_available_item',
        expectedError: errorMessages.outOfStock
    },

    // TS003_TC19: Browser back button navigation
    TS003_TC19: {
        personalDetails: validGuestUser,
        shippingAddress: validShippingAddress,
        testBrowserNavigation: true
    },

    // TS003_TC20: Session timeout handling
    TS003_TC20: {
        personalDetails: validGuestUser,
        shippingAddress: validShippingAddress,
        sessionTimeout: 30000, // 30 seconds for testing
        expectedBehavior: 'session_handling'
    }
};

module.exports = {
    validGuestUser,
    validShippingAddress,
    validShippingAddressUS,
    invalidShippingAddress,
    invalidEmails,
    validEmail,
    invalidPhones,
    validPhone,
    coupons,
    shippingMethods,
    paymentMethods,
    freeShippingThreshold,
    testProducts,
    taxData,
    errorMessages,
    checkoutTestData
};