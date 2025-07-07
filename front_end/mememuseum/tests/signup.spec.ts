import { test, expect } from '@playwright/test';
import jwt from 'jsonwebtoken';

const HOST = "http://localhost"

async function signup(page, info) {
    await page.getByRole('button', { name: 'Sign up' }).click();
    await page.getByRole('textbox', { name: 'nome utente', exact: true }).click();
    await page.getByRole('textbox', { name: 'nome utente', exact: true }).fill(info.name);
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill(info.email);
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill(info.pass);
    await page.locator('#form-signup').getByRole('button', { name: 'Sign up' }).click();
    await expect(page.locator('#toast-container div.toast-success').getByRole('alert', { name: 'Hai fatto la registrazione con successo' })).toBeVisible();
}


async function signupError(page, info) {
    await page.getByRole('button', { name: 'Sign up' }).click();
    await page.getByRole('textbox', { name: 'nome utente', exact: true }).click();
    await page.getByRole('textbox', { name: 'nome utente', exact: true }).fill(info.name);
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill(info.email);
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill(info.pass);
    await page.locator('#form-signup').getByRole('button', { name: 'Sign up' }).click();
    await expect(page.locator('#toast-container div.toast-success').getByRole('alert', { name: 'Hai fatto la registrazione con successo' })).toBeVisible();
}



function takeinfo(testInfo) {
    const configAnnotation = testInfo.annotations.find(a => a.type === 'config');
    if (configAnnotation) return JSON.parse(configAnnotation.description as string);
}

test.beforeEach(async ({ page }, testInfo) => {

    let num_account = Math.floor(Math.random() * 1000);
    await page.goto(`${HOST}/home`);

    const config = {
        num_account: num_account,
        name: `Carlo${num_account}`,
        email: `prova${num_account}@prova.it`,
        pass: `provaprova`
    };

    // Puoi allegare dati al testInfo
    testInfo.annotations.push({ type: 'config', description: JSON.stringify(config) });

});

test.afterEach(async ({ page }, testInfo) => {
    let config = takeinfo(testInfo);
    const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: config.email,
            password: config.pass
        }),
    });

    const result = await response.json();
    const token = jwt.decode(result.token);

    if (result.token) {
        await fetch(`http://localhost:3000/users/${token.idUser}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${result.token}`
            }
        });
    }
});

test('signup', async ({ page }, testInfo) => {
    let config = takeinfo(testInfo);
    await page.goto(`${HOST}/home`);
    await signup(page, config);
});

test('fallimeto signup', async ({ page }, testInfo) => {
    let config = takeinfo(testInfo);
    await page.goto(`${HOST}/home`);
    await signup(page, config);
    await signupError(page, config);
});