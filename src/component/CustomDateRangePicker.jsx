import { useState } from 'react';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

// 🔹 Custom wrapper around rsuite DateRangePicker
// Provides controlled value state and applies/cancels date selection
const CustomDateRangePicker = ({ onApply, onCancel, placeholder }) => {
  const [value, setValue] = useState(null); // 🟢 Stores selected date range

  // ✅ Called when user selects date range
  const handleApply = (selectedValue) => {
    setValue(selectedValue); // update local state
    if (selectedValue?.length === 2) {
      onApply?.(selectedValue); // send raw Date[] to parent if range is valid
    } else {
      onCancel?.(); // cancel if selection invalid/incomplete
    }
  };

  // ❌ Clear date range and call cancel callback
  const handleClear = () => {
    setValue(null);
    onCancel?.();
  };

  return (
    <DateRangePicker
      value={value}                // bind state
      onChange={handleApply}       // fires on date select
      onClean={handleClear}        // fires on clear/reset
      showHeader={false}           // hides default header
      placeholder={placeholder || "Select Date Range"} // custom placeholder
      placement="bottomEnd"        // dropdown alignment
      style={{ width: 250 }}       // width styling
    />
  );
};

export default CustomDateRangePicker;
