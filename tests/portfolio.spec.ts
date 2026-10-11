import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('page renders without runtime errors or horizontal overflow', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Beyond ordinary.' })).toBeVisible();
  await expect(page.locator('.sculpture')).toHaveAttribute('data-ready', 'true', { timeout: 20000 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('all concept studies open and close accessibly', async ({ page }) => {
  await page.goto('/');
  for (const name of ['Orbit', 'Forma', 'Parallel']) {
    await page.getByRole('button', { name: `Explore ${name} concept study` }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: new RegExp(name) })).toBeVisible();
    await expect(dialog.getByText('This is an original visual exploration', { exact: false })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  }
});

test('contact validates input and creates an addressed email without sending', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start a project', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Prepare project email' }).click();
  await expect(dialog.getByText('Your introduction is ready.')).not.toBeVisible();
  await dialog.getByLabel('Your name').fill('Jamie Example');
  await dialog.getByLabel('Email address').fill('jamie@example.com');
  await dialog.getByLabel('A little about your idea').fill('A creative website with accessible 3D interactions.');
  await dialog.getByRole('button', { name: 'Prepare project email' }).click();
  await expect(dialog.getByText('Your introduction is ready.')).toBeVisible();
  const href = await dialog.getByRole('link', { name: 'Open email app' }).getAttribute('href');
  expect(href).toContain('mailto:imzyrixx@gmail.com?');
  expect(decodeURIComponent(href!)).toContain('Jamie Example');
  expect(decodeURIComponent(href!)).toContain('accessible 3D interactions');
  await dialog.getByRole('button', { name: 'Edit your introduction' }).click();
  await expect(dialog.getByLabel('Your name')).toHaveValue('Jamie Example');
  await page.keyboard.press('Escape');
});

test('mobile navigation works and closes after selection', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile');
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Studio' }).click();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).not.toBeVisible();
  await expect(page).toHaveURL(/#studio$/);
});

test('reduced motion keeps content and a static 3D poster available', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.sculpture-poster')).toBeVisible();
  expect(await page.locator('.sculpture-poster').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  await expect(page.locator('.sculpture canvas')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Ideas made tangible.' })).toBeVisible();
});

test('main page and contact dialog pass accessibility checks', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole('button', { name: 'Start a project', exact: true }).click();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test('without JavaScript the organization and contact route remain available', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173');
  await expect(page.getByRole('heading', { name: 'Zyrix — Beyond ordinary.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'connect with Zyrix on GitHub' })).toHaveAttribute('href', 'https://github.com/zyrixdevs');
  await context.close();
});
