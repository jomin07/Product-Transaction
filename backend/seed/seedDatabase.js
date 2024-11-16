import axios from "axios";
import Transaction from "../models/transactionModel.js";
import dotenv from "dotenv";

dotenv.config();

const API_URL = process.env.API_URL;

const seedDatabase = async () => {
  try {
    console.log("Fetching data from the third-party API...");
    const { data } = await axios.get(API_URL);

    console.log("Seeding data into the database...");
    await Transaction.deleteMany();
    await Transaction.insertMany(data);

    console.log("Database successfully seeded!");
  } catch (error) {
    console.error("Error seeding the database:", error);
  }
};

export default seedDatabase;
