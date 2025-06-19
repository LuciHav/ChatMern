import express from 'express';
import {protectRoute}from '../../middleware/authMiddleware.js';
const router = express.Router();
import { getMessages, getusers, sendMessage, deleteMessage } from '../../controllers/messagesController.js';



router.get("/", protectRoute, getusers )
router.get("/:id", protectRoute, getMessages)
router.post("/send/:id",protectRoute, sendMessage)
router.delete("/delete/:id",protectRoute, deleteMessage)
export default router;

