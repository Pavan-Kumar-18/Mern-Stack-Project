// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionsTable from './components/TransactionsTable';
import TransactionsStatistics from './components/TransactionsStatistics';
import TransactionsBarChart from './components/TransactionsBarChart';
import TransactionsPieChart from './components/TransactionsPieChart';
import MonthSelectorDropdown from './components/MonthSelectorDropdown';
import './App.css';
import Data from './components/Data';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('March');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTransactions();
    fetchStatistics();
    fetchBarChartData();
    fetchPieChartData();
  }, [selectedMonth, searchText, currentPage]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`/api/transactions?month=${selectedMonth.toLowerCase()}&search=${searchText}&page=${currentPage}`);
      setTransactions(response.data);
      // Assuming the backend provides total pages in the response
      setTotalPages(Math.ceil(response.headers['x-total-count'] / 10)); // Assuming perPage=10
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`/api/statistics?month=${selectedMonth.toLowerCase()}`);
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchBarChartData = async () => {
    try {
      const response = await axios.get(`/api/bar-chart?month=${selectedMonth.toLowerCase()}`);
      setBarChartData(response.data);
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
    }
  };

  const fetchPieChartData = async () => {
    try {
      const response = await axios.get(`/api/pie-chart?month=${selectedMonth.toLowerCase()}`);
      setPieChartData(response.data);
    } catch (error) {
      console.error('Error fetching pie chart data:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    setCurrentPage(1); // Reset pagination to page 1 when search text changes
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setCurrentPage(1); // Reset pagination to page 1 when month changes
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <div className="App">
      <h1>MERN Stack Coding Challenge</h1>
      <Data/>

      {/* Month Selector Dropdown */}
      <MonthSelectorDropdown selectedMonth={selectedMonth} handleMonthChange={handleMonthChange} />

      {/* Transactions Table */}
      <TransactionsTable
        transactions={transactions}
        searchText={searchText}
        handleSearchChange={handleSearchChange}
        currentPage={currentPage}
        totalPages={totalPages}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
      />
      <TransactionsStatistics statistics={statistics} />
      <TransactionsBarChart barChartData={barChartData} />
      <TransactionsPieChart pieChartData={pieChartData} />
    </div>
  );
}

export default App;
