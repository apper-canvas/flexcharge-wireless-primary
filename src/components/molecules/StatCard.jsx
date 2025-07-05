import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue,
  className = '',
  gradient = false
}) => {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
  const trendIcon = trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'
  
  return (
    <Card className={`p-6 ${gradient ? 'bg-gradient-to-r from-primary to-secondary text-white' : ''} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${gradient ? 'text-white/80' : 'text-gray-600'}`}>
            {title}
          </p>
          <p className={`text-3xl font-bold mt-2 ${gradient ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </p>
          {trend && (
            <div className={`flex items-center mt-2 ${gradient ? 'text-white/80' : trendColor}`}>
              <ApperIcon name={trendIcon} className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${gradient ? 'bg-white/20' : 'bg-gray-100'}`}>
          <ApperIcon name={icon} className={`w-6 h-6 ${gradient ? 'text-white' : 'text-gray-600'}`} />
        </div>
      </div>
    </Card>
  )
}

export default StatCard