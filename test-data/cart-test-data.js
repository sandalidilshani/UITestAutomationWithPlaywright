// Test data for cart functionality tests

const cartTestData = {

    // Specific products for testing
    specificProducts: [
        {
            id: 50,
            name: "Skinsheen Bronzer Stick",
            model: "558001",
            price: 29.50,
            url: "/index.php?rt=product/product&product_id=50",
            inStock: true,
            hasOptions: false,
            description: "Bronzer stick for natural-looking tan"
        },
        {
            id: 52,
            name: "Benefit Bella Bamba",
            model: "558003",
            price: 28.00,
            url: "/index.php?rt=product/product&product_id=52",
            inStock: true,
            hasOptions: false,
            description: "Blush for a healthy glow"
        },
        {
            id: 49,
            name: "Giorgio Armani Acqua Di Gio Pour Homme",
            model: "557001",
            price: 58.00,
            url: "/index.php?rt=product/product&product_id=49",
            inStock: true,
            hasOptions: false,
            description: "Men's fragrance"
        }
    ],

    // Out of stock products
    outOfStockProducts: [
        {
            id: 51,
            name: "BeneFit Girl Meets Pearl",
            model: "558007",
            price: 19.00,
            salePrice: 30.00,
            url: "/index.php?rt=product/product&product_id=51",
            inStock: false,
            hasOptions: false
        },
        {
            id: 66,
            name: "Total Moisture Facial Cream",
            model: "558008",
            price: 38.00,
            url: "/index.php?rt=product/product&product_id=66",
            inStock: false,
            hasOptions: false
        }
    ],

    // Products with options/variations
    productsWithOptions: [
        {
            id: 116,
            name: "New Ladies High Wedge Heel Toe Thong Diamante Flip Flop Sandals",
            model: "FFSS001",
            price: 26.00,
            url: "/index.php?rt=product/product&product_id=116",
            inStock: true,
            hasOptions: true,
            options: {
                size: ["Small", "Medium", "Large"],
                color: ["Red", "Blue", "Black"]
            }
        }
    ],

    // Test quantities
    quantities: {
        default: 1,
        multiple: 3,
        large: 10,
        maximum: 999,
        zero: 0,
        negative: -1,
        excessive: 1005
    },

    // Guest user data
    guestUser: {
        isLoggedIn: false,
        sessionPersistence: false
    },

    // Test user credentials (from the prompt)
    testUser: {
        username: "sandali99",
        password: "Sandali@12",
        isLoggedIn: true,
        sessionPersistence: true
    },

    // Shipping and pricing data
    shipping: {
        flatRate: 2.00,
        freeThreshold: 100.00,
        country: "United Kingdom",
        state: "Greater London",
        zipCode: "SW1A 1AA"
    },

    // Cart limits and validation
    cartLimits: {
        maxItems: 100,
        maxQuantityPerItem: 999,
        minQuantityPerItem: 1
    },

    // Coupon codes for testing
    coupons: {
        valid: "SAVE10",
        invalid: "INVALID123",
        expired: "EXPIRED2023"
    },

    // Expected error messages
    errorMessages: {
        outOfStock: "Out of Stock",
        insufficientStock: "Insufficient stock",
        invalidQuantity: "Quantity must be at least 1",
        cartLimit: "Maximum cart limit reached",
        networkError: "Network error occurred",
        invalidCoupon: "Invalid coupon code"
    },

    // Expected success messages
    successMessages: {
        addedToCart: "Success: You have added",
        cartUpdated: "Cart updated successfully",
        couponApplied: "Coupon applied successfully"
    },

    // Browser simulation data
    networkConditions: {
        offline: { offline: true },
        slow3G: { 
            downloadThroughput: 500 * 1024 / 8,
            uploadThroughput: 500 * 1024 / 8,
            latency: 400
        },
        fast3G: {
            downloadThroughput: 1.6 * 1024 * 1024 / 8,
            uploadThroughput: 750 * 1024 / 8,
            latency: 150
        }
    },

    // Test scenarios data
    scenarios: {
        singleProductGuest: {
            user: "guest",
            products: [{ id: 50, quantity: 1 }],
            expectedTotal: 31.50 // 29.50 + 2.00 shipping
        },
        multipleQuantitySame: {
            user: "guest",
            products: [{ id: 50, quantity: 3 }],
            expectedTotal: 90.50 // (29.50 * 3) + 2.00 shipping
        },
        multipleDifferentProducts: {
            user: "guest",
            products: [
                { id: 50, quantity: 1 },
                { id: 52, quantity: 1 }
            ],
            expectedTotal: 59.50 // (29.50 + 28.00) + 2.00 shipping
        },
        maxStock: {
            user: "guest",
            products: [{ id: 50, quantity: 999 }],
            expectedTotal: 29402.50 // (29.50 * 999) + 2.00 shipping
        },
        productWithOptions: {
            user: "guest",
            products: [{
                id: 116,
                quantity: 1,
                options: { size: "Large", color: "Blue" }
            }],
            expectedTotal: 28.00 // 26.00 + 2.00 shipping
        }
    }
};

module.exports = cartTestData;