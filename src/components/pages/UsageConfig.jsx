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

const UsageConfig = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({})
  const [configData, setConfigData] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true)
        const config = await billingModelConfigService.getConfigByType('usage')
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
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await billingModelConfigService.saveConfig('usage', formData)
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
          {/* Meter Setup Section */}
          <Card className="p-6 mb-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ApperIcon name="Activity" size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Meter Setup</h3>
                <p className="text-sm text-gray-600">Configure your usage metering parameters</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Meter Name */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <FormField
                  type="text"
                  label="Meter Name"
                  value={formData.meterName || ''}
                  onChange={(e) => handleInputChange('meterName', e.target.value)}
                  className="w-full"
                  placeholder="e.g., API Usage Meter"
                />
                <p className="text-xs text-gray-500 mt-1">Display name for your usage meter</p>
              </motion.div>

              {/* Meter Code */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <FormField
                  type="text"
                  label="Meter Code"
                  value={formData.meterCode || ''}
                  onChange={(e) => handleInputChange('meterCode', e.target.value.toUpperCase())}
                  className="w-full"
                  placeholder="e.g., API_CALLS"
                />
                <p className="text-xs text-gray-500 mt-1">Unique identifier for tracking (uppercase, no spaces)</p>
              </motion.div>

              {/* Unit of Measure */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <FormField
                  type="select"
                  label="Unit of Measure"
                  value={formData.unitOfMeasure || ''}
                  onChange={(e) => handleInputChange('unitOfMeasure', e.target.value)}
                  options={[
                    { value: 'calls', label: 'Calls/Requests' },
                    { value: 'gb', label: 'Gigabytes (GB)' },
                    { value: 'mb', label: 'Megabytes (MB)' },
                    { value: 'hours', label: 'Hours' },
                    { value: 'users', label: 'Users' },
                    { value: 'transactions', label: 'Transactions' },
                    { value: 'events', label: 'Events' },
                    { value: 'custom', label: 'Custom Unit' }
                  ]}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">How usage will be measured and billed</p>
              </motion.div>

              {/* Custom Unit Name (conditional) */}
              {formData.unitOfMeasure === 'custom' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <FormField
                    type="text"
                    label="Custom Unit Name"
                    value={formData.customUnitName || ''}
                    onChange={(e) => handleInputChange('customUnitName', e.target.value)}
                    className="w-full"
                    placeholder="e.g., Credits, Points, Actions"
                  />
                  <p className="text-xs text-gray-500 mt-1">Name for your custom measurement unit</p>
                </motion.div>
              )}
            </div>

            {/* Meter Preview */}
            {(formData.meterName || formData.meterCode || formData.unitOfMeasure) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 p-4 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ApperIcon name="Eye" size={16} className="text-primary" />
                  </div>
                  <h4 className="text-sm font-medium text-gray-900">Meter Preview</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <p className="font-medium">{formData.meterName || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Code:</span>
                    <p className="font-medium font-mono">{formData.meterCode || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Unit:</span>
                    <p className="font-medium">
                      {formData.unitOfMeasure === 'custom' 
                        ? (formData.customUnitName || 'Custom') 
                        : (formData.unitOfMeasure ? 
                           configData.fields.find(f => f.name === 'unitOfMeasure')?.options.find(o => o.value === formData.unitOfMeasure)?.label 
                           : 'Not specified')}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </Card>

          {/* Additional Configuration */}
          <Card className="p-6 mb-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <ApperIcon name="Settings" size={20} className="text-secondary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Billing Configuration</h3>
                <p className="text-sm text-gray-600">Set up pricing and billing parameters</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {configData.fields.filter(field => !['meterName', 'meterCode', 'unitOfMeasure', 'customUnitName'].includes(field.name)).map((field, index) => (
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
              ))}
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

export default UsageConfig