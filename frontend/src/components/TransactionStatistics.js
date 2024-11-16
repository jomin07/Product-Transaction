import { useEffect, useState } from "react";
import { fetchTransactionStatistics } from "../api/transactionApi";

const TransactionStatistics = ({ selectedMonth }) => {
  const [statistics, setStatistics] = useState({
    totalSales: 0,
    totalSoldItems: 0,
    totalUnsoldItems: 0,
  });

  useEffect(() => {
    loadStatistics();
  }, [selectedMonth]);

  const loadStatistics = async () => {
    try {
      const { data } = await fetchTransactionStatistics(selectedMonth);
      setStatistics({
        totalSales: data.totalSales,
        totalSoldItems: data.totalSoldItems,
        totalUnsoldItems: data.totalUnsoldItems,
      });
    } catch (error) {
      console.error("Failed to fetch transaction statistics", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-6 text-gray-700">
        Statistics - {selectedMonth}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-lg shadow-md bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Total Sales</h3>
            <div className="text-4xl">💰</div>
          </div>
          <p className="text-3xl font-semibold mt-4">
            ${statistics.totalSales}
          </p>
        </div>

        <div className="p-6 rounded-lg shadow-md bg-gradient-to-r from-green-400 to-green-600 text-white hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Sold Items</h3>
            <div className="text-4xl">🛒</div>
          </div>
          <p className="text-3xl font-semibold mt-4">
            {statistics.totalSoldItems}
          </p>
        </div>

        <div className="p-6 rounded-lg shadow-md bg-gradient-to-r from-red-400 to-red-600 text-white hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Unsold Items</h3>
            <div className="text-4xl">⚠️</div>
          </div>
          <p className="text-3xl font-semibold mt-4">
            {statistics.totalUnsoldItems}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionStatistics;
