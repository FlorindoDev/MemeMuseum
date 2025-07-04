import { test, expect } from '@playwright/test';


async function login(page) {
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('prova@prova.it');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('provaprova');
  await page.getByRole('button', { name: 'Accedi' }).click();
  await expect(page.locator('#nickName').getByText('Carlo')).toBeVisible();
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
  await expect(page.locator('#toast-container div.toast-success').getByRole('alert', { name: 'Successo caricamento tags!' })).toBeVisible();
  await expect(page.locator('#toast-container div.toast-success').getByRole('alert', { name: 'Successo caricamento Meme!' })).toBeVisible();

}

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
  await page.locator('#nickName').getByText('Carlo').click();
  await page.getByRole('menuitem', { name: 'Profilo' }).click();
  await page.locator('.grid > *').last().click();
  await page.getByRole('textbox', { name: 'Scrivi il tuo commento...' }).click();
  await page.getByRole('textbox', { name: 'Scrivi il tuo commento...' }).fill('bel meme');
  await page.getByRole('button', { name: 'Commenta' }).click();
  await expect(page.locator('div').filter({ hasText: 'bel meme' }).nth(1)).toBeVisible();

});

test('ricerca per nome', async ({ page }) => {
  await page.goto('http://localhost:4200/home');

  //Login
  await login(page);
  //carica meme
  await upLoadMeme(page);
  //ricerca
  await page.getByRole('textbox', { name: 'Nome utente' }).click();
  await page.getByRole('textbox', { name: 'Nome utente' }).fill('Carlo');
  await page.getByRole('button', { name: 'Cerca' }).click();
  await expect(page.locator('#user-post-name').filter({ hasText: 'Carlo' }).nth(1)).toBeVisible();

});

test('ricerca per tag', async ({ page }) => {
  await page.goto('http://localhost:4200/home');

  //Login
  await login(page);
  //carica meme
  await upLoadMeme(page);
  //ricerca per tag

  await page.getByRole('textbox', { name: 'Nome tag' }).click();
  await page.getByRole('textbox', { name: 'Nome tag' }).fill('un tag');
  await page.getByRole('textbox', { name: 'Nome tag' }).press('Enter');
  await page.getByRole('button', { name: 'Cerca' }).click();
  await expect(page.locator('#tags-wrap').nth(1).getByText('un tag')).toBeVisible();

});

test('meme non esiste', async ({ page }) => {
  await page.goto('http://localhost:4200/memes/232323');
  await expect(page.locator('#toast-container div.toast-warning').getByRole('alert', { name: 'Tra poco sarai reindirizzato alla home' })).toBeVisible();
});

test('utente non esiste', async ({ page }) => {
  await page.goto('http://localhost:4200/users/232323');
  await expect(page.locator('#toast-container div.toast-warning').getByRole('alert', { name: 'Tra poco sarai reindirizzato alla home' })).toBeVisible();
});

test('caricamento immagine profilo', async ({ page }) => {
  await page.goto('http://localhost:4200/home');
  //Login
  await login(page);
  await page.locator('#nickName').getByText('Carlo').click();
  await page.getByRole('menuitem', { name: 'Profilo' }).click();
  await page.locator('#profile-img div').click();
  await page.locator('#drag-area').click();
  await page.locator('input[type="file"]').setInputFiles('front_end/mememuseum/tests/gatto.png');
  await expect(page.locator('#toast-container div.toast-success').getByRole('alert', { name: 'Foto profilo caricata' })).toBeVisible();
});
