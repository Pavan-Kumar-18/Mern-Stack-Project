// frontend/src/components/TransactionsTable.js
import React from 'react';

const TransactionsTable = ({
  transactions,
  searchText,
  handleSearchChange,
  currentPage,
  totalPages,
  handleNextPage,
  handlePrevPage
}) => {
  return (
    <div className="transactions-table">
      <h2>Transactions Table</h2>

      {/* Search Box */}
      <input
        type="text"
        placeholder="Search transactions..."
        value={searchText}
        onChange={handleSearchChange}
      />

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Date of Sale</th>
            <th>Sold</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction._id}>
              <td>{transaction.productName}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{transaction.dateOfSale}</td>
              <td>{transaction.sold ? 'Yes' : 'No'}</td>
              <td>{transaction.category}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default TransactionsTable;
