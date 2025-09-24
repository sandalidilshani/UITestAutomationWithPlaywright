const searchTestData = {
    valid: {
        searchTerm: "men"
    },
    
    invalid: {
        searchTerm: "xyznoproduct123",
        expectedMessage: "No products found"
    },
    
    empty: {
        searchTerm: "",
        expectedBehavior: "Either validation message or all products displayed"
    },
    
    specialCharacters: {
        searchTerm: "@#$%^&*()",
        expectedBehavior: "System gracefully handles special characters without crashes"
    },
    
    numeric: {
        searchTerm: "123",
        expectedResults: "Products containing '123' in name, description, or SKU are displayed"
    },
    
    caseInsensitive: {
        upperCase: "MAKEUP",
        lowerCase: "makeup",
        expectedBehavior: "Search results are case-insensitive, same products appear for both cases"
    },
    
    longString: {
        searchTerm: "erylongproductnamethatexceedsmaximumlimitverylongproductnamethatexceedsmaximumlimitverylongproductname",
        expectedBehavior: "System either truncates input or shows validation message for character limit"
    },
    
    pagination: {
        searchTerm: "product",
        expectedBehavior: "Pagination controls work correctly, user can navigate through multiple pages of results"
    },
    
    sorting: {
        searchTerm: "skincare",
        sortOption: "Price: Low to High",
        expectedBehavior: "Search results are properly sorted according to selected criteria"
    },
    
    filtering: {
        searchTerm: "makeup",
        priceRange: {
            min: 10,
            max: 50
        },
        expectedBehavior: "Search results show only products matching applied filters"
    },
    
    autocomplete: {
        partialTerm: "make",
        expectedBehavior: "Search suggestions appear as user types, selection works correctly"
    },
    
    crossPage: {
        searchTerm: "fragrance",
        expectedBehavior: "Search functionality works consistently from all pages on the website"
    },
    
    timeout: {
        searchTerm: "men",
    },

    guestUser: {
        searchTerm: "men",
       
    },
    loggedInUser: {
        searchTerm: "makeup",
        credentials: {
            username: "testuser@example.com",
            password: "password123"
        },
        expectedBehavior: "Search functionality works fully for logged-in users, same results as guest users"
    },

    searchConsistency: {
        searchTerm: "fragrance",
        credentials: {
            username: "testuser@example.com", 
            password: "password123"
        },
        expectedBehavior: "Search results are identical for both guest and logged-in users (no hidden/restricted products)"
    },

    searchHistory: {
        searchTerms: ["beauty", "health"],
        credentials: {
            username: "testuser@example.com",
            password: "password123"
        },
        expectedBehavior: "If feature exists, logged-in users have access to search history or personalized suggestions"
    },

    searchFromAuthPages: {
        searchTerm: "men",
        expectedBehavior: "Search functionality is accessible from authentication pages and works correctly"
    }
};

module.exports = searchTestData;