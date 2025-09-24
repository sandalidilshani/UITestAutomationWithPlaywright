/**
 * Cart Test Data
 * Contains all test data needed for cart functionality testing
 */

const cartTestData = {
    
    // ===========================================
    // TEST USER CREDENTIALS
    // ===========================================
    testUser: {
        username: "sandali99",
        password: "Sandali@12"
    },

    // ===========================================
    // PRODUCT DATA
    // ===========================================
    
    // Products for basic cart testing
    specificProducts: [
        {
            id: 50,
            name: "Skinsheen Bronzer Stick",
            price: 29.50
        },
        {
            id: 52,
            name: "Benefit Bella Bamba", 
            price: 28.00
        },
        {
            id: 49,
            name: "Giorgio Armani Acqua Di Gio Pour Homme",
            price: 58.00
        }
    ],

    // Products with size/color options
    productsWithOptions: [
        {
            id: 116,
            name: "New Ladies High Wedge Heel Toe Thong Diamante Flip Flop Sandals",
            price: 26.00
        }
    ],

    // Simple product list for basic tests
    singleProducts: [
        {
            id: 50,
            name: "Skinsheen Bronzer Stick",
            price: 29.50
        },
        {
            id: 52,
            name: "Benefit Bella Bamba",
            price: 28.00
        }
    ]
};

module.exports = cartTestData;