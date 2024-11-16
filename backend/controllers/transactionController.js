import Transaction from "../models/transactionModel.js";

export const listTransactions = async (req, res) => {
  try {
    const { month, search = "", page = 1, perPage = 10 } = req.query;

    const monthMap = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };

    const monthNumber = monthMap[month];

    if (!monthNumber) {
      return res.status(400).json({ message: "Invalid month parameter" });
    }

    const query = {
      $expr: {
        $and: [{ $eq: [{ $month: "$dateOfSale" }, monthNumber] }],
      },
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$price" },
              regex: search,
              options: "i",
            },
          },
        },
      ];
    }

    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(Number(perPage));

    const totalDocuments = await Transaction.countDocuments(query);

    res.status(200).json({ transactions, totalDocuments });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getTransactionStatistics = async (req, res) => {
  try {
    const { month } = req.query;

    const monthMap = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };

    const monthNumber = monthMap[month];

    if (!monthNumber) {
      return res.status(400).json({ message: "Invalid month parameter" });
    }

    const matchQuery = {
      $expr: {
        $eq: [{ $month: "$dateOfSale" }, monthNumber],
      },
    };

    const statistics = await Transaction.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalSales: { $sum: { $cond: ["$sold", "$price", 0] } },
          totalSoldItems: { $sum: { $cond: ["$sold", 1, 0] } },
          totalUnsoldItems: { $sum: { $cond: ["$sold", 0, 1] } },
        },
      },
    ]);

    if (!statistics.length) {
      return res.status(200).json({
        totalSales: 0,
        totalSoldItems: 0,
        totalUnsoldItems: 0,
      });
    }

    const result = statistics[0];

    res.status(200).json({
      totalSales: result.totalSales.toFixed(2),
      totalSoldItems: result.totalSoldItems,
      totalUnsoldItems: result.totalUnsoldItems,
    });
  } catch (error) {
    console.error("Error fetching transaction statistics:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getTransactionChartData = async (req, res) => {
  try {
    const { month } = req.query;

    const monthMap = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };

    const monthNumber = monthMap[month];

    if (!monthNumber) {
      return res.status(400).json({ message: "Invalid month parameter" });
    }

    const boundaries = [0, 101, 201, 301, 401, 501, 601, 701, 801, 901];

    const matchQuery = {
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
    };

    const chartData = await Transaction.aggregate([
      { $match: matchQuery },
      {
        $bucket: {
          groupBy: "$price",
          boundaries,
          default: "901 and above",
          output: {
            count: { $sum: 1 },
          },
        },
      },
    ]);

    const formattedData = chartData.map((bucket) => {
      if (bucket._id === "901 and above") {
        return { min: 901, max: "above", count: bucket.count };
      }

      const boundaryIndex = boundaries.findIndex((b) => b === bucket._id);
      if (boundaryIndex !== -1 && boundaryIndex < boundaries.length - 1) {
        return {
          min: boundaries[boundaryIndex],
          max: boundaries[boundaryIndex + 1] - 1,
          count: bucket.count,
        };
      }

      return { min: "unknown", max: "unknown", count: bucket.count };
    });

    res.status(200).json({ priceRanges: formattedData });
  } catch (error) {
    console.error("Error generating chart data:", error);
    res.status(500).json({ message: "Failed to fetch chart data" });
  }
};

export const getPieChartData = async (req, res) => {
  try {
    const { month } = req.query;

    const monthMap = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };

    const monthNumber = monthMap[month];

    if (!monthNumber) {
      return res.status(400).json({ message: "Invalid month parameter" });
    }

    const matchQuery = {
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
    };

    const pieChartData = await Transaction.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedData = pieChartData.map((data) => ({
      category: data._id,
      count: data.count,
    }));

    res.status(200).json({ categories: formattedData });
  } catch (error) {
    console.error("Error fetching pie chart data:", error);
    res.status(500).json({ message: "Failed to fetch pie chart data" });
  }
};

export const getCombinedData = async (req, res) => {
  try {
    const { month, search = "", page = 1, perPage = 10 } = req.query;

    const listTransactionsReq = {
      ...req,
      query: { month, search, page, perPage },
    };
    const getTransactionStatisticsReq = {
      ...req,
      query: { month },
    };
    const getTransactionChartDataReq = {
      ...req,
      query: { month },
    };
    const getPieChartDataReq = {
      ...req,
      query: { month },
    };

    const transactionsPromise = new Promise((resolve, reject) => {
      const mockRes = {
        status: (code) => ({
          json: (data) => {
            if (code >= 400) reject(data);
            else resolve(data);
          },
        }),
      };
      listTransactions(listTransactionsReq, mockRes);
    });

    const statisticsPromise = new Promise((resolve, reject) => {
      const mockRes = {
        status: (code) => ({
          json: (data) => {
            if (code >= 400) reject(data);
            else resolve(data);
          },
        }),
      };
      getTransactionStatistics(getTransactionStatisticsReq, mockRes);
    });

    const chartDataPromise = new Promise((resolve, reject) => {
      const mockRes = {
        status: (code) => ({
          json: (data) => {
            if (code >= 400) reject(data);
            else resolve(data);
          },
        }),
      };
      getTransactionChartData(getTransactionChartDataReq, mockRes);
    });

    const pieChartDataPromise = new Promise((resolve, reject) => {
      const mockRes = {
        status: (code) => ({
          json: (data) => {
            if (code >= 400) reject(data);
            else resolve(data);
          },
        }),
      };
      getPieChartData(getPieChartDataReq, mockRes);
    });

    const [transactionsData, statisticsData, chartData, pieChartData] =
      await Promise.all([
        transactionsPromise,
        statisticsPromise,
        chartDataPromise,
        pieChartDataPromise,
      ]);

    res.status(200).json({
      transactions: transactionsData,
      statistics: statisticsData,
      chart: chartData,
      pie: pieChartData,
    });
  } catch (error) {
    console.error("Error fetching combined transaction data:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
