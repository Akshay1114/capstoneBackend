import { Router } from 'express';
import dotenv from 'dotenv';
import { saveBP, getBpData } from '../services/health.js';
import { makeResponse, responseMessages, statusCodes } from '../helpers/response/index.js';

dotenv.config();

const router = Router();

// Constants
const FIXED_USER_ID = "68363fabfa6e794d7eac980a";

// Response messages
const { USER_ADDED, FETCH_USERS } = responseMessages.EN;
const { RECORD_CREATED, RECORD_ALREADY_EXISTS, SUCCESS, BAD_REQUEST } = statusCodes;

// POST /bp - Uses fixed user ID
router.post('/bp', async (req, res) => {
  console.log("ENTER saveBP ==>>");
  console.log("Request Body (before override):", req.body);

  req.body.userID = FIXED_USER_ID;

  saveBP(req.body)
    .then(async (user) => {
      return makeResponse(res, RECORD_CREATED, true, USER_ADDED, user);
    })
    .catch(async (error) => {
      return makeResponse(res, RECORD_ALREADY_EXISTS, false, error.message);
    });
});

// GET /bp - Uses fixed user ID
router.get('/bp', async (req, res) => {
  console.log("ENTER getBP ==>>");

  const userID = FIXED_USER_ID;

  getBpData(userID)
    .then(async (data) => {
      return makeResponse(res, SUCCESS, true, FETCH_USERS, data);
    })
    .catch(async (error) => {
      return makeResponse(res, BAD_REQUEST, false, error.message);
    });
});

export const healthController = router;
