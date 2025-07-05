import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import StatCard from '@/components/molecules/StatCard'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { dashboardService } from '@/services/api/dashboardService'
import { useBillingModels } from '@/hooks/useBillingModels'

const Dashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { primaryModel } = useBillingModels()
  
  useEffect(() => {
    loadDashboardData()
  }, [])
  
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const dashboardData = await dashboardService.getDashboardData()
      setData(dashboardData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) return <Loading type="dashboard" />
  if (error) return <Error onRetry={loadDashboardData} />
  if (!data) return <Empty title="No dashboard data" message="Configure your billing model to see analytics" />
  
  const getModelSpecificStats = () => {
    switch (primaryModel) {
      case 'one-time':
        return [
          { title: 'Total Revenue', value: '$24,500', icon: 'DollarSign', trend: 'up', trendValue: '+12%' },
          { title: 'Products Sold', value: '1,247', icon: 'Package', trend: 'up', trendValue: '+8%' },
          { title: 'Conversion Rate', value: '3.2%', icon: 'TrendingUp', trend: 'up', trendValue: '+0.4%' },
          { title: 'Active Products', value: '42', icon: 'Archive', trend: 'neutral', trendValue: 'No change' }
        ]
      case 'credit':
        return [
          { title: 'Credit Revenue', value: '$18,750', icon: 'Coins', trend: 'up', trendValue: '+15%' },
          { title: 'Credits Sold', value: '125K', icon: 'Zap', trend: 'up', trendValue: '+22%' },
          { title: 'Active Users', value: '2,340', icon: 'Users', trend: 'up', trendValue: '+18%' },
          { title: 'Avg. Purchase', value: '$45', icon: 'CreditCard', trend: 'up', trendValue: '+5%' }
        ]
      case 'usage':
        return [
          { title: 'Usage Revenue', value: '$32,100', icon: 'Activity', trend: 'up', trendValue: '+25%' },
          { title: 'API Calls', value: '2.4M', icon: 'Database', trend: 'up', trendValue: '+30%' },
          { title: 'Active Accounts', value: '456', icon: 'Users', trend: 'up', trendValue: '+12%' },
          { title: 'Avg. Usage', value: '$70', icon: 'BarChart3', trend: 'up', trendValue: '+8%' }
        ]
      case 'marketplace':
        return [
          { title: 'Marketplace Revenue', value: '$45,600', icon: 'Store', trend: 'up', trendValue: '+18%' },
          { title: 'Vendor Payouts', value: '$38,760', icon: 'Send', trend: 'up', trendValue: '+20%' },
          { title: 'Active Vendors', value: '127', icon: 'Users', trend: 'up', trendValue: '+15%' },
          { title: 'Commission Earned', value: '$6,840', icon: 'Percent', trend: 'up', trendValue: '+12%' }
        ]
      case 'milestone':
        return [
          { title: 'Project Revenue', value: '$28,900', icon: 'FolderOpen', trend: 'up', trendValue: '+10%' },
          { title: 'Active Projects', value: '23', icon: 'Briefcase', trend: 'up', trendValue: '+4%' },
          { title: 'Completed Projects', value: '156', icon: 'CheckCircle', trend: 'up', trendValue: '+8%' },
          { title: 'Avg. Project Value', value: '$1,256', icon: 'DollarSign', trend: 'up', trendValue: '+6%' }
        ]
      default:
        return [
          { title: 'Total Revenue', value: '$24,500', icon: 'DollarSign', trend: 'up', trendValue: '+12%' },
          { title: 'Total Orders', value: '1,247', icon: 'ShoppingCart', trend: 'up', trendValue: '+8%' },
          { title: 'Active Customers', value: '456', icon: 'Users', trend: 'up', trendValue: '+15%' },
          { title: 'Conversion Rate', value: '3.2%', icon: 'TrendingUp', trend: 'up', trendValue: '+0.4%' }
        ]
    }
  }
  
  const stats = getModelSpecificStats()
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Monitor your billing performance and key metrics</p>
        </div>
        <Button variant="primary" icon="Plus">
          Add Product
        </Button>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              trendValue={stat.trendValue}
              gradient={index === 0}
            />
          </motion.div>
        ))}
      </div>
      
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {data.recentOrders.map((order) => (
              <div key={order.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                    <ApperIcon name="ShoppingCart" className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{order.customerName}</p>
                    <p className="text-sm text-gray-600">{order.product}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${order.amount}</p>
                  <p className="text-sm text-gray-600">{order.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <ApperIcon name="Plus" className="w-6 h-6 mb-2" />
              Add Product
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <ApperIcon name="Users" className="w-6 h-6 mb-2" />
              View Customers
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <ApperIcon name="BarChart3" className="w-6 h-6 mb-2" />
              View Reports
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <ApperIcon name="Settings" className="w-6 h-6 mb-2" />
              Settings
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard