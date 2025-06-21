import express from "express";
import { saveKick, getKicks, deleteKick } from "../controllers/kickController.js";

const router = express.Router();

router.post("/", saveKick);
router.get("/", getKicks);
router.get("/date/:userId", getKicks);
router.delete("/:id", deleteKick);

export default router;
