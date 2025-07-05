import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { vendorsService } from '@/services/api/vendorsService'

const Vendors = () => {
  const [vendors, setVendors] = useState([])
  const [filteredVendors, setFilteredVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  useEffect(() => {
    loadVendors()
  }, [])
  
  useEffect(() => {
    if (searchTerm) {
      const filtered = vendors.filter(vendor =>
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredVendors(filtered)
    } else {
      setFilteredVendors(vendors)
    }
  }, [searchTerm, vendors])
  
  const loadVendors = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await vendorsService.getAll()
      setVendors(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return { variant: 'success', label: 'Active' }
      case 'pending':
        return { variant: 'warning', label: 'Pending' }
      case 'suspended':
        return { variant: 'error', label: 'Suspended' }
      case 'inactive':
        return { variant: 'default', label: 'Inactive' }
      default:
        return { variant: 'default', label: status }
    }
  }
  
  if (loading) return <Loading type="list" />
  if (error) return <Error onRetry={loadVendors} />
  if (!vendors.length) return <Empty title="No vendors found" message="Invite vendors to join your marketplace" icon="Store" actionLabel="Invite Vendor" />
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
          <p className="text-gray-600">Manage marketplace vendors and track their performance</p>
        </div>
        <Button variant="primary" icon="UserPlus">
          Invite Vendor
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          onSearch={setSearchTerm}
          placeholder="Search vendors..."
          className="flex-1"
        />
        <Button variant="outline" icon="Filter" className="sm:w-auto">
          Filter
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Sales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pending Payout
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVendors.map((vendor, index) => {
                const statusBadge = getStatusBadge(vendor.status)
                return (
                  <motion.tr
                    key={vendor.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-secondary to-purple-600 rounded-full flex items-center justify-center">
                          <ApperIcon name="Store" className="w-5 h-5 text-white" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                          <div className="text-sm text-gray-500">{vendor.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={statusBadge.variant} size="sm">
                        {statusBadge.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vendor.productCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${vendor.totalSales.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vendor.commissionRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${vendor.pendingPayout.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" icon="Eye" className="text-primary hover:text-primary">
                          View
                        </Button>
                        <Button variant="ghost" size="sm" icon="Send" className="text-green-600 hover:text-green-700">
                          Payout
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Vendors