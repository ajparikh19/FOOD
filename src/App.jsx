import * as React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserRoleProvider } from "./context/userRoleContext";
import "./app.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Login from "./pages/Login";
import routes from "./constants/routesConstants";
import Dashboard from "./pages/Dashboard";
import Wrapper from "./components/Wrapper";
// import Setting from "./pages/Setting";
import PrivateRoute from "./components/PrivateRoute";
import Forgot from "./pages/Login/forgot";
import Clients from "./pages/Clients";
import AddClient from "./pages/Clients/AddClients";
import ViewClient from "./pages/Clients/ViewClient";

import { ToastContainer } from "react-toastify";
import AddCompany from "./pages/Company/companyAdd";
import Company from "./pages/Company/view";
import Subscriptions from "./pages/subscriptions";
import AddSubscription from "./pages/subscriptions/AddSubscriptionPlan";

const withPrivateRoute = (Component) => (
  <PrivateRoute>
    <Wrapper>
      <Component />
    </Wrapper>
  </PrivateRoute>
);

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* {/* Redirect all unknown routes to the login page /} */}
        <Route path="*" element={<Navigate to="/" replace />} />

        <Route path={routes.Login} element={<Login pageType="login" />} exact />
        <Route path={routes.ForgotPassword} element={<Forgot />} exact />
        <Route
          path={routes.Dashboard}
          element={withPrivateRoute(Dashboard)}
          exact
        />

        {/* //  ========================= Cleints ===================== */}

        <Route
          path={routes.Clients}
          element={withPrivateRoute(Clients)}
          exact
        />

        <Route
          path={routes.AddClient}
          element={withPrivateRoute(AddClient)}
          exact
        />

        <Route
          path={routes.EditClient}
          element={withPrivateRoute(AddClient)}
          exact
        />
        <Route
          path={routes.ViewClient}
          element={withPrivateRoute(ViewClient)}
          exact
        />

        {/* ================ Compney ===================== */}
        <Route
          path={routes.AddCompany}
          element={withPrivateRoute(AddCompany)}
          exact
        />
        <Route
          path={routes.Companies}
          element={withPrivateRoute(Company)}
          exact
        />
        <Route
          path={routes.EditCompany}
          element={withPrivateRoute(AddCompany)}
          exact
        />

        {/* //  ========================= Subscription ===================== */}
        <Route
          path={routes.Subscriptions}
          element={withPrivateRoute(Subscriptions)}
          exact
        />
        <Route
          path={routes.AddSubscription}
          element={withPrivateRoute(AddSubscription)}
          exact
        />
        <Route
          path={routes.EditSubscription}
          element={withPrivateRoute(AddSubscription)}
          exact
        />
        
      </Routes>
    </BrowserRouter>
  );
}
