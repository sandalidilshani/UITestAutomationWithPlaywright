# Out-of-Stock Product Testing Documentation

## Overview
The `SelectRandomProductFromCategoryFixture.js` has been updated with new functions to handle out-of-stock product testing. These functions allow you to find and verify out-of-stock products across different categories.

## New Functions Added

### 1. `findOutOfStockProduct()`
**Purpose**: Searches across multiple random categories to find any out-of-stock product.

**Returns**: 
```javascript
{
  productName: string | null,      // Name of the out-of-stock product found
  categoryName: string | null,     // Category where the product was found
  isOutOfStock: boolean,           // Whether an out-of-stock product was found
  message?: string                 // Additional information if no product found
}
```

**Usage Example**:
```javascript
const result = await selectRandomProductCategoryFixture.findOutOfStockProduct();
if (result.isOutOfStock) {
  console.log(`Found out-of-stock product: ${result.productName} in ${result.categoryName}`);
}
```

### 2. `findOutOfStockProductInCategory(targetCategoryName)`
**Purpose**: Searches for out-of-stock products within a specific category.

**Parameters**:
- `targetCategoryName` (string): The name of the category to search in

**Returns**: Same structure as `findOutOfStockProduct()`

**Usage Example**:
```javascript
const result = await selectRandomProductCategoryFixture.findOutOfStockProductInCategory('Apparel');
if (result.isOutOfStock) {
  console.log(`Found out-of-stock product in Apparel: ${result.productName}`);
}
```

### 3. `checkCurrentProductStock()`
**Purpose**: Checks the stock status of the currently loaded product page.

**Returns**:
```javascript
{
  productName: string | null,      // Current product name
  isOutOfStock: boolean,           // Whether product is out of stock
  isInStock: boolean,              // Whether product is in stock
  isAddToCartEnabled: boolean,     // Whether Add to Cart button is enabled
  error?: string                   // Error message if something went wrong
}
```

**Usage Example**:
```javascript
const stockStatus = await selectRandomProductCategoryFixture.checkCurrentProductStock();
console.log(`Product: ${stockStatus.productName}, Out of Stock: ${stockStatus.isOutOfStock}`);
```

## Key Features

### 1. **Intelligent Category Navigation**
- Automatically navigates through different categories using the existing `navigateToRandomCategoryFromSubnav()` function
- Falls back to other categories if no out-of-stock products are found in the current category

### 2. **Robust Error Handling**
- Handles cases where categories have no products
- Manages navigation errors and continues searching
- Provides detailed logging for debugging

### 3. **ProductPage Integration**
- Uses the existing `ProductPage.js` methods:
  - `isOutOfStock()`: Checks for out-of-stock label
  - `isInStock()`: Checks for in-stock status
  - `isAddToCartButtonEnabled()`: Verifies if Add to Cart is available
  - `getProductTitle()`: Gets product name

### 4. **Comprehensive Logging**
- Logs search progress and results
- Provides detailed information about found products
- Logs errors for troubleshooting

## Test Implementation Examples

### Basic Out-of-Stock Search
```javascript
test('Find any out-of-stock product', async ({ page, selectRandomProductCategoryFixture }) => {
  await selectRandomProductCategoryFixture.homePage.navigate();
  
  const result = await selectRandomProductCategoryFixture.findOutOfStockProduct();
  
  if (result.isOutOfStock) {
    // Verify the product is actually out of stock
    const stockStatus = await selectRandomProductCategoryFixture.checkCurrentProductStock();
    expect(stockStatus.isOutOfStock).toBe(true);
    expect(stockStatus.isAddToCartEnabled).toBe(false);
  }
});
```

### Category-Specific Search
```javascript
test('Find out-of-stock product in Electronics', async ({ page, selectRandomProductCategoryFixture }) => {
  await selectRandomProductCategoryFixture.homePage.navigate();
  
  const result = await selectRandomProductCategoryFixture.findOutOfStockProductInCategory('Electronics');
  
  if (result.isOutOfStock) {
    // Product found in Electronics category
    console.log(`Found: ${result.productName}`);
  } else {
    // No out-of-stock products in Electronics
    console.log(result.message);
  }
});
```

### Verification Test
```javascript
test('Verify out-of-stock product behavior', async ({ page, selectRandomProductCategoryFixture }) => {
  const result = await selectRandomProductCategoryFixture.findOutOfStockProduct();
  
  if (result.isOutOfStock) {
    // Check that the product cannot be added to cart
    const stockStatus = await selectRandomProductCategoryFixture.checkCurrentProductStock();
    
    expect(stockStatus.isOutOfStock).toBe(true);
    expect(stockStatus.isAddToCartEnabled).toBe(false);
    
    // Verify out-of-stock label is visible
    const isOutOfStockVisible = await selectRandomProductCategoryFixture.productPage.isOutOfStock();
    expect(isOutOfStockVisible).toBe(true);
  }
});
```

## Configuration Options

### Maximum Search Attempts
The `findOutOfStockProduct()` function has a built-in limit of 10 attempts to prevent infinite loops. You can modify this in the fixture:

```javascript
const maxAttempts = 10; // Change this value as needed
```

### Category Selection
The functions use the existing `.subnav` selector to find categories. Make sure your test environment has products marked as out-of-stock for effective testing.

## Troubleshooting

### Common Issues:

1. **No out-of-stock products found**: This is normal if your test environment doesn't have out-of-stock products. The functions will return appropriate messages.

2. **Navigation errors**: The functions include error handling and will retry with different categories.

3. **Selector issues**: If product selectors change, update the corresponding selectors in the fixture.

### Debug Logging:
All functions include comprehensive logging. Check the test logs for detailed information about the search process and any errors encountered.

## Dependencies
- `ProductPage.js`: For stock status checking methods
- `HomePage.js`: For navigation
- `LoggerUtil.js`: For logging functionality
- Existing category and product selectors (`.subnav`, `.thumbnail`, `.prdocutname`)