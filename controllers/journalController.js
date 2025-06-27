import { Router } from 'express';
import { makeResponse, responseMessages, statusCodes } from '../helpers/response/index.js';

import fs from 'fs';
import { User } from '../models/index.js';

import dotenv from 'dotenv';
import { getJournal, saveJournal, getJournalById } from '../services/journal.js';
dotenv.config();


const router = Router();

//Response messages
const { USER_ADDED, FETCH_USERS, UPDATE_USER, ALREADY_REGISTER, FETCH_USER, DELETE_USER,LOGIN } = responseMessages.EN;
//Response Status code
const { RECORD_CREATED, RECORD_ALREADY_EXISTS, SUCCESS, BAD_REQUEST } = statusCodes;

router.post('/', async(req, res) => {

  console.log("ENTER saveCrew ==>>")
  
  saveJournal(req.body)
  .then(async user => {
    return makeResponse(
      res,
      RECORD_CREATED,
      true,
      USER_ADDED,
      user
    );
  })
  .catch(async error => {
    return makeResponse(
      res,
      RECORD_ALREADY_EXISTS,
      false,
      error.message
    );
  });
});

router.get('/', async(req, res) => {
  console.log("ENTER getBP ==>>", req.query.id)
  
  getJournal(req.query.id)
  .then(async data => {
    return makeResponse(
      res,
      SUCCESS,
      true,
      FETCH_USERS,
      data
    );
  })
  .catch(async error => {
    return makeResponse(
      res,
      BAD_REQUEST,
      false,
      error.message
    );
  });
}
);

router.get('/byId', async(req, res) => {
  console.log("ENTER getBP ==>>", req.query.id)
  
  getJournalById(req.query.id)
  .then(async data => {
    return makeResponse(
      res,
      SUCCESS,
      true,
      FETCH_USERS,
      data
    );
  })
  .catch(async error => {
    return makeResponse(
      res,
      BAD_REQUEST,
      false,
      error.message
    );
  });
}
);



export const journalController = router;
