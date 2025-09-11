import { validationResult } from "express-validator";
import  Event  from "../models/Event.js";

export const listEvents = async (req, res) => {
  const { page = 1, limit = 12, category, dateFrom, dateTo, q } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (dateFrom || dateTo) {
    filter.date = {};
    if (dateFrom) filter.date.$gte = new Date(dateFrom);
    if (dateTo) filter.date.$lte = new Date(dateTo);
  }
  if (q) filter.$text = { $search: q };
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [items, total] = await Promise.all([
    Event.find(filter).sort({ date: 1 }).skip(skip).limit(parseInt(limit)),
    Event.countDocuments(filter)
  ]);
  res.json({ items, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
};

export const getEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json(event);
};

export const createEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const payload = { ...req.body, createdBy: req.user._id };
  const event = await Event.create(payload);
  res.status(201).json(event);
};

export const updateEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json(event);
};

export const deleteEvent = async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json({ message: "Event deleted" });
};
