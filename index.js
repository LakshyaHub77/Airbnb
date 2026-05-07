import dotenv from "dotenv";
dotenv.config();  // Load env variables ASAP

import express from "express";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import listingRouter from "./routes/listing.routes.js";
import bookingRouter from "./routes/booking.routes.js";

// Rest of your code unchanged
let port = process.env.PORT || 5000;
const app = express();

app.use(cookieParser());
app.use(cors({
  origin: "https://air-bnb-frontend-three.vercel.app",
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/listing", listingRouter);
app.use("/api/booking", bookingRouter);

app.get("/", (req, res) => {
  res.send("Airbnb backend is running");
});

app.listen(port, () => {
  connectDb();
  console.log("Server is running on port " + port);
});
