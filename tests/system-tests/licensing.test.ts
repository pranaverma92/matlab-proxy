import {Page, test, expect, Locator} from '@playwright/test';

// Tests to check the licensing workflow in the MATLAB Proxy UI
test.describe('MATLAB Proxy tests to check the licensing and start stop workflow', () => {

    // Before each test case, checks if the MATLAB Proxy page is loaded
    test.beforeEach(async ({page}) => {
        // Checks if the MATLAB Proxy page is available
        await waitForPageLoad(page);
    });

    // After each test case, try to check if the status of MATLAB is running
    test.afterEach(async ({ page }) => {
        // Goes to the MATLAB Proxy page
        await page.goto('/index.html');

        // Clicks the tools icon button and checks the status of MATLAB is Running
        await clickTheToolsIconButton(page);
        const MATLABRunningStatus = await getTheStatusOFMATLAB(page);
        await expect(MATLABRunningStatus.getByText('Running'), 'The Status of MATLAB should be Running').toHaveText('Running', { timeout: 120000 });
    });

    // Test to check the "Stop MATLAB" Button in the tools icon
    test('Stop MATLAB Proxy', async({ page }) => {
        await page.goto('/index.html');

        // Stops the MATLAB Session and checks that the status is turned to Not Running
        await stopMatlabSession(page);
        const MATLABRunningStatusDialog = await getTheStatusOFMATLAB(page);
        await expect(MATLABRunningStatusDialog.getByText('Not running'), 'Wait for MATLAB status to be stopped').toHaveText('Not running', { timeout: 120000 });

        // Start the MATLAB Session back again
        await startMatlabSession(page);
    });

    // Test to check if the user is able to Sign Out and Sign In back again using the user credentials in the tools icon
    test('Test Online licensing is working', async ( {page} ) => {
        await page.goto("/index.html");

        // Sign out of MATLAB
        await unsetMatlabLicensing(page);

        // License MATLAB back using Online licensing
        await setMatlabLicensingInJsdUsingOnlineLicensing(page, 'dockeruser@mwcloudtest.com', 'CPIPassw0rd!');
        await verifyLicensingSuccessful(page);
    });

    // Test to check the "Restart MATLAB" button in the tools icon is abel to restart MATLAB
    test('Test Restart MATLAB is working', async ({page}) => {
        await page.goto("/index.html");

        // Clicks the Restart button
        await clickTheToolsIconButton(page);

        await waitForButtonAndClick(page, 'startMatlabBtn', 'Restart MATLAB button should be visible');

        // Presses the confirm button while restarting MATLAB
        await waitForButtonAndClick(page, 'confirmButton', 'Wait for Confirm button');

        // Cliks the Tool Icon button
        await clickTheToolsIconButton(page);

        // Checks the status of MATLAB to be running
        const MATLABRunningStatus = await getTheStatusOFMATLAB(page);
        await expect(MATLABRunningStatus.getByText('Running'), 'Wait for MATLAB status to be stopped').toHaveText('Running', { timeout: 120000 });
    });

    test('Test to check if prompt appears for invalid usr credentials', async({page}) => {
        await page.goto("/index.html");
        await unsetMatlabLicensing(page);
        await setMatlabLicensingInJsdUsingOnlineLicensing(page, 'mckeruser@mwcloudtest.com', 'CPIPassw0rd!');
        const invalidText = page.frameLocator('#loginframe').locator('#errorMessage');
        await expect(invalidText).toHaveText('Invalid Email or Password');
        const invalidEmail = page.frameLocator('#loginframe').locator('#emailUpdate');
        await invalidEmail.click();
        await setMatlabLicensingInJsdUsingOnlineLicensing(page, 'dockeruser@mwcloudtest.com', 'CPIPassw0rd!');
        await verifyLicensingSuccessful(page);
    });

    // Test to check MATLAB Proxy is able to license using the local licensing
    test('Test to check the local licensing', async ({page}) => {
        await page.goto("/index.html");

        await unsetMatlabLicensing(page);

        // Clicks on the Network License Manager tab
        const signInDialog = page.locator('#setup-dialog');
        await clickAndWaitForLoadState(signInDialog.getByRole('tab', { name: 'Existing License' }), page);

        const startMATLABButton = signInDialog.getByRole('button', { name: 'Start MATLAB' });
        await startMATLABButton.click();
    });



    // Test to check if the user is able to Sign Out and Sign In back again using the license manager in the tools icon
    // This test's workflow would need to change since the old workflow of 1@license will no longer work
    // Commenting this out for the time being

    // test('Test Network License Manager licensing is working', async ({page}) => {
    //     await page.goto("/index.html");
    //     await unsetMatlabLicensing(page);
    //     await setMatlabLicensingInJsdUsingLicenseManager(page);
    // });
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

async function getTheStatusOFMATLAB(matlabJsdPage: Page) : Promise<Locator>{
    // This gets the dialog having all the buttons
    const MATLABRunningStatus = matlabJsdPage.getByRole('dialog', { name: 'Status Information' });
    await expect(MATLABRunningStatus, 'Wait for the running status dialog box').toBeVisible({timeout: 120000});
    return MATLABRunningStatus;
}

async function clickTheToolsIconButton(matlabJsdPage: Page){
    const toolIcon = matlabJsdPage.getByRole('button', { name: 'Menu' });
    await expect(toolIcon, 'Wait for Tool Icon button in MATLAB Web Desktop').toBeVisible();
    await toolIcon.click();
}

async function waitForButtonAndClick(pageElement, buttonTestId, buttonLabel) {
    const button = pageElement.getByTestId(buttonTestId);
    await expect(button, buttonLabel).toBeVisible();
    await button.click();
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

    // Submits the form and waits for the page to finish loading
    await clickAndWaitForLoadState(signInDialog.getByRole('button', { name: 'Submit' }), matlabJsdPage);
}

// Sets MATLAB licensing in JSD using the Online Licensing option
async function setMatlabLicensingInJsdUsingOnlineLicensing(matlabJsdPage: Page, username: string, password: string) {
    await waitForPageLoad(matlabJsdPage);

    // Fills in the email textbox and presses Enter
    const emailTextbox = matlabJsdPage.frameLocator('#loginframe').locator('#userId');
    await expect(emailTextbox, 'Wait for email ID textbox to appear').toBeVisible();

    // This fill is added to makesure that the email input area is blank before entering the username
    await emailTextbox.fill('');

    // Fills in the username in the input
    await emailTextbox.fill(username);
    await emailTextbox.press('Enter');

    // Fills in the password textbox and presses Enter multiple times
    const passwordTextbox = matlabJsdPage.frameLocator('#loginframe').locator('#password');
    await expect(passwordTextbox, 'Wait for password textbox to appear').toBeVisible();
    await passwordTextbox.fill(password);
    await passwordTextbox.press('Enter');
    // await passwordTextbox.press('Enter');
}

async function verifyLicensingSuccessful(matlabJsdPage: Page){
    // Verifies if licensing is successful by checking the status information
    const statusInfo = matlabJsdPage.getByText('Status Information');
    await expect(statusInfo, 'Verify if Licensing is successful').toBeVisible();
}

// Unsets MATLAB licensing in JSD
async function unsetMatlabLicensing(matlabJsdPage: Page) {
    await waitForPageLoad(matlabJsdPage);

    // Clicks on the Tool Icon button in MATLAB Web Desktop
    await clickTheToolsIconButton(matlabJsdPage);
    const statusInfo = await getTheStatusOFMATLAB(matlabJsdPage);

    // Clicks on the Unset MATLAB Licensing button
    await waitForButtonAndClick(statusInfo, 'unsetLicensingBtn', 'Wait for Unset MATLAB Licensing button');

    // Confirms the action by clicking the Confirm button

    await waitForButtonAndClick(matlabJsdPage, 'confirmButton', 'Wait for Confirm button');
    await waitForPageLoad(matlabJsdPage);
}

// Starts a MATLAB session in JSD
async function startMatlabSession(matlabJsdPage: Page) {
    await waitForPageLoad(matlabJsdPage);

    // Waits for the Status Information dialog to be loaded
    const statusInfo = await getTheStatusOFMATLAB(matlabJsdPage);

    // Clicks on the Start MATLAB Session button
    await waitForButtonAndClick(statusInfo, 'startMatlabBtn', 'Wait for Stop MATLAB Session button');

    // Confirms the action by clicking the Confirm button with a longer timeout
    await waitForButtonAndClick(matlabJsdPage, 'confirmButton', 'Wait for Confirm button');
}

// Stops the current MATLAB session in JSD
async function stopMatlabSession(matlabJsdPage: Page) {
    await waitForPageLoad(matlabJsdPage);

    // Clicks on the Tool Icon button in MATLAB Web Desktop
    await clickTheToolsIconButton(matlabJsdPage);

    // Waits for the Status Information dialog to be loaded
    const statusInfo = await getTheStatusOFMATLAB(matlabJsdPage);

    // Clicks on the Stop MATLAB Session button
    await waitForButtonAndClick(statusInfo, 'stopMatlabBtn', 'Stop MATLAB Session');

    // Confirms the action by clicking the Confirm button
    await waitForButtonAndClick(matlabJsdPage, 'confirmButton', 'Wait for Confirm button');
}
