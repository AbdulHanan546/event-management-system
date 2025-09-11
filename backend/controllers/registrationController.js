import User from "../models/User.js";
import Event from "../models/Event.js";

// ✅ Register current user for an event
export const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    if (!eventId)
      return res.status(400).json({ message: "eventId is required" });

    const event = await Event.findById(eventId);
    if (!event)
      return res.status(404).json({ message: "Event not found" });

    const user = await User.findById(req.user._id);

    // prevent duplicates
    if (user.registeredEvents.includes(eventId)) {
      return res
        .status(409)
        .json({ message: "Already registered for this event" });
    }

    user.registeredEvents.push(eventId);
    await user.save();

    res.status(201).json({
      message: "Registration successful",
      event: {
        id: event._id,
        title: event.title,
        date: event.date,
        location: event.location,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// ✅ Get all events current user has registered for
export const myRegistrations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("registeredEvents");
    res.json(user.registeredEvents);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch registrations", error: err.message });
  }
};

// ✅ Admin: list all users registered for a specific event
export const listEventRegistrations = async (req, res) => {
  try {
    const { id } = req.params;
    const users = await User.find({ registeredEvents: id }).select("name email");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to list registrations", error: err.message });
  }
};

// ✅ Admin: export registrations as CSV
export const exportCSV = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const users = await User.find({ registeredEvents: id }).select("name email");

    const header = ["Name", "Email", "Event", "Date", "Location"];
    const lines = [header.join(",")];

    users.forEach((u) => {
      const row = [
        (u.name || "").replaceAll(",", " "),
        u.email || "",
        event.title.replaceAll(",", " "),
        event.date ? new Date(event.date).toISOString() : "",
        (event.location || "").replaceAll(",", " "),
      ];
      lines.push(row.join(","));
    });

    const csv = lines.join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=registrations.csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: "Failed to export CSV", error: err.message });
  }
};
