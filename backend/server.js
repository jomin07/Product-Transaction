import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import transactionRoute from "./routes/transactionRoute.js";
import seedDatabase from "./seed/seedDatabase.js";
import cors from "cors";

dotenv.config();

connectDB()
  .then(() => {
    return seedDatabase();
  })
  .then(() => {
    console.log("Database seeding completed");
  })
  .catch((error) => {
    console.error("Error during database seeding:", error);
    process.exit(1);
  });

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

app.use("/api/transaction", transactionRoute);

app.listen(PORT, () => {
  console.log("Server Started");
});
