import User from "../models/User.js";

export const getUsers =
  async (req, res) => {
    try {
      const users =
        await User.find().select(
          "-password"
        );

      res.status(200).json({
        success: true,
        users,
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

  export const updateAvatar =
  async (req, res) => {
    try {
      const {
        userId,
      } = req.body;

      const avatar =
        `/uploads/${req.file.filename}`;

      const user =
        await User.findByIdAndUpdate(
          userId,
          { avatar },
          { new: true }
        ).select(
          "-password"
        );

      res.status(200).json({
        success: true,
        user,
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

  export const updateTheme = async (req, res) => {
  try {
    const { userId, theme } = req.body;

    if (!["light", "dark"].includes(theme)) {
      return res.status(400).json({
        success: false,
        message: "Invalid theme",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { theme },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};