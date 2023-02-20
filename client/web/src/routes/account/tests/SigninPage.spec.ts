import {test, expect, Locator} from '@playwright/test';

// Mock user account
const mockEmail = 'user@test.com';
const mockPassword = 'test@123';

// Integration test suite for signin page
test.describe('Signin Page', () => {
  let email: Locator, password: Locator, signinBtn: Locator, createBtn: Locator;

  test.use({storageState: {cookies: [], origins: []}});

  // Goto signin route before each test case
  test.beforeEach(async ({page}) => {
    await page.goto('/');

    email = page.getByRole('textbox', {name: /Email ID/i});
    password = page.getByLabel(/Password/i);
    signinBtn = page.getByRole('button', {name: /Sign In/i});
    createBtn = page.getByRole('link', {name: /Create Account/i});
  });

  // Expect all elements to be rendered in the page
  test('should render all elements', async () => {
    // Input elements should be visible
    await expect(email).toBeVisible();
    await expect(password).toBeVisible();

    // Input elements should be empty
    await expect(email).toBeEmpty();
    await expect(password).toBeEmpty();

    // Email field should be focused on render
    await expect(email).toBeFocused();

    // Sign in button should be visible and disabled
    await expect(signinBtn).toBeVisible();
    await expect(signinBtn).toBeDisabled();

    // Create Account link should be visible and enabled
    await expect(createBtn).toBeVisible();
    await expect(createBtn).toBeEnabled();
  });

  // Expect sign in button to be disabled for invalid and empty inputs (validated by form validation hook).
  test('should not enable signin button for invalid / empty inputs', async ({
    page,
  }) => {
    // Leave some field empty
    await email.fill(mockEmail);

    await expect(signinBtn).toBeDisabled();

    // Fill with invalid input
    await email.fill('user@test'); // .com missing
    await password.fill(mockPassword);

    await expect(signinBtn).toBeDisabled();

    // Error message is displayed for invalid input
    const errorMsg = page.getByText('Enter a valid mail address');
    await expect(errorMsg).toBeVisible();
  });

  // Expect sign in button to be enabled for valid inputs (validated by form validation hook).
  test('should enable signin button for valid inputs', async () => {
    // Fill with valid inputs
    await email.fill('user@test.com');
    await password.fill('password');

    await expect(signinBtn).toBeEnabled();
  });

  // Expect account not found for unregistered user
  test('should render alert for account not found', async ({page}) => {
    // Fill with unregistered user details
    await email.fill('noone@test.com');
    await password.fill('password');

    await signinBtn.click();

    // Expect alert to be rendered for account not found server response
    const alert = page.getByRole('alert');

    await expect(alert).toBeVisible();
    await expect(alert.locator('[aria-label="alert message"]')).toContainText(
      "User account doesn't exist"
    );
  });

  // Expect signup route if user intends to create account
  test('should navigate to /signup route', async ({page}) => {
    await createBtn.click();
    await expect(page).toHaveURL('/signup');
  });

  // Expect account not found for unregistered user
  test('should render alert for incorrect password', async ({page}) => {
    // Fill with incorrect password
    await email.fill(mockEmail);
    await password.fill('password');

    await signinBtn.click();

    // Expect alert to be rendered for incorrect password server response
    const alert = page.getByRole('alert');

    await expect(alert).toBeVisible();
    await expect(alert.locator('[aria-label="alert message"]')).toContainText(
      'Incorrect password'
    );
  });

  // Expect index page on successful authentication
  test('should navigate to index ("/") route on successful signin', async ({
    page,
  }) => {
    // Fill with registered mock user account
    await email.fill(mockEmail);
    await password.fill(mockPassword);

    await signinBtn.click();

    // Expect index route
    await expect(page).toHaveURL('/');
  });
});
