import { Router } from "express";
import { auth, requireAdmin } from "../middleware/auth.js";
import { overview } from "../controllers/dashboardController.js";

const router = Router();
router.get("/overview", auth, requireAdmin, overview);
export default router;
