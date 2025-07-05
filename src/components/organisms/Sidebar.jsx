import { motion } from 'framer-motion'
import Logo from '@/components/atoms/Logo'
import NavigationItem from '@/components/molecules/NavigationItem'
import { useBillingModels } from '@/hooks/useBillingModels'

const Sidebar = ({ isOpen, onClose }) => {
  const { activeModels } = useBillingModels()
  
  const baseNavigation = [
    { to: '/', icon: 'Home', label: 'Dashboard' },
    { to: '/billing-models', icon: 'CreditCard', label: 'Billing Models' },
    { to: '/products', icon: 'Package', label: 'Products' },
    { to: '/customers', icon: 'Users', label: 'Customers' },
    { to: '/orders', icon: 'ShoppingCart', label: 'Orders & Transactions' }
  ]
  
  const conditionalNavigation = []
  
  if (activeModels.includes('marketplace')) {
    conditionalNavigation.push({ to: '/vendors', icon: 'Store', label: 'Vendors' })
  }
  
  if (activeModels.includes('milestone')) {
    conditionalNavigation.push({ to: '/projects', icon: 'FolderOpen', label: 'Projects' })
  }
  
  const bottomNavigation = [
    { to: '/reports', icon: 'BarChart3', label: 'Reports' },
    { to: '/settings', icon: 'Settings', label: 'Settings' }
  ]
  
  const allNavigation = [...baseNavigation, ...conditionalNavigation, ...bottomNavigation]
  
  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  }
  
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200">
        <div className="flex items-center px-6 py-4 border-b border-gray-200">
          <Logo />
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {allNavigation.map((item) => (
            <NavigationItem key={item.to} {...item} />
          ))}
        </nav>
      </div>
      
      {/* Mobile sidebar */}
      <motion.div
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 lg:hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <Logo />
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <motion.div whileTap={{ scale: 0.95 }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.div>
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {allNavigation.map((item) => (
            <NavigationItem key={item.to} {...item} />
          ))}
        </nav>
      </motion.div>
    </>
  )
}

export default Sidebar