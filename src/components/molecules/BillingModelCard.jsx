import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const BillingModelCard = ({ 
  model, 
  isSelected = false, 
  onSelect,
  className = '' 
}) => {
  const { type, title, description, icon, bestFor, gradient } = model
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      <Card 
        className={`p-6 cursor-pointer transition-all duration-200 ${
          isSelected 
            ? 'ring-2 ring-primary border-primary shadow-lg' 
            : 'hover:shadow-lg hover:border-gray-300'
        }`}
        onClick={() => onSelect(type)}
      >
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg mb-4 ${gradient}`}>
            <ApperIcon name={icon} className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-4">{description}</p>
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-xs font-medium text-gray-700 mb-1">Best for:</p>
            <p className="text-xs text-gray-600">{bestFor}</p>
          </div>
          <Button
            variant={isSelected ? 'primary' : 'outline'}
            size="sm"
            className="w-full"
          >
            {isSelected ? 'Selected' : 'Select Model'}
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}

export default BillingModelCard