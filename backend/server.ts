import dns from "node:dns/promises";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import "dotenv/config";
import express, { NextFunction, Request, Response } from 'express';
import cors from "cors";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import restaurantRouter from "./routes/restaurantRoutes.js";

const app = express();

//COnnect to MongoDB
await connectDB();


// Middleware
app.use(cors())
app.use(express.json());

const port = process.env.PORT || 5000;

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

app.use("/api/auth", authRouter)
app.use("/api/restaurants", restaurantRouter)

//Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction)=>{
    console.error("Unhandle Error", err);
    res.status(500).json({
        message: err.message || "Internal server Error",
        stack: process.env.NODE_ENV === "production" ? undefined: err.stack,
    })
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});