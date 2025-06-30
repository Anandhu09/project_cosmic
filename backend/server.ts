import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import exoplanetRoutes from "./routes/exoplanetRoutes";
import neoRoutes from "./routes/neoRoutes";
import insightRoutes from "./routes/insightRoutes";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

dotenv.config();

const app: Express = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://project-cosmic.vercel.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());

app.use(helmet());
app.use(morgan("combined"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: { message: "Too many requests", status: 429 } },
  })
);
app.use(express.json());

connectDB();

app.use("/api/exoplanets", exoplanetRoutes);
app.use("/api/neo", neoRoutes);
app.use("/api/insights", insightRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const status = (err as any).status || 500;
  res.status(status).json({ error: { message: err.message, status } });
});

const PORT: number = parseInt(process.env.PORT || "3000", 10);
app.listen(PORT, () => {
  console.log(`Server running-port ${PORT}`);
});

export default app;
