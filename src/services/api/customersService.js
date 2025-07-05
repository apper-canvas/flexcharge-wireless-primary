import mockData from '@/services/mockData/customers.json'

let customers = [...mockData]

export const customersService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return [...customers]
  },
  
  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return customers.find(customer => customer.Id === id)
  },
  
  create: async (customerData) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newCustomer = {
      ...customerData,
      Id: Math.max(...customers.map(c => c.Id)) + 1
    }
    customers.push(newCustomer)
    return newCustomer
  },
  
  update: async (id, customerData) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = customers.findIndex(customer => customer.Id === id)
    if (index !== -1) {
      customers[index] = { ...customers[index], ...customerData }
      return customers[index]
    }
    throw new Error('Customer not found')
  },
  
  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = customers.findIndex(customer => customer.Id === id)
    if (index !== -1) {
      customers.splice(index, 1)
      return true
    }
    throw new Error('Customer not found')
  }
}