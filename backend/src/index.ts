import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import appraisalRoutes from "./routes/appraisals";
import dashboardRoutes from "./routes/dashboardRoutes"; 
import employeeRoutes from "./routes/employeeRoutes";
import departmentRoutes from "./routes/departmentRoutes";
import userRoutes from "./routes/userRoutes";
import appraisalRoute from "./routes/appraisalRoute";
import settingsRoutes from "./routes/settingsRoutes";
import supervisorDashRoutes  from "./routes/supervisorDashRoutes";
import { db } from "./config/db";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/auth", appraisalRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/appraisals", appraisalRoute);
app.use("/api/settings", settingsRoutes);
app.use("/api/supervisor", supervisorDashRoutes)


db.connect()
  .then(() => console.log("✅ Connected to PostgreSQL DB"))
  .catch((err) => console.error("❌ Database connection error:", err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
