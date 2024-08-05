"use client";
import React from 'react';
import D3Visualization from './D3Visualization';

interface FilteredDataProps {
  data: any[];
  filterText: string; // Add filterText prop
}

const FilteredData: React.FC<FilteredDataProps> = ({ data, filterText }) => {
  // Group data by title
  const groupedData = data.reduce((acc: Record<string, any[]>, item) => {
    const title = item.title;
    if (!acc[title]) {
      acc[title] = [];
    }
    acc[title].push({
      end_year: item.end_year,
      intensity: item.intensity,
      sector: item.sector,
      topic: item.topic,
      region: item.region,
      relevance: item.relevance,
      pestle: item.pestle,
      likelihood: item.likelihood,
      country: item.country,
      title: item.title, // Add title to the grouped data
    });
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Filtered Data by {filterText || 'All'}</h2> {/* Display filterText */}
      <hr className="my-4 border-gray-300" />
      {data.length > 0 ? (
        Object.keys(groupedData).map((title, index) => (
          <div key={index} className="mb-8">
            <h3 className="text-xl font-bold mb-4">Title: {title}</h3> {/* Title here */}
            <D3Visualization title={title} data={groupedData[title]} /> {/* Pass the title */}
            <hr className="my-4 border-gray-300" /> {/* Add a horizontal rule */}
          </div>
        ))
      ) : (
        <div className="text-center">No data available.</div>
      )}
    </div>
  );
};

export default FilteredData;
