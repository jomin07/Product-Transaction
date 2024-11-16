import { useEffect, useState } from "react";
import { fetchTransactions } from "../api/transactionApi";

const TransactionTable = ({ selectedMonth }) => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalDocuments, setTotalDocuments] = useState(0);

  const perPage = 10;

  useEffect(() => {
    loadTransactions();
  }, [selectedMonth, search, page]);

  const loadTransactions = async () => {
    try {
      const { data } = await fetchTransactions(selectedMonth, search, page);

      setTransactions(data.transactions);
      setTotalDocuments(data.totalDocuments);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  };

  const totalPages = Math.ceil(totalDocuments / perPage);

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Transaction Table
      </h3>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search Transactions"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3 px-3 py-2 border rounded-lg shadow-sm focus:ring focus:ring-indigo-300 focus:outline-none"
        />
      </div>

      <table className="min-w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-indigo-600 text-white">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Sold</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr
              key={transaction._id}
              className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
            >
              <td className="border px-4 py-2 text-center">{transaction.id}</td>
              <td className="border px-4 py-2 text-center">
                {transaction.image ? (
                  <img
                    src={transaction.image}
                    alt={transaction.title}
                    className="w-12 h-12 object-cover rounded-full mx-auto"
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td className="border px-4 py-2">{transaction.title}</td>
              <td className="border px-4 py-2">{transaction.description}</td>
              <td className="border px-4 py-2">${transaction.price}</td>
              <td className="border px-4 py-2">{transaction.category}</td>
              <td className="border px-4 py-2 text-center">
                {transaction.sold ? "Yes" : "No"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 ${
            page === 1 && "opacity-50 cursor-not-allowed"
          }`}
        >
          Previous
        </button>
        <p className="text-gray-600">
          Page {page} of {totalPages}
        </p>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page === totalPages || transactions.length === 0}
          className={`px-4 py-2 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 ${
            (page === totalPages || transactions.length === 0) &&
            "opacity-50 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionTable;
