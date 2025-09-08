import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import { notFound, errorHandler } from "./utils/errorHandler.js";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const origins = (process.env.CORS_ORIGIN || "").split(",").map(s => s.trim()).filter(Boolean);
app.use(cors({ origin: origins.length ? origins : "*", credentials: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => res.json({ status: "ok", name: "Event Management API" }));

app.use("/api/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
