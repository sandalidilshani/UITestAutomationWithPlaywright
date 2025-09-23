/**
 * Test data configuration for login test cases
 * Based on CSV test case specifications
 */

const testData = {
    // Valid user credentials from CSV
    validUser: {
        username: 'Sandali99',
        password: 'Sandali@12'
    },

    // Test cases data mapping
    testCases: {
        TS001_TC01: {
            id: 'TS001_TC01',
            description: 'Verify login page elements are displayed correctly',
            preconditions: 'User navigates to login page',
            testSteps: [
                'Navigate to https://automationteststore.com/',
                'Click on "Login or register" link'
            ],
            testData: {},
            expectedResult: [
                '"Account Login" heading is visible',
                '"Returning Customer" section is visible', 
                '"I am a new customer" section is visible',
                'Login name input field is visible',
                'Password input field is visible',
                'Login button is visible',
                '"Forgot your password?" link is visible',
                '"Forgot your login?" link is visible'
            ],
            priority: 'High',
            severity: 'S3',
            status: 'Active'
        },

        TS001_TC02: {
            id: 'TS001_TC02',
            description: 'Verify that registered user can login successfully',
            preconditions: [
                'User account already exists',
                'User has valid login credentials'
            ],
            testSteps: [
                'Click on "Login or register" link',
                'Enter valid login name',
                'Enter valid password',
                'Click "Login" button'
            ],
            testData: {
                loginName: 'Sandali99',
                password: 'Sandali@12'
            },
            expectedResult: [
                'Login form accepts credentials',
                'User is redirected to account dashboard',
                'URL contains "account/account"',
                'User menu shows "Welcome back {username}"'
            ],
            priority: 'High',
            severity: 'S1',
            status: 'Active'
        },

        TS001_TC03: {
            id: 'TS001_TC03',
            description: 'Verify that login fails when user enters invalid username with valid password',
            preconditions: [
                'Application is accessible',
                'User is on login page'
            ],
            testSteps: [
                'Navigate to login page',
                'Enter invalid username',
                'Enter valid password format',
                'Click Login button',
                'Verify error message'
            ],
            testData: {
                loginName: 'Sandalsdhjshdj',
                password: 'Sandali@12'
            },
            expectedResult: "Error message 'No match for Username and/or Password' displayed",
            priority: 'High',
            severity: 'S1',
            status: 'Active'
        },

        TS001_TC04: {
            id: 'TS001_TC04',
            description: 'Verify login with invalid password',
            preconditions: [
                'User account exists in system',
                'Application is accessible',
                'User is on login page'
            ],
            testSteps: [
                'Navigate to login page',
                'Enter valid login name',
                'Enter invalid password',
                'Click "Login" button',
                'Verify error message is displayed'
            ],
            testData: {
                loginName: 'Sandali99',
                password: 'wrongPassword'
            },
            expectedResult: "Error message 'No match for Username and/or Password' displayed",
            priority: 'High',
            severity: 'S1',
            status: 'Active'
        },

        TS001_TC05: {
            id: 'TS001_TC05',
            description: 'Verify validation when username is empty but password is provided',
            preconditions: [
                'Application is accessible',
                'User is on login page'
            ],
            testSteps: [
                'Navigate to login page',
                'Leave login name field empty',
                'Enter valid password: "TestPassword123!"',
                'Click "Login" button',
                'Verify validation message for username field'
            ],
            testData: {
                loginName: '',
                password: 'TestPassword123!'
            },
            expectedResult: "Error message 'No match for Username and/or Password' displayed",
            priority: 'Critical',
            severity: 'S1',
            status: 'Active'
        },

        TS001_TC06: {
            id: 'TS001_TC06',
            description: 'Verify login with empty fields',
            preconditions: [
                'Application is accessible',
                'User is on login page'
            ],
            testSteps: [
                'Navigate to login page',
                'Leave username field empty',
                'Leave password field empty',
                'Click "Login" button',
                'Verify validation message for password field'
            ],
            testData: {
                loginName: '',
                password: ''
            },
            expectedResult: "Error message 'No match for Username and/or Password' displayed",
            priority: 'High',
            severity: 'S3',
            status: 'Active'
        },

        TS001_TC07: {
            id: 'TS001_TC07',
            description: 'Verify login with special characters in username and password',
            preconditions: [
                'Application is accessible',
                'User account with special characters exists (if supported)'
            ],
            testSteps: [
                'Navigate to login page',
                'Enter username with special characters: "test.user@domain"',
                'Enter password with special characters: "Pass@Word#123!"',
                'Click "Login" button',
                'Verify appropriate handling'
            ],
            testData: {
                loginName: 'test.user@domain',
                password: 'Pass@Word#123!'
            },
            expectedResult: [
                'If special characters are allowed: Login processes normally',
                'If not allowed: Appropriate validation message'
            ],
            priority: 'Medium',
            severity: 'S3',
            status: 'Active'
        },

        TS001_TC08: {
            id: 'TS001_TC08',
            description: 'Verify login behavior with different case combinations for username',
            preconditions: [],
            testSteps: [
                'Navigate to login page',
                'Enter username in uppercase',
                'Enter correct password',
                'Click "Login" button',
                'Repeat with mixed case: "TestUser_20241201"'
            ],
            testData: [
                {
                    loginName: 'SANDALI99',
                    password: 'Sandali@12'
                },
                {
                    loginName: 'SANdali99', 
                    password: 'Sandali@12'
                }
            ],
            expectedResult: [
                'Behavior depends on system design:',
                '- Case-insensitive: Both should succeed',
                '- Case-sensitive: Both should fail'
            ],
            priority: 'Medium',
            severity: 'S1',
            status: 'Active'
        },

        TS001_TC09: {
            id: 'TS001_TC09',
            description: 'Verify that user session is properly managed after successful login',
            preconditions: [
                'User account exists',
                'User is not logged in'
            ],
            testSteps: [
                'Login successfully with valid credentials',
                'Navigate to different pages within application',
                'Verify user remains logged in',
                'Close browser and reopen',
                'Navigate to application',
                'Verify session state'
            ],
            testData: {
                loginName: 'Sandali99',
                password: 'Sandali@12'
            },
            expectedResult: [
                'After login, user session is established',
                'User can navigate all pages without re-login',
                'User menu shows logged-in state',
                'After browser restart: Session behavior depends on "Remember Me" option',
                'Session timeout works as configured',
                'Logout properly terminates session'
            ],
            priority: 'High',
            severity: 'S1',
            status: 'Active'
        },

        TS001_TC10: {
            id: 'TS001_TC10',
            description: 'Verify application behavior after multiple consecutive failed login attempts',
            preconditions: [
                'User account exists',
                'Account is not currently locked'
            ],
            testSteps: [
                'Navigate to login page',
                'Enter valid username: "testuser_20241201"',
                'Enter invalid password: "wrongpass1"',
                'Click "Login" button',
                'Repeat steps 2-4 with different wrong passwords 4 more times',
                'Attempt login with correct credentials',
                'Verify account lockout behavior'
            ],
            testData: {
                loginName: 'Sandali99',
                wrongPasswords: ['wrongpass1', 'wrongpass2', 'wrongpass3', 'wrongpass4', 'wrongpass5'],
                correctPassword: 'Sandali@12'
            },
            expectedResult: [
                'Each failed attempt shows error message',
                'After defined number of attempts, account may be locked',
                'If lockout implemented: Clear message about temporary lockout',
                'Lockout duration is enforced',
                'After lockout period, normal login resumes',
                'Security logging of failed attempts (if implemented)'
            ],
            priority: 'High',
            severity: 'S1',
            status: 'Active'
        },

        TS001_TC11: {
            id: 'TS001_TC11',
            description: 'Verify login session timeout',
            preconditions: ['User is logged in'],
            testSteps: [
                'Login successfully',
                'Stay idle until session times out', 
                'Perform an action'
            ],
            testData: {
                loginName: 'Sandali99',
                password: 'Sandali@12'
            },
            expectedResult: 'User should be logged out automatically after session timeout',
            priority: 'High',
            severity: 'S2',
            status: 'Active'
        },

        TS001_TC12: {
            id: 'TS001_TC12',
            description: 'Verify login redirection from checkout/cart page',
            preconditions: ['User has items in cart but not logged in'],
            testSteps: [
                'Add items to cart',
                'Click "Checkout"',
                'Enter valid credentials'
            ],
            testData: {
                loginName: 'Sandali99',
                password: 'Sandali@12'
            },
            expectedResult: 'After login, user is redirected back to checkout page',
            priority: 'High',
            severity: 'S1',
            status: 'Active'
        }
    },

    // Error messages to expect
    errorMessages: {
        invalidCredentials: 'Error: Incorrect login or password provided',
        emptyFields: 'Error: Incorrect login or password provided',
        accountLocked: 'Warning: Your account has exceeded allowed number of login attempts',
        sessionTimeout: 'Session expired'
    },

    // URLs for validation
    urls: {
        base: 'https://automationteststore.com',
        login: 'https://automationteststore.com/index.php?rt=account/login',
        account: 'https://automationteststore.com/index.php?rt=account/account',
        logout: 'https://automationteststore.com/index.php?rt=account/logout',
        checkout: 'https://automationteststore.com/index.php?rt=checkout/cart'
    },

    // Priority and severity mappings
    priority: {
        HIGH: 'High',
        MEDIUM: 'Medium', 
        LOW: 'Low',
        CRITICAL: 'Critical'
    },

    severity: {
        S1: 'Critical - System crash/data loss',
        S2: 'High - Major feature not working',
        S3: 'Medium - Minor feature issue',
        S4: 'Low - Cosmetic issue'
    }
};

module.exports = testData;