import { Router } from "express";
import { body } from "express-validator";
import { createMessage, listMessages } from "../controllers/messageController.js";
import { auth, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/", [
  body("name").notEmpty(),
  body("email").isEmail(),
  body("message").notEmpty()
], createMessage);

router.get("/", auth, requireAdmin, listMessages);

export default router;
