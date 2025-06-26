import { Router } from 'express';

import { userController } from '../controllers/index.js';
import { notificationController } from '../controllers/notificationController.js';
import { healthController } from '../controllers/healthController.js';
import { imageController } from '../controllers/imageController.js';
import { journalController } from '../controllers/journalController.js';
// import { verifyToken} from './middleware/verifyToken.js'

const router = Router();

router.use('/user', userController);
// router.use('/v1', verifyToken)
// use /v1 for user authientication and authorization

router.use('/uploadImage', imageController)

router.use('/userHealth', healthController)

router.use('/journal', journalController)

router.use('/getNotification', notificationController)
export { router };

//  LOG  Weight entry added: {"date": "2025-06-19", "unit": "kg", "value": "120"}
//  LOG  All weight entry keys: ["value", "unit", "date"]