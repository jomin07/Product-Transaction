import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const fetchTransactions = async (month, search = "", page = 1) => {
  const response = await axios.get(`${API_URL}`, {
    params: { month, search, page },
  });

  return response;
};

export const fetchTransactionStatistics = async (month) => {
  const response = await axios.get(`${API_URL}/statistics`, {
    params: { month },
  });

  return response;
};

export const fetchTransactionChartData = async (month) => {
  const response = await axios.get(`${API_URL}/chart`, {
    params: { month },
  });

  return response;
};
