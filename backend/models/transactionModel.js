import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  price: {
    type: Number,
    set: (value) => parseFloat(value.toFixed(2)),
  },
  category: String,
  sold: Boolean,
  dateOfSale: Date,
  image: String,
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
