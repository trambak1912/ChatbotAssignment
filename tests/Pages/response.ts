import { Page, Locator, expect } from '@playwright/test';

export class ResponsePage {
  validateConsistency(enResponse: string, arResponse: string) {
      throw new Error('Method not implemented.');
  }
  validateNotIncomplete(text: string) {
      throw new Error('Method not implemented.');
  }
  validateCleanHTML(html: string) {
      throw new Error('Method not implemented.');
  }
  validateNoHallucination(response: string) {
      throw new Error('Method not implemented.');
  }
  validateHelpfulResponse(response: string, arg1: string[]) {
      throw new Error('Method not implemented.');
  }
  readonly page: Page;
  readonly input: Locator;
  readonly sendButton: Locator;
  readonly aiMessages: Locator;
  readonly userMessages: Locator;
  readonly loadingIndicator: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.input = page.locator('#chat-input');
    this.sendButton = page.locator('#send-button');
    this.aiMessages = page.locator('.ai-message');
    this.userMessages = page.locator('.user-message');
    this.loadingIndicator = page.locator('.loading-indicator');
    this.errorMessage = page.locator('.error-message');
  }

  async goto() {
    await this.page.goto('/');
  }

  async sendMessage(message: string) {
    await this.input.fill(message);
    await this.sendButton.click();
    await expect(this.userMessages.last()).toHaveText(message);
  }

  async waitForAIResponse() {
    await expect(this.aiMessages.last()).toBeVisible({ timeout: 20000 });
  }

  async getLastAIText(): Promise<string> {
    const text = await this.aiMessages.last().textContent();
    return text?.trim() || '';
  }

  async getLastAIHTML(): Promise<string> {
    return await this.aiMessages.last().innerHTML();
  }

  async expectLoadingVisible() {
    await expect(this.loadingIndicator).toBeVisible();
  }

  async expectErrorVisible() {
    await expect(this.errorMessage).toBeVisible();
  }

  async simulateApiFailure() {
    await this.page.route('**/api/chat', route => route.abort());
  }
}
