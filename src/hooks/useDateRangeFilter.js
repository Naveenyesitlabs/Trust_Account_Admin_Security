// hooks/useDateRangeFilter.js

import { useCallback } from "react";
import { filterByDateRange } from "../utils/dateRangeFilter";

/**
 * Custom hook for filtering a dataset by a date range.
 * @param {Object} params
 * @param {Array} params.data - The array of data objects to filter.
 * @param {string} params.dateKey - The key in data objects representing the date.
 * @param {Function} params.onFilter - Callback function to return the filtered data.
 */
export const useDateRangeFilter = ({ data, dateKey, onFilter }) => {

  // Function to apply date range filtering
  // Uses useCallback to memoize function and avoid unnecessary re-renders
  const handleApply = useCallback(
    (range) => {
      // Check if range is valid (should have exactly 2 dates)
      if (range?.length === 2) {
        // Filter data using utility function and call onFilter with results
        const filtered = filterByDateRange(data, dateKey, range);
        onFilter(filtered);
      }
    },
    [data, dateKey, onFilter] // dependencies for useCallback
  );

  // Function to reset filter and return original data
  const handleCancel = useCallback(() => {
    onFilter(data); // reset filtered data to original dataset
  }, [data, onFilter]);

  // Return handler functions to be used in components
  return { handleApply, handleCancel };
};
