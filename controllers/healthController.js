import { Router } from 'express';
import dotenv from 'dotenv';
import { saveBP, getBpData } from '../services/health.js';
import { makeResponse, responseMessages, statusCodes } from '../helpers/response/index.js';

dotenv.config();

const router = Router();

// Response messages
const { USER_ADDED, FETCH_USERS } = responseMessages.EN;
const { RECORD_CREATED, RECORD_ALREADY_EXISTS, SUCCESS, BAD_REQUEST } = statusCodes;

// POST /bp - Uses userID from frontend
router.post('/bp', async (req, res) => {
  // Validate userID from frontend
  const userID = req.body.userID;
  if (!userID) {
    return makeResponse(res, BAD_REQUEST, false, "User ID missing in request body.");
  }

  // Proceed to save
  console.log(req.body,">>");
  saveBP(req.body)
    .then(async (user) => {
      return makeResponse(res, RECORD_CREATED, true, USER_ADDED, user);
    })
    .catch(async (error) => {
      return makeResponse(res, RECORD_ALREADY_EXISTS, false, error.message);
    });
});

// GET /bp - Uses userID from query params sent by frontend
router.get('/bp', async (req, res) => {
  const userID = req.query.id;
  if (!userID) {
    return makeResponse(res, BAD_REQUEST, false, "User ID missing in query parameters.");
  }

  getBpData(userID)
    .then(async (data) => {
      return makeResponse(res, SUCCESS, true, FETCH_USERS, data);
    })
    .catch(async (error) => {
      return makeResponse(res, BAD_REQUEST, false, error.message);
    });
});

export const healthController = router;
