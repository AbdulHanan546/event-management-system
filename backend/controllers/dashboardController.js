import Event from "../models/Event.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

export const overview = async (req, res) => {
  try {
    const [totalEvents, users, latestMessages] = await Promise.all([
      Event.countDocuments(),
      User.find({}, "registeredEvents"),
      Message.find().sort({ createdAt: -1 }).limit(5),
    ]);

    // Count total registrations across all users
    const totalRegistrations = users.reduce(
      (sum, u) => sum + (u.registeredEvents?.length || 0),
      0
    );

    res.json({
      totalEvents,
      totalRegistrations,
      latestMessages,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to load overview", error: err.message });
  }
};
