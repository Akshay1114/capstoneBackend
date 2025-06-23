import { Router } from 'express';
import { makeResponse, responseMessages, statusCodes } from '../helpers/response/index.js';
import { createClient } from '@supabase/supabase-js';

import dotenv from 'dotenv';
dotenv.config();


const router = Router();

//Response messages
const { USER_ADDED, FETCH_USERS, UPDATE_USER, ALREADY_REGISTER, FETCH_USER, DELETE_USER,LOGIN } = responseMessages.EN;
//Response Status code
const { RECORD_CREATED, RECORD_ALREADY_EXISTS, SUCCESS, BAD_REQUEST } = statusCodes;


const SUPABASE_URL = 'https://loqjctqlroqrvxfoqdjr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvcWpjdHFscm9xcnZ4Zm9xZGpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDQ2NzU0OSwiZXhwIjoyMDY2MDQzNTQ5fQ.WXqUyU6JOeBeK-4a4Y7yRCUDLWRQc2sZ_lSIuBGbrAo';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
router.post('/', async (req, res) => {
    console.log("ENTER saveUser ==>>");
    // res.status(200).json({ message: 'Image upload endpoint is not implemented yet.' });
    try {
      const { base64, fileName, contentType } = req.body;
  console.log("base64", base64);
      if (!base64 || !fileName || !contentType) {
        return res.status(400).json({ error: 'Missing parameters' });
      }
  
      const buffer = Buffer.from(base64, 'base64');
  
      const { error } = await supabase.storage
        .from('images')
        .upload(fileName, buffer, {
          contentType,
          upsert: false,
        });
  
      if (error) {
        return res.status(500).json({ error: error.message });
      }
  
      const { data } = supabase.storage.from('images').getPublicUrl(fileName);
  
      res.json({ publicUrl: data.publicUrl });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });






export const imageController = router;
