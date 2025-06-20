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

router.put('/updateUser', async(req, res) => {
  console.log("ENTER updateUser")
  const userData = req.body;

    // Change this filter to your unique identifier (email, _id, username, etc.)
    const filter = { employee_ID: userData.employee_ID };

    // Destructure fields you want to exclude
    const { email, password, ...fieldsToUpdate } = userData;

    const update = { $set: fieldsToUpdate };

    const result = await User.updateOne(filter, update, { upsert: false }); // upsert: false = only update existing

    res.status(200).send({
      message: 'User updated successfully (excluding email & password)',
      result: result
    });
}
);

// //Add User
// router.post('/signup', async(req, res) => {
//   console.log("ENTER HERE IN SIGNUP ==>>>>")
//   addUser(req.body)
//             .then(async user => {
//               return makeResponse(
//                 res,
//                 RECORD_CREATED,
//                 true,
//                 USER_ADDED,
//                 user
//               );
//             })
//             .catch(async error => {
//               return makeResponse(
//                 res,
//                 RECORD_ALREADY_EXISTS,
//                 false,
//                 error.message
//               );
//             });
 
// });

router.get('/crewSchedule', async(req, res) => {
  console.log(req.query)
  getCrewSchedule(req.query.id)
  .then(async user => {
      return makeResponse(
      res,
      RECORD_CREATED,
      true,
      FETCH_USERS,
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


// Login User
router.post('/login', async (req, res) => {
  console.log("ENTER HERE IN LOGIN")
    try{
      console.log(req.body)
      loginUser(req.body)
      .then(async user => {
        return makeResponse(
          res,
          RECORD_CREATED,
          true,
          LOGIN,
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
    } catch (error) {
      return makeResponse(
        res,
        RECORD_ALREADY_EXISTS,
        false,
        error.message
      );
    }
  
});

//userProfile
router.post('/userProfile', async (req, res) => {
  console.log("ENTER HERE IN USER PROFILE")
  try{
    console.log(req.body)
    getProfile(req.body)
      .then(async user => {
        return makeResponse(
          res,
          RECORD_CREATED,
          true,
          FETCH_USERS,
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
  } catch (error) {
    return makeResponse(
      res,
      RECORD_ALREADY_EXISTS,
      false,
      error.message
    );
  }
})

router.post('/editProfile', async (req, res) => {
  console.log("ENTER HERE IN EDIT PROFILE")
  try{
    editProfile(req.body)
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
  } catch (error) {
    return makeResponse(
      res,
      RECORD_ALREADY_EXISTS,
      false,
      error.message
    );
  }
})

// request to change schedule save request
router.post('/requestChangeSchedule', async (req, res) => {
  console.log("ENTER HERE IN REQUEST CHANGE SCHEDULE")
  requestChangeSchedule(req.body)
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

// get request change schedule
router.get('/getRequestChangeSchedule', async (req, res) => {
  console.log("ENTER HERE IN GET REQUEST CHANGE SCHEDULE")
  const { id } = req.query;
  console.log('id', id)
  getRequestSchedule(id)
    .then(async user => {
      return makeResponse(
        res,
        RECORD_CREATED,
        true,
        FETCH_USERS,
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
//  change schedule
router.post('/changeSchedule', async (req, res) => {
  console.log("ENTER HERE IN CHANGE SCHEDULE")
  changeSchedule(req.body)
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

router.post('/changePassword', async (req, res) => {
  console.log("ENTER HERE IN CHANGE PASSWORD")
  changePassword(req.body)
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
//Update user
router.put("/:id", (req, res) => {
  const { id } = req.params;
  updateUser(id, req.body)
    .then(async (user) => {
      return makeResponse(
        res,
        SUCCESS,
        true,
        UPDATE_USER,
        user
      );
    })
    .catch(async (error) => {
      return makeResponse(
        res,
        BAD_REQUEST,
        false, error.message);
    });
});

//Get user by Id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  findUserById({ _id: id })
    .then(user => {
      return makeResponse(
        res,
        SUCCESS,
        true,
        FETCH_USER,
        user
      );
    })
    .catch(async (error) => {
      return makeResponse(
        res,
        BAD_REQUEST,
        false, error.message
      );
    });
});


//Find all user
router.get("/", (req, res) => {

  let page = 1, limit = 10, skip = 0
  let regx = new RegExp(req.query.search ? req.query.search : '')
  if (req.query.page) page = req.query.page
  if (req.query.limit) limit = req.query.limit
  skip = (page - 1) * limit

  //created common searching object for find all user and user count
  let searchingUser = {
    isDeleted: false,
    role: { $ne: "admin" },
    $or: [
      { employee_ID: { '$regex': regx, $options: 'i' } },
      { name: { '$regex': regx, $options: 'i' } }
    ]
  };

  findAllUsers(searchingUser, parseInt(skip), parseInt(limit))
    .then(async (user) => {
      let userCount = await getUsersCount(searchingUser);
      return makeResponse(
        res,
        SUCCESS,
        true,
        FETCH_USERS, user, {
        current_page: page,
        total_records: userCount,
        total_pages: Math.ceil(userCount / limit)
      });
    })
    .catch(async (error) => {
      return makeResponse(
        res,
        BAD_REQUEST,
        false, error.message);
    });
});

//Delete User
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  console.log('id', id)
  res.send('Hello World')
  // deleteUser(id)
  //   .then(async () => {
  //     return makeResponse(
  //       res,
  //       SUCCESS,
  //       true,
  //       DELETE_USER
  //     );
  //   })
  //   .catch(async (error) => {
  //     return makeResponse(
  //       res,
  //       BAD_REQUEST,
  //       false, error.message);
  //   });
});


export const userController = router;
