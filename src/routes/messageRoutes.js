import express from "express";

import {
  sendMessage,
  getMessages,
  markMessagesSeen,
  deleteMessage,
  editMessage,
} from "../controllers/messageController.js";

import upload from "../middleware/upload.js";

const router =
  express.Router();

router.post(
  "/send",
  sendMessage
);

router.delete(
  "/:id",
  deleteMessage
);

router.put(
  "/edit/:id",
  editMessage
);

router.get(
  "/:senderId/:receiverId",
  getMessages
);

router.put(
  "/seen",
  markMessagesSeen
);

router.post(
  "/upload",
  upload.single("image"),
  (req, res) => {
    res.status(200).json({
      success: true,

      imageUrl:
        `/uploads/${req.file.filename}`,
    });
  }
);

export default router;