import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Dashboard from '@/components/pages/Dashboard'
import BillingModels from '@/components/pages/BillingModels'
import Products from '@/components/pages/Products'
import Customers from '@/components/pages/Customers'
import Orders from '@/components/pages/Orders'
import Vendors from '@/components/pages/Vendors'
import Projects from '@/components/pages/Projects'
import Reports from '@/components/pages/Reports'
import Settings from '@/components/pages/Settings'
import Onboarding from '@/components/pages/Onboarding'
import BillingModelSelection from '@/components/pages/BillingModelSelection'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/billing-model-selection" element={<BillingModelSelection />} />
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
  )
}

export default App