import { Router } from "express";
import { auth, requireAdmin } from "../middleware/auth.js";
import { registerForEvent, myRegistrations, listEventRegistrations, exportCSV } from "../controllers/registrationController.js";
import { body } from "express-validator";

const router = Router();

router.post("/", auth, [ body("eventId").notEmpty() ], registerForEvent);
router.get("/me", auth, myRegistrations);
router.get("/event/:id", auth, requireAdmin, listEventRegistrations);
router.get("/event/:id/export", auth, requireAdmin, exportCSV);

export default router;
