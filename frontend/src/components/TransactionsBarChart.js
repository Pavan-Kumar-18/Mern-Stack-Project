// frontend/src/components/TransactionsBarChart.js
import React from 'react';

const TransactionsBarChart = ({ barChartData }) => {
  return (
    <div className="transactions-bar-chart">
      <h2>Transactions Bar Chart</h2>
      <div className="chart">
        {barChartData.map(item => (
          <div key={item._id} className="bar">
            <div className="bar-label">{item._id}</div>
            <div className="bar-value">{item.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionsBarChart;
