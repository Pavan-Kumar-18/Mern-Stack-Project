import React, { useState, useEffect } from 'react';
import axios from 'axios';


function Data() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3030/api/products'); 
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Error fetching data. Please try again later.');
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="products-container">
      <h1>Products List</h1>
      {error && <p className="error">{error}</p>}
      <div className="products-list">
        {products.map(product => (
          <div key={product.id} className="product-item">
            <div className="product-image">
              <img src={product.image} alt={product.title} />
            </div>
            <div className="product-details">
              <h2>{product.title}</h2>
              <p>{product.description}</p>
              <p>Price: ${product.price}</p>
              <p>Category: {product.category}</p>
              <p>Date of Sale: {new Date(product.dateOfSale).toLocaleDateString()}</p>
              <p>Sold: {product.sold ? 'Yes' : 'No'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Data;
