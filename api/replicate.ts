import type { VercelRequest, VercelResponse } from '@vercel/node';
import Replicate from 'replicate';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { prompt, type = 'video' } = req.body;
  const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

  console.log('API called with:', { prompt, type, hasToken: !!REPLICATE_API_TOKEN });

  if (!REPLICATE_API_TOKEN) {
    console.error('Missing REPLICATE_API_TOKEN');
    res.status(500).json({ error: 'Missing Replicate API token' });
    return;
  }

  if (!prompt) {
    res.status(400).json({ error: 'Missing prompt' });
    return;
  }

  try {
    const replicate = new Replicate({
      auth: REPLICATE_API_TOKEN,
    });

    console.log('Starting generation for type:', type);

    let output;
    if (type === 'video') {
      // 使用动画模型
      output = await replicate.run(
        "lucataco/animate-diff:beecf59c4aee8d81bf04f0381033dfa10dc16e845b4ae00d281e2fa377e48a9f",
        {
          input: {
            path: "toonyou_beta3.safetensors",
            seed: Math.floor(Math.random() * 1000000),
            steps: 25,
            prompt: prompt,
            n_prompt: "badhandv4, easynegative, ng_deepnegative_v1_75t",
            motion_module: "mm_sd_v14",
            guidance_scale: 7.5
          }
        }
      );
    } else {
      // 使用图片模型
      output = await replicate.run(
        "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        {
          input: {
            prompt: prompt,
            negative_prompt: "bad quality, blurry, low resolution",
            width: 1024,
            height: 1024,
            num_outputs: 1,
            scheduler: "K_EULER",
            num_inference_steps: 50,
            guidance_scale: 7.5,
            seed: Math.floor(Math.random() * 1000000)
          }
        }
      );
    }

    console.log('Generation completed:', output);

    const result = {
      output: Array.isArray(output) ? output[0] : output,
      type: type,
      prompt: prompt
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ error: `Generation failed: ${error.message}` });
  }
} 