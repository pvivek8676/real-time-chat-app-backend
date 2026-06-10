import Message from "../models/Message.js";
import { getIO } from "../socket/socket.js";

export const sendMessage =
  async (req, res) => {
    try {
      const {
  senderId,
  receiverId,
  text,
  image,
} = req.body;

      const message =
  await Message.create({
    sender: senderId,
    receiver:
      receiverId,

    text,

    image:
      image || "",
  });

        console.log(
  "EMIT:",
  message.text
);

        getIO().emit(
  "receive_message",
  message
);


      res.status(201).json({
        success: true,
        message,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Server Error",
      });
    }
  };

export const getMessages =
  async (req, res) => {
    try {
      const {
        senderId,
        receiverId,
      } = req.params;

      const messages =
        await Message.find({
          $or: [
            {
              sender:
                senderId,
              receiver:
                receiverId,
            },
            {
              sender:
                receiverId,
              receiver:
                senderId,
            },
          ],
        }).sort({
          createdAt: 1,
        });

      res.status(200).json({
        success: true,
        messages,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Server Error",
      });
    }
  };

  export const markMessagesSeen =
  async (req, res) => {
    try {
      const {
        senderId,
        receiverId,
      } = req.body;

      await Message.updateMany(
        {
          sender: senderId,
          receiver:
            receiverId,

          seen: false,
        },
        {
          seen: true,
        }
      );

      console.log(
  "MESSAGES SEEN:",
  senderId,
  receiverId
);

      getIO().emit(
  "messages_seen",
  {
    senderId,
    receiverId,
  }
);

      res.status(200).json({
        success: true,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Server Error",
      });
    }
  };

  export const deleteMessage =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      await Message.findByIdAndDelete(
        id
      );

      getIO().emit(
        "message_deleted",
        id
      );

      res.status(200).json({
        success: true,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Server Error",
      });
    }
  };

  export const editMessage =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const { text } =
        req.body;

      const message =
        await Message.findByIdAndUpdate(
          id,
          {
            text,
            edited: true,
          },
          {
            new: true,
          }
        );

      getIO().emit(
        "message_edited",
        message
      );

      res.status(200).json({
        success: true,
        message,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Server Error",
      });
    }
  };