import React, { Component } from 'react';
import './index.css';

class FilterBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: 'Laptop',
      company: 'all',
      minPrice: '1',
      maxPrice: '10000',
      minRating: '0',
      availability: 'all',
      sortBy: 'price',
      sortOrder: 'asc'
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  // This function runs when the form is submitted
  handleSubmit = (event) => {
    event.preventDefault(); // Prevents the whole page from reloading
    this.props.onApplyFilters(this.state); // This sends all the filter data up to the parent component
  }

  render() {
    return (
      <div className="filter-bar">
        {/* When the form is submitted, it calls handleSubmit */}
        <form onSubmit={this.handleSubmit}>
          {/* All the labels and inputs are the same as before... */}
          <label>Category:</label>
          <select name="category" value={this.state.category} onChange={this.handleInputChange}>
            <option value="Laptop">Laptop</option>
            <option value="Phone">Phone</option>
            <option value="Tablet">Tablet</option>
            <option value="Earphone">Earphone</option>
          </select>

          <label>Company:</label>
          <select name="company" value={this.state.company} onChange={this.handleInputChange}>
            <option value="all">All</option>
            <option value="AMZ">AMZ</option>
            <option value="FLP">FLP</option>
            <option value="SNP">SNP</option>
            <option value="MYN">MYN</option>
            <option value="AZO">AZO</option>
          </select>
           
          {/* --- Price Range --- */}
          <label>Price:</label>
          <input type="number" name="minPrice" value={this.state.minPrice} onChange={this.handleInputChange} placeholder="Min" />
          <span>-</span>
          <input type="number" name="maxPrice" value={this.state.maxPrice} onChange={this.handleInputChange} placeholder="Max" />

          {/* --- Rating --- */}
          <label>Min Rating:</label>
          <input type="range" name="minRating" min="0" max="5" step="0.1" value={this.state.minRating} onChange={this.handleInputChange} />
          <span>{this.state.minRating}</span>
          
          {/* --- Sort By --- */}
          <label>Sort By:</label>
          <select name="sortBy" value={this.state.sortBy} onChange={this.handleInputChange}>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
            <option value="discount">Discount</option>
          </select>
          
          
          {/* Add the new button */}
          <button type="submit">Apply Filters</button>
        </form>
      </div>
    );
  }
}

export default FilterBar;