// API route for handling 3D Animation API integration
// Will need to be replaced with actual API key and endpoints

import { IncomingForm } from 'formidable';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import fs from 'fs';
import path from 'path';
import FormData from 'form-data'; // Use form-data library to stream files

export const config = {
  api: {
    bodyParser: false,
  },
};

const DEEPMOTION_API_KEY = process.env.DEEPMOTION_API_KEY;
const DEEPMOTION_API_URL = 'https://api.deepmotion.com/v2/motion';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'You must be signed in to generate animations.' });
  }

  if (!DEEPMOTION_API_KEY) {
    console.error("DeepMotion API key is not configured.");
    return res.status(500).json({ error: 'Service is not configured correctly.' });
  }

  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).json({ error: 'Error processing your request.' });
    }

    const file = files.file;
    if (!file) {
      return res.status(400).json({ error: 'Missing file.' });
    }

    try {
      const fileStream = fs.createReadStream(file.filepath);
      const apiFormData = new FormData();
      apiFormData.append('file', fileStream);
      
      console.log('Sending file to DeepMotion API...');

      const apiResponse = await fetch(DEEPMOTION_API_URL, {
        method: 'POST',
        headers: {
          'x-api-key': DEEPMOTION_API_KEY,
          ...apiFormData.getHeaders()
        },
        body: apiFormData,
      });

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error('DeepMotion API Error:', errorText);
        throw new Error(`DeepMotion API failed with status: ${apiResponse.status}`);
      }

      const result = await apiResponse.json();
      console.log('Successfully received response from DeepMotion:', result);
      
      // IMPORTANT: DeepMotion API is asynchronous. It returns a job ID.
      // You would typically store this job ID and then poll another endpoint
      // or use a webhook to get the final animation URL when it's ready.
      // For now, to keep the frontend working, we will LOG the real job ID
      // but still return the MOCK video URL.
      console.log(`DeepMotion job started with ID: ${result.id}`);
      
      const mockResultUrl = '/animations/result.mp4'; 
      return res.status(200).json({ animationUrl: mockResultUrl });

    } catch (error) {
      console.error('Failed to call DeepMotion API:', error);
      return res.status(500).json({ error: 'Failed to process animation.' });
    } finally {
      // Clean up the temporarily uploaded file
      fs.unlink(file.filepath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting temp file:", unlinkErr);
        }
      });
    }
  });
} 