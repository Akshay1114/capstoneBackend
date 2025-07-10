import { Router } from 'express';
import { saveWeight, getWeightData, deleteWeightData } from '../services/weight.js';
import { makeResponse, responseMessages, statusCodes } from '../helpers/response/index.js';

const router = Router();

const { USER_ADDED, FETCH_USERS } = responseMessages.EN;
const { RECORD_CREATED, SUCCESS, BAD_REQUEST } = statusCodes;

// POST /weight 
router.post('/weight', async (req, res) => {
  console.log("ENTER saveWeight ==>>");
  console.log("Request Body (incoming):", req.body);

  const userID = req.body.userID;
  if (!userID) {
    return makeResponse(res, BAD_REQUEST, false, "User ID missing in request body.");
  }

  try {
    const result = await saveWeight(req.body);
    return makeResponse(res, RECORD_CREATED, true, USER_ADDED, result);
  } catch (error) {
    return makeResponse(res, BAD_REQUEST, false, error.message);
  }
});

// GET /weight 
router.get('/weight', async (req, res) => {
  console.log("ENTER getWeight ==>>");

  const userID = req.query.id;
  if (!userID) {
    return makeResponse(res, BAD_REQUEST, false, "User ID missing in query parameters.");
  }

  try {
    const result = await getWeightData(userID);
    return makeResponse(res, SUCCESS, true, FETCH_USERS, result);
  } catch (error) {
    return makeResponse(res, BAD_REQUEST, false, error.message);
  }
});

// DELETE /weight
router.delete('/weight', async (req, res) => {
  const userID = req.query.id;
  const date = req.query.date;

  if (!userID || !date) {
    return makeResponse(res, BAD_REQUEST, false, "User ID or date missing in query parameters.");
  }

  try {
    const result = await deleteWeightData(userID, date);
    if (result) {
      return makeResponse(res, SUCCESS, true, "Record deleted successfully.");
    } else {
      return makeResponse(res, BAD_REQUEST, false, "Record not found or could not be deleted.");
    }
  } catch (error) {
    console.error('Error deleting weight:', error);
    return makeResponse(res, BAD_REQUEST, false, error.message);
  }
});

export const weightController = router;
