import mockData from '@/services/mockData/products.json'

let products = [...mockData]

export const productsService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return [...products]
  },
  
  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return products.find(product => product.Id === id)
  },
  
  create: async (productData) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newProduct = {
      ...productData,
      Id: Math.max(...products.map(p => p.Id)) + 1
    }
    products.push(newProduct)
    return newProduct
  },
  
  update: async (id, productData) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = products.findIndex(product => product.Id === id)
    if (index !== -1) {
      products[index] = { ...products[index], ...productData }
      return products[index]
    }
    throw new Error('Product not found')
  },
  
  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = products.findIndex(product => product.Id === id)
    if (index !== -1) {
      products.splice(index, 1)
      return true
    }
    throw new Error('Product not found')
  }
}