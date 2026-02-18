import { expect, test } from "@playwright/test";
import { ResponsePage } from "./Pages/response";

test.describe("GPT-Powered Response Validation (POM Only)", () => {
  test.beforeEach(async ({ page }) => {
    const chat = new ResponsePage(page);
    await chat.goto();
  });

  // Helpful Public Service Response (English)
  test("AI provides helpful passport renewal response (EN)", async ({
    page,
  }) => {
    const chat = new ResponsePage(page);

    await chat.sendMessage("How can I renew my passport?");
    await chat.waitForAIResponse();

    const response = await chat.getLastAIText();

    chat.validateHelpfulResponse(response, [
      "passport",
      "renew",
      "documents",
      "application",
      "office",
    ]);
  });

  // Helpful Public Service Response (Arabic)
  test("AI provides helpful passport renewal response (AR)", async ({
    page,
  }) => {
    const chat = new ResponsePage(page);

    await chat.sendMessage("كيف يمكنني تجديد جواز السفر؟");
    await chat.waitForAIResponse();

    const response = await chat.getLastAIText();

    chat.validateHelpfulResponse(response, [
      "جواز",
      "تجديد",
      "مستندات",
      "طلب",
      "مكتب",
    ]);
  });

  // No Hallucinated / Irrelevant Content
  test("AI does not fabricate unrelated information", async ({ page }) => {
    const chat = new ResponsePage(page);

    await chat.sendMessage("What are the working hours of the civil office?");
    await chat.waitForAIResponse();

    const response = await chat.getLastAIText();

    chat.validateNoHallucination(response);
  });

  // English / Arabic Intent Consistency
  test("Responses remain consistent for similar EN/AR intent", async ({
    page,
  }) => {
    await page.getByTestId("chat-input").fill("How can I renew my ID?");
    await page.getByTestId("send-button").click();

    const enText =
      (await page.getByTestId("ai-message").last().textContent()) || "";

    await page.getByTestId("chat-input").fill("كيف يمكنني تجديد الهوية؟");
    await page.getByTestId("send-button").click();

    const arText =
      (await page.getByTestId("ai-message").last().textContent()) || "";
    expect(enText.length).toBeGreaterThan(20);
    expect(arText.length).toBeGreaterThan(20);
  });

  // 5️⃣ Clean Formatting (No Broken HTML)
  test("Response formatting is clean and complete", async ({ page }) => {
    const chat = new ResponsePage(page);

    await chat.sendMessage("Tell me about public health services");
    await chat.waitForAIResponse();

    const html = await chat.getLastAIHTML();
    const text = await chat.getLastAIText();

    chat.validateCleanHTML(html);
    chat.validateNotIncomplete(text);
  });

  // 6️⃣ Loading State
  test("Loading state appears before AI response", async ({ page }) => {
    const chat = new ResponsePage(page);

    await chat.input.fill("Testing loading state");
    await chat.sendButton.click();

    await chat.expectLoadingVisible();
    await chat.waitForAIResponse();
  });

  // 7️⃣ Fallback Handling
  test("Fallback message appears when API fails", async ({ page }) => {
    const chat = new ResponsePage(page);

    await chat.simulateApiFailure();
    await chat.sendMessage("Trigger failure");

    await chat.expectErrorVisible();
  });
});
