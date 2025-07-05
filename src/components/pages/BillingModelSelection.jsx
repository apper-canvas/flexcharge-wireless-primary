import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Logo from '@/components/atoms/Logo'
import BillingModelCard from '@/components/molecules/BillingModelCard'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'

const BillingModelSelection = () => {
  const navigate = useNavigate()
const [selectedModel, setSelectedModel] = useState(null)
  const [loading, setLoading] = useState(false)
  
  const billingModels = [
    {
      type: 'one-time',
      title: 'One-Time Purchase',
      description: 'Single payment for products or services',
      icon: 'ShoppingCart',
      bestFor: 'Digital downloads, tools, templates',
      gradient: 'bg-gradient-to-r from-blue-500 to-blue-600'
    },
    {
      type: 'credit',
      title: 'Credit System',
      description: 'Pre-purchased credits consumed by usage',
      icon: 'Coins',
      bestFor: 'AI tools, API access, image generation',
      gradient: 'bg-gradient-to-r from-green-500 to-green-600'
    },
    {
      type: 'usage',
      title: 'Usage-Based',
      description: 'Pay-as-you-go based on consumption',
      icon: 'Activity',
      bestFor: 'Cloud services, APIs, data processing',
      gradient: 'bg-gradient-to-r from-purple-500 to-purple-600'
    },
    {
      type: 'marketplace',
      title: 'Marketplace',
      description: 'Multi-vendor platform with commissions',
      icon: 'Store',
      bestFor: 'Freelance platforms, app stores, service aggregators',
      gradient: 'bg-gradient-to-r from-orange-500 to-orange-600'
    },
    {
      type: 'milestone',
      title: 'Milestone/Project',
      description: 'Phased payments for projects',
      icon: 'Calendar',
      bestFor: 'Freelance work, consulting, custom development',
      gradient: 'bg-gradient-to-r from-pink-500 to-pink-600'
    }
  ]
  
  const handleModelSelect = (modelType) => {
    setSelectedModel(modelType)
  }
  
const handleContinue = async () => {
    if (!selectedModel) {
      toast.error('Please select a billing model')
      return
    }
    
    setLoading(true)
try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success('Proceeding to model configuration')
      navigate(`/billing-model-config/${selectedModel}`)
    } catch (error) {
      toast.error('Failed to proceed to configuration')
    } finally {
      setLoading(false)
    }
  }
  
  const handleBack = () => {
    navigate('/onboarding')
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <div className="max-w-6xl mx-auto">
<div className="text-center mb-8">
          <Logo size="lg" className="justify-center mb-4" />
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-2">
              <span>Setup (1/5)</span>
              <ApperIcon name="ArrowRight" size={16} />
              <span className="text-primary font-medium">Model (2/5)</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Billing Model</h1>
          <p className="text-gray-600">Select the primary billing model that best fits your business needs</p>
        </div>
        
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {billingModels.map((model, index) => (
            <motion.div
              key={model.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <BillingModelCard
                model={model}
                isSelected={selectedModel === model.type}
                onSelect={handleModelSelect}
              />
            </motion.div>
          ))}
        </div>
        
<Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Selected Model</h3>
              <p className="text-sm text-gray-600">
                {selectedModel 
                  ? `${billingModels.find(m => m.type === selectedModel)?.title} selected`
                  : 'No model selected yet'
                }
              </p>
            </div>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={handleBack}
                icon="ArrowLeft"
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleContinue}
                loading={loading}
                icon="ArrowRight"
                disabled={!selectedModel}
              >
                Continue
              </Button>
            </div>
          </div>
        </Card>
        
<div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/billing-models')}
            icon="Plus"
            className="mb-4"
          >
            Add Another Model
          </Button>
          <p className="text-sm text-gray-600">
            You can add additional billing models later to support multiple revenue streams
          </p>
        </div>
      </div>
    </div>
  )
}

export default BillingModelSelection