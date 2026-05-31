import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
import cors from "cors";
import {serve} from "inngest/express";
import { connectDB } from "./lib/db.js";
import { inngest,functions } from "./lib/inngest.js";
import { clerkMiddleware } from '@clerk/express';
import { protectRoute } from "./middleware/protectRoute.js";
import chatRoutes from "../src/routes/chatRoutes.js";
import sessionRoutes from "../src/routes/sessionRoutes.js";
import codeExecutionRoutes from "./routes/codeExecutionRoutes.js";


const app = express();
const __dirname = path.resolve();


const PORT = ENV.PORT || 3000;

//middlewares
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://intervue-x-eosin.vercel.app"
  ],
  credentials: true,
}));

app.use(clerkMiddleware());

// DEBUG LOGS

app.use((req, res, next) => {
  console.log("========== REQUEST ==========");
  console.log("PATH:", req.path);

  try {
    console.log("AUTH:", req.auth()?.userId);
  } catch (err) {
    console.log("AUTH ERROR:", err.message);
  }

  next();
});

app.use("/api/inngest" , serve({client: inngest, functions}));

app.use("/api/inngest" , serve({client: inngest, functions}));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/code", codeExecutionRoutes);

app.get("/api/test-auth", protectRoute, (req, res) => {
  res.json({
    success: true,
    clerkId: req.user.clerkId,
  });
});

app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});

app.get("/health" , (req,res)=>{
    res.status(200).json({msg:"success from backend"})
})



// make our app ready for deployment




const startServer = async()=>{
  try {
    await connectDB();
    app.listen(PORT, ()=>{
    console.log(`server is listening at port ${PORT}`);
  })

  } catch (error) {
    console.error("server connection failed", error);
  }

}

startServer();