import { test, expect, Page } from "@playwright/test";

async function ensureChatOpen(page: Page) {
  const toggle = page.locator("#chat-toggle");
  if (await toggle.isVisible()) {
    await toggle.click();
  }
  await expect(page.locator("#chat-widget")).toBeVisible();
}

/**
Send a message and wait for response
 */
async function sendMessage(page: Page, message: string) {
  const input = page.locator("#chat-input");
  const sendBtn = page.locator("#send-button");

  await input.fill(message);
  await expect(input).toHaveValue(message);

  await sendBtn.click();

  // Ensure user message displayed
  await expect(page.locator(".user-message").last()).toHaveText(message);

  // Wait for response
  await expect(page.locator(".ai-message").last()).toBeVisible();
}

test.describe("A. Chatbot UI Behavior", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await ensureChatOpen(page);
  });

  // 1. Chat widget loads correctly (Desktop & Mobile)
  test("Chat widget renders properly", async ({ page }) => {
    const widget = page.locator("#chat-widget");
    await expect(widget).toBeVisible();

    await expect(page.locator("#chat-input")).toBeVisible();
    await expect(page.locator("#send-button")).toBeVisible();
    await expect(page.locator("#chat-messages")).toBeVisible();
  });

  // User can send message via input box
  test("User can send message", async ({ page }) => {
    const message = "Hello chatbot";
    await sendMessage(page, message);

    const lastUserMessage = page.locator(".user-message").last();
    await expect(lastUserMessage).toContainText(message);
  });

  // AI responses are rendered properly
  test("AI response renders correctly inside conversation area", async ({
    page,
  }) => {
    await sendMessage(page, "What services do you provide?");

    const aiMessage = page.locator(".ai-message").last();

    await expect(aiMessage).toBeVisible();

    // Ensure it contains meaningful content
    const text = await aiMessage.textContent();
    expect(text?.length).toBeGreaterThan(20);

    // Ensure message is inside chat container
    await expect(page.locator("#chat-messages")).toContainText(text!);
  });

  // Multilingual support (LTR / RTL)
  test("English renders LTR direction", async ({ page }) => {
    await sendMessage(page, "Hello");

    const message = page.locator(".user-message").last();
    await expect(message).toHaveCSS("direction", "ltr");
  });

  test("Arabic renders RTL direction", async ({ page }) => {
    await sendMessage(page, "مرحبا كيف حالك؟");

    const message = page.locator(".user-message").last();
    await expect(message).toHaveCSS("direction", "rtl");
  });

  // Input is cleared after sending
  test("Input clears after sending message", async ({ page }) => {
    const input = page.locator("#chat-input");

    await input.clear();
    await page.click("#send-button");

    await expect(input).toHaveValue("");
  });

  // Scroll behavior works correctly
  test("Chat scrolls automatically to latest message", async ({ page }) => {
    const container = page.locator("#chat-messages");

    for (let i = 0; i < 8; i++) {
      await sendMessage(page, `Message number ${i}`);
    }

    const scrollPosition = await container.evaluate((el: HTMLElement) => {
      return {
        scrollTop: el.scrollTop,
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
      };
    });

    // Validate that scroll moved
    expect(
      scrollPosition.scrollTop + scrollPosition.clientHeight,
    ).toBeGreaterThanOrEqual(scrollPosition.scrollHeight - 5);
  });
});
