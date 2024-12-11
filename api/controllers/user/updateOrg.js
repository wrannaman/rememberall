import { pg } from '../../connections/index.js';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import OpenAI from 'openai';


export default async (req, res) => {
  const { User, Org } = pg.models
  try {
    const { openai_url, openai_api_key, openai_model } = req.body
    const org = await Org.findOne({ where: { id: req.user.OrgId } });
    if (!org) return res.status(404).json({ error: 'Org not found' });
    if (openai_url && openai_api_key) {
      // call openai to test the api key
      try {
        const openai = new OpenAI({
          apiKey: openai_api_key === '********' ? req.user?.Org?.openai_api_key : openai_api_key,
          baseURL: openai_url || "https://api.openai.com/v1",
        });
        const response = await openai.chat.completions.create({
          messages: [{ role: 'user', content: 'Say this is a test' }],
          model: openai_model || 'gpt-4o',
        });
        console.log("response:", response)
      } catch (e) {
        console.error('openai api key error ', e)
        return res.json({ error: 'invalid api key or url' })
      }
      org.openai_url = openai_url
      org.openai_api_key = openai_api_key
      await org.save()
    }
    return res.json({ success: true });
  } catch (e) {
    console.error('update org error ', e)
    return res.json({ error: e.message })
  }
};
