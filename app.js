import express from "express";
import { connectDB } from "./src/config/database.js";
import cookieParser from "cookie-parser";

const app =  express();
const PORT= process.env.PORT || 3700;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const startServer = async ()=>{
    await connectDB();
    app.listen(PORT, async()=>{
    console.log(`servidor escuchando en el puerto ${PORT}`);
    });
};

startServer();
