import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Logo from '@/components/atoms/Logo'
import FormField from '@/components/molecules/FormField'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'
import billingModelConfigService from '@/services/api/billingModelConfigService'

const OneTimeConfig = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({})
  const [configData, setConfigData] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true)
        const config = await billingModelConfigService.getConfigByType('one-time')
        setConfigData(config)
        setFormData(config.defaultSettings)
      } catch (error) {
        toast.error('Failed to load configuration')
        console.error('Error loading config:', error)
      } finally {
        setLoading(false)
      }
    }

    loadConfig()
  }, [])

const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      }
      
      // Handle policy text pre-filling
      if (field === 'refundPolicyType' && value) {
        const policyField = configData.fields.find(f => f.name === 'refundPolicyText')
        if (policyField && policyField.options) {
          const selectedOption = policyField.options.find(opt => opt.value === value)
          if (selectedOption && selectedOption.policyText) {
            newData.refundPolicyText = selectedOption.policyText
          }
        }
      }
      
      return newData
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await billingModelConfigService.saveConfig('one-time', formData)
      toast.success('Configuration saved successfully')
      navigate('/')
    } catch (error) {
      toast.error('Failed to save configuration')
      console.error('Error saving config:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleBack = () => {
    navigate('/billing-model-selection')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading configuration...</p>
        </div>
      </div>
    )
  }

  if (!configData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="mx-auto mb-4 text-red-500" />
          <p className="text-gray-600">Failed to load configuration</p>
          <Button onClick={() => navigate('/billing-model-selection')} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center mb-4" />
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-2">
              <span>Setup (1/5)</span>
              <ApperIcon name="ArrowRight" size={16} />
              <span>Model (2/5)</span>
              <ApperIcon name="ArrowRight" size={16} />
              <span className="text-primary font-medium">Config (3/5)</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{configData.title}</h1>
          <p className="text-gray-600">{configData.description}</p>
        </div>

<motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Delivery Method Overview */}
          <Card className="p-6 mb-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delivery Method Options</h3>
              <p className="text-sm text-gray-600">Available delivery methods for your one-time purchase products</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                  <ApperIcon name="Download" size={24} className="text-blue-600" />
                </div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Instant Download</h4>
                <p className="text-xs text-gray-500 text-center">Immediate file download after payment</p>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <ApperIcon name="Mail" size={24} className="text-green-600" />
                </div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Email Delivery</h4>
                <p className="text-xs text-gray-500 text-center">Files sent via email attachment</p>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
                  <ApperIcon name="User" size={24} className="text-purple-600" />
                </div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Account-Based Access</h4>
                <p className="text-xs text-gray-500 text-center">Access through user account portal</p>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3">
                  <ApperIcon name="Zap" size={24} className="text-orange-600" />
                </div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">API/Webhook</h4>
                <p className="text-xs text-gray-500 text-center">Programmatic delivery via API</p>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
                  <ApperIcon name="XCircle" size={24} className="text-gray-600" />
                </div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">No Delivery</h4>
                <p className="text-xs text-gray-500 text-center">Service completed upon payment</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 mb-6">
            <div className="space-y-8">
              {/* Delivery Method Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Method</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {configData.fields.filter(field => field.section === 'delivery').map((field, index) => {
                    const isVisible = !field.dependsOn || formData[field.dependsOn]
                    if (!isVisible) return null
                    
                    return (
                      <motion.div
                        key={field.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={field.type === 'textarea' ? 'md:col-span-2' : ''}
                      >
                        {field.type === 'checkbox' ? (
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              id={field.name}
                              checked={formData[field.name] || false}
                              onChange={(e) => handleInputChange(field.name, e.target.checked)}
                              className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                            />
                            <div>
                              <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                                {field.label}
                              </label>
                              {field.description && (
                                <p className="text-xs text-gray-500 mt-1">{field.description}</p>
                              )}
                            </div>
                          </div>
                        ) : field.type === 'select' ? (
                          <FormField
                            type="select"
                            label={field.label}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            options={field.options}
                            className="w-full"
                          />
                        ) : (
                          <FormField
                            type={field.type}
                            label={field.label}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleInputChange(field.name, field.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value)}
                            className="w-full"
                          />
                        )}
                        {field.description && field.type !== 'checkbox' && (
                          <p className="text-xs text-gray-500 mt-1">{field.description}</p>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Licensing Options Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Licensing Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {configData.fields.filter(field => field.section === 'licensing').map((field, index) => {
                    const isVisible = !field.dependsOn || formData[field.dependsOn]
                    if (!isVisible) return null
                    
                    return (
                      <motion.div
                        key={field.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={field.type === 'textarea' ? 'md:col-span-2' : ''}
                      >
                        {field.type === 'checkbox' ? (
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              id={field.name}
                              checked={formData[field.name] || false}
                              onChange={(e) => handleInputChange(field.name, e.target.checked)}
                              className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                            />
                            <div>
                              <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                                {field.label}
                              </label>
                              {field.description && (
                                <p className="text-xs text-gray-500 mt-1">{field.description}</p>
                              )}
                            </div>
                          </div>
                        ) : field.type === 'select' ? (
                          <FormField
                            type="select"
                            label={field.label}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            options={field.options}
                            className="w-full"
                          />
                        ) : (
                          <FormField
                            type={field.type}
                            label={field.label}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleInputChange(field.name, field.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value)}
                            className="w-full"
                          />
                        )}
                        {field.description && field.type !== 'checkbox' && (
                          <p className="text-xs text-gray-500 mt-1">{field.description}</p>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Payment Settings Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {configData.fields.filter(field => field.section === 'payment').map((field, index) => {
                    const isVisible = !field.dependsOn || formData[field.dependsOn]
                    if (!isVisible) return null
                    
                    return (
                      <motion.div
                        key={field.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={field.type === 'textarea' ? 'md:col-span-2' : ''}
                      >
                        {field.type === 'checkbox' ? (
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              id={field.name}
                              checked={formData[field.name] || false}
                              onChange={(e) => handleInputChange(field.name, e.target.checked)}
                              className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                            />
                            <div>
                              <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                                {field.label}
                              </label>
                              {field.description && (
                                <p className="text-xs text-gray-500 mt-1">{field.description}</p>
                              )}
                            </div>
                          </div>
                        ) : field.type === 'select' ? (
                          <FormField
                            type="select"
                            label={field.label}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            options={field.options}
                            className="w-full"
                          />
                        ) : (
                          <FormField
                            type={field.type}
                            label={field.label}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleInputChange(field.name, field.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value)}
                            className="w-full"
                          />
                        )}
                        {field.description && field.type !== 'checkbox' && (
                          <p className="text-xs text-gray-500 mt-1">{field.description}</p>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Refund Policy Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Refund Policy</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {configData.fields.filter(field => field.section === 'refund').map((field, index) => {
                    const isVisible = !field.dependsOn || formData[field.dependsOn]
                    if (!isVisible) return null
                    
                    return (
                      <motion.div
                        key={field.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={field.type === 'textarea' ? 'md:col-span-2' : ''}
                      >
                        {field.type === 'checkbox' ? (
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              id={field.name}
                              checked={formData[field.name] || false}
                              onChange={(e) => handleInputChange(field.name, e.target.checked)}
                              className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                            />
                            <div>
                              <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                                {field.label}
                              </label>
                              {field.description && (
                                <p className="text-xs text-gray-500 mt-1">{field.description}</p>
                              )}
                            </div>
                          </div>
                        ) : field.type === 'select' ? (
                          <FormField
                            type="select"
                            label={field.label}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            options={field.options}
                            className="w-full"
                          />
                        ) : (
                          <FormField
                            type={field.type}
                            label={field.label}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleInputChange(field.name, field.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value)}
                            className="w-full"
                          />
                        )}
                        {field.description && field.type !== 'checkbox' && (
                          <p className="text-xs text-gray-500 mt-1">{field.description}</p>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Configuration Summary</h3>
                <p className="text-sm text-gray-600">
                  Review your settings and save to continue
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
                  onClick={handleSave}
                  loading={saving}
                  icon="Save"
                >
                  Save & Continue
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default OneTimeConfig