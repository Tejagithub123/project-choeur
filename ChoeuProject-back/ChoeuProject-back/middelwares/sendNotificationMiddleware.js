//aziz
const Utilisateur = require("../Models/Utilisateur");
const { io, userSocketMap } = require("../utils/socket");

// sendNotificationMiddleware.js
const sendNotificationMiddleware = async (req, res, next) => {
  // console.log(io);
  try {
    const { userId, notificationMessage } = req.notificationData;

    const user = await Utilisateur.findById(userId);
    // console.log(user);
    if (user.statut != "En congé") {
      const userSocketId = userSocketMap[userId];
      if (userSocketId) {
        io.to(userSocketId).emit("getNotification", notificationMessage);
        // console.log(notificationMessage);
      }
      const Newnotification = {
        notification: notificationMessage,
        read: false,
      };
      await Utilisateur.findOneAndUpdate(
        { _id: userId },
        { $push: { notifications: Newnotification } },
        { new: true }
      );
    }
    next();
  } catch (error) {
    console.error("Error sending notification:", error);
    if (res && res.status && res.json) {
      res
        .status(500)
        .json({ message: "Internal server error sending notification" });
    }
  }
};

module.exports = sendNotificationMiddleware;
