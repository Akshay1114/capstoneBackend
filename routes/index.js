// routes/index.js
import express from 'express';
import userRoutes from '../controllers/index.js';
import { healthController } from '../controllers/healthController.js';
import { imageController } from '../controllers/imageController.js';
import { journalController } from '../controllers/journalController.js';
import { notificationController } from '../controllers/notificationController.js';

const router = express.Router();

router.use('/user', userRoutes);
router.use('/userHealth', healthController);
router.use('/uploadImage', imageController);
router.use('/journal', journalController);
router.use('/getNotification', notificationController);

export default router; // ✅ default export
