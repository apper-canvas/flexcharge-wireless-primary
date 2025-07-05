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
import { productsService } from '@/services/api/productsService'
import { toast } from 'react-toastify'

const Products = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  useEffect(() => {
    loadProducts()
  }, [])
  
  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products)
    }
  }, [searchTerm, products])
  
  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productsService.getAll()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const handleStatusToggle = async (productId) => {
    try {
      const product = products.find(p => p.Id === productId)
      const newStatus = product.status === 'active' ? 'inactive' : 'active'
      const updatedProduct = await productsService.update(productId, {
        ...product,
        status: newStatus
      })
      setProducts(products.map(p => p.Id === productId ? updatedProduct : p))
      toast.success(`Product ${newStatus === 'active' ? 'activated' : 'deactivated'}`)
    } catch (err) {
      toast.error('Failed to update product status')
    }
  }
  
  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsService.delete(productId)
        setProducts(products.filter(p => p.Id !== productId))
        toast.success('Product deleted successfully')
      } catch (err) {
        toast.error('Failed to delete product')
      }
    }
  }
  
  if (loading) return <Loading type="list" />
  if (error) return <Error onRetry={loadProducts} />
  if (!products.length) return <Empty title="No products found" message="Create your first product to get started" actionLabel="Add Product" />
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog and pricing</p>
        </div>
        <Button variant="primary" icon="Plus">
          Add Product
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          onSearch={setSearchTerm}
          placeholder="Search products..."
          className="flex-1"
        />
        <Button variant="outline" icon="Filter" className="sm:w-auto">
          Filter
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                    <ApperIcon name="Package" className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                  </div>
                </div>
                <Badge 
                  variant={product.status === 'active' ? 'success' : 'warning'}
                  size="sm"
                >
                  {product.status}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{product.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900">${product.price}</p>
                  <p className="text-sm text-gray-600">{product.billingModel} model</p>
                </div>
                <Badge variant="primary" size="sm">
                  {product.category}
                </Badge>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusToggle(product.Id)}
                  className="flex-1"
                >
                  {product.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Edit"
                  className="px-3"
                >
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Trash2"
                  className="px-3 text-red-600 hover:text-red-700"
                  onClick={() => handleDelete(product.Id)}
                >
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Products