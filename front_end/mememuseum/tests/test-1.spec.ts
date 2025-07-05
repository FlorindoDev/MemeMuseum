import { test, expect, chromium } from '@playwright/test';
import jwt from 'jsonwebtoken';

async function login(page, info) {
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(info.email);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(info.pass);
  await page.getByRole('button', { name: 'Accedi' }).click();
  await expect(page.locator('#nickName').getByText('Carlo')).toBeVisible();
}

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


async function upLoadMeme(page, config) {
  await page.getByRole('link', { name: 'Carica' }).click();
  await page.locator('#drag-area').click();
  await page.locator('input[type="file"]').setInputFiles('front_end/mememuseum/tests/gatto.png');
  await page.getByRole('textbox', { name: 'Nome tag' }).click();
  await page.getByRole('textbox', { name: 'Nome tag' }).fill(config.content_tag);
  await page.getByRole('textbox', { name: 'Nome tag' }).press('Enter');
  await page.getByRole('textbox', { name: 'Inserisci descrizione del meme' }).click();
  await page.getByRole('textbox', { name: 'Inserisci descrizione del meme' }).fill('una descrizione');
  await page.getByRole('button', { name: 'Crea Meme' }).click();
  await expect(page.locator('#toast-container div.toast-success').getByRole('alert', { name: 'Successo caricamento tags!' })).toBeVisible();
  await expect(page.locator('#toast-container div.toast-success').getByRole('alert', { name: 'Successo caricamento Meme!' })).toBeVisible();

}


function takeinfo(testInfo) {
  const configAnnotation = testInfo.annotations.find(a => a.type === 'config');
  if (configAnnotation) return JSON.parse(configAnnotation.description as string);
}

test.beforeEach(async ({ page }, testInfo) => {

  let num_account = Math.floor(Math.random() * 1000) + 100;
  await page.goto('http://localhost:4200/home');

  const config = {
    num_account: num_account,
    name: `Carlo${num_account}`,
    email: `prova${num_account}@prova.it`,
    pass: `provaprova`,
    content_tag: `${num_account}`
  };

  // Puoi allegare dati al testInfo
  testInfo.annotations.push({ type: 'config', description: JSON.stringify(config) });

  await signup(page, config);

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

test('login', async ({ page }, testInfo) => {
  await page.goto('http://localhost:4200/home');
  let config = takeinfo(testInfo);
  await login(page, config);
});

test('uploadmeme', async ({ page }, testInfo) => {
  await page.goto('http://localhost:4200/home');

  let config = takeinfo(testInfo);
  //Login
  await login(page, config);
  //carica meme
  await upLoadMeme(page, config);

});

test('commento', async ({ page }, testInfo) => {
  await page.goto('http://localhost:4200/home');
  let config = takeinfo(testInfo);
  //Login
  await login(page, config);
  //carica meme
  await upLoadMeme(page, config);
  //Commento
  await page.locator('#nickName').getByText(config.name).click();
  await page.getByRole('menuitem', { name: 'Profilo' }).click();
  await page.locator('.grid > *').last().click();
  await page.getByRole('textbox', { name: 'Scrivi il tuo commento...' }).click();
  await page.getByRole('textbox', { name: 'Scrivi il tuo commento...' }).fill('bel meme');
  await page.getByRole('button', { name: 'Commenta' }).click();
  await expect(page.locator('#comment-content').filter({ hasText: 'bel meme' })).toBeVisible();

});

test('ricerca per nome', async ({ page }, testInfo) => {
  await page.goto('http://localhost:4200/home');
  let config = takeinfo(testInfo);
  //Login
  await login(page, config);
  //carica meme
  await upLoadMeme(page, config);
  //ricerca
  await page.getByRole('textbox', { name: 'Nome utente' }).click();
  await page.getByRole('textbox', { name: 'Nome utente' }).fill(config.name);
  await page.getByRole('button', { name: 'Cerca' }).click();
  await expect(page.locator('#user-post-name').filter({ hasText: config.name })).toBeVisible();

});

test('ricerca per tag', async ({ page }, testInfo) => {
  await page.goto('http://localhost:4200/home');
  let config = takeinfo(testInfo);
  //Login
  await login(page, config);
  //carica meme
  await upLoadMeme(page, config);
  //ricerca per tag

  await page.getByRole('textbox', { name: 'Nome tag' }).click();
  await page.getByRole('textbox', { name: 'Nome tag' }).fill(config.content_tag);
  await page.getByRole('textbox', { name: 'Nome tag' }).press('Enter');
  await page.getByRole('button', { name: 'Cerca' }).click();
  await expect(page.locator('#tags-wrap').getByText(config.content_tag)).toBeVisible();

});

test('meme non esiste', async ({ page }) => {
  await page.goto('http://localhost:4200/memes/232323');
  await expect(page.locator('#toast-container div.toast-warning').getByRole('alert', { name: 'Tra poco sarai reindirizzato alla home' })).toBeVisible();
});

test('utente non esiste', async ({ page }) => {
  await page.goto('http://localhost:4200/users/232323');
  await expect(page.locator('#toast-container div.toast-warning').getByRole('alert', { name: 'Tra poco sarai reindirizzato alla home' })).toBeVisible();
});

test('caricamento immagine profilo', async ({ page }, testInfo) => {
  await page.goto('http://localhost:4200/home');
  let config = takeinfo(testInfo);
  //Login
  await login(page, config);
  await page.locator('#nickName').getByText(config.name).click();
  await page.getByRole('menuitem', { name: 'Profilo' }).click();
  await page.locator('#profile-img div').click();
  await page.locator('#drag-area').click();
  await page.locator('input[type="file"]').setInputFiles('front_end/mememuseum/tests/gatto.png');
  await expect(page.locator('#toast-container div.toast-success').getByRole('alert', { name: 'Foto profilo caricata' })).toBeVisible();
});
