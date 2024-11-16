import { useState } from "react";
import TransactionTable from "../components/TransactionTable";
import TransactionStatistics from "../components/TransactionStatistics";
import TransactionChart from "../components/TransactionChart";

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState("March");

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Transactions Dashboard
        </h1>

        <div className="flex items-center gap-4 mb-6">
          <label
            className="text-lg font-medium text-gray-600"
            htmlFor="month-select"
          >
            Select Month:
          </label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="border border-gray-300 rounded-lg py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <TransactionTable selectedMonth={selectedMonth} />

        <div className="mt-8 grid gap-6 grid-cols-1 lg:grid-cols-2">
          <TransactionStatistics selectedMonth={selectedMonth} />
          <TransactionChart selectedMonth={selectedMonth} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
