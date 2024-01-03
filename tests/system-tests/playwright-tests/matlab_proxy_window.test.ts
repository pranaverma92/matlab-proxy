import { test, expect } from '@playwright/test';

// Tests to check the tools icon clickability and the initial dialog
test.describe('MATLAB Proxy tests', () => {

    // Test to check if the tools icon button is clickable
    test('Test the tools icon button is clicked', async ( {page} )  => {

        await page.goto("/index.html");
        const buttonLocator = page.locator('button.trigger-btn');
        await expect(buttonLocator, 'Tools icon button is not visible').toBeVisible({timeout : 60000});
        await buttonLocator.click();
    })

    // Test to check that '>>' is visible on the command window
    test('Test that prompt >> is seen', async ( {page} ) => {

        await page.goto("/index.html");
        const commandWindowFrame = page.getByText('>>');
        // await expect(commandWindowFrame, 'Command prompt ">>" is not visible').toBeVisible({timeout : 60000});
        await commandWindowFrame.isVisible({timeout:60000});
    })

    // Test to check if the initial dialog which appears on the start up is able to close
    test('Test that the Close button on initial tools icon dialog works', async( {page} )  => {

        await page.goto("/index.html");
        const triggerButton = page.getByTestId('tutorialCloseBtn');
        await expect(triggerButton, "The tools icon dialog is not visible").toBeVisible({timeout : 60000});
        await triggerButton.click();
    })
});