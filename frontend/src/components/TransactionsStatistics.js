// frontend/src/components/TransactionsStatistics.js
import React from 'react';

const TransactionsStatistics = ({ statistics }) => {
  return (
    <div className="transactions-statistics">
      <h2>Transactions Statistics</h2>
      <p>Total Sale Amount: ${statistics.totalSaleAmount}</p>
      <p>Total Sold Items: {statistics.totalSoldItems}</p>
      <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
    </div>
  );
};

export default TransactionsStatistics;
