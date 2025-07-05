import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const NavigationItem = ({ to, icon, label, badge, className = '' }) => {
  return (
    <NavLink to={to} className={({ isActive }) => 
      `flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
        isActive 
          ? 'bg-primary/10 text-primary border-r-2 border-primary' 
          : 'text-gray-700 hover:bg-gray-100'
      } ${className}`
    }>
      {({ isActive }) => (
        <motion.div 
          className="flex items-center w-full"
          whileHover={{ x: 2 }}
          transition={{ duration: 0.15 }}
        >
          <ApperIcon name={icon} className="w-5 h-5 mr-3" />
          <span className="flex-1">{label}</span>
          {badge && (
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
              {badge}
            </span>
          )}
        </motion.div>
      )}
    </NavLink>
  )
}

export default NavigationItem