import mockData from '@/services/mockData/billingModels.json'

let models = [...mockData]

export const billingModelsService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return [...models]
  },
  
  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return models.find(model => model.Id === id)
  },
  
  create: async (modelData) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newModel = {
      ...modelData,
      Id: Math.max(...models.map(m => m.Id)) + 1
    }
    models.push(newModel)
    return newModel
  },
  
  update: async (id, modelData) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = models.findIndex(model => model.Id === id)
    if (index !== -1) {
      models[index] = { ...models[index], ...modelData }
      return models[index]
    }
    throw new Error('Model not found')
  },
  
  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = models.findIndex(model => model.Id === id)
    if (index !== -1) {
      models.splice(index, 1)
      return true
    }
    throw new Error('Model not found')
  }
}