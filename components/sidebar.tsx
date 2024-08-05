"use client";
import React, { useState, useEffect } from 'react';
import { Popover } from './ui/popover';
import { ComboboxDemo } from './ui/combobox';
import { FaRedoAlt } from 'react-icons/fa';
import FilteredData from './FilteredDataDisplay'; // Import the FilteredDataDisplay component

interface FilterData {
  end_year: string;
  topic: string;
  sector: string;
  region: string;
  pestle: string;
  source: string;
  swot: string;
  country: string;
  city: string;
}

const Sidebar: React.FC = () => {
  const [filters, setFilters] = useState<FilterData>({
    end_year: '',
    topic: '',
    sector: '',
    region: '',
    pestle: '',
    source: '',
    swot: '',
    country: '',
    city: ''
  });

  const [endYears, setEndYears] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [pestles, setPestles] = useState<string[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [filterText, setFilterText] = useState<string>(''); // Store filter text

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/mongo");
        const data = await response.json();
        setCountries(data.country || []);
        setEndYears(data.end_year || []);
        setTopics(data.topic || []);
        setSectors(data.sector || []);
        setRegions(data.region || []);
        setPestles(data.pestle || []);
        setSources(data.source || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (key: keyof FilterData, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearFilter = (key: keyof FilterData) => {
    setFilters({ ...filters, [key]: '' });
  };

  const applyFilters = async () => {
    const query = new URLSearchParams(
      Object.entries(filters).filter(([_, value]) => value) as [string, string][]
    ).toString();

    console.log("Applying filters with query:", query);

    try {
      const response = await fetch(`/api/get?${query}`);
      const data = await response.json();
      console.log("Received filtered data:", data);
      setFilteredData(data.country || []); // Ensure it sets an array
      // Update the filter text when filters are applied
      setFilterText(
        Object.entries(filters)
          .filter(([_, value]) => value)
          .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
          .join(', ')
      );
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  return (
    <div>
      <aside className="fixed top-0 left-0 z-40 w-64 h-screen bg-gray-50 dark:bg-gray-800">
        <div className="h-full px-4 py-6 overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Filters</h2>
          <ul className="space-y-4">
            {[
              { key: 'country', options: countries },
              { key: 'end_year', options: endYears.map(String) },
              { key: 'topic', options: topics },
              { key: 'sector', options: sectors },
              { key: 'region', options: regions },
              { key: 'pestle', options: pestles },
              { key: 'source', options: sources },
            ].map(({ key, options }) => (
              <li key={key} className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-900 dark:text-white w-32">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={() => clearFilter(key as keyof FilterData)}
                  >
                  </button>
                </div>
                <div className="flex items-center"> 
                  <ComboboxDemo
                    choices={options}
                    selectedValue={filters[key as keyof FilterData]}
                    onChange={(value) => handleFilterChange(key as keyof FilterData, value)}
                    filterKey={key}
                    setData={setFilteredData}
                  />
                  <button
                    type="button"
                    className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={() => clearFilter(key as keyof FilterData)}
                  >
                    <FaRedoAlt />
                  </button>
                </div>
              </li>
            ))}
            <li>
              <button
                type="button"
                className="w-full py-2 px-4 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                onClick={applyFilters}
              >
                Apply Filters
              </button>
            </li>
          </ul>
        </div>
        <Popover />
      </aside>

      <main className="ml-64 flex-1 p-4">
        <FilteredData data={filteredData} filterText={filterText} /> {/* Pass the filter text */}
      </main>
    </div>
  );
};

export default Sidebar;