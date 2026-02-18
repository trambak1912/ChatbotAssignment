# Chatbot Assignment

## 📌 Overview
U-Ask is a generative AI-powered chatbot launched by the UAE Government to support residents and citizens
with access to public services. It allows users to ask questions in Arabic and English, and uses models like
ChatGPT to generate real-time responses.
You are tasked with validating the user interface behavior, AI-generated responses, and overall reliability
of the chatbot using test automation techniques focused on AI/ML.

This project validates:

A. Chatbot UI Behavior  
B. GPT Response Quality  
C. Security & Injection Handling  

Built using Playwright + TypeScript.

---

# 🚀 Installation

```bash
npm install
npx playwright install


## Run all tests:
npx playwright test

## Run specific file:
npx playwright test tests/chatbot_UI_test.spec.ts

## View Test Report After execution:
npx playwright show-report