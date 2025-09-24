const productSelectionTestData = {
    searchTerms: {
        men: {
            term: "men",
            expectedResults: "Products related to men's items should be displayed"
        },
        skincare: {
            term: "skincare",
            expectedResults: "Skincare products should be displayed"
        },
        makeup: {
            term: "makeup",
            expectedResults: "Makeup products should be displayed"
        },
        fragrance: {
            term: "fragrance",
            expectedResults: "Fragrance products should be displayed"
        }
    },

    specificProducts: {
        // Based on your recorded test - the $32.00 product
        menProduct: {
            searchTerm: "men",
            identifier: "View Write Review $32.00",
            expectedPrice: "$32.00"
        }
    },

    cartVerification: {
        minimumItemsExpected: 1,
        cartUrl: "https://automationteststore.com/index.php?rt=checkout/cart",
        emptyCartMessage: "Your shopping cart is empty!"
    },

    randomSelection: {
        maxRetries: 3,
        selectionStrategy: "random", // could be "first", "last", "random"
        fallbackSearchTerm: "skincare" // fallback if primary search fails
    },

    testConfiguration: {
        baseUrl: "https://automationteststore.com/",
        waitTimeout: 10000,
        navigationTimeout: 30000
    }
};

module.exports = productSelectionTestData;