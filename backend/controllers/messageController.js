import { validationResult } from "express-validator";
import Message  from "../models/Message.js";

export const createMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const msg = await Message.create(req.body);
  res.status(201).json(msg);
};

export const listMessages = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [items, total] = await Promise.all([
    Message.find().sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
    Message.countDocuments()
  ]);
  res.json({ items, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
};
