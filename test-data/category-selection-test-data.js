const categorySelectionTestData = {
    // Main product categories available on the site
    mainCategories: [
        'Apparel & accessories',
        'Makeup',
        'Skincare', 
        'Hair Care',
        'Men',
        'Fragrance',
        'Books'
    ],

    // Category hierarchy with subcategories
    categoryHierarchy: {
        'Apparel & accessories': {
            displayName: 'Apparel & accessories',
            subcategories: ['Shoes', 'T-shirts'],
            url: 'https://automationteststore.com/index.php?rt=product/category&path=68'
        },
        'Makeup': {
            displayName: 'Makeup',
            subcategories: ['Cheeks', 'Eyes', 'Face', 'Lips', 'Nails', 'Value Sets'],
            url: 'https://automationteststore.com/index.php?rt=product/category&path=36'
        },
        'Skincare': {
            displayName: 'Skincare',
            subcategories: ['Eyes', 'Face', 'Gift Ideas & Sets', 'Hands & Nails', 'Sun'],
            url: 'https://automationteststore.com/index.php?rt=product/category&path=43'
        },
        'Hair Care': {
            displayName: 'Hair Care',
            subcategories: ['Conditioner', 'Shampoo'],
            url: 'https://automationteststore.com/index.php?rt=product/category&path=52'
        },
        'Men': {
            displayName: 'Men',
            subcategories: ['Body & Shower', 'Fragrance Sets', 'Pre-Shave & Shaving', 'Skincare'],
            url: 'https://automationteststore.com/index.php?rt=product/category&path=58'
        },
        'Fragrance': {
            displayName: 'Fragrance',
            subcategories: ['Men', 'Women'],
            url: 'https://automationteststore.com/index.php?rt=product/category&path=49',
            exact: true // Use exact match for this category
        },
        'Books': {
            displayName: 'Books',
            subcategories: ['Audio CD', 'Paperback'],
            url: 'https://automationteststore.com/index.php?rt=product/category&path=65'
        }
    },

    // Specific subcategory details
    subcategoryDetails: {
        // Makeup subcategories
        'Lips': {
            parentCategory: 'Makeup',
            url: 'https://automationteststore.com/index.php?rt=product/category&path=36_39'
        },
        'Eyes': {
            parentCategory: 'Makeup',
            url: 'https://automationteststore.com/index.php?rt=product/category&path=36_37'
        },
        'Face': {
            parentCategory: 'Makeup',
            url: 'https://automationteststore.com/index.php?rt=product/category&path=36_35'
        },
        
        // Hair Care subcategories
        'Conditioner': {
            parentCategory: 'Hair Care',
            url: 'https://automationteststore.com/index.php?rt=product/category&path=52_53'
        },
        'Shampoo': {
            parentCategory: 'Hair Care',
            url: 'https://automationteststore.com/index.php?rt=product/category&path=52_54'
        },

        // Men subcategories
        'Fragrance Sets': {
            parentCategory: 'Men',
            url: 'https://automationteststore.com/index.php?rt=product/category&path=58_60'
        },
        'Skincare': {
            parentCategory: 'Men',
            url: 'https://automationteststore.com/index.php?rt=product/category&path=58_61'
        }
    },

    // Selection strategies
    selectionStrategies: {
        random: {
            description: 'Randomly select categories and subcategories',
            useRandomSeed: false
        },
        weighted: {
            description: 'Select categories with higher probability for popular ones',
            weights: {
                'Makeup': 0.25,
                'Skincare': 0.20,
                'Men': 0.15,
                'Hair Care': 0.15,
                'Fragrance': 0.10,
                'Apparel & accessories': 0.10,
                'Books': 0.05
            }
        },
        sequential: {
            description: 'Go through categories in order',
            currentIndex: 0
        }
    },

    // Test configuration
    testConfig: {
        maxNavigationRetries: 3,
        waitTimeoutMs: 10000,
        navigationTimeoutMs: 30000,
        minCategoriesForRandomTest: 3,
        maxCategoriesForRandomTest: 6,
        defaultNavigationDepth: 2 // category + subcategory
    },

    // Expected elements for verification
    expectedElements: {
        categoryPage: {
            breadcrumbs: '[class*="breadcrumb"]',
            productGrid: '[class*="product"]',
            categoryTitle: 'h1, .heading1',
            sortOptions: '[name="sort"]',
            pagination: '.pagination'
        },
        categoryMenu: {
            menuContainer: '#categorymenu',
            categoryLinks: '#categorymenu a',
            dropdownIndicator: '.dropdown-toggle'
        }
    },

    // Error handling
    errorMessages: {
        categoryNotFound: 'Category not found or not clickable',
        subcategoryNotFound: 'Subcategory not found or not clickable', 
        navigationTimeout: 'Navigation to category timed out',
        categoryMenuNotAvailable: 'Category menu is not available',
        noProductsInCategory: 'No products found in the selected category'
    }
};

module.exports = categorySelectionTestData;