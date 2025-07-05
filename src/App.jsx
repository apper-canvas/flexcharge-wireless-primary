import { Route, Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import React from "react";
import OneTimeConfig from "@/components/pages/OneTimeConfig";
import CreditConfig from "@/components/pages/CreditConfig";
import UsageConfig from "@/components/pages/UsageConfig";
import MarketplaceConfig from "@/components/pages/MarketplaceConfig";
import MilestoneConfig from "@/components/pages/MilestoneConfig";
import Onboarding from "@/components/pages/Onboarding";
import Layout from "@/components/organisms/Layout";
import Customers from "@/components/pages/Customers";
import Vendors from "@/components/pages/Vendors";
import Settings from "@/components/pages/Settings";
import Orders from "@/components/pages/Orders";
import Projects from "@/components/pages/Projects";
import Dashboard from "@/components/pages/Dashboard";
import BillingModelSelection from "@/components/pages/BillingModelSelection";
import Products from "@/components/pages/Products";
import BillingModels from "@/components/pages/BillingModels";
import Reports from "@/components/pages/Reports";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/billing-model-selection" element={<BillingModelSelection />} />
          <Route path="/billing-model-config/one-time" element={<OneTimeConfig />} />
          <Route path="/billing-model-config/credit" element={<CreditConfig />} />
          <Route path="/billing-model-config/usage" element={<UsageConfig />} />
          <Route path="/billing-model-config/marketplace" element={<MarketplaceConfig />} />
          <Route path="/billing-model-config/milestone" element={<MilestoneConfig />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="billing-models" element={<BillingModels />} />
            <Route path="products" element={<Products />} />
            <Route path="customers" element={<Customers />} />
            <Route path="orders" element={<Orders />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="projects" element={<Projects />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-50"
        />
</div>
    </Router>
  );
}

export default App;