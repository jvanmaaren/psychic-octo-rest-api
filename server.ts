import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import subscribersRouter from "./routes/subscribers";

dotenv.config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL as string);
const db = mongoose.connection;

db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(express.json());

app.use("/subscribers", subscribersRouter);

app.listen(3030, () => {
  console.log("server started");
});
