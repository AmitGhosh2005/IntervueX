import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
import cors from "cors";
import {serve} from "inngest/express";
import { connectDB } from "./lib/db.js";
import { inngest,functions } from "./lib/inngest.js";


const app = express();
const __dirname = path.resolve();


const PORT = ENV.PORT || 3000;

//middlewares
app.use(express.json());
app.use(cors({origin:ENV.CLIENT_URL,credentials:true}));

app.use("api/inngest" , serve({client: inngest, functions}));

app.get("/health" , (req,res)=>{
    res.status(200).json({msg:"success from backend"})
})

app.get("/books" , (req,res)=>{
    res.status(200).json({msg:"welcome to books"})
});

// make our app ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}



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