import express from "express";
import { saveBP } from "../controllers/bpController.js";

const router = express.Router();

router.post("/", saveBP);

export default router;
