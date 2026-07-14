// hooks/useDateRangeFilter.js

import { useCallback } from "react";

/**
 * Custom hook to filter data by multiple date keys within a given range.
 * @param {Object} params
 * @param {Array} params.data - Array of objects to filter.
 * @param {Array} params.dateKeys - Array of keys in each object representing dates to check.
 * @param {Function} params.onFilter - Callback function to receive filtered data.
 */
export const useMultipleDateRange = ({ data, dateKeys = [], onFilter }) => {

  // Function to apply date range filter
  // useCallback is used to memoize the function and prevent unnecessary re-renders
  const handleApply = useCallback(
    (range) => {
      // Check if the range is valid (array with exactly 2 dates)
      if (range?.length === 2) {
        // Filter the data array
        const filtered = data.filter((item) =>
          // Check if any of the dateKeys in the item fall within the range
          dateKeys.some((key) => {
            const date = new Date(item[key]); // convert string or timestamp to Date
            return date >= range[0] && date <= range[1]; // check if date is within range
          })
        );
        // Pass the filtered data to callback
        onFilter(filtered);
      }
    },
    [data, dateKeys, onFilter] // dependencies for useCallback
  );

  // Function to reset filter and return original data
  const handleCancel = useCallback(() => {
    onFilter(data); // reset filtered data to original dataset
  }, [data, onFilter]);

  // Return handlers to be used in components
  return { handleApply, handleCancel };
};
