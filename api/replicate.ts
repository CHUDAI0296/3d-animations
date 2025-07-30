import type { VercelRequest, VercelResponse } from '@vercel/node';

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

  if (!REPLICATE_API_TOKEN) {
    res.status(500).json({ error: 'Missing Replicate API token' });
    return;
  }

  if (!prompt) {
    res.status(400).json({ error: 'Missing prompt' });
    return;
  }

  // 根据类型选择不同的模型和参数
  const modelConfig = type === 'video' ? {
    version: 'beecf59c4aee8d81bf04f0381033dfa10dc16e845b4ae0d281e2fa377e48a9f', // lucataco/animate-diff
    input: {
      path: "toonyou_beta3.safetensors",
      seed: Math.floor(Math.random() * 1000000), // 随机种子
      steps: 25,
      prompt: prompt,
      n_prompt: "badhandv4, easynegative, ng_deepnegative_v1_75t",
      motion_module: "mm_sd_v14",
      guidance_scale: 7.5
    }
  } : {
    version: '39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b', // stability-ai/sdxl
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
  };

  try {
    console.log('Starting API call with config:', JSON.stringify(modelConfig, null, 2));
    
    // 1. 发起prediction
    const predictionRes = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(modelConfig)
    });

    if (!predictionRes.ok) {
      const errorText = await predictionRes.text();
      console.error('Replicate API error:', errorText);
      res.status(500).json({ error: `API call failed: ${errorText}` });
      return;
    }

    const prediction = await predictionRes.json();
    console.log('Prediction started:', prediction);

    // 2. 轮询prediction状态
    let output = null;
    let status = prediction.status;
    let pollUrl = prediction.urls.get;
    let attempts = 0;
    const maxAttempts = 60; // 最多等待5分钟

    while (status !== 'succeeded' && status !== 'failed' && status !== 'canceled' && attempts < maxAttempts) {
      await new Promise(r => setTimeout(r, 3000)); // 每3秒检查一次
      attempts++;
      
      const pollRes = await fetch(pollUrl, {
        headers: { 'Authorization': `Token ${REPLICATE_API_TOKEN}` }
      });
      
      if (!pollRes.ok) {
        const errorText = await pollRes.text();
        console.error('Polling error:', errorText);
        res.status(500).json({ error: `Polling failed: ${errorText}` });
        return;
      }
      
      const pollData = await pollRes.json();
      status = pollData.status;
      output = pollData.output;
      console.log(`Attempt ${attempts}: Status = ${status}`);
    }

    if (status === 'succeeded' && output) {
      const result = {
        output: Array.isArray(output) ? output[0] : output,
        type: type,
        prompt: prompt
      };
      console.log('Generation succeeded:', result);
      res.status(200).json(result);
    } else {
      console.error('Generation failed:', { status, attempts });
      res.status(500).json({ 
        error: 'Generation failed', 
        status: status,
        attempts: attempts 
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
} 