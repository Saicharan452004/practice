import React, { Component } from 'react';
import FilterBar from '../FilterBar';
import './index.css';

class ProductsViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      isLoading: true,
      filters: {
        category: 'Laptop',
        company: 'all',
        minPrice: '1',
        maxPrice: '20000', // Increased range for more results
        minRating: '0',
        sortBy: 'price',
        sortOrder: 'asc',
        top: 50, // Ask for a large number of products
        page: 1  // Add page number to our state
      },
      selectedProduct: null
    };
  }

  componentDidMount() {
    this.fetchProducts();
  }

  fetchProducts = async () => {
    this.setState({ isLoading: true });
    const { filters } = this.state;
    const url = `http://localhost:8000/categories/${filters.category}/products?top=${filters.top}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}&sortBy=${filters.sortBy}&sortOrder=${filters.sortOrder}&page=${filters.page}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      this.setState({ products: data, isLoading: false });
    } catch (error) {
      console.error("Error fetching data:", error);
      this.setState({ isLoading: false });
    }
  }

  handleApplyFilters = (newFilters) =>   {
    // When applying new filters, always reset to page 1
    const filtersWithResetPage = { ...newFilters, page: 1 };
    this.setState({ filters: filtersWithResetPage }, () => {
      this.fetchProducts();
    });
  }

  handleProductSelect = (product) => {
    this.setState({ selectedProduct: product });
  }

  handleGoBack = () => {
    this.setState({ selectedProduct: null });
  }
  
  // --- NEW ---
  // Go to the next page of results
  handleNextPage = () => {
    this.setState(prevState => ({
      filters: {
        ...prevState.filters,
        page: prevState.filters.page + 1
      }
    }), this.fetchProducts); // Fetch data after state is updated
  }

  // --- NEW ---
  // Go to the previous page of results
  handlePreviousPage = () => {
    this.setState(prevState => ({
      filters: {
        ...prevState.filters,
        page: prevState.filters.page - 1
      }
    }), this.fetchProducts); // Fetch data after state is updated
  }


  render() {
    const { products, isLoading, selectedProduct, filters } = this.state;

    if (selectedProduct) {
      // ... (detail view code is the same)
      return (
        <div>
          <button onClick={this.handleGoBack}>&larr; Back to List</button>
          <h2>{selectedProduct.productName}</h2>
          <p>Company: {selectedProduct.company}</p>
          <p>Price: ${selectedProduct.price}</p>
          {/* ... other details ... */}
        </div>
      );
    }

    return (
      <div className="products-viewer">
        <h2>Our Products</h2>
        <FilterBar onApplyFilters={this.handleApplyFilters} />

        {isLoading ? (
          <div>Loading products...</div>
        ) : (
          <>
            <div className="product-list">
              {products.map(product => (
                <div key={product.id} className="product-card" onClick={() => this.handleProductSelect(product)}>
                  <h3>{product.productName}</h3>
                  <p>Price: ${product.price}</p>
                  <p>Rating: {product.rating}</p>
                </div>
              ))}
            </div>

            {/* --- NEW PAGINATION CONTROLS --- */}
            <div className="pagination-controls">
              <button onClick={this.handlePreviousPage} disabled={filters.page <= 1}>
                Previous
              </button>
              <span>Page {filters.page}</span>
              <button onClick={this.handleNextPage} disabled={products.length < 10}>
                Next
              </button>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default ProductsViewer;