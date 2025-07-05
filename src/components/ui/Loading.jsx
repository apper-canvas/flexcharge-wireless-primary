import { motion } from 'framer-motion'

const Loading = ({ type = 'dashboard' }) => {
  const shimmerEffect = "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer"
  
  if (type === 'dashboard') {
    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className={`h-4 w-20 rounded ${shimmerEffect} mb-3`} />
                  <div className={`h-8 w-24 rounded ${shimmerEffect} mb-3`} />
                  <div className={`h-3 w-16 rounded ${shimmerEffect}`} />
                </div>
                <div className={`w-12 h-12 rounded-lg ${shimmerEffect}`} />
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Chart Area */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className={`h-6 w-32 rounded ${shimmerEffect} mb-6`} />
          <div className={`h-64 w-full rounded ${shimmerEffect}`} />
        </div>
        
        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className={`h-6 w-40 rounded ${shimmerEffect} mb-4`} />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className={`h-4 w-20 rounded ${shimmerEffect}`} />
                  <div className={`h-4 w-32 rounded ${shimmerEffect}`} />
                  <div className={`h-4 w-16 rounded ${shimmerEffect}`} />
                  <div className={`h-4 w-24 rounded ${shimmerEffect}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  if (type === 'list') {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg ${shimmerEffect}`} />
                <div>
                  <div className={`h-4 w-32 rounded ${shimmerEffect} mb-2`} />
                  <div className={`h-3 w-24 rounded ${shimmerEffect}`} />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`h-6 w-20 rounded-full ${shimmerEffect}`} />
                <div className={`h-8 w-8 rounded ${shimmerEffect}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }
  
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

export default Loading