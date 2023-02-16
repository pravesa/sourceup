import {test, expect, Locator} from '@playwright/test';

// Mock organisation details
const mockEmail = 'user@test.com';
const mockGSTN = '33ABCDE1234F1GH';
const mockPassword = 'testuser';

// Integration test suite for signup page
test.describe('Signup Page', () => {
  let email: Locator,
    gstn: Locator,
    password: Locator,
    cnfPassword: Locator,
    signupBtn: Locator;

  // Goto signup route before each test case
  test.beforeEach(async ({page}) => {
    await page.goto('/signup');

    email = page.getByRole('textbox', {name: /Email ID/i});
    gstn = page.getByRole('textbox', {name: /GST No/i});
    password = page.getByLabel(/^Password/i);
    cnfPassword = page.getByLabel(/Confirm Password/i);
    signupBtn = page.getByRole('button', {name: /Sign Up/i});
  });

  // Expect all elements to be rendered in the page
  test('should render all elements', async () => {
    // Input elements should be visible
    await expect(email).toBeVisible();
    await expect(gstn).toBeVisible();
    await expect(password).toBeVisible();
    await expect(cnfPassword).toBeVisible();

    // Input elements should be empty
    await expect(email).toBeEmpty();
    await expect(gstn).toBeEmpty();
    await expect(password).toBeEmpty();
    await expect(cnfPassword).toBeEmpty();

    // Email field should be focused on render
    await expect(gstn).toBeFocused();

    // Sign up button should be visible and disabled
    await expect(signupBtn).toBeVisible();
    await expect(signupBtn).toBeDisabled();
  });

  // Expect sign up button to be disabled for invalid and empty inputs (validated by form validation hook).
  test('should not enable signup button for invalid / empty inputs', async ({
    page,
  }) => {
    // Leave some fields empty
    await email.fill(mockEmail);

    await expect(signupBtn).toBeDisabled();

    // Fill with invalid input
    await gstn.fill('33ASDG2345D1DH');
    await email.fill(mockEmail);
    await password.fill(mockPassword);

    await expect(signupBtn).toBeDisabled();

    // Error message is displayed for invalid input
    const errorMsg = page.getByText('Enter a valid GST No.');
    await expect(errorMsg).toBeVisible();
  });

  // Expect sign up button to be enabled for valid inputs (validated by form validation hook).
  test('should enable signup button for valid inputs', async () => {
    // Fill with valid inputs
    await gstn.fill(mockGSTN);
    await email.fill(mockEmail);
    await password.fill(mockPassword);
    await cnfPassword.fill(mockPassword);

    await expect(signupBtn).toBeEnabled();
  });

  // Expect ID (email) already exist for duplicate user id
  test('should render alert for ID (email) already exist', async ({page}) => {
    // Fill with existing mock organisation id (gstn & email is unique for organisations in database)
    await gstn.fill('33ACDBE4321F1GH');
    await email.fill(mockEmail);
    await password.fill('password');
    await cnfPassword.fill('password');

    await expect(signupBtn).toBeEnabled();

    await signupBtn.click();

    // Expect alert to be rendered for duplicate id server response
    const alert = page.getByRole('alert');

    await expect(alert).toBeVisible();
    await expect(alert.locator('[aria-label="alert message"]')).toContainText(
      'ID (email) already exist'
    );
  });

  // Expect ID (gstn) already exist for duplicate user id
  test('should render alert for ID (gstn) already exist', async ({page}) => {
    // Fill with existing mock organisation id (gstn & email is unique for organisations in database)
    await gstn.fill(mockGSTN);
    await email.fill('user2@test.com');
    await password.fill('password');
    await cnfPassword.fill('password');

    await expect(signupBtn).toBeEnabled();

    await signupBtn.click();

    // Expect alert to be rendered for duplicate id server response
    const alert = page.getByRole('alert');

    await expect(alert).toBeVisible();
    await expect(alert.locator('[aria-label="alert message"]')).toContainText(
      'ID (gstn) already exist'
    );
  });

  // Expect delayed signin page on successful registration
  test('should navigate to /signin route on successful signup', async ({
    page,
  }) => {
    // Fill with unregistered mock organisation details
    await email.fill('user2@test.com');
    await gstn.fill('33BCDEF1234G1HI');
    await password.fill(mockPassword);
    await cnfPassword.fill(mockPassword);

    await expect(signupBtn).toBeEnabled();

    await signupBtn.click();

    // Expect alert to be rendered for successful registration server response
    const alert = page.getByRole('alert');

    await expect(alert).toBeVisible();
    await expect(alert.locator('[aria-label="alert message"]')).toContainText(
      'registered successfully'
    );

    // expect delayed redirect to signin route
    await expect(page).toHaveURL('/signin');
  });
});
