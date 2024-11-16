import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchTransactionChartData } from "../api/transactionApi";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const TransactionChart = ({ selectedMonth }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    loadChartData();
  }, [selectedMonth]);

  const loadChartData = async () => {
    try {
      const { data } = await fetchTransactionChartData(selectedMonth);

      const labels = data.priceRanges.map(
        (range) => `${range.min}-${range.max}`
      );

      const values = data.priceRanges.map((range) => range.count);

      setChartData({
        labels,
        datasets: [
          {
            label: "Number of Items",
            data: values,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch chart data", error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4">
        Bar Chart Stats - {selectedMonth}
      </h3>
      <Bar
        data={chartData}
        options={{
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
};

export default TransactionChart;
