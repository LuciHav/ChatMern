import express from "express";

import { signup, login, logout, updatecreds , checkAuth } from "../../controllers/authController.js";
import { protectRoute } from "../../middleware/authMiddleware.js";

const router = express.Router();
router.post("/signup",signup );

router.post("/login",login);

router.post("/logout", logout);

router.patch("/update", protectRoute , updatecreds);


 
router.get("/protected", protectRoute, checkAuth )

export default router;
