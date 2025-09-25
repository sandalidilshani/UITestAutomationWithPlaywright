# 🎭 UI Test Automation with Playwright

A comprehensive UI test automation framework built with Playwright for testing the Automation Test Store (https://automationteststore.com). This project demonstrates enterprise-level testing practices with advanced architecture, custom fixtures, and robust reporting capabilities.

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running Tests](#-running-tests)
- [Test Structure](#-test-structure)
- [Project Structure](#-project-structure)
- [Reporting](#-reporting)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

## 🎯 Project Overview

This project is a sophisticated UI test automation framework that implements the **Page Object Model (POM)** design pattern with custom fixtures, data-driven testing, and advanced reporting capabilities. It provides comprehensive test coverage for e-commerce functionality including authentication, cart management, checkout processes, and search functionality.

### Key Highlights
- **70+ Test Cases** across multiple test suites
- **Page Object Model** implementation for maintainability
- **Custom Fixtures** for reusable test operations
- **Data-Driven Testing** with centralized test data
- **Multi-Environment Support** (dev, qa, uat, production)
- **Advanced Logging** with Winston
- **Custom HTML Reporting** with detailed analytics
- **Cross-Browser Testing** capabilities

## ✨ Features

### 🧪 Test Coverage
- **Authentication Testing** (12 test cases)
- **Cart Functionality** (20 test cases)
- **Checkout Process** (21 test cases)
- **Search Functionality** (18 test cases)
- **Product Management** (Multiple test cases)

### 🏗️ Architecture Features
- **Page Object Model** for maintainable test code
- **Custom Fixtures** for reusable test setup
- **Data-Driven Testing** with external test data
- **Environment Configuration** management
- **Session State Management** for authentication
- **Parallel Test Execution** support

### 📊 Reporting & Logging
- **Custom HTML Reporter** with scenario grouping
- **Winston-based Logging** with timezone support
- **Screenshot & Video Capture** on failures
- **Detailed Error Reporting** with stack traces
- **Test Execution Analytics**

## 🏛️ Architecture

### Design Patterns Implemented

#### 1. Page Object Model (POM)
```javascript
// BasePage.js - Foundation class
class BasePage {
    constructor(page) {
        this.page = page;
        this.baseUrl = config.app.baseUrl;
    }
    
    async navigateTo(url) {
        await this.page.goto(url);
        await this.page.waitForLoadState('networkidle');
    }
}

// Specific page extends BasePage
class LoginPage extends BasePage {
    constructor(page) {
        super(page);
        this.loginNameInput = page.locator('input[name="loginname"]');
        this.passwordInput = page.locator('input[name="password"]');
    }
}
```

#### 2. Fixture Pattern
- **addProductToCartFixture.js**: Cart-related test operations
- **loginFixture.js**: Authentication management
- **SelectRandomProductFromCategoryFixture.js**: Dynamic product selection

#### 3. Data-Driven Testing
- Centralized test data in `test-data/` directory
- Environment-specific configurations
- Parameterized test execution

## 🔧 Prerequisites

Before setting up this project, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **Git** (for version control)
- **Visual Studio Code** (recommended IDE)

## 🚀 Installation

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd UIAutomation
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

## ⚙️ Configuration

### Environment Configuration

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

### Environment-Specific Configurations

- **Development**: `.env` (default)
- **QA**: `.env.qa`
- **UAT**: `.env.uat`

## 🧪 Running Tests

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

# Run search tests only
npx playwright test search.spec.js
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

## 📁 Test Structure

### Test Categories

#### TS001 - Login Functionality
- Login page element validation
- Successful login verification
- Invalid credential handling
- Password recovery functionality
- Session management
- Multiple failed attempts handling

#### TS003 - Cart Functionality
- Add products to cart (single/multiple)
- Cart quantity management
- Price calculations
- Guest vs logged-in user behavior
- Product options selection
- Cart persistence across sessions

#### TS004 - Checkout Functionality
- Guest checkout process
- Registered user checkout
- Payment processing simulation
- Address validation
- Order summary accuracy
- Coupon code validation

#### Search Functionality
- Product search with various criteria
- Search result validation
- Filtering and sorting
- Autocomplete functionality
- Cross-page search consistency

## 📂 Project Structure

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
├── playwright-report/          # Generated test reports
├── package.json
├── playwright.config.js
└── README.md
```

## 📊 Reporting

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

### Custom HTML Report Features
- **Scenario Grouping**: Tests grouped by describe blocks
- **Execution Summary**: Pass/fail statistics with timing
- **Error Details**: Comprehensive error information
- **Attachment Links**: Direct access to screenshots and videos

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

## 📈 Performance Optimization

### Network and Load Optimization
```javascript
// Wait strategies for better performance
await this.page.waitForLoadState('networkidle');
await this.page.waitForLoadState('domcontentloaded');
```

### Parallel Execution
```javascript
// playwright.config.js
module.exports = defineConfig({
    fullyParallel: true,
    workers: process.env.CI ? config.test.workers : undefined,
    retries: process.env.CI ? config.test.retries : 0,
});
```

## 🎓 Learning Outcomes

### Technical Skills Demonstrated
- **Playwright Framework Mastery**: Advanced test automation
- **JavaScript/Node.js**: Modern JavaScript development
- **Design Patterns**: POM, Fixture, Factory patterns
- **DevOps Integration**: CI/CD pipeline compatibility
- **Logging and Monitoring**: Winston-based logging system

### Testing Expertise
- **Test Strategy Development**: Comprehensive test planning
- **Data-Driven Testing**: Parameterized test execution
- **Cross-Browser Testing**: Multi-environment validation
- **Error Handling**: Robust failure recovery mechanisms
- **Performance Optimization**: Efficient test execution

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review log files in the `logging/` directory
3. Examine test results and screenshots
4. Refer to [Playwright Documentation](https://playwright.dev/)

## 📄 License

This project is licensed under the ISC License - see the [package.json](package.json) file for details.

---

## 🏆 Project Success Metrics

### Quality Metrics
- **Test Coverage**: Comprehensive functionality coverage
- **Execution Reliability**: Consistent test results
- **Maintainability**: Easy to update and extend
- **Performance**: Fast execution times

### Business Value
- **Risk Mitigation**: Early bug detection
- **Cost Reduction**: Automated regression testing
- **Quality Assurance**: Consistent validation processes
- **Team Productivity**: Reliable automated testing

---

**"Quality is never an accident; it is always the result of intelligent effort."** - John Ruskin

**Happy Testing! 🎭**
