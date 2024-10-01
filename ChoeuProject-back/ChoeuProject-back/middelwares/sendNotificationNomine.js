const { io, userSocketMap } = require("../utils/socket");
const Utilisateur = require("../Models/Utilisateur");

const sendNotificationNomine = async (req, res, next) => {
  try {
    const { selectedNominees } = req.body;

    // Fetch updated nominees
    const updatedNominees = await Utilisateur.find({
      _id: { $in: selectedNominees },
      etat: "Nominé",
    });

    for (const user of updatedNominees) {
      const userSocketId = userSocketMap[user._id];
      const notificationMessage = "Votre état a changé à Nominé.";

      // Check if the notification already exists
      const notificationExists = user.notifications.some(
        (notification) => notification.notification === notificationMessage
      );

      if (!notificationExists) {
        const newNotification = {
          notification: notificationMessage,
          read: false,
        };

        user.notifications.push(newNotification);
        await user.save();
      }

      if (userSocketId) {
        io.to(userSocketId).emit("getNotification", notificationMessage);
      }
    }

    next();
  } catch (error) {
    console.error("Error sending notification:", error);
    res
      .status(500)
      .json({ message: "Internal server error sending notification" });
  }
};

module.exports = sendNotificationNomine;
