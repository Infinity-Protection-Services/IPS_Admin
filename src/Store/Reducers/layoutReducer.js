
import { LOADER, SUCCESS_MESSAGE, ERROR_MESSAGE } from "../../Common/actionTypes";

const INIT_STATE = {
  isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
  localisation: "en",
  statusColorCode: ['#f7c673', "green", "red", "#ff0066", "green"],
  status: ["Pending", "Accepted", "Rejected", "Stand by", "Accepted"],
  // statusColorCode: ['black', "green", "red", "#ff0066", "#f7c673"],
  // status: ["Pending", "Accepted", "Rejected", "Stand by", "Pending"],
  paymentMode: ["Pay by Hour"],
  paymentColorCode: ["#349beb", "#eb3446"],
  entryOptions: [10, 20, 30, 40, 50],
  redirectOn: "/new-jobs",
};

const Layout = (state = INIT_STATE, action) => {
  switch (action.type) {
    case LOADER:
      state = { ...state, loader: action.payload };
      return state;
    case SUCCESS_MESSAGE:
      state = { ...state, [action.entity]: action.payload }
      return state;
    case ERROR_MESSAGE:
      state = { ...state, [action.entity]: action.payload }
      return state;
    default:
      return state;
  }
};

export default Layout;
