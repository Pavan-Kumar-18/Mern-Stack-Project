// backend/server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Example endpoint to fetch transactions
app.get('/api/transactions', async (req, res) => {
  try {
    
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;
    res.json(transactions);
    const perPage = 10; 
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;
    const paginatedTransactions = transactions.slice(startIndex, endIndex);

    res.json({
      transactions: paginatedTransactions,
      totalPages: Math.ceil(transactions.length / perPage)
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example endpoint to fetch statistics
app.get('/api/statistics', async (req, res) => {
  try {
    const { month } = req.query;
    const response = await axios.get(`https://s3.amazonaws.com/roxiler.com/product_transaction.json`);
    const transactions = response.data.filter(transaction => {
      const transactionDate = new Date(transaction.dateOfSale);
      return transactionDate.toLocaleString('en-us', { month: 'long' }).toLowerCase() === month.toLowerCase();
    });

    const totalSaleAmount = transactions.reduce((total, transaction) => total + transaction.price, 0);
    const soldItems = transactions.length;
    const notSoldItems = response.data.length - soldItems;

    res.json({
      totalSaleAmount,
      soldItems,
      notSoldItems
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/bar-chart', async (req, res) => {
  try {
    const { month } = req.query;
    const response = await axios.get(`https://s3.amazonaws.com/roxiler.com/product_transaction.json`);
    const transactions = response.data.filter(transaction => {
      const transactionDate = new Date(transaction.dateOfSale);
      return transactionDate.toLocaleString('en-us', { month: 'long' }).toLowerCase() === month.toLowerCase();
    });

    const priceRanges = [
      { range: '0-100', count: 0 },
      { range: '101-200', count: 0 },
      { range: '201-300', count: 0 },
      { range: '301-400', count: 0 },
      { range: '401-500', count: 0 },
      { range: '501-600', count: 0 },
      { range: '601-700', count: 0 },
      { range: '701-800', count: 0 },
      { range: '801-900', count: 0 },
      { range: '901-above', count: 0 }
    ];

    transactions.forEach(transaction => {
      const price = transaction.price;
      if (price >= 0 && price <= 100) {
        priceRanges[0].count++;
      } else if (price >= 101 && price <= 200) {
        priceRanges[1].count++;
      } else if (price >= 201 && price <= 300) {
        priceRanges[2].count++;
      } else if (price >= 301 && price <= 400) {
        priceRanges[3].count++;
      } else if (price >= 401 && price <= 500) {
        priceRanges[4].count++;
      } else if (price >= 501 && price <= 600) {
        priceRanges[5].count++;
      } else if (price >= 601 && price <= 700) {
        priceRanges[6].count++;
      } else if (price >= 701 && price <= 800) {
        priceRanges[7].count++;
      } else if (price >= 801 && price <= 900) {
        priceRanges[8].count++;
      } else if (price >= 901) {
        priceRanges[9].count++;
      }
    });

    res.json(priceRanges);
  } catch (error) {
    console.error('Error fetching bar chart data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example endpoint to fetch pie chart data
app.get('/api/pie-chart', async (req, res) => {
  try {
    const { month } = req.query;
    const response = await axios.get(`https://s3.amazonaws.com/roxiler.com/product_transaction.json`);
    const transactions = response.data.filter(transaction => {
      const transactionDate = new Date(transaction.dateOfSale);
      return transactionDate.toLocaleString('en-us', { month: 'long' }).toLowerCase() === month.toLowerCase();
    });

    const categoriesMap = new Map();
    transactions.forEach(transaction => {
      const category = transaction.category;
      if (categoriesMap.has(category)) {
        categoriesMap.set(category, categoriesMap.get(category) + 1);
      } else {
        categoriesMap.set(category, 1);
      }
    });

    const pieChartData = Array.from(categoriesMap, ([category, count]) => ({ category, count }));

    res.json(pieChartData);
  } catch (error) {
    console.error('Error fetching pie chart data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
