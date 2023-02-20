import {test, expect, Locator, selectors} from '@playwright/test';

// Integration test suite for settings page -> profile tab
test.describe('Settings - Profile Tab', () => {
  let profile: Locator,
    companyName: Locator,
    secMail: Locator,
    checkbox: Locator,
    saveProfile: Locator,
    regdAddress: Locator,
    headOffice: Locator,
    factoryAddress: Locator,
    warehouseAddress: Locator;

  // Goto settings route before each test case
  test.beforeEach(async ({page}) => {
    await page.goto('/settings');

    profile = page.getByRole('tab', {name: 'profile'});
    companyName = page.getByRole('textbox', {name: 'Company Name'});
    secMail = page.getByRole('textbox', {name: 'Secondary Mail'});
    checkbox = page.getByRole('checkbox', {name: 'Same as Registered address'});
    saveProfile = page.getByRole('button', {name: 'Save profile'});
    regdAddress = page.getByRole('grid', {name: 'Registered address'});
    headOffice = page.getByRole('grid', {name: 'Head office address'});
    factoryAddress = page.getByRole('grid', {name: 'Factory address'});
    warehouseAddress = page.getByRole('grid', {name: 'Warehouse address'});
  });

  // Expect all elements to be rendered in the page
  test('should render all elements', async () => {
    await expect(profile).toBeVisible();
    await expect(companyName).toBeVisible();
    await expect(secMail).toBeVisible();
    await expect(regdAddress).toBeVisible();
    await expect(checkbox).toBeVisible();
    await expect(headOffice).toBeVisible();
    await expect(factoryAddress).toBeVisible();
    await expect(warehouseAddress).toBeVisible();

    // Input elements should be empty
    await expect(companyName).toBeEmpty();
    await expect(secMail).toBeEmpty();

    await expect(companyName).toBeFocused();

    // Save profile button should be visible and disabled
    await expect(saveProfile).toBeVisible();
    await expect(saveProfile).toBeDisabled();
  });

  // Expect save profile button to be enabled and update the profile successfully.
  test('should update profile', async ({page}) => {
    await profile.click();
    await expect(saveProfile).toBeDisabled();

    await companyName.fill('test');
    await expect(saveProfile).toBeDisabled();

    // Add Registered address
    const addRegd = page.getByRole('button', {name: 'add registered address'});

    await expect(addRegd).toBeVisible();
    await addRegd.click();

    const save = page.getByRole('button', {name: 'Save'});

    await expect(save).toBeDisabled();

    const bno = page.getByRole('textbox', {name: 'Building No'});
    const street = page.getByRole('textbox', {name: 'Street'});
    const city = page.getByRole('textbox', {name: 'City'});
    const state = page.getByRole('textbox', {name: 'State'});
    const country = page.getByRole('textbox', {name: 'Country'});
    const pincode = page.getByRole('textbox', {name: 'Pincode'});

    await bno.fill('101/2');
    await street.fill('west street');
    await city.fill('Chennai');
    await state.fill('Tamil Nadu');
    await country.fill('India');
    await pincode.fill('603202');

    await expect(save).toBeEnabled();
    await save.click();

    await expect(addRegd).not.toBeVisible();

    await expect(
      page.getByRole('button', {name: 'edit registered address'})
    ).toBeVisible();

    await expect(saveProfile).toBeDisabled();

    // Add Head office address
    const addHeadOffice = page.getByRole('button', {
      name: 'add head office address',
    });
    await expect(addHeadOffice).toBeVisible();

    await checkbox.click();

    await expect(addHeadOffice).not.toBeVisible();

    const editHeadOffice = page.getByRole('button', {
      name: 'edit head office address',
    });

    await expect(editHeadOffice).toBeVisible();
    await expect(editHeadOffice).toBeDisabled();

    await expect(saveProfile).toBeDisabled();

    // Add factory address
    const addPlant = page.getByRole('button', {name: 'add plant address'});
    await expect(addPlant).toBeVisible();

    await addPlant.click();

    const nextBtn = page.getByRole('button', {name: 'Next'});

    await expect(nextBtn).toBeVisible();
    await expect(nextBtn).toBeDisabled();

    await page.getByRole('textbox', {name: 'Factory ID'}).fill('plant1');

    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();

    await expect(save).toBeDisabled();

    await bno.fill('101/2');
    await street.fill('west street');
    await city.fill('Chennai');
    await state.fill('Tamil Nadu');
    await country.fill('India');
    await pincode.fill('603202');

    await expect(save).toBeEnabled();
    await save.click();

    await expect(saveProfile).toBeEnabled();

    await expect(addPlant).toBeVisible();

    selectors.setTestIdAttribute('data-id');

    // Remove factory address
    const plant1 = factoryAddress.getByTestId('plant1');

    await plant1.click();

    await expect(addPlant).not.toBeVisible();

    const removeFactory = page.getByRole('button', {
      name: 'delete plant address',
    });

    await expect(removeFactory).toBeVisible();
    await expect(removeFactory).toBeEnabled();

    await removeFactory.click();
    await expect(plant1).not.toBeVisible();

    await expect(saveProfile).toBeDisabled();

    // Add factory address
    await page.getByRole('button', {name: 'add plant address'}).click();

    await page.getByRole('textbox', {name: 'Factory ID'}).fill('plant1');

    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();

    await expect(save).toBeDisabled();

    await bno.fill('101/2');
    await street.fill('west street');
    await city.fill('Chennai');
    await state.fill('Tamil Nadu');
    await country.fill('India');
    await pincode.fill('603202');

    await expect(save).toBeEnabled();
    await save.click();

    await expect(saveProfile).toBeEnabled();
    await saveProfile.click();

    // Expect profile to be updated successfully
    await expect(
      page.getByRole('alert').locator('[aria-label="alert message"]')
    ).toContainText('Profile updated successfully');

    await page.reload();

    await profile.click();
    await expect(companyName).not.toBeEmpty();
    await expect(saveProfile).toBeEnabled();
  });
});
