import { test, expect } from '@playwright/test';

async function signup(page) {
    await page.getByRole('button', { name: 'Sign up' }).click();
    await page.getByRole('textbox', { name: 'nome utente', exact: true }).click();
    await page.getByRole('textbox', { name: 'nome utente', exact: true }).fill('Carlo');
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('prova@prova.it');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('provaprova');
    await page.locator('#form-signup').getByRole('button', { name: 'Sign up' }).click();
    await expect(page.locator('#toast-container div.toast-success').getByRole('alert', { name: 'Hai fatto la registrazione con successo' })).toBeVisible();
}


async function signupError(page) {
    await page.getByRole('button', { name: 'Sign up' }).click();
    await page.getByRole('textbox', { name: 'nome utente', exact: true }).click();
    await page.getByRole('textbox', { name: 'nome utente', exact: true }).fill('Carlo');
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('prova@prova.it');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('provaprova');
    await page.locator('#form-signup').getByRole('button', { name: 'Sign up' }).click();
    await expect(page.locator('#toast-container div.toast-error').getByRole('alert', { name: 'Utente con questa email già registrato' })).toBeVisible();
}


test('signup', async ({ page }) => {

    await page.goto('http://localhost:4200/home');
    await signup(page);
});

test('fallimeto signup', async ({ page }) => {
    await page.goto('http://localhost:4200/home');
    await signupError(page);
});