// frontend/src/components/TransactionsPieChart.js
import React from 'react';

const TransactionsPieChart = ({ pieChartData }) => {
  return (
    <div className="transactions-pie-chart">
      <h2>Transactions Pie Chart</h2>
      <div className="chart">
        {pieChartData.map(item => (
          <div key={item._id} className="slice">
            <div className="slice-label">{item._id}</div>
            <div className="slice-value">{item.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionsPieChart;
