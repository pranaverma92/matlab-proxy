import { BrowserContext, Locator, Page, test, expect, chromium} from '@playwright/test';

// Tests to check the tools icon clickability and the initial dialog
test.describe('MATLAB Proxy tests', () => {

    // Test to check if the tools icon button is clickable
    test('Test the tools icon button is clicked', async ( {page} )  => {
        await page.goto("./index.html");
        await page.waitForLoadState();
        const buttonLocator = page.locator('button.trigger-btn');
        await buttonLocator.click();
    })

    // Test to check that '>>' is visible on the command window
    test('Test that prompt >> is seen', async ( {page} ) => {
        await page.goto('./index.html');
        await page.waitForLoadState();
        const commandWindowFrame = page.getByText('>>');
        await commandWindowFrame.isVisible({timeout:120000});
    })

    // Test to check if the initial dialog which appears on the start up is able to close
    test('Close button on tool button works', async( {page} )  => {
        await page.goto('./index.html');
        const triggerButton = page.getByTestId('tutorialCloseBtn');
        await triggerButton.isVisible();
        await triggerButton.click();
    })
});