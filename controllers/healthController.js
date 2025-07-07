import { Router } from 'express';
import dotenv from 'dotenv';
import { saveBP, getBpData, deleteBpData } from '../services/health.js';
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

// DELETE /bp
router.delete('/bp', async (req, res) => {
  const userID = req.query.id;
  const datetime = req.query.datetime;

  if (!userID || !datetime) {
    return makeResponse(res, BAD_REQUEST, false, "User ID or datetime missing in query parameters.");
  }

  try {
    const result = await deleteBpData(userID, datetime);
    if (result) {
      return makeResponse(res, SUCCESS, true, "Record deleted successfully.");
    } else {
      return makeResponse(res, BAD_REQUEST, false, "Record not found or could not be deleted.");
    }
  } catch (error) {
    console.error('Error deleting BP:', error);
    return makeResponse(res, BAD_REQUEST, false, error.message);
  }
});

export const healthController = router;
