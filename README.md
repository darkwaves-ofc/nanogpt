<div align="center">

# NanoGPT 🚀

<img src="https://nano-gpt.com/logo.png" alt="NanoGPT Logo" width="150" height="150">

A lightweight JavaScript/TypeScript client for interacting with the **NanoGPT API**. This package provides an easy way to utilize AI models for **chat, image generation, and more**.

[![npm version](https://img.shields.io/npm/v/nanogpt.svg)](https://www.npmjs.com/package/nanogpt)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/github/actions/workflow/status/username/nanogpt/build.yml)](https://github.com/username/nanogpt/actions)
[![Downloads](https://img.shields.io/npm/dt/nanogpt.svg)](https://www.npmjs.com/package/nanogpt)

</div>

---

## 🚀 Features

- 🤖 AI-powered chat with **GPT and Gemini models**
- 🖼️ **Image generation** using stable diffusion models
- 💰 **Account balance** and available model checks
- 📚 **Full TypeScript support** with type definitions
- 🔄 **Promise-based API** with async/await functionality
- 🔧 **Easy integration** with Node.js and browser environments
- 📡 **WebSocket support** for real-time AI interactions

---

## 📦 Installation

Install via npm:

```bash
npm install nanogpt
```

Or using yarn:

```bash
yarn add nanogpt
```

---

## 📖 API Reference

### 🔹 Initialization

```javascript
const nanoGPT = NanoGPT({
  apiKey: string,       // Required: Your NanoGPT API key
  defaultModel: string  // Optional: Default model to use for requests
});
```

### 💬 Chat

```javascript
// Basic chat request
const response = await nanoGPT.chat('Hello, how are you?');
```

### 🖼️ Image Generation

```javascript
// Basic image generation
const response = await nanoGPT.image('A beautiful sunset over mountains');
```

---

## 📌 Best Practices

✅ **Keep API keys secure** – Avoid exposing them in public repositories.  
✅ **Use proper error handling** – Wrap API calls with `try/catch`.  
✅ **Be mindful of API limits** – Optimize API calls to prevent overuse.  
✅ **Maintain chat context** – Store previous responses for better conversations.  
✅ **Optimize image sizes** – Choose dimensions wisely to balance quality and performance.  

---

## 🤝 Contributing

Contributions are welcome! Feel free to submit a Pull Request.

---

## 📜 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## 💬 Support

For questions, issues, or feature requests, contact: **info@crysolabs.com**

---

<div align="center">

Made with ❤️ by [CrysoLabs](https://crysolabs.com)

</div>

