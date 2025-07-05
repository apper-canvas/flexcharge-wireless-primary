import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import StatCard from '@/components/molecules/StatCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { reportsService } from '@/services/api/reportsService'

const Reports = () => {
  const [reports, setReports] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  
  useEffect(() => {
    loadReports()
  }, [selectedPeriod])
  
  const loadReports = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await reportsService.getReports(selectedPeriod)
      setReports(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const periods = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ]
  
  if (loading) return <Loading type="dashboard" />
  if (error) return <Error onRetry={loadReports} />
  if (!reports) return <Empty title="No report data" message="Generate your first report to see analytics" icon="BarChart3" />
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Analyze your billing performance and revenue trends</p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {periods.map(period => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
          <Button variant="outline" icon="Download">
            Export
          </Button>
        </div>
      </div>
      
      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${reports.totalRevenue.toLocaleString()}`}
          icon="DollarSign"
          trend="up"
          trendValue={`+${reports.revenueGrowth}%`}
          gradient={true}
        />
        <StatCard
          title="Total Orders"
          value={reports.totalOrders.toLocaleString()}
          icon="ShoppingCart"
          trend="up"
          trendValue={`+${reports.ordersGrowth}%`}
        />
        <StatCard
          title="Average Order Value"
          value={`$${reports.averageOrderValue.toFixed(2)}`}
          icon="TrendingUp"
          trend="up"
          trendValue={`+${reports.aovGrowth}%`}
        />
        <StatCard
          title="Conversion Rate"
          value={`${reports.conversionRate}%`}
          icon="Target"
          trend="up"
          trendValue={`+${reports.conversionGrowth}%`}
        />
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <div className="h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ApperIcon name="TrendingUp" className="w-12 h-12 text-primary mx-auto mb-2" />
              <p className="text-gray-600">Chart placeholder</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Model</h3>
          <div className="h-64 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ApperIcon name="PieChart" className="w-12 h-12 text-secondary mx-auto mb-2" />
              <p className="text-gray-600">Chart placeholder</p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
          <div className="space-y-3">
            {reports.topProducts.map((product, index) => (
              <motion.div
                key={product.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales} sales</p>
                  </div>
                </div>
                <p className="font-medium text-gray-900">${product.revenue.toLocaleString()}</p>
              </motion.div>
            ))}
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Customers</h3>
          <div className="space-y-3">
            {reports.topCustomers.map((customer, index) => (
              <motion.div
                key={customer.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-secondary to-purple-600 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-600">{customer.orders} orders</p>
                  </div>
                </div>
                <p className="font-medium text-gray-900">${customer.totalSpent.toLocaleString()}</p>
              </motion.div>
            ))}
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
          <div className="space-y-3">
            {reports.revenueBreakdown.map((item, index) => (
              <motion.div
                key={item.model}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color}`}>
                    <ApperIcon name={item.icon} className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.model}</p>
                    <p className="text-sm text-gray-600">{item.percentage}% of total</p>
                  </div>
                </div>
                <p className="font-medium text-gray-900">${item.amount.toLocaleString()}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Reports