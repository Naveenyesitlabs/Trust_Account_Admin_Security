import { useMemo, useState } from "react";

/**
 * Helper function to parse date strings in "DD/MM/YYYY" format
 * into JavaScript Date objects for sorting purposes.
 * @param {string} dateStr - Date string in "DD/MM/YYYY" format
 * @returns {Date} - JavaScript Date object
 */
const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("/"); // split string into day, month, year
  return new Date(year, month - 1, day); // create Date object (month is 0-indexed)
};

/**
 * Custom hook to sort data by a specific key and direction
 * Supports numeric, string, and date values
 * @param {Array} data - Array of objects to sort
 * @param {Object} initialConfig - Initial sort configuration { key, direction }
 * @returns {Object} - { sortedData, sortConfig, handleSort }
 */
const useSortableData = (data, initialConfig = { key: null, direction: "asc" }) => {
  // State to keep track of current sort key and direction
  const [sortConfig, setSortConfig] = useState(initialConfig);

  /**
   * Memoized sorted data
   * Recomputes only when data or sortConfig changes
   */
  const sortedData = useMemo(() => {
    if (!sortConfig?.key) return data; // if no sort key, return original data

    const sorted = [...data].sort((a, b) => {
      let aValue = a[sortConfig?.key];
      let bValue = b[sortConfig?.key];

      // Handle date sorting if key is 'date'
      if (sortConfig?.key === "date") {
        aValue = parseDate(aValue);
        bValue = parseDate(bValue);
      }
      // Handle numeric sorting
      else if (!isNaN(aValue) && !isNaN(bValue)) {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }
      // Handle string sorting (case-insensitive)
      else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      // Compare values based on sort direction
      if (aValue < bValue) return sortConfig?.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig?.direction === "asc" ? 1 : -1;
      return 0; // equal values
    });

    return sorted;
  }, [data, sortConfig]);

  /**
   * Function to handle sorting when a column header is clicked
   * Toggles between ascending and descending if the same key is clicked
   */
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig?.key === key && sortConfig?.direction === "asc") {
      direction = "desc"; // toggle direction
    }
    setSortConfig({ key, direction });
  };

  // Return sorted data, current sort config, and handler function
  return { sortedData, sortConfig, handleSort };
};

export default useSortableData;
