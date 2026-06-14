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

console.log("CLIENT_URL =", ENV.CLIENT_URL);

//middlewares
app.use(express.json());
app.use(cors({
  origin: [
    ENV.CLIENT_URL,
    "http://localhost:5173",
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

app.get("/api/debug-auth", (req, res) => {
  res.json({
    authorization: req.headers.authorization || null,
    headers: req.headers,
  });
});

// make our app ready for deployment
app.get("/api/debug-auth", (req, res) => {
  res.json({
    auth: req.auth ? req.auth() : null,
    headers: {
      authorization: req.headers.authorization,
      cookie: req.headers.cookie,
    },
  });
});

app.get("/api/clerk-test", (req, res) => {
  try {
    const auth = req.auth?.();

    res.json({
      auth,
      secretExists: !!process.env.CLERK_SECRET_KEY,
    });
  } catch (err) {
    res.json({
      error: err.message,
      secretExists: !!process.env.CLERK_SECRET_KEY,
    });
  }
});

app.get("/api/debug-session", (req, res) => {
  res.json({
    cookie: req.headers.cookie || null,
  });
});



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