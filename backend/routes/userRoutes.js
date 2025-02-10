import express from "express";
import { allUsers, loginUser, registerUser, updateUser, userDetails } from "../controllers/userController.js";
const router = express.Router();

router.post("/signup", registerUser)

router.post("/login", loginUser)

router.post("/update/:id", updateUser)

router.get("/details/:id", userDetails)

router.get("/allUsers", allUsers)

export default router;