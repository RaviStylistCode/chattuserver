import express from "express";
import {
  allUsers,
  login,
  logout,
  myProfile,
  register,
  singleuser,
  updatePassword,
} from "../controllers/user.js";
import isAuthenticated from "../middlewares/Auth.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(isAuthenticated, logout);
router.route("/myprofile").get(isAuthenticated, myProfile);
router.route("/update/password").put(isAuthenticated, updatePassword);
router.route("/:id").get(isAuthenticated, singleuser);
router.route("/all/user").get(isAuthenticated,allUsers);

export default router;
