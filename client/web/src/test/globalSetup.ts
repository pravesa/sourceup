// global-setup.ts
import {chromium, FullConfig} from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const {baseURL, storageState} = config.projects[0].use;

  const browser = await chromium.launch();
  const page = await browser.newPage();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await page.goto(baseURL!);

  await page.getByRole('textbox', {name: /Email ID/i}).fill('user@test.com');
  await page.getByLabel(/Password/i).fill('test@123');
  await page.getByRole('button', {name: /Sign In/i}).click();

  await page.waitForTimeout(500);

  // Save signed-in state to 'storageState.json'.
  await page.context().storageState({path: storageState as string});
  await browser.close();
}

export default globalSetup;
