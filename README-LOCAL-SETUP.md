# UI Test Automation with Playwright - Local Setup Guide

## 📋 Project Overview

This project is a comprehensive UI test automation framework built with **Playwright** for testing the Automation Test Store (https://automationteststore.com). It implements the **Page Object Model (POM)** design pattern with custom fixtures, data-driven testing, and advanced reporting capabilities.

## 🏗️ Project Architecture

```
UIAutomation/
├── config/                     # Environment configurations
│   ├── config.js              # Main configuration file
│   ├── .env                   # Default environment variables
│   ├── .env.qa                # QA environment variables
│   └── .env.uat               # UAT environment variables
├── fixtures/                   # Custom test fixtures
│   ├── addProductToCartFixture.js
│   ├── loginFixture.js
│   └── SelectRandomProductFromCategoryFixture.js
├── pages/                      # Page Object Model classes
│   ├── BasePage.js            # Base page with common functionality
│   ├── HomePage.js
│   ├── LoginPage.js
│   ├── ProductPage.js
│   ├── CartPage.js
│   ├── CheckoutPage.js
│   ├── SearchPage.js
│   └── AccountPage.js
├── tests/                      # Test specifications
│   ├── auth.setup.js          # Authentication setup
│   ├── login.spec.js          # Login functionality tests
│   ├── cart.spec.js           # Cart functionality tests
│   ├── product.spec.js        # Product functionality tests
│   ├── search.spec.js         # Search functionality tests
│   ├── Checkout.spec.js       # Checkout functionality tests
│   └── storeLoginContext/     # Stored authentication state
├── test-data/                  # Test data files
│   ├── login-test-data.js
│   ├── cart-test-data.js
│   ├── product-selection-test-data.js
│   ├── search-test-data.js
│   └── checkout-test-data.js
├── utils/                      # Utility functions
│   └── LoggerUtil.js          # Winston logger configuration
├── reporters/                  # Custom reporting
│   └── custom-html-report.js  # Custom HTML reporter
├── logging/                    # Log files
│   ├── test_run.log
│   └── test_error.log
└── playwright-report/          # Generated test reports
```

## 🔧 Prerequisites

Before setting up this project locally, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **Git** (for version control)
- **Visual Studio Code** (recommended IDE)

## 🚀 Local Setup Instructions

### Step 1: Clone the Repository

```bash
git clone https://github.com/sandalidilshani/UITestAutomationWithPlaywright.git
cd UITestAutomationWithPlaywright
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- `@playwright/test` - Playwright testing framework
- `winston` - Logging library
- `dotenv` - Environment variable management
- `crypto-js` - Encryption utilities
- `moment-timezone` - Date/time handling
- `xlsx` - Excel file operations

### Step 3: Install Playwright Browsers

```bash
npx playwright install
```

This command downloads the required browser binaries (Chromium, Firefox, WebKit).

### Step 4: Environment Configuration

The project uses multiple environment configurations. The default configuration is in `config/.env`:

```env
# Application Configuration
BASE_URL=https://automationteststore.com
PORT=3000

# User Credentials
LOGIN_USERNAME=Sandali99
LOGIN_PASSWORD=Sandali@12

# Test Configuration
TEST_TIMEOUT=30000
TEST_RETRIES=2
TEST_WORKERS=1

# Browser Configuration
HEADLESS=false
SLOW_MO=0
VIEWPORT_WIDTH=1280
VIEWPORT_HEIGHT=720
```

**Optional**: Modify the credentials and other settings as needed for your testing requirements.

### Step 5: Verify Installation

Run a quick test to verify everything is set up correctly:

```bash
npx playwright test --reporter=list
```

## 🎯 Running Tests

### Run All Tests
```bash
npx playwright test
```

### Run Specific Test Files
```bash
# Run login tests only
npx playwright test login.spec.js

# Run cart tests only
npx playwright test cart.spec.js

# Run checkout tests only
npx playwright test Checkout.spec.js
```

### Run Tests with Different Configurations

#### Headless Mode
```bash
npx playwright test --project=all
```

#### Debug Mode (with browser UI)
```bash
npx playwright test --debug
```

#### Run Tests with Custom Reporter
```bash
npx playwright test --reporter=./reporters/custom-html-report.js
```

### Run Tests for Different Environments

#### QA Environment
```bash
NODE_ENV=qa npx playwright test
```

#### UAT Environment
```bash
NODE_ENV=uat npx playwright test
```

## 📊 Test Reports and Outputs

### HTML Reports
After test execution, reports are generated in:
- `playwright-report/index.html` - Default Playwright report
- `custom-report.html` - Custom HTML report with grouped scenarios

### Log Files
- `logging/test_run.log` - General test execution logs
- `logging/test_error.log` - Error-specific logs

### Test Results
- `test-results/` - Contains screenshots, videos, and traces for failed tests
- Videos are recorded only on test failures
- Screenshots are captured on failures
- Traces are captured on first retry

## 🔍 Key Features

### 1. Page Object Model (POM)
- **BasePage.js**: Common functionality shared across all pages
- Individual page classes for each application page
- Centralized element locators and actions

### 2. Custom Fixtures
- **SelectRandomProductFromCategoryFixture.js**: Handles random product selection
- **addProductToCartFixture.js**: Cart-related test fixtures
- **loginFixture.js**: Authentication-related fixtures

### 3. Data-Driven Testing
- Centralized test data in `test-data/` directory
- Environment-specific configurations
- Parameterized test execution

### 4. Advanced Logging
- Winston-based logging with timezone support
- Separate log files for different log levels
- Structured logging with timestamps

### 5. Authentication Management
- **auth.setup.js**: Pre-authenticates and stores session state
- Reusable authentication context across tests
- Stored in `tests/storeLoginContext/storageState.json`

### 6. Custom Reporting
- Groups tests by scenarios (describe blocks)
- Detailed test execution summary
- Attachment links for failures

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. Playwright Installation Issues
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npx playwright install --force
```

#### 2. Environment Variable Issues
- Ensure `.env` files are properly configured
- Check file paths in config.js
- Verify credentials are correct

#### 3. Test Failures
- Check `logging/test_error.log` for detailed error information
- Review screenshots in `test-results/` folder
- Use debug mode: `npx playwright test --debug`

#### 4. Browser Issues
```bash
# Reinstall browsers
npx playwright install --force
```

## 📝 Test Structure

### Test Categories

#### TS001 - Login Functionality
- Login page element validation
- Successful login verification
- Invalid credential handling
- Password recovery functionality

#### TS003 - Cart Functionality
- Add products to cart
- Cart quantity management
- Price calculations
- Guest vs logged-in user behavior

#### Checkout Functionality
- Guest checkout process
- Registered user checkout
- Payment processing simulation

#### Product & Search Functionality
- Product browsing
- Search functionality
- Product filtering
- Category navigation

## 🔐 Security Considerations

- Credentials are stored in environment files (not committed to version control)
- Encryption utilities available via crypto-js
- Session management through Playwright's context storage
- Configurable salt for password hashing

## 🚀 Advanced Usage

### Running Tests in CI/CD
The project is configured for CI/CD with:
- Retry mechanisms for flaky tests
- Parallel execution capabilities
- Headless mode for server environments

### Custom Test Configuration
Modify `playwright.config.js` to:
- Add new browser projects
- Configure different test timeouts
- Setup custom base URLs
- Add additional reporters

## 📞 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review log files in the `logging/` directory
3. Examine test results and screenshots
4. Refer to [Playwright Documentation](https://playwright.dev/)

---

**Happy Testing! 🎭**