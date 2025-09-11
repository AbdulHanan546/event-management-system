import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import messageRoutes from "./routes/messageRoutes.js"
import registrationRoutes from "./routes/registrationRoutes.js"
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
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/events",eventRoutes)
app.use("/api/messages",messageRoutes)
app.use("/api/registartions",registrationRoutes)

app.use(notFound);
app.use(errorHandler);

export default app;
