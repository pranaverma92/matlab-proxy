// global-setup.ts
import { chromium, FullConfig, expect } from '@playwright/test';

async function globalSetup (config: FullConfig) {
    const { baseURL } = config.projects[0].use;
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(baseURL!);

    const emailTextbox = page.frameLocator('#loginframe').locator('#userId');
    await expect(emailTextbox, 'Wait for email ID textbox to appear').toBeVisible({ timeout: 60000 });
    await emailTextbox.fill('dockeruser@mwcloudtest.com');
    await emailTextbox.press('Enter');

    // Fills in the password textbox and presses Enter multiple times
    const passwordTextbox = page.frameLocator('#loginframe').locator('#password');
    await expect(passwordTextbox, 'Wait for password textbox to appear').toBeVisible();
    await passwordTextbox.fill('CPIPassw0rd!');
    await passwordTextbox.press('Enter');
    await passwordTextbox.press('Enter');

    // Verifies if licensing is successful by checking the status information
    const statusInfo = page.getByText('Status Information');
    await expect(statusInfo, 'Verify if Licensing is successful').toBeVisible({ timeout: 60000 });
    await browser.close();
}

export default globalSetup;