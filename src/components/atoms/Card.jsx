import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '',
  hover = false,
  onClick,
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-200'
  const hoverClasses = hover ? 'hover:shadow-lg hover:border-gray-300 cursor-pointer transform hover:scale-102' : ''
  
  const CardComponent = onClick ? motion.div : 'div'
  
  return (
    <CardComponent
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
      whileHover={hover ? { scale: 1.02 } : {}}
      whileTap={hover ? { scale: 0.98 } : {}}
      {...props}
    >
      {children}
    </CardComponent>
  )
}

export default Card