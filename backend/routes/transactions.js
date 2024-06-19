// backend/routes/transactions.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const Transaction = require('../models/transaction');

// Endpoint to fetch and seed data from third-party API
router.get('/seed-data', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;

        await Transaction.deleteMany({}); // Clear existing data
        await Transaction.insertMany(transactions); // Insert new data

        res.status(200).json({ message: 'Data seeded successfully' });
    } catch (err) {
        console.error('Error seeding data:', err);
        res.status(500).json({ error: 'Failed to seed data' });
    }
});

// Endpoint to fetch transactions with pagination and search
router.get('/transactions', async (req, res) => {
    const { month, search, page = 1, perPage = 10 } = req.query;
    const regex = new RegExp(search, 'i');
    const query = {
        $and: [
            { dateOfSale: { $regex: month, $options: 'i' } },
            {
                $or: [
                    { productName: regex },
                    { description: regex },
                    { price: regex }
                ]
            }
        ]
    };

    try {
        const transactions = await Transaction.find(query)
            .skip((parseInt(page) - 1) * parseInt(perPage))
            .limit(parseInt(perPage))
            .exec();

        res.status(200).json(transactions);
    } catch (err) {
        console.error('Error fetching transactions:', err);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

// Endpoint for statistics (total sale amount, sold items, not sold items)
router.get('/statistics', async (req, res) => {
    const { month } = req.query;
    const query = { dateOfSale: { $regex: month, $options: 'i' } };

    try {
        const totalSaleAmount = await Transaction.aggregate([
            { $match: query },
            { $group: { _id: null, total: { $sum: '$price' } } }
        ]);

        const totalSoldItems = await Transaction.countDocuments({
            $and: [query, { sold: true }]
        });

        const totalNotSoldItems = await Transaction.countDocuments({
            $and: [query, { sold: false }]
        });

        res.status(200).json({
            totalSaleAmount: totalSaleAmount.length > 0 ? totalSaleAmount[0].total : 0,
            totalSoldItems,
            totalNotSoldItems
        });
    } catch (err) {
        console.error('Error calculating statistics:', err);
        res.status(500).json({ error: 'Failed to calculate statistics' });
    }
});

// Endpoint for bar chart data (price range and count of items)
router.get('/bar-chart', async (req, res) => {
    const { month } = req.query;
    const query = { dateOfSale: { $regex: month, $options: 'i' } };

    try {
        const barChartData = await Transaction.aggregate([
            { $match: query },
            {
                $group: {
                    _id: {
                        $switch: {
                            branches: [
                                { case: { $lte: ['$price', 100] }, then: '0-100' },
                                { case: { $lte: ['$price', 200] }, then: '101-200' },
                                { case: { $lte: ['$price', 300] }, then: '201-300' },
                                { case: { $lte: ['$price', 400] }, then: '301-400' },
                                { case: { $lte: ['$price', 500] }, then: '401-500' },
                                { case: { $lte: ['$price', 600] }, then: '501-600' },
                                { case: { $lte: ['$price', 700] }, then: '601-700' },
                                { case: { $lte: ['$price', 800] }, then: '701-800' },
                                { case: { $lte: ['$price', 900] }, then: '801-900' },
                                { case: { $gte: ['$price', 901] }, then: '901-above' },
                            ],
                            default: 'Unknown'
                        }
                    },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json(barChartData);
    } catch (err) {
        console.error('Error fetching bar chart data:', err);
        res.status(500).json({ error: 'Failed to fetch bar chart data' });
    }
});

// Endpoint for pie chart data (unique categories and count of items)
router.get('/pie-chart', async (req, res) => {
    const { month } = req.query;
    const query = { dateOfSale: { $regex: month, $options: 'i' } };

    try {
        const pieChartData = await Transaction.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json(pieChartData);
    } catch (err) {
        console.error('Error fetching pie chart data:', err);
        res.status(500).json({ error: 'Failed to fetch pie chart data' });
    }
});

module.exports = router;
