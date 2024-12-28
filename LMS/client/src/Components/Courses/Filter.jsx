import React, { useState } from 'react';

const Filter = ({ filter, handleFilterChange, resetFilter }) => {
  const [open, setOpen] = useState({
    category: false,
    level: false,
    sortBy: false,
  });

  const toggleAccordion = (section) => {
    setOpen((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <div className="mb-6 border-2">
      {/* Category Accordion */}
      <div className="border-b">
        <button
          onClick={() => toggleAccordion('category')}
          className="w-full text-left p-4 font-semibold text-xl"
        >
          Categories
        </button>
        {open.category && (
          <div className="p-4">
            <select
              name="category"
              className="border p-2 rounded w-full"
              value={filter.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              <option value="Programming">Programming</option>
              <option value="Data Science">Data Science</option>
              <option value="Design">Design</option>
              <option value="Web Development">Web Development</option>
              <option value="Technology">Technology</option>
              <option value="Photography">Photography</option>

            </select>
          </div>
        )}
      </div>

      {/* Level Accordion */}
      <div className="border-b">
        <button
          onClick={() => toggleAccordion('level')}
          className="w-full text-left p-4 font-semibold text-xl"
        >
          Level
        </button>
        {open.level && (
          <div className="p-4">
            <select
              name="level"
              className="border p-2 rounded w-full"
              value={filter.level}
              onChange={handleFilterChange}
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        )}
      </div>

      {/* Sort By Accordion */}
      <div className="border-b">
        <button
          onClick={() => toggleAccordion('sortBy')}
          className="w-full text-left p-4 font-semibold text-xl"
        >
          Sort By
        </button>
        {open.sortBy && (
          <div className="p-4">
            <select
              name="sortBy"
              className="border p-2 rounded w-full"
              value={filter.sortBy}
              onChange={handleFilterChange}
            >
              <option value="">Sort By</option>
              <option value="price">Price (Low to High)</option>
              <option value="-price">Price (High to Low)</option>
              <option value="rating">Rating</option>
              <option value="numRatings">Most Reviewed</option>
              <option value="discount">Discount</option>
              <option value="new">Newly Updated</option>
            </select>
          </div>
        )}
      </div>

      {/* Reset All Button */}
      <div className="my-4 flex justify-center ">
        <button
          onClick={resetFilter}
          className=" bg-gray-600 text-white py-2 rounded-lg text-center w-1/2 hover:bg-gray-800 "
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );
};

export default Filter;
