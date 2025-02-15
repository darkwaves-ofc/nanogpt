# NanoGPT

![NanoGPT Logo](https://nano-gpt.com/logo.png)

A lightweight JavaScript/TypeScript client for interacting with the NanoGPT API. This package provides an easy way to use AI models for chat, image generation, and more.

[![npm version](https://img.shields.io/npm/v/nanogpt.svg)](https://www.npmjs.com/package/nanogpt)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🤖 Chat with AI models (GPT and Gemini)
- 🖼️ Generate images with stable diffusion models
- 💰 Check account balance and available models
- 📚 TypeScript support with complete type definitions
- 🔄 Promise-based API with async/await support

## Installation

```bash
npm install nanogpt
```

Or using yarn:

```bash
yarn add nanogpt
```

## Quick Start

```javascript
// Import the package
import { NanoGPT } from "nanogpt";

// Initialize with your API key
const nanoGPT = NanoGPT({
  apiKey: 'your-api-key-here',
  defaultModel: 'gpt-4-turbo' // optional
});

// Chat example
async function chatExample() {
  const response = await nanoGPT.chat('What is artificial intelligence?');
  console.log(response.reply);
}

// Image generation example
async function imageExample() {
  const response = await nanoGPT.image('A futuristic city with flying cars');
  // Use the base64 image data
  console.log(response.base64);
}

chatExample();
imageExample();
```

## API Reference

### Initialization

```javascript
const nanoGPT = NanoGPT({
  apiKey: string,       // Required: Your NanoGPT API key
  defaultModel: string  // Optional: Default model to use for requests
});
```

### Chat

```javascript
// Simple version with just a prompt
const response = await nanoGPT.chat('Hello, how are you?');

// Advanced version with parameters
const response = await nanoGPT.chat({
  prompt: 'Hello, how are you?',
  model: 'gpt-4-turbo',  // Optional if defaultModel was set
  context: [             // Optional conversation history
    { role: 'user', content: 'Hi there!' },
    { role: 'assistant', content: 'Hello! How can I help you today?' }
  ]
});

// Response structure
{
  reply: string,   // The AI's response
  metadata: object // Additional information about the response
}
```

### Image Generation

```javascript
// Simple version with just a prompt
const response = await nanoGPT.image('A beautiful sunset over mountains');

// Advanced version with parameters
const response = await nanoGPT.image({
  prompt: 'A beautiful sunset over mountains',
  model: 'stable-diffusion-xl', // Optional if defaultModel was set
  width: 1024,                  // Optional (default: 1024)
  height: 1024,                 // Optional (default: 1024)
  negativePrompt: 'blurry, low quality', // Optional
  steps: 30,                    // Optional (default: 25)
  sampler: 'DPM++ 2S a Karras', // Optional
  scale: 7.0,                   // Optional (default: 6.5)
  batchSize: 1                  // Optional (default: 1)
});

// Response structure
{
  base64: string,  // Base64-encoded image data
  metadata: object // Additional information about the generated image
}
```

### Batch Image Generation

```javascript
const response = await nanoGPT.imageBatch({
  prompt: 'A futuristic cityscape',
  batchSize: 4, // Generate 4 variations
  // ... other parameters same as image()
});

// Response structure
{
  imageBatch: [
    { base64: string }, // Image 1
    { base64: string }, // Image 2
    // ... 
  ],
  metadata: object
}
```

### Account Information

```javascript
// Get full account information
const accountInfo = await nanoGPT.account();

// Get just the balance
const balance = await nanoGPT.balance();

// Get available models
const models = await nanoGPT.models();
```

### Helper Functions

```javascript
// Create a user message for context
const userMessage = nanoGPT.contextUser('Hello AI!');
// Result: { role: 'user', content: 'Hello AI!' }

// Create an assistant message for context
const aiMessage = nanoGPT.contextAI('Hello human!');
// Result: { role: 'assistant', content: 'Hello human!' }
```

## Error Handling

All methods return promises that may reject with errors. We recommend using try/catch blocks:

```javascript
try {
  const response = await nanoGPT.chat('Hello');
  console.log(response.reply);
} catch (error) {
  console.error('Error:', error.message);
}
```

Common errors include:
- API key not provided or invalid
- Network connectivity issues
- Rate limiting or insufficient balance
- Invalid parameters

## TypeScript Support

This package includes TypeScript definitions. For example:

```typescript
import NanoGPT from 'nanogpt';

interface ChatResponse {
  reply: string;
  metadata: any;
}

const nanoGPT = NanoGPT({
  apiKey: 'your-api-key',
  defaultModel: 'gpt-4-turbo'
});

async function getResponse(): Promise<ChatResponse> {
  return await nanoGPT.chat('Hello');
}
```

## Examples

### Conversation with Context

```javascript
const nanoGPT = NanoGPT({ apiKey: 'your-api-key', defaultModel: 'gpt-4-turbo' });

// Create a conversation
const conversation = [
  nanoGPT.contextUser('What is the capital of France?'),
  nanoGPT.contextAI('The capital of France is Paris.'),
  nanoGPT.contextUser('What about Japan?')
];

// Continue the conversation
const response = await nanoGPT.chat({
  prompt: 'And what about Germany?',
  context: conversation
});

console.log(response.reply);
// Output might be: "The capital of Germany is Berlin."
```

### Saving Generated Images

```javascript
const fs = require('fs');

async function saveImage() {
  const response = await nanoGPT.image('A cyberpunk cityscape at night');
  
  // Convert base64 to buffer
  const imageBuffer = Buffer.from(response.base64, 'base64');
  
  // Save to file
  fs.writeFileSync('cyberpunk-city.png', imageBuffer);
  console.log('Image saved successfully!');
}

saveImage();
```

## Best Practices

1. **API Key Security**: Never expose your API key in client-side code or public repositories.

2. **Error Handling**: Always implement proper error handling for API calls.

3. **Rate Limiting**: Be mindful of your API usage to avoid hitting rate limits.

4. **Context Management**: For chat applications, maintain conversation context appropriately.

5. **Image Sizes**: Choose appropriate image dimensions to balance quality vs. generation time.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions, issues, or feature requests, please contact: info@crysolabs.com

---

Made with ❤️ by [CrysoLabs](https://crysolabs.com)