import {test, expect} from '@playwright/test';

test.describe('Signout page', async () => {
  test.use({storageState: {cookies: [], origins: []}});

  test('should signout when yes is clicked and render signin page', async ({
    page,
  }) => {
    await page.goto('/signup');

    await page
      .getByRole('textbox', {name: /Email ID/i})
      .fill('testsignout@test.com');
    await page.getByRole('textbox', {name: /GST No/i}).fill('33ABCDE1234F1GK');
    await page.getByLabel(/^Password/i).fill('password');
    await page.getByLabel(/Confirm Password/i).fill('password');
    await page.getByRole('button', {name: /Sign Up/i}).click();

    await page.goto('/');

    await page
      .getByRole('textbox', {name: /Email ID/i})
      .fill('testsignout@test.com');
    await page.getByLabel(/Password/i).fill('password');
    await page.getByRole('button', {name: /Sign In/i}).click();

    await expect(page).toHaveURL('/');

    await page.getByRole('button', {name: /Signout/i}).click();
    await page.getByRole('button', {name: /No/i}).click();

    await page.getByRole('button', {name: /Signout/i}).click();
    await page.getByRole('link', {name: /Yes/i}).click();

    await expect(page).toHaveURL('/signin');
  });
});
