import Notification from "../models/notification.model.js";

export const markAllNotificationsRead = async (req, res) => {
  try {
    // Find all unread notifications belonging to the current user.
    // Mark isRead = true using one database operation.
    // Return how many notifications were changed.

    return res.status(501).json({ success: false, message: "Finish markAllNotificationsRead" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
