import { Router } from 'express';

import { userController } from '../controllers/index.js';
import { notificationController } from '../controllers/notificationController.js';
import { healthController } from '../controllers/healthController.js';
// import { verifyToken} from './middleware/verifyToken.js'

const router = Router();

router.use('/user', userController);
// router.use('/v1', verifyToken)
// use /v1 for user authientication and authorization

router.use('userHealth', healthController)

router.use('/getNotification', notificationController)
export { router };