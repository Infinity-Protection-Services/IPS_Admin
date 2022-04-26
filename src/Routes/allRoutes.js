import React from "react";
import { Redirect } from "react-router-dom";

// Authentication related pages
import Login from "../Components/Pages/Authentication/login";

// Dashboard
import { IPSusers, ProductTable, Orders, Category, DataStatistics, CustomerSupportTable, NewJobTable, IncompleteJobs, CompleteJobs, Payment, DisputeRquestTable } from "../Components/Pages";
import ChangePassword from "../Components/Pages/Authentication/changePassword";
import SuccessMessage from "../Components/Pages/Authentication/successMessage";
// import Dashboard from "../Components/Pages/Dashboard";
import { ChatList } from "../Components/Pages/ChatList";
const userRoutes = [
  // { path: "/dashboard", component: Dashboard },
  { path: "/users", component: IPSusers },
  { path: "/statistics", component: DataStatistics },
  // { path: "/rate-agreement", component: IPSusers },
  // { path: "/invoice", component: IPSusers },
  { path: "/support", component: CustomerSupportTable },
  { path: "/products", component: ProductTable },
  { path: "/orders", component: Orders },
  { path: "/category", component: Category },
  { path: "/new-jobs", component: NewJobTable },
  { path: "/inprogress-jobs", component: IncompleteJobs },
  { path: "/completed-jobs", component: CompleteJobs },
  { path: '/payment', component: Payment },
  { path: '/dispute', component: DisputeRquestTable },
  { path: '/chat', component: ChatList },


  // this route should be at the end of all other routes
  { path: "/", exact: true, component: () => <Redirect to="/new-jobs" /> },
];

const authRoutes = [
  { path: "/login", component: Login },
  { path: "/changepassword", component: ChangePassword },
  { path: "/success", component: SuccessMessage },
];

export { userRoutes, authRoutes };
