// utils/dateRangeFilter.js
import { parse, isValid } from 'date-fns';
export const normalizeDate = (date) => {
  if (!date) return null;
  let parsedDate;
  if (typeof date === 'string') {
    // Try parsing as "dd/MM/yyyy"
    parsedDate = parse(date, 'dd/MM/yyyy', new Date());

    // Fallback: try creating a Date from the string if parse fails
    if (!isValid(parsedDate)) {
      parsedDate = new Date(date);
    }
  } else {
    parsedDate = new Date(date);
  }

  if (!isValid(parsedDate)) return null;

  parsedDate.setHours(0, 0, 0, 0);
  return parsedDate;
};

export const filterByDateRange = (data, key, [start, end]) => {
  const startDate = normalizeDate(start);
  const endDate = normalizeDate(end);

  return data.filter((item) => {
    const itemDate = normalizeDate(item?.[key]);
    return itemDate >= startDate && itemDate <= endDate;
  });
};