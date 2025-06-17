import { Router } from 'express';
import { makeResponse, responseMessages, statusCodes } from '../helpers/response/index.js';
import {
  addUser,
  changePassword,
  changeSchedule,
  findAllUsers,
  findUserById,
  getUsersCount,
  loginUser,
  updateUser,
  getCrewSchedule,
  requestChangeSchedule,
  getRequestSchedule,
  getProfile,
  editProfile
} from '../services/index.js';
import fs from 'fs';
import { User } from '../models/index.js';

import dotenv from 'dotenv';
dotenv.config();


const router = Router();

//Response messages
const { USER_ADDED, FETCH_USERS, UPDATE_USER, ALREADY_REGISTER, FETCH_USER, DELETE_USER,LOGIN } = responseMessages.EN;
//Response Status code
const { RECORD_CREATED, RECORD_ALREADY_EXISTS, SUCCESS, BAD_REQUEST } = statusCodes;

router.post('/saveCrew', async(req, res) => {

  console.log("ENTER saveCrew ==>>")
  // const flightsData = JSON.parse(fs.readFileSync('./flightCollection.json', 'utf-8'));
  // const flightsData = JSON.parse(fs.readFileSync('./WingJSon/flight.json', 'utf-8'));
  const flightsData = JSON.parse(fs.readFileSync('./WingJSon/pilot.json', 'utf-8'));
  
 const resp = await User.insertMany(flightsData);;
  res.send(resp)
});



export const healthController = router;
