// backend/server.ts
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import exoplanetRoutes from './routes/exoplanetRoutes';
import neoRoutes from './routes/neoRoutes';
import insightRoutes from './routes/insightRoutes';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';


dotenv.config();

const app: Express = express();

// Allow CORS from all origins
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: false, // Set to true if cookies/auth headers are needed
}));

app.use(express.json());

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('combined')); // Request logging
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: { error: { message: 'Too many requests', status: 429 } },
  })
);
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

connectDB();

app.use('/api/exoplanets', exoplanetRoutes);
app.use('/api/neo', neoRoutes);
app.use('/api/insights', insightRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const status = (err as any).status || 500;
  res.status(status).json({ error: { message: err.message, status } });
});

const PORT: number = parseInt(process.env.PORT || '3000', 10);
app.listen(PORT, () => {
  console.log(`Server running-port ${PORT}`);
});

export default app;