import { Router } from "express";
import { body } from "express-validator";
import { listEvents, getEvent, createEvent, updateEvent, deleteEvent } from "../controllers/eventController.js";
import { auth, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", listEvents);
router.get("/:id", getEvent);

router.post("/", auth, requireAdmin, [
  body("title").notEmpty(),
  body("description").notEmpty(),
  body("category").isIn(["conference", "wedding", "party", "workshop"]),
  body("location").notEmpty(),
  body("date").isISO8601().toDate(),
  body("price").optional().isFloat({ min: 0 })
], createEvent);

router.put("/:id", auth, requireAdmin, [
  body("title").optional().notEmpty(),
  body("description").optional().notEmpty(),
  body("category").optional().isIn(["conference", "wedding", "party", "workshop"]),
  body("location").optional().notEmpty(),
  body("date").optional().isISO8601().toDate(),
  body("price").optional().isFloat({ min: 0 })
], updateEvent);

router.delete("/:id", auth, requireAdmin, deleteEvent);

export default router;
