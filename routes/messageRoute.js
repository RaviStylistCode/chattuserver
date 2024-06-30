import express from "express";
import isAuthenticated from "../middlewares/Auth.js";
import { GetMessage, sendMessage } from "../controllers/message.js";

const router=express.Router();
router.route("/send/:id").post(isAuthenticated,sendMessage);
router.route("/getmessage/:id").get(isAuthenticated,GetMessage);

export default router;