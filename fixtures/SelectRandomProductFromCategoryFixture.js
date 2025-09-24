// fixtures/SelectRandomProductCategoryFixture.js
const { test: base, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const ProductPage = require('../pages/ProductPage');
const logger = require('../utils/LoggerUtil');

const test = base.extend({
  selectRandomProductCategoryFixture: async ({ page }, use) => {
    logger.info('Setting up random product category fixture');

    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);

    const fixture = {
      homePage,
      productPage,

      // Pick a random category only from .subnav
      async navigateToRandomCategoryFromSubnav() {
        const categories = page.locator('.subnav'); // only subnav categories
        const count = await categories.count();

        if (count === 0) {
          throw new Error('No categories found in .subnav');
        }

        const randomIndex = Math.floor(Math.random() * count);
        const categoryName = await categories.nth(randomIndex).textContent();

        await categories.nth(randomIndex).click();
        await page.waitForLoadState('networkidle');

        logger.info(`Navigated to subnav category: ${categoryName}`);
        return categoryName.trim();
      },

      async selectRandomProduct() {
        // Get all visible product links
        const productLinks = page.locator('.thumbnail:visible a').first();
        const count = await productLinks.count();
      
        if (count === 0) {
          throw new Error('No products found');
        }
      
        const randomIndex = Math.floor(Math.random() * count);
        const selectedLink = productLinks.nth(randomIndex);
      
        // Get product name from the parent thumbnail
        const productName = await selectedLink.locator('xpath=..').locator('.prdocutname').first().textContent();
      
        await selectedLink.click();
        await page.waitForLoadState();
      
        return productName.trim();
      },
      // Function to find out-of-stock products across categories
      async findOutOfStockProduct() {
        logger.info('Starting search for out-of-stock products');
        
        let attempts = 0;
        const maxAttempts = 10; 
        
        while (attempts < maxAttempts) {
          attempts++;
          logger.info(`Attempt ${attempts}: Searching for out-of-stock product`);
          
          try {
            // Navigate to a random category
            const categoryName = await this.navigateToRandomCategoryFromSubnav();
            logger.info(`Searching in category: ${categoryName}`);
            
            // Get all products in this category
            const thumbnails = page.locator('.thumbnail');
            const productCount = await thumbnails.count();
            
            if (productCount === 0) {
              logger.info(`No products found in category: ${categoryName}, trying another category`);
              continue;
            }
            
            // Check each product for out-of-stock status
            for (let i = 0; i < productCount; i++) {
              const thumbnail = thumbnails.nth(i);
              const productName = await thumbnail.locator('..').locator('.prdocutname').first().textContent();
              
              // Click on the product to check its details
              await thumbnail.locator('a').first().click();
              await page.waitForLoadState();
              
              // Check if product is out of stock
              const isOutOfStock = await productPage.isOutOfStock();
              
              if (isOutOfStock) {
                logger.info(`Found out-of-stock product: ${productName.trim()} in category: ${categoryName}`);
                return {
                  productName: productName.trim(),
                  categoryName: categoryName,
                  isOutOfStock: true
                };
              }
              
              // Go back to category page to check next product
              await page.goBack();
              await page.waitForLoadState();
            }
            
            logger.info(`No out-of-stock products found in category: ${categoryName}`);
            
          } catch (error) {
            logger.error(`Error during attempt ${attempts}: ${error.message}`);
            // Navigate back to home page before trying again
            await homePage.navigate();
          }
        }
        
        logger.warn(`No out-of-stock products found after ${maxAttempts} attempts`);
        return {
          productName: null,
          categoryName: null,
          isOutOfStock: false,
          message: `No out-of-stock products found after ${maxAttempts} attempts`
        };
      },

      // Function to find out-of-stock product from a specific category
      async findOutOfStockProductInCategory(targetCategoryName) {
        logger.info(`Searching for out-of-stock products in specific category: ${targetCategoryName}`);
        
        try {
          // Navigate to the specific category
          const categories = page.locator('.subnav');
          const count = await categories.count();
          
          let categoryFound = false;
          for (let i = 0; i < count; i++) {
            const categoryName = await categories.nth(i).textContent();
            if (categoryName.trim().toLowerCase().includes(targetCategoryName.toLowerCase())) {
              await categories.nth(i).click();
              await page.waitForLoadState();
              categoryFound = true;
              logger.info(`Navigated to category: ${categoryName.trim()}`);
              break;
            }
          }
          
          if (!categoryFound) {
            logger.warn(`Category "${targetCategoryName}" not found`);
            return {
              productName: null,
              categoryName: targetCategoryName,
              isOutOfStock: false,
              message: `Category "${targetCategoryName}" not found`
            };
          }
          
          // Get all products in this category
          const thumbnails = page.locator('.thumbnail');
          const productCount = await thumbnails.count();
          
          if (productCount === 0) {
            logger.info(`No products found in category: ${targetCategoryName}`);
            return {
              productName: null,
              categoryName: targetCategoryName,
              isOutOfStock: false,
              message: `No products found in category: ${targetCategoryName}`
            };
          }
          
          // Check each product for out-of-stock status
          for (let i = 0; i < productCount; i++) {
            const thumbnail = thumbnails.nth(i);
            const productName = await thumbnail.locator('..').locator('.prdocutname').first().textContent();
            
            // Click on the product to check its details
            await thumbnail.locator('a').first().click();
            await page.waitForLoadState();
            
            // Check if product is out of stock
            const isOutOfStock = await productPage.isOutOfStock();
            
            if (isOutOfStock) {
              logger.info(`Found out-of-stock product: ${productName.trim()} in category: ${targetCategoryName}`);
              return {
                productName: productName.trim(),
                categoryName: targetCategoryName,
                isOutOfStock: true
              };
            }
            
            // Go back to category page to check next product
            await page.goBack();
            await page.waitForLoadState();
          }
          
          logger.info(`No out-of-stock products found in category: ${targetCategoryName}`);
          return {
            productName: null,
            categoryName: targetCategoryName,
            isOutOfStock: false,
            message: `No out-of-stock products found in category: ${targetCategoryName}`
          };
          
        } catch (error) {
          logger.error(`Error searching in category ${targetCategoryName}: ${error.message}`);
          return {
            productName: null,
            categoryName: targetCategoryName,
            isOutOfStock: false,
            message: `Error occurred: ${error.message}`
          };
        }
      },

      // Function to check current product's stock status
      async checkCurrentProductStock() {
        try {
          const isOutOfStock = await productPage.isOutOfStock();
          const isInStock = await productPage.isInStock();
          const productTitle = await productPage.getProductTitle();
          
          logger.info(`Product: ${productTitle}, Out of Stock: ${isOutOfStock}, In Stock: ${isInStock}`);
          
          return {
            productName: productTitle,
            isOutOfStock: isOutOfStock,
            isInStock: isInStock,
            isAddToCartEnabled: await productPage.isAddToCartButtonEnabled()
          };
        } catch (error) {
          logger.error(`Error checking product stock: ${error.message}`);
          return {
            productName: null,
            isOutOfStock: false,
            isInStock: false,
            isAddToCartEnabled: false,
            error: error.message
          };
        }
      },
    };

    await use(fixture);
  },
});

module.exports = { test, expect };
