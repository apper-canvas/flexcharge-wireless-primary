import { useState, useEffect } from 'react'

export const useBillingModels = () => {
  const [activeModels, setActiveModels] = useState(['one-time', 'credit'])
  const [primaryModel, setPrimaryModel] = useState('one-time')
  
  useEffect(() => {
    // In a real app, this would fetch from an API or local storage
    const savedModels = localStorage.getItem('activeModels')
    const savedPrimary = localStorage.getItem('primaryModel')
    
    if (savedModels) {
      setActiveModels(JSON.parse(savedModels))
    }
    if (savedPrimary) {
      setPrimaryModel(savedPrimary)
    }
  }, [])
  
  const addModel = (model) => {
    setActiveModels(prev => {
      const newModels = [...prev, model]
      localStorage.setItem('activeModels', JSON.stringify(newModels))
      return newModels
    })
  }
  
  const removeModel = (model) => {
    setActiveModels(prev => {
      const newModels = prev.filter(m => m !== model)
      localStorage.setItem('activeModels', JSON.stringify(newModels))
      return newModels
    })
  }
  
  const setPrimary = (model) => {
    setPrimaryModel(model)
    localStorage.setItem('primaryModel', model)
  }
  
  return {
    activeModels,
    primaryModel,
    addModel,
    removeModel,
    setPrimary
  }
}