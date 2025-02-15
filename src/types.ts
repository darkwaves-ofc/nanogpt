export interface NanoGPTConfig {
  apiKey: string;
  defaultModel?: string;
}

export interface ChatParams {
  prompt: string;
  model?: string;
  context?: ContextMessage[];
}

export interface ContextMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  reply: string;
  metadata: any;
}

export interface ImageParams {
  prompt: string;
  model?: string;
  width?: number;
  height?: number;
  negativePrompt?: string;
  steps?: number;
  sampler?: string;
  scale?: number;
  batchSize?: number;
  paramsExtra?: Record<string, any>;
}

export interface ProcessedImageParams {
  prompt: string;
  model: string;
  width: number;
  height: number;
  negative_prompt: string;
  num_steps: number;
  sampler_name: string;
  scale: number;
  resolution: string;
  nImages: number;
  [key: string]: any;
}

export interface ImageResponse {
  base64: string;
  metadata: any;
}

export interface ImageBatchResponse {
  imageBatch: Array<{base64: string}>;
  metadata: any;
}

export interface AccountResponse {
  balance: number;
  [key: string]: any;
}