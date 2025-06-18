import express from "express";

import { signup, login, logout, updatecreds } from "../../controllers/authController.js";

const router = express.Router();
router.post("/signup",signup );

router.post("/login",login);

router.post("/logout", logout);

router.patch("/update", protectRoute , updatecreds);

export default router;
