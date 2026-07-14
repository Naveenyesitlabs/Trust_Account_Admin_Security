import { useEffect, useRef } from "react";

const DesignerDateRangePicker = ({ onApply, onCancel, placeholder }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    let input;
    let isDisposed = false;

    const initializeDatePicker = async () => {
      if (!window.$) {
        return;
      }

      if (!window.$.fn?.daterangepicker) {
        try {
          await import("daterangepicker");
        } catch (error) {
          console.error("Failed to load daterangepicker", error);
          return;
        }
      }

      if (isDisposed || !window.$.fn?.daterangepicker) {
        return;
      }

      const $ = window.$;
      input = $(inputRef.current);

      input.daterangepicker(
        {
          autoUpdateInput: false,
          locale: {
            cancelLabel: "Clear",
          },
        },
        function (start, end) {
          input.val(`${start.format("MM/DD/YYYY")} - ${end.format("MM/DD/YYYY")}`);
        }
      );

      input.on("apply.daterangepicker", function (_event, picker) {
        if (onApply) {
          onApply([picker.startDate.toDate(), picker.endDate.toDate()]);
        }
        input.val(`${picker.startDate.format("MM/DD/YYYY")} - ${picker.endDate.format("MM/DD/YYYY")}`);
      });

      input.on("cancel.daterangepicker", function () {
        if (onCancel) {
          onCancel();
        }
        input.val("");
      });
    };

    initializeDatePicker();

    return () => {
      isDisposed = true;
      input?.data("daterangepicker")?.remove();
      input?.off("apply.daterangepicker");
      input?.off("cancel.daterangepicker");
    };
  }, [onApply, onCancel]);

  return (
    <label className="daterange-btn">
      <img src="/images/filter-icons/date.svg" alt="" />
      <input
        type="text"
        readOnly
        className="input"
        name="datefilter"
        placeholder={placeholder || "Sign Up Date Range"}
        ref={inputRef}
      />
    </label>
  );
};

export default DesignerDateRangePicker;
