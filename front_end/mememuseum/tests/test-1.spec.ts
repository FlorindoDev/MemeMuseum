import { test, expect } from '@playwright/test';

async function login(page) {
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('prova@prova.it');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('provaprova');
  await page.getByRole('button', { name: 'Accedi' }).click();
  await expect(page.locator('#nickName').getByText('prova')).toBeVisible();
}

async function upLoadMeme(page) {
  await page.getByRole('link', { name: 'Carica' }).click();
  await page.locator('#drag-area').click();
  await page.locator('input[type="file"]').setInputFiles('front_end/mememuseum/tests/gatto.png');
  await page.getByRole('textbox', { name: 'Nome tag' }).click();
  await page.getByRole('textbox', { name: 'Nome tag' }).fill('un tag');
  await page.getByRole('textbox', { name: 'Nome tag' }).press('Enter');
  await page.getByRole('textbox', { name: 'Inserisci descrizione del meme' }).click();
  await page.getByRole('textbox', { name: 'Inserisci descrizione del meme' }).fill('una descrizione');
  await page.getByRole('button', { name: 'Crea Meme' }).click();
  await expect(page.locator('div').filter({ hasText: 'Successo caricamento tags!' }).nth(2)).toBeVisible();
  await page.locator('div').filter({ hasText: 'Successo caricamento Meme!' }).nth(2).click();
}


test('signup', async ({ page }) => {
  await page.goto('http://localhost:4200/home');
  await page.getByRole('button', { name: 'Sign up' }).click();
  await page.getByRole('textbox', { name: 'nome utente', exact: true }).click();
  await page.getByRole('textbox', { name: 'nome utente', exact: true }).fill('prova');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('prova@prova.it');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('provaprova');
  await page.locator('#form-signup').getByRole('button', { name: 'Sign up' }).click();
  await expect(page.getByLabel('Registrazione Completata!')).toBeVisible();
});

test('login', async ({ page }) => {
  await page.goto('http://localhost:4200/home');
  await login(page);
});

test('uploadmeme', async ({ page }) => {
  await page.goto('http://localhost:4200/home');
  //Login
  await login(page);
  //carica meme
  await upLoadMeme(page);

});

test('commento', async ({ page }) => {
  await page.goto('http://localhost:4200/home');
  //Login
  await login(page);
  //carica meme
  await upLoadMeme(page);
  //Commento
  await page.locator('#nickName').getByText('prova').click();
  await page.getByRole('menuitem', { name: 'Profilo' }).click();
  await page.locator('.grid > *').last().click();
  await page.getByRole('textbox', { name: 'Scrivi il tuo commento...' }).click();
  await page.getByRole('textbox', { name: 'Scrivi il tuo commento...' }).fill('bel meme');
  await page.getByRole('button', { name: 'Commenta' }).click();
  await expect(page.locator('div').filter({ hasText: 'bel meme' }).nth(2)).toBeVisible();

});