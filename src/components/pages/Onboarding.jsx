import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Logo from "@/components/atoms/Logo";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import { customersService } from "@/services/api/customersService";

const Onboarding = () => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user?.user)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    organizationName: '',
    businessType: '',
    primaryCurrency: '',
    country: '',
    logo: null
  })
  
  const businessTypes = [
    { value: 'saas', label: 'SaaS/Software' },
    { value: 'digital', label: 'Digital Products' },
    { value: 'services', label: 'Services' },
    { value: 'marketplace', label: 'Marketplace' },
    { value: 'mixed', label: 'Mixed' }
  ]
  
  const currencies = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'CAD', label: 'CAD - Canadian Dollar' },
    { value: 'AUD', label: 'AUD - Australian Dollar' }
  ]
  
  const countries = [
    { value: 'US', label: 'United States' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' },
    { value: 'AU', label: 'Australia' },
    { value: 'DE', label: 'Germany' }
  ]
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.organizationName) {
      toast.error('Organization name is required')
      return
    }
    
setLoading(true)
    try {
      // Mark onboarding as completed in the database
      if (user?.emailAddress) {
        await customersService.markOnboardingComplete(user.emailAddress)
      }
      toast.success('Organization setup completed')
      navigate('/billing-model-selection')
    } catch (error) {
      console.error('Failed to complete onboarding:', error)
      toast.error('Failed to setup organization')
    } finally {
      setLoading(false)
    }
  }
  
  const handleSkip = () => {
    navigate('/')
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to FlexCharge</h1>
          <p className="text-gray-600">Let's set up your billing system in just a few steps</p>
        </div>
        
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Organization Name"
                placeholder="Enter your organization name"
                value={formData.organizationName}
                onChange={(e) => handleInputChange('organizationName', e.target.value)}
                required
              />
              <Select
                label="Business Type"
                placeholder="Select business type"
                options={businessTypes}
                value={formData.businessType}
                onChange={(e) => handleInputChange('businessType', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Primary Currency"
                placeholder="Select currency"
                options={currencies}
                value={formData.primaryCurrency}
                onChange={(e) => handleInputChange('primaryCurrency', e.target.value)}
              />
              <Select
                label="Country"
                placeholder="Select country"
                options={countries}
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo Upload (Optional)
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Building" className="w-8 h-8 text-white" />
                </div>
                <Button variant="outline" icon="Upload" type="button">
                  Upload Logo
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                icon="ArrowRight"
                className="flex-1"
              >
                Continue to Billing Models
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleSkip}
                className="flex-1"
              >
                Skip Setup
              </Button>
            </div>
          </form>
        </Card>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Need help? <a href="#" className="text-primary hover:underline">Contact support</a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Onboarding