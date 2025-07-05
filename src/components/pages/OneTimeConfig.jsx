import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Logo from "@/components/atoms/Logo";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Settings from "@/components/pages/Settings";
import FormField from "@/components/molecules/FormField";
import billingModelConfigService, { getConfigByType, saveConfig } from "@/services/api/billingModelConfigService";

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
              <p className="text-sm text-gray-600">Select your preferred delivery method for one-time purchase products</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { 
                  value: 'instant', 
                  label: 'Instant Download', 
                  description: 'Immediate file download after payment',
                  icon: 'Download',
                  iconColor: 'text-blue-600',
                  bgColor: 'bg-blue-100'
                },
                { 
                  value: 'email', 
                  label: 'Email Delivery', 
                  description: 'Files sent via email attachment',
                  icon: 'Mail',
                  iconColor: 'text-green-600',
                  bgColor: 'bg-green-100'
                },
                { 
                  value: 'account', 
                  label: 'Account-Based Access', 
                  description: 'Access through user account portal',
                  icon: 'User',
                  iconColor: 'text-purple-600',
                  bgColor: 'bg-purple-100'
                },
                { 
                  value: 'api', 
                  label: 'API/Webhook', 
                  description: 'Programmatic delivery via API',
                  icon: 'Zap',
                  iconColor: 'text-orange-600',
                  bgColor: 'bg-orange-100'
                },
                { 
                  value: 'none', 
                  label: 'No Delivery', 
                  description: 'Service completed upon payment',
                  icon: 'XCircle',
                  iconColor: 'text-gray-600',
                  bgColor: 'bg-gray-100'
                }
              ].map((method) => {
                const isSelected = formData.deliveryMethod === method.value
                return (
                  <div 
                    key={method.value}
                    className={`relative flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'border-primary bg-primary/5 shadow-md' 
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                    }`}
                    onClick={() => handleInputChange('deliveryMethod', method.value)}
                  >
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value={method.value}
                      checked={isSelected}
                      onChange={() => handleInputChange('deliveryMethod', method.value)}
                      className="absolute top-3 right-3 w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary focus:ring-2"
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <ApperIcon name="Check" size={12} className="text-white" />
                      </div>
                    )}
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
                      isSelected ? 'bg-primary/20' : method.bgColor
                    }`}>
                      <ApperIcon 
                        name={method.icon} 
                        size={24} 
                        className={isSelected ? 'text-primary' : method.iconColor} 
                      />
                    </div>
                    <h4 className={`text-sm font-medium mb-1 ${
                      isSelected ? 'text-primary' : 'text-gray-900'
                    }`}>
                      {method.label}
                    </h4>
                    <p className="text-xs text-gray-500 text-center">{method.description}</p>
                  </div>
                )
              })}
            </div>
          </Card>

<Card className="p-6 mb-6">
            <div className="space-y-8">
              {/* Delivery Method Configuration */}
              {formData.deliveryMethod && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Delivery Configuration
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {configData.fields.filter(field => {
                      if (field.section !== 'delivery') return false
                      if (field.name === 'deliveryMethod') return false
                      
                      // Show fields based on delivery method selection
                      if (field.dependsOn === 'deliveryMethod') {
                        return field.showWhen && field.showWhen.includes(formData.deliveryMethod)
                      }
                      
                      // Show other delivery fields that don't depend on method
                      return !field.dependsOn || formData[field.dependsOn]
                    }).map((field, index) => {
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
                  
                  {/* Delivery Method Specific Fields */}
                  {formData.deliveryMethod === 'instant' && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="text-sm font-medium text-blue-900 mb-3 flex items-center">
                        <ApperIcon name="Download" size={16} className="mr-2" />
                        Instant Download Settings
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          type="number"
                          label="Link Expiration (hours)"
                          value={formData.linkExpiration || ''}
                          onChange={(e) => handleInputChange('linkExpiration', parseInt(e.target.value) || 0)}
                          className="w-full"
                        />
                        <FormField
                          type="text"
                          label="IP Restriction"
                          value={formData.ipRestriction || ''}
                          onChange={(e) => handleInputChange('ipRestriction', e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}
                  
                  {formData.deliveryMethod === 'email' && (
                    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="text-sm font-medium text-green-900 mb-3 flex items-center">
                        <ApperIcon name="Mail" size={16} className="mr-2" />
                        Email Delivery Settings
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          type="select"
                          label="Email Template"
                          value={formData.emailTemplate || ''}
                          onChange={(e) => handleInputChange('emailTemplate', e.target.value)}
                          options={[
                            { value: 'default', label: 'Default Template' },
                            { value: 'professional', label: 'Professional Template' },
                            { value: 'branded', label: 'Branded Template' },
                            { value: 'custom', label: 'Custom Template' }
                          ]}
                          className="w-full"
                        />
                        <FormField
                          type="number"
                          label="Attachment Size Limit (MB)"
                          value={formData.attachmentSizeLimit || ''}
                          onChange={(e) => handleInputChange('attachmentSizeLimit', parseInt(e.target.value) || 0)}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}
                  
                  {formData.deliveryMethod === 'account' && (
                    <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="text-sm font-medium text-purple-900 mb-3 flex items-center">
                        <ApperIcon name="User" size={16} className="mr-2" />
                        Account-Based Access Settings
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          type="number"
                          label="Device Limit"
                          value={formData.deviceLimit || ''}
                          onChange={(e) => handleInputChange('deviceLimit', parseInt(e.target.value) || 0)}
                          className="w-full"
                        />
                      </div>
                    </div>
</div>
                  )}
                </div>
              )}
              {/* Licensing Options Section */}
              {(formData.deliveryMethod === 'instant' || formData.deliveryMethod === 'email') && (
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
              )}
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