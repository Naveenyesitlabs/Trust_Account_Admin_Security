import { useEffect } from "react";
import { toast } from "react-toastify";
import { getStoredSession } from "../utils/authStorage";

let isBlocked = false;

const useSubscriptionBlocker = () => {
  useEffect(() => {
    const handler = (e) => {
      const target = e.target;

      // ✅ allow login page
      if (window.location.pathname === "/") return;

      // ✅ allow toast interactions
      if (target.closest(".Toastify__toast")) return;

      // ✅ allow modal close buttons
      if (
        target.closest('[data-bs-dismiss="modal"]') ||
        target.closest(".btn-close")
      ) {
        return;
      }

      // ✅ allow logout (IMPORTANT)
      if (
        target.closest('[data-bs-target="#logout"]') || // modal trigger
        target.closest("#logout") // inside logout modal (Yes/No buttons)
      ) {
        return;
      }

      // ✅ ONLY block actionable elements (IMPORTANT FIX)
      const isActionElement = target.closest(
        "a, button, input, select, textarea, [role='button'], [data-bs-toggle]"
      );

      if (!isActionElement) return; // 🔥 ignore blank clicks

      const subscription = getStoredSession()?.subscription;

      const isInvalid =
        !subscription ||
        typeof subscription !== "object" ||
        Object.keys(subscription).length === 0;

      if (isInvalid) {
        const isModalTrigger = target.closest('[data-bs-toggle="modal"]');

        // 🔥 stop everything
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        // 🔥 kill modal if triggered
        if (isModalTrigger) {
          const openModal = document.querySelector(".modal.show");

          if (openModal) {
            const modalInstance =
              window.bootstrap?.Modal.getInstance(openModal);
            modalInstance?.hide();
          }

          document
            .querySelectorAll(".modal-backdrop")
            .forEach((el) => el.remove());

          document.body.classList.remove("modal-open");
        }

        // 🔥 avoid toast spam
        if (!isBlocked) {
          isBlocked = true;

          toast.error(
            "Access denied! you have no subscription plan. Please subscribe to a plan to access your account"
          );

          setTimeout(() => {
            isBlocked = false;
          }, 2000);
        }

        return false;
      }
    };

    document.addEventListener("click", handler, true);
    document.addEventListener("mousedown", handler, true);

    return () => {
      document.removeEventListener("click", handler, true);
      document.removeEventListener("mousedown", handler, true);
    };
  }, []);
};

export default useSubscriptionBlocker;
