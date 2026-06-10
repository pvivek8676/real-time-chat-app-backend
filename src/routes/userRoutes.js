import express from "express";

import {
  getUsers,
  updateAvatar,
  updateTheme,
} from "../controllers/userController.js";

import upload from "../middleware/upload.js";

const router =
  express.Router();

router.get(
  "/",
  getUsers
);

router.put(
  "/avatar",
  upload.single("avatar"),
  updateAvatar
);

router.put(
  "/theme",
  updateTheme
);

export default router;