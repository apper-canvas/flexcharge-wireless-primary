import mockData from '@/services/mockData/vendors.json'

let vendors = [...mockData]

export const vendorsService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return [...vendors]
  },
  
  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return vendors.find(vendor => vendor.Id === id)
  },
  
  create: async (vendorData) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newVendor = {
      ...vendorData,
      Id: Math.max(...vendors.map(v => v.Id)) + 1
    }
    vendors.push(newVendor)
    return newVendor
  },
  
  update: async (id, vendorData) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = vendors.findIndex(vendor => vendor.Id === id)
    if (index !== -1) {
      vendors[index] = { ...vendors[index], ...vendorData }
      return vendors[index]
    }
    throw new Error('Vendor not found')
  },
  
  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = vendors.findIndex(vendor => vendor.Id === id)
    if (index !== -1) {
      vendors.splice(index, 1)
      return true
    }
    throw new Error('Vendor not found')
  }
}