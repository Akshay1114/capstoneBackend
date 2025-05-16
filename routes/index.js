import { Router } from 'express';

import { userController } from '../controllers/index.js';
import { notificationController } from '../controllers/notificationController.js';
// import { verifyToken} from './middleware/verifyToken.js'

const router = Router();

router.use('/user', userController);
// router.use('/v1', verifyToken)
router.use('/getNotification', notificationController)
export { router };