import { createBrowserRouter, Navigate } from "react-router-dom";

import SignInPage from "../pages/signin";
import DashboardPage from "../pages/dashboard";
import { PrivateOutlet } from "./PrivateOutlet";

const router = createBrowserRouter([
  {
    path: "signin",
    element: <SignInPage />,
  },
  {
    path: "signout",
    element: <Navigate to="/signin" />,
  },
  {
    path: '/',
    element: <PrivateOutlet />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace={true} /> },
      {
        path: 'dashboard',
        element: <DashboardPage />
      },
    ]
  },
  {
    path: "*",
    element: <Navigate to="/signin" replace={true} />,
  },
]);

export default router;
