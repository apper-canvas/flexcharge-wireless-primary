import mockData from '@/services/mockData/billingModelConfig.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const getConfigByType = async (modelType) => {
  await delay(300)
  const config = mockData.find(config => config.modelType === modelType)
  if (!config) {
    throw new Error(`Configuration not found for model type: ${modelType}`)
  }
  return { ...config }
}

export const saveConfig = async (modelType, configData) => {
  await delay(500)
  // In a real app, this would save to backend
  console.log('Saving config for', modelType, configData)
  return { success: true, message: 'Configuration saved successfully' }
}

export const getDefaultConfig = async (modelType) => {
  await delay(200)
  const config = mockData.find(config => config.modelType === modelType)
  if (!config) {
    throw new Error(`Default configuration not found for model type: ${modelType}`)
  }
  return { ...config.defaultSettings }
}

export default {
  getConfigByType,
  saveConfig,
  getDefaultConfig
}