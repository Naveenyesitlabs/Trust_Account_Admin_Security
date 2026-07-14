import $ from "jquery";
import moment from "moment";
import "daterangepicker/daterangepicker.css";

window.$ = $;
window.jQuery = $;
window.moment = moment;

import("daterangepicker").catch((error) => {
  console.error("Failed to load daterangepicker", error);
});
