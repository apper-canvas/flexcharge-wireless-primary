import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "No data found", 
  message = "Get started by adding your first item.",
  icon = "Database",
  actionLabel = "Add Item",
  onAction,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center justify-center min-h-[400px] ${className}`}
    >
      <Card className="p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name={icon} className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        {onAction && (
          <Button
            variant="primary"
            onClick={onAction}
            icon="Plus"
            className="w-full"
          >
            {actionLabel}
          </Button>
        )}
      </Card>
    </motion.div>
  )
}

export default Empty