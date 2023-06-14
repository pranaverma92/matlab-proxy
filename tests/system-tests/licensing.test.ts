import {Page, test, expect, Locator} from '@playwright/test';

// Tests to check the licensing workflow in the MATLAB Proxy UI
test.describe('Licensing MATLAB Proxy tests', () => {

    // after each test case, try to check if the status of MATLAB is running
    test.afterEach(async ({ page }) => {
        await page.goto('./index.html');

        await waitForPageLoad(page);
        const toolIcon = page.getByRole('button', { name: 'Menu' });
        await toolIcon.click();

        await waitForPageLoad(page);

        const MATLABRunningStatus = page.getByRole('dialog', { name: 'Status Information' });
        await expect(MATLABRunningStatus.getByText('Running'), 'Wait for MATLAB status to be stopped').toHaveText('Running', { timeout: 120000 });
    });

    // Test to check the "STOP MATLAB Button" in the tools icon
    test('Stop MATLAB Proxy', async({ page }) => {
        await page.goto('/index.html');
        await stopMatlabSession(page);
        await startMatlabSession(page);
    });

    // Test to check if the user is able to Sign Out and Sign In back again using the user credentials in the tools icon
    test('Test Online licensing is working', async ( {page} ) => {
        await page.goto("/index.html");
        await unsetMatlabLicensing(page);
        await setMatlabLicensingInJsdUsingOnlineLicensing(page);
    });

    // Test to check if the user is able to Sign Out and Sign In back again using the license manager in the tools icon
    test('Test Network License Manager licensing is working', async ({page}) => {
        await page.goto("/index.html");
        await unsetMatlabLicensing(page);
        await setMatlabLicensingInJsdUsingLicenseManager(page);
    });
});

// HELPER FUNCTIONS FOR THE TESTS
// Waits for the page to finish loading
async function waitForPageLoad(matlabJsdPage: Page) {
    await matlabJsdPage.waitForLoadState();
}

// Clicks an element and waits for the page to finish loading
async function clickAndWaitForLoadState(element: Locator, matlabJsdPage: Page) {
    await element.click();
    await waitForPageLoad(matlabJsdPage);
}

// Sets MATLAB licensing in JSD using the License Manager option
async function setMatlabLicensingInJsdUsingLicenseManager(matlabJsdPage: Page) {
    await waitForPageLoad(matlabJsdPage);

    // Clicks on the Network License Manager tab
    const signInDialog = matlabJsdPage.locator('#setup-dialog');
    await clickAndWaitForLoadState(signInDialog.getByRole('tab', { name: 'Network License Manager' }), matlabJsdPage);

    // Fills in the License Manager dialog with the desired information
    const LMDialog = signInDialog.getByPlaceholder('port@hostname');
    await LMDialog.fill("1@license");
    await waitForPageLoad(matlabJsdPage);

    // Submits the form and waits for the page to finish loading
    await clickAndWaitForLoadState(signInDialog.getByRole('button', { name: 'Submit' }), matlabJsdPage);
}

// Sets MATLAB licensing in JSD using the Online Licensing option
async function setMatlabLicensingInJsdUsingOnlineLicensing(matlabJsdPage: Page) {
    await waitForPageLoad(matlabJsdPage);

    // Fills in the email textbox and presses Enter
    const emailTextbox = matlabJsdPage.frameLocator('#loginframe').locator('#userId');
    await expect(emailTextbox, 'Wait for email ID textbox to appear').toBeVisible({ timeout: 60000 });
    await emailTextbox.fill('dockeruser@mwcloudtest.com');
    await emailTextbox.press('Enter');
    await waitForPageLoad(matlabJsdPage);

    // Fills in the password textbox and presses Enter multiple times
    const passwordTextbox = matlabJsdPage.frameLocator('#loginframe').locator('#password');
    await expect(passwordTextbox, 'Wait for password textbox to appear').toBeVisible();
    await passwordTextbox.fill('CPIPassw0rd!');
    await waitForPageLoad(matlabJsdPage);

    await passwordTextbox.press('Enter');
    await waitForPageLoad(matlabJsdPage);

    await passwordTextbox.press('Enter');
    await waitForPageLoad(matlabJsdPage);

    // Verifies if licensing is successful by checking the status information
    const statusInfo = matlabJsdPage.getByText('Status Information');
    await expect(statusInfo, 'Verify if Licensing is successful').toBeVisible({ timeout: 60000 });
}

// Unsets MATLAB licensing in JSD
async function unsetMatlabLicensing(matlabJsdPage: Page) {
    await waitForPageLoad(matlabJsdPage);

    // Clicks on the Tool Icon button in MATLAB Web Desktop
    const toolIcon = matlabJsdPage.getByRole('button', { name: 'Menu' });
    await expect(toolIcon, 'Wait for Tool Icon button in MATLAB Web Desktop').toBeVisible();
    await toolIcon.click();
    await waitForPageLoad(matlabJsdPage);

    // Clicks on the Unset MATLAB Licensing button
    const statusInfo = matlabJsdPage.getByRole('dialog', { name: 'Status Information' });
    const unsetlicensingBtn = statusInfo.getByTestId('unsetLicensingBtn');
    await expect(unsetlicensingBtn, 'Wait for Unset MATLAB Licensing button').toBeVisible();
    await unsetlicensingBtn.click();
    await waitForPageLoad(matlabJsdPage);

    // Confirms the action by clicking the Confirm button
    const confirmButton = matlabJsdPage.getByTestId('confirmButton');
    await expect(confirmButton, 'Wait for Confirm button').toBeVisible();
    await confirmButton.click();
    await waitForPageLoad(matlabJsdPage);
}

// Starts a MATLAB session in JSD
async function startMatlabSession(matlabJsdPage: Page) {
    await waitForPageLoad(matlabJsdPage);

    // Waits for the Status Information dialog to be loaded
    const statusInfo = matlabJsdPage.getByRole('dialog', { name: 'Status Information' });
    await expect(statusInfo, 'Wait for Staus Information DOM to be loaded').toBeVisible();

    // Clicks on the Start MATLAB Session button
    const startButton = statusInfo.getByTestId('startMatlabBtn');
    await expect(startButton, 'Wait for Stop MATLAB Session button').toBeVisible();
    await startButton.click();
    await waitForPageLoad(matlabJsdPage);

    // Confirms the action by clicking the Confirm button with a longer timeout
    const confirmButton = matlabJsdPage.getByTestId('confirmButton');
    await expect(confirmButton, 'Wait for Confirm button').toBeVisible();
    await confirmButton.click({ timeout: 120000 });
    await waitForPageLoad(matlabJsdPage);
}

// Stops the current MATLAB session in JSD
async function stopMatlabSession(matlabJsdPage: Page) {
    await waitForPageLoad(matlabJsdPage);

    // Clicks on the Tool Icon button in MATLAB Web Desktop
    const toolIcon = matlabJsdPage.getByRole('button', { name: 'Menu' });
    await expect(toolIcon, 'Wait for Tool Icon button in MATLAB Web Desktop').toBeVisible();
    await toolIcon.click();
    await waitForPageLoad(matlabJsdPage);

    // Waits for the Status Information dialog to be loaded
    const statusInfo = matlabJsdPage.getByRole('dialog', { name: 'Status Information' });
    await expect(statusInfo, 'Wait for Staus Information DOM to be loaded').toBeVisible();

    // Clicks on the Stop MATLAB Session button
    const stopButton = statusInfo.getByTestId('stopMatlabBtn');
    await expect(stopButton, 'Wait for Stop MATLAB Session button').toBeVisible();
    await stopButton.click();
    await waitForPageLoad(matlabJsdPage);

    // Confirms the action by clicking the Confirm button
    const confirmButton = matlabJsdPage.getByTestId('confirmButton');
    await expect(confirmButton, 'Wait for Confirm button').toBeVisible();
    await confirmButton.click();
    await waitForPageLoad(matlabJsdPage);

    // Verifies if MATLAB status is stopped by checking the dialog text
    const MATLABRunningStatus = matlabJsdPage.getByRole('dialog', { name: 'Status Information' });
    await expect(MATLABRunningStatus.getByText('Not running'), 'Wait for MATLAB status to be stopped').toHaveText('Not running', { timeout: 120000 });
}
