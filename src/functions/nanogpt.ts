import { AccountResponse, ChatParams, ChatResponse, ContextMessage, ImageBatchResponse, ImageParams, ImageResponse, NanoGPTConfig, ProcessedImageParams } from "../types";

const NANOGPT_API_BASE_URL = 'https://nano-gpt.com/api/';
const NANOGPT_API_TALK_TO_GPT = NANOGPT_API_BASE_URL + 'talk-to-gpt';
const NANOGPT_API_TALK_TO_GEMINI = NANOGPT_API_BASE_URL + 'talk-to-gemini';
const NANOGPT_API_GENERATE_IMAGE = NANOGPT_API_BASE_URL + 'generate-image';
const NANOGPT_API_BALANCE = NANOGPT_API_BASE_URL + 'check-nano-balance';
const NANOGPT_API_MODELS = NANOGPT_API_BASE_URL + 'models';

const IMAGE_WIDTH = 1024;
const IMAGE_HEIGHT = 1024;
const IMAGE_NUM_STEPS = 25;
const IMAGE_SAMPLER_NAME = 'DPM++ 2S a Karras';
const IMAGE_SCALE = 6.5;

const ERROR_PREFIX = '[NanoGPTJS error] ';
const ERROR_PROMPT_IS_NOT_A_STRING = 'Prompt must be a string';
const ERROR_INCORRECT_PARAMETERS = 'Incorrect parameters';
const ERROR_MODEL_NOT_SET = 'Model not set. Please specify model';
const ERROR_NANOGPT_CONNECTION = 'Error during connection with NanoGPT, status: ';

export default function(config: NanoGPTConfig) {
  const { apiKey, defaultModel } = config;

  const requestTemplate: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    }    
  };

  if (!apiKey) {
    throw new Error(ERROR_PREFIX + 'NanoGPT API key not provided');
  }

  if (!isString(apiKey)) {
    throw new Error(ERROR_PREFIX + 'NanoGPT API key must be a string');
  }  

  return {
    chat: async function(params: string | ChatParams): Promise<ChatResponse> {
      let response: Response;
      let prompt = '';
      let model: string | undefined;
      let context: ContextMessage[] = [];

      // if params are a single string then this is the prompt shorthand version of this function
      if (isString(params)) {
        prompt = params as string;
      } else if (isObject(params)) {
        const chatParams = params as ChatParams;
        prompt = chatParams.prompt;
        model = chatParams.model;
        context = chatParams.context || [];
      } else {
        throw new Error(ERROR_PREFIX + ERROR_INCORRECT_PARAMETERS);
      }

      let _model = model || defaultModel;

      if (!_model) {
        throw new Error(ERROR_PREFIX + ERROR_MODEL_NOT_SET);
      }
      if (!isString(prompt)) {
        throw new Error(ERROR_PREFIX + ERROR_PROMPT_IS_NOT_A_STRING);
      }
      if (!isArray(context)) {
        throw new Error(ERROR_PREFIX + 'Context must be an array');
      }                    

      let apiURL: string;
      if (_model.startsWith('gemini')) {
        apiURL = NANOGPT_API_TALK_TO_GEMINI;
      } else {
        apiURL = NANOGPT_API_TALK_TO_GPT;
      }

      // -----

      try {
        response = await fetch(
          apiURL,
          {
            ...requestTemplate,
            body: JSON.stringify({
              prompt,
              model: _model,
              messages: context
            })
          }
        );

        if (!response.ok) {
          throw new Error();
        }
      }
      catch (error) {
        throw new Error(ERROR_PREFIX + ERROR_NANOGPT_CONNECTION + (error as Response).status);
      }

      // -----

      try {
        const response_ = await response.text();
        const response__ = response_.split('<NanoGPT>');
        const nanoGPTText = response__[0];
        const responseMetadata = response__[1].split('</NanoGPT>');  
        const responseMetadata_ = responseMetadata[0];
        const nanoGPTMetadata = JSON.parse(responseMetadata_);
    
        return {
          reply: nanoGPTText,
          metadata: nanoGPTMetadata
        };
      }
      catch (error) {
        throw new Error(ERROR_PREFIX + (error as Error).message);
      }      
    },

    // ---------------------------------------------------

    image: async function(params: string | ImageParams): Promise<ImageResponse> {
      let response: Response;
      let _params: ProcessedImageParams;
      
      try {
        _params = handleImageGenerationParams(params, defaultModel);
      } catch (error) {
        throw error;
      }

      // -----

      try {        
        response = await fetch(
          NANOGPT_API_GENERATE_IMAGE,
          {
            ...requestTemplate,
            body: JSON.stringify(_params)
          }
        );    

        if (!response.ok) {
          throw new Error();
        }
      }
      catch (error) {
        throw new Error(ERROR_PREFIX + ERROR_NANOGPT_CONNECTION + (error as Response).status);
      }        

      // -----

      try {
        let parsedResponse = JSON.parse(await response.text());
        let base64 = parsedResponse.data[0].b64_json;
        delete parsedResponse.data;

        return {
          base64,
          metadata: parsedResponse
        };
      }
      catch (error) {
        throw new Error(ERROR_PREFIX + (error as Error).message);
      }      
    },

    // ---------------------------------------------------

    imageBatch: async function(params: ImageParams): Promise<ImageBatchResponse> {
      let response: Response;
      let _params: ProcessedImageParams;
      
      if (!isObject(params)) {
        throw new Error(ERROR_PREFIX + ERROR_INCORRECT_PARAMETERS);
      }

      try {
        _params = handleImageGenerationParams(params, defaultModel);
      } catch (error) {
        throw error;
      }

      // -----
      
      try {
        response = await fetch(
          NANOGPT_API_GENERATE_IMAGE,
          {
            ...requestTemplate,
            body: JSON.stringify(_params)
          }
        );
        
        if (!response.ok) {
          throw new Error();
        }
      }
      catch (error) {
        throw new Error(ERROR_PREFIX + ERROR_NANOGPT_CONNECTION + (error as Response).status);
      }                

      // -----

      try {      
        let parsedResponse = JSON.parse(await response.text());
        let images_ = parsedResponse.data;
        let images = images_.map(function(i: {b64_json: string}) {
          return {base64: i.b64_json};
        });
        delete parsedResponse.data;

        return {
          imageBatch: images,
          metadata: parsedResponse
        };
      }
      catch (error) {
        throw new Error(ERROR_PREFIX + (error as Error).message);
      }      
    },    

    // ---------------------------------------------------

    account: async function(): Promise<AccountResponse> {
      let response: Response;

      try {
        response = await fetch(NANOGPT_API_BALANCE, requestTemplate);
        if (!response.ok) { throw new Error(); }
        return await response.json();
      }
      catch (error) {
        throw new Error(ERROR_PREFIX + (error as Error).message);
      }      
    },

    // ---------------------------------------------------

    balance: async function(): Promise<number> {
      let response: Response;

      try {        
        response = await fetch(NANOGPT_API_BALANCE, requestTemplate);
        if (!response.ok) { throw new Error(); }      
        return (await response.json()).balance;
      }
      catch (error) {
        throw new Error(ERROR_PREFIX + (error as Error).message);
      }      
    },
    
    // ---------------------------------------------------

    models: async function(): Promise<any> {
      let response: Response;

      try {        
        response = await fetch(NANOGPT_API_MODELS);
        if (!response.ok) { throw new Error(); }      
        return (await response.json());
      }
      catch (error) {
        throw new Error(ERROR_PREFIX + (error as Error).message);
      }      
    },    

    // ---------------------------------------------------

    contextUser: function(content: string = ''): ContextMessage {  
      return { role: 'user', content };
    },

    // ---------------------------------------------------

    contextAI: function(content: string = ''): ContextMessage {
      return { role: 'assistant', content };
    }
  };
}

// ---------------------------------------------------

function handleImageGenerationParams(params: string | ImageParams, defaultModel?: string): ProcessedImageParams {
  let _params: ProcessedImageParams = {} as ProcessedImageParams;

  if (isString(params)) {
    if (!defaultModel) {
      throw new Error(ERROR_PREFIX + ERROR_MODEL_NOT_SET);
    }

    _params = {
      prompt: params as string,
      model: defaultModel,
      width: IMAGE_WIDTH,
      height: IMAGE_HEIGHT,
      negative_prompt: '',
      num_steps: IMAGE_NUM_STEPS,
      sampler_name: IMAGE_SAMPLER_NAME,
      scale: IMAGE_SCALE,
      resolution: `${IMAGE_WIDTH}x${IMAGE_HEIGHT}`,
      nImages: 1
    };
  }
  else if (isObject(params)) {
    const imgParams = params as ImageParams;

    _params = {
      prompt: imgParams.prompt || '',
      model: imgParams.model || defaultModel || '',
      width: imgParams.width || IMAGE_WIDTH,
      height: imgParams.height || IMAGE_HEIGHT,
      negative_prompt: imgParams.negativePrompt || '',
      num_steps: imgParams.steps || IMAGE_NUM_STEPS,
      sampler_name: imgParams.sampler || IMAGE_SAMPLER_NAME,
      scale: imgParams.scale || IMAGE_SCALE,
      nImages: imgParams.batchSize || 1,
      resolution: ''
    };
    _params.resolution = `${_params.width}x${_params.height}`;

    if (isObject(imgParams.paramsExtra)) {
      _params = { ..._params, ...imgParams.paramsExtra };
    }
  } else {
    throw new Error(ERROR_PREFIX + ERROR_INCORRECT_PARAMETERS);
  }

  if (!isString(_params.prompt)) {
    throw new Error(ERROR_PREFIX + ERROR_PROMPT_IS_NOT_A_STRING);
  }      
  if (!_params.model) {
    throw new Error(ERROR_PREFIX + ERROR_MODEL_NOT_SET);
  }
  if (!isIntegerGreaterThanZero(_params.width)) {
    throw new Error(ERROR_PREFIX + 'Image width must be an integer greater than zero');
  }
  if (!isIntegerGreaterThanZero(_params.height)) {
    throw new Error(ERROR_PREFIX + 'Image height must be an integer greater than zero');
  }  
  if (!isString(_params.negative_prompt)) {
    throw new Error(ERROR_PREFIX + 'Negative prompt must be a string');
  }
  if (!isIntegerGreaterThanZero(_params.num_steps)) {
    throw new Error(ERROR_PREFIX + 'Number of steps must be an integer greater than zero');
  }      
  if (!isString(_params.sampler_name)) {
    throw new Error(ERROR_PREFIX + 'Sampler name must be a string');
  }
  if (!isNumber(_params.scale)) {
    throw new Error(ERROR_PREFIX + 'Scale must be a number');
  }
  if (!isIntegerGreaterThanZero(_params.nImages)) {
    throw new Error(ERROR_PREFIX + 'Number of images must be an integer greater than zero');
  }      

  return _params;
}

// ---------------------------------------------------

function isArray(value: any): value is Array<any> {
  return Array.isArray(value);
}

function isString(value: any): value is string {
  return typeof value === 'string';
}

function isNumber(value: any): value is number {
  return typeof value === 'number';
}

function isInteger(value: any): value is number {
  return typeof value === 'number' &&
    isFinite(value) &&
    Math.floor(value) === value;
}

function isIntegerGreaterThanZero(value: any): value is number {
  return isInteger(value) && value >= 1;
}

function isObject(value: any): value is object {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}