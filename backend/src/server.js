import express from "express";
import { ENV } from "./lib/env.js";

const app = express();

const PORT = ENV.PORT || 3000;

app.get("/" , (req,res)=>{
    res.status(200).json({msg:"success from backend"})
})

app.listen(PORT, ()=>{
    console.log(`server is listening at port ${PORT}`);
})