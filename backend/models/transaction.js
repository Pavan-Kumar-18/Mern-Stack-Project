// backend/models/transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    productId: String,
    productName: String,
    description: String,
    price: Number,
    dateOfSale: Date,
    sold: Boolean,
    category: String
});

module.exports = mongoose.model('Transaction', transactionSchema);
