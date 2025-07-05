import mockData from '@/services/mockData/orders.json'

let orders = [...mockData]

export const ordersService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return [...orders]
  },
  
  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return orders.find(order => order.Id === id)
  },
  
  create: async (orderData) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newOrder = {
      ...orderData,
      Id: Math.max(...orders.map(o => o.Id)) + 1
    }
    orders.push(newOrder)
    return newOrder
  },
  
  update: async (id, orderData) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = orders.findIndex(order => order.Id === id)
    if (index !== -1) {
      orders[index] = { ...orders[index], ...orderData }
      return orders[index]
    }
    throw new Error('Order not found')
  },
  
  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = orders.findIndex(order => order.Id === id)
    if (index !== -1) {
      orders.splice(index, 1)
      return true
    }
    throw new Error('Order not found')
  }
}