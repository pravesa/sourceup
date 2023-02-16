import {test, expect} from '@playwright/test';

test('should render home page for existing session cookie', async ({page}) => {
  await page.goto('/');
  await expect(page).toHaveURL('/');
});
