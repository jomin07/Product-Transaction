import express from "express";
import {
  getCombinedData,
  getPieChartData,
  getTransactionChartData,
  getTransactionStatistics,
  listTransactions,
} from "../controllers/transactionController.js";

const router = express.Router();

router.get("/", listTransactions);

router.get("/statistics", getTransactionStatistics);

router.get("/chart", getTransactionChartData);

router.get("/pie-chart", getPieChartData);

router.get("/combined", getCombinedData);

export default router;
