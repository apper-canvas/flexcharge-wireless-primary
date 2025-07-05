import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Logo from '@/components/atoms/Logo'
import BillingModelCard from '@/components/molecules/BillingModelCard'
import { toast } from 'react-toastify'

const BillingModelSelection = () => {
  const navigate = useNavigate()
  const [selectedModels, setSelectedModels] = useState([])
  const [loading, setLoading] = useState(false)
  
  const billingModels = [
    {
      type: 'one-time',
      title: 'One-Time Purchase',
      description: 'Single payment for products or services',
      icon: 'ShoppingCart',
      bestFor: 'Digital downloads, tools, templates, one-time services',
      gradient: 'bg-gradient-to-r from-blue-500 to-blue-600'
    },
    {
      type: 'credit',
      title: 'Credit System',
      description: 'Pre-purchased credits for usage',
      icon: 'Coins',
      bestFor: 'AI tools, API access, image generation, file processing',
      gradient: 'bg-gradient-to-r from-green-500 to-green-600'
    },
    {
      type: 'usage',
      title: 'Usage-Based',
      description: 'Pay-as-you-go pricing model',
      icon: 'Activity',
      bestFor: 'Cloud services, APIs, data processing, bandwidth',
      gradient: 'bg-gradient-to-r from-purple-500 to-purple-600'
    },
    {
      type: 'marketplace',
      title: 'Marketplace',
      description: 'Multi-vendor platform with commissions',
      icon: 'Store',
      bestFor: 'Freelance platforms, app stores, service marketplaces',
      gradient: 'bg-gradient-to-r from-orange-500 to-orange-600'
    },
    {
      type: 'milestone',
      title: 'Milestone/Project',
      description: 'Phased payments for project completion',
      icon: 'Calendar',
      bestFor: 'Freelance work, consulting, custom development',
      gradient: 'bg-gradient-to-r from-pink-500 to-pink-600'
    }
  ]
  
  const handleModelSelect = (modelType) => {
    setSelectedModels(prev => {
      if (prev.includes(modelType)) {
        return prev.filter(m => m !== modelType)
      } else {
        return [...prev, modelType]
      }
    })
  }
  
  const handleContinue = async () => {
    if (selectedModels.length === 0) {
      toast.error('Please select at least one billing model')
      return
    }
    
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Billing models configured successfully')
      navigate('/')
    } catch (error) {
      toast.error('Failed to configure billing models')
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Billing Models</h1>
          <p className="text-gray-600">Select one or more billing models that fit your business needs</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {billingModels.map((model, index) => (
            <motion.div
              key={model.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <BillingModelCard
                model={model}
                isSelected={selectedModels.includes(model.type)}
                onSelect={handleModelSelect}
              />
            </motion.div>
          ))}
        </div>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Selected Models</h3>
              <p className="text-sm text-gray-600">
                {selectedModels.length > 0 
                  ? `${selectedModels.length} model${selectedModels.length > 1 ? 's' : ''} selected`
                  : 'No models selected yet'
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
                disabled={selectedModels.length === 0}
              >
                Continue to Dashboard
              </Button>
            </div>
          </div>
        </Card>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            You can always add or remove billing models later in your settings
          </p>
        </div>
      </div>
    </div>
  )
}

export default BillingModelSelection