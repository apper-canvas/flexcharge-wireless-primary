import ApperIcon from '@/components/ApperIcon'

const Logo = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xl',
    md: 'w-10 h-10 text-2xl',
    lg: 'w-12 h-12 text-3xl'
  }
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className={`${sizes[size]} bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold shadow-lg`}>
        <ApperIcon name="Zap" className="w-6 h-6" />
      </div>
      <span className="ml-3 text-xl font-bold text-gray-900">FlexCharge</span>
    </div>
  )
}

export default Logo