import { chromium, FullConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Idź na Akademię → auto redirect na GitLab
    await page.goto('https://akademia.gwodev.pl/');
    await page.waitForURL('**/gitlab.gwo.pl/users/sign_in**');

    // Zaloguj się
    await page.locator('#user_login').fill(process.env.GITLAB_EMAIL!);
    await page.locator('#user_password').fill(process.env.GITLAB_PASSWORD!);
    await page.locator('button[type="submit"]').click();

    // Czekaj na redirect z powrotem na Akademię
    await page.waitForURL('**/akademia.gwodev.pl/**', { timeout: 30000 });
    await page.waitForLoadState('networkidle');

    // Zapisz sesję
    await context.storageState({
      path: path.join(__dirname, '.auth', 'user.json'),
    });

    console.log('✅ Zalogowano i zapisano sesję');
  } catch (error) {
    await page.screenshot({ path: 'setup-error.png' });
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
