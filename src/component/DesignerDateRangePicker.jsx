import { useEffect, useRef } from "react";

// 🔹 DesignerDateRangePicker Component
// - A custom wrapper for the jQuery-based `daterangepicker` plugin
// - Props:
//   • onApply → callback fired when user selects a date range
//   • onCancel → callback fired when user clears the date range
//   • placeholder → custom placeholder text for the input
const DesignerDateRangePicker = ({ onApply, onCancel, placeholder }) => {
  // React ref to access the input element
  const inputRef = useRef(null);

  useEffect(() => {
    // ✅ Ensure jQuery ($) and daterangepicker plugin are available globally
    if (window.$ && window.$.fn.daterangepicker) {
      const $ = window.$;
      const input = $(inputRef.current);

      // 🔸 Initialize daterangepicker on the input
      input.daterangepicker(
        {
          autoUpdateInput: false, // Prevent auto text update
          locale: {
            cancelLabel: "Clear", // Button label for clearing input
          },
        },
        function (start, end) {
          // 🔹 Optional callback to manually set input display
          input.val(`${start.format("MM/DD/YYYY")} - ${end.format("MM/DD/YYYY")}`);
        }
      );

      // 🔸 Handle Apply Event
      input.on("apply.daterangepicker", function (ev, picker) {
        if (onApply) {
          // Pass raw Date objects back to parent
          onApply([picker.startDate.toDate(), picker.endDate.toDate()]);
        }
        // Update input text with selected range
        input.val(`${picker.startDate.format("MM/DD/YYYY")} - ${picker.endDate.format("MM/DD/YYYY")}`);
      });

      // 🔸 Handle Cancel Event
      input.on("cancel.daterangepicker", function () {
        if (onCancel) {
          onCancel(); // Trigger cancel callback
        }
        input.val(""); // Clear input display
      });

      // 🔸 Cleanup on unmount
      return () => {
        input.data("daterangepicker")?.remove();
      };
    }
  }, [onApply, onCancel]);

  return (
    <>
      {/* ⚠️ Note: Include external daterangepicker CSS/JS only once in your app (e.g., in _app.js or index.html) */}
      <label className="daterange-btn">
        {/* Calendar icon for styling */}
        <img src="/images/filter-icons/date.svg" alt="" />
        {/* Input field attached to daterangepicker */}
        <input
          type="text"
          readOnly
          className="input"
          name="datefilter"
          placeholder={placeholder || "Sign Up Date Range"}
          ref={inputRef}
        />
      </label>
    </>
  );
};

export default DesignerDateRangePicker;
