import { Router } from 'express';
import { saveWeight, getWeightData } from '../services/weight.js'; // adjust path if needed
import { makeResponse, responseMessages, statusCodes } from '../helpers/response/index.js';

const router = Router();

const FIXED_USER_ID = '68363fabfa6e794d7eac980a';

const { USER_ADDED, FETCH_USERS } = responseMessages.EN;
const { RECORD_CREATED, SUCCESS, BAD_REQUEST } = statusCodes;

router.post('/weight', async (req, res) => {
  console.log("ENTER saveWeight ==>>");
  try {
    const result = await saveWeight({ ...req.body, userID: '68363fabfa6e794d7eac980a' });
    return makeResponse(res, RECORD_CREATED, true, USER_ADDED, result);
  } catch (error) {
    return makeResponse(res, BAD_REQUEST, false, error.message);
  }
});

router.get('/weight', async (req, res) => {
  console.log("ENTER getWeight ==>>");
  try {
    const result = await getWeightData('68363fabfa6e794d7eac980a');
    return makeResponse(res, SUCCESS, true, FETCH_USERS, result);
  } catch (error) {
    return makeResponse(res, BAD_REQUEST, false, error.message);
  }
});

export const weightController = router;
