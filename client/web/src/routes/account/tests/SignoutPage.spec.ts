import {test, expect} from '@playwright/test';

test('should not signout if NO is clicked', async ({page}) => {
  await page.goto('/');
  await expect(page).toHaveURL('/');

  await page.getByRole('button', {name: /Signout/i}).click();

  await page.getByRole('button', {name: /No/i}).click();
  await expect(page).toHaveURL('/');
});

test('should signout and render signin page', async ({page}) => {
  await page.goto('/');
  await expect(page).toHaveURL('/');

  await page.getByRole('button', {name: /Signout/i}).click();

  await page.getByRole('link', {name: /Yes/i}).click();
  await expect(page).toHaveURL('/signin');
});
