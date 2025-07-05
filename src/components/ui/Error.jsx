import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ 
  title = "Something went wrong", 
  message = "We encountered an error while loading the data. Please try again.",
  onRetry,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center justify-center min-h-[400px] ${className}`}
    >
      <Card className="p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        {onRetry && (
          <Button
            variant="primary"
            onClick={onRetry}
            icon="RefreshCw"
            className="w-full"
          >
            Try Again
          </Button>
        )}
      </Card>
    </motion.div>
  )
}

export default Error