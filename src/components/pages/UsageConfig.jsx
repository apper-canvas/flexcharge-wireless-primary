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


          {/* Aggregation Configuration */}
          <Card className="p-6 mb-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-accent/10 rounded-lg">
                <ApperIcon name="Calculator" size={20} className="text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Aggregation Configuration</h3>
                <p className="text-sm text-gray-600">Configure how usage data is aggregated and measured</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Aggregation Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <FormField
                  type="select"
                  label="Aggregation Method"
                  value={formData.aggregationMethod || ''}
                  onChange={(e) => handleInputChange('aggregationMethod', e.target.value)}
                  options={[
                    { value: 'sum', label: 'Sum - Total of all usage values' },
                    { value: 'max', label: 'Max - Maximum usage value recorded' },
                    { value: 'average', label: 'Average - Mean of all usage values' },
                    { value: 'unique_count', label: 'Unique Count - Count of distinct values' }
                  ]}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">How usage data points are combined for billing calculations</p>
              </motion.div>

              {/* Reset Period */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <FormField
                  type="select"
                  label="Reset Period"
                  value={formData.resetPeriod || ''}
                  onChange={(e) => handleInputChange('resetPeriod', e.target.value)}
                  options={[
                    { value: 'never', label: 'Never - Cumulative usage' },
                    { value: 'daily', label: 'Daily - Reset every day' },
                    { value: 'weekly', label: 'Weekly - Reset every week' },
                    { value: 'monthly', label: 'Monthly - Reset every month' },
                    { value: 'annually', label: 'Annually - Reset every year' }
                  ]}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">How often usage counters are reset to zero</p>
              </motion.div>
            </div>

            {/* Aggregation Preview */}
            {(formData.aggregationMethod || formData.resetPeriod) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 p-4 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <ApperIcon name="BarChart3" size={16} className="text-accent" />
                  </div>
                  <h4 className="text-sm font-medium text-gray-900">Aggregation Preview</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Method:</span>
                    <p className="font-medium">
                      {formData.aggregationMethod 
                        ? configData.fields.find(f => f.name === 'aggregationMethod')?.options.find(o => o.value === formData.aggregationMethod)?.label.split(' - ')[0]
                        : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Reset Period:</span>
                    <p className="font-medium">
                      {formData.resetPeriod 
                        ? configData.fields.find(f => f.name === 'resetPeriod')?.options.find(o => o.value === formData.resetPeriod)?.label.split(' - ')[0]
                        : 'Not specified'}
                    </p>
                  </div>
                </div>
                {formData.aggregationMethod && formData.resetPeriod && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-800">
                      <strong>Example:</strong> Usage will be calculated using {formData.aggregationMethod === 'sum' ? 'the total' : formData.aggregationMethod === 'max' ? 'the maximum' : formData.aggregationMethod === 'average' ? 'the average' : 'the unique count'} of all {formData.unitOfMeasure || 'usage'} values
                      {formData.resetPeriod !== 'never' ? ` and reset ${formData.resetPeriod}` : ' with no reset period'}.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
</Card>

          {/* Pricing Model Section */}
          <Card className="p-6 mb-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <ApperIcon name="DollarSign" size={20} className="text-secondary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Pricing Model</h3>
                <p className="text-sm text-gray-600">Configure your pricing structure and billing tiers</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Model Type Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <FormField
                  type="select"
                  label="Model Type"
                  value={formData.pricingModelType || ''}
                  onChange={(e) => handleInputChange('pricingModelType', e.target.value)}
                  options={[
                    { value: 'simple', label: 'Simple per-unit - Fixed price per unit' },
                    { value: 'tiered', label: 'Tiered pricing - Different rates for usage tiers' },
                    { value: 'volume', label: 'Volume pricing - Discount based on total volume' },
                    { value: 'package', label: 'Package pricing - Bundled usage packages' }
                  ]}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Choose how usage will be priced and billed</p>
              </motion.div>

              {/* Simple Pricing */}
              {formData.pricingModelType === 'simple' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg"
                >
                  <FormField
                    type="number"
                    label="Price per Unit ($)"
                    value={formData.unitPrice || ''}
                    onChange={(e) => handleInputChange('unitPrice', parseFloat(e.target.value) || 0)}
                    className="w-full"
                    placeholder="0.01"
                  />
                  <FormField
                    type="number"
                    label="Free Tier Limit"
                    value={formData.freeTierLimit || ''}
                    onChange={(e) => handleInputChange('freeTierLimit', parseInt(e.target.value) || 0)}
                    className="w-full"
                    placeholder="1000"
                  />
                </motion.div>
              )}

              {/* Tiered Pricing Table */}
              {(formData.pricingModelType === 'tiered' || formData.pricingModelType === 'package') && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-900">
                      {formData.pricingModelType === 'package' ? 'Package Tiers' : 'Pricing Tiers'}
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newTier = {
                          id: Date.now(),
                          name: `Tier ${(formData.pricingTiers || []).length + 1}`,
                          from: 0,
                          to: null,
                          price: 0
                        }
                        handleInputChange('pricingTiers', [...(formData.pricingTiers || []), newTier])
                      }}
                      icon="Plus"
                    >
                      Add Tier
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {(formData.pricingTiers || []).map((tier, index) => (
                      <div key={tier.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 bg-white rounded border items-end">
                        <FormField
                          type="text"
                          label="Tier Name"
                          value={tier.name}
                          onChange={(e) => {
                            const updatedTiers = [...(formData.pricingTiers || [])]
                            updatedTiers[index] = { ...tier, name: e.target.value }
                            handleInputChange('pricingTiers', updatedTiers)
                          }}
                          className="w-full"
                        />
                        <FormField
                          type="number"
                          label="From"
                          value={tier.from}
                          onChange={(e) => {
                            const updatedTiers = [...(formData.pricingTiers || [])]
                            updatedTiers[index] = { ...tier, from: parseInt(e.target.value) || 0 }
                            handleInputChange('pricingTiers', updatedTiers)
                          }}
                          className="w-full"
                        />
                        <FormField
                          type="number"
                          label="To"
                          value={tier.to || ''}
                          onChange={(e) => {
                            const updatedTiers = [...(formData.pricingTiers || [])]
                            updatedTiers[index] = { ...tier, to: e.target.value ? parseInt(e.target.value) : null }
                            handleInputChange('pricingTiers', updatedTiers)
                          }}
                          className="w-full"
                          placeholder="Unlimited"
                        />
                        <FormField
                          type="number"
                          label="Price ($)"
                          value={tier.price}
                          onChange={(e) => {
                            const updatedTiers = [...(formData.pricingTiers || [])]
                            updatedTiers[index] = { ...tier, price: parseFloat(e.target.value) || 0 }
                            handleInputChange('pricingTiers', updatedTiers)
                          }}
                          className="w-full"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const updatedTiers = formData.pricingTiers.filter((_, i) => i !== index)
                            handleInputChange('pricingTiers', updatedTiers)
                          }}
                          icon="Trash2"
                          className="text-red-600 hover:text-red-700"
                        />
                      </div>
                    ))}
                    
                    {(!formData.pricingTiers || formData.pricingTiers.length === 0) && (
                      <div className="text-center py-6 text-gray-500">
                        <ApperIcon name="Package" size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No tiers configured yet. Click "Add Tier" to get started.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Volume Pricing */}
              {formData.pricingModelType === 'volume' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-gray-50 rounded-lg"
                >
                  <FormField
                    type="number"
                    label="Base Price per Unit ($)"
                    value={formData.baseUnitPrice || ''}
                    onChange={(e) => handleInputChange('baseUnitPrice', parseFloat(e.target.value) || 0)}
                    className="w-full"
                    placeholder="0.01"
                  />
                  <FormField
                    type="number"
                    label="Volume Discount (%)"
                    value={formData.volumeDiscount || ''}
                    onChange={(e) => handleInputChange('volumeDiscount', parseFloat(e.target.value) || 0)}
                    className="w-full"
                    placeholder="10"
                  />
                  <FormField
                    type="number"
                    label="Volume Threshold"
                    value={formData.volumeThreshold || ''}
                    onChange={(e) => handleInputChange('volumeThreshold', parseInt(e.target.value) || 0)}
                    className="w-full"
                    placeholder="10000"
                  />
                </motion.div>
              )}
            </div>
          </Card>

          {/* Usage Controls Section */}
          <Card className="p-6 mb-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-red-100 rounded-lg">
                <ApperIcon name="Shield" size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Usage Controls</h3>
                <p className="text-sm text-gray-600">Set up limits, alerts, and budget controls for usage management</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Hard Limits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 border border-red-200 rounded-lg"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <ApperIcon name="StopCircle" size={16} className="text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Hard Limits</h4>
                    <p className="text-xs text-gray-600">Strict limits that stop usage when reached</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="enableHardLimits"
                      checked={formData.enableHardLimits || false}
                      onChange={(e) => handleInputChange('enableHardLimits', e.target.checked)}
                      className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                    />
                    <label htmlFor="enableHardLimits" className="text-sm font-medium text-gray-700">
                      Enable Hard Limits
                    </label>
                  </div>
                  
                  {formData.enableHardLimits && (
                    <>
                      <FormField
                        type="number"
                        label="Usage Limit"
                        value={formData.hardUsageLimit || ''}
                        onChange={(e) => handleInputChange('hardUsageLimit', parseInt(e.target.value) || 0)}
                        className="w-full"
                        placeholder="100000"
                      />
                      <FormField
                        type="number"
                        label="Spending Limit ($)"
                        value={formData.hardSpendingLimit || ''}
                        onChange={(e) => handleInputChange('hardSpendingLimit', parseFloat(e.target.value) || 0)}
                        className="w-full"
                        placeholder="1000"
                      />
                    </>
                  )}
                </div>
              </motion.div>

              {/* Soft Alerts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 border border-yellow-200 rounded-lg"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <ApperIcon name="AlertTriangle" size={16} className="text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Soft Alerts</h4>
                    <p className="text-xs text-gray-600">Warning notifications when approaching limits</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="enableSoftAlerts"
                      checked={formData.enableSoftAlerts || false}
                      onChange={(e) => handleInputChange('enableSoftAlerts', e.target.checked)}
                      className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500 focus:ring-2"
                    />
                    <label htmlFor="enableSoftAlerts" className="text-sm font-medium text-gray-700">
                      Enable Soft Alerts
                    </label>
                  </div>
                  
                  {formData.enableSoftAlerts && (
                    <>
                      <FormField
                        type="number"
                        label="Alert at % of Limit"
                        value={formData.alertThresholdPercent || ''}
                        onChange={(e) => handleInputChange('alertThresholdPercent', parseInt(e.target.value) || 0)}
                        className="w-full"
                        placeholder="80"
                      />
                      <FormField
                        type="select"
                        label="Alert Method"
                        value={formData.alertMethod || ''}
                        onChange={(e) => handleInputChange('alertMethod', e.target.value)}
                        options={[
                          { value: 'email', label: 'Email' },
                          { value: 'webhook', label: 'Webhook' },
                          { value: 'both', label: 'Email + Webhook' }
                        ]}
                        className="w-full"
                      />
                      <FormField
                        type="select"
                        label="Alert Frequency"
                        value={formData.alertFrequency || ''}
                        onChange={(e) => handleInputChange('alertFrequency', e.target.value)}
                        options={[
                          { value: 'once', label: 'Once' },
                          { value: 'daily', label: 'Daily' },
                          { value: 'weekly', label: 'Weekly' }
                        ]}
                        className="w-full"
                      />
                    </>
                  )}
                </div>
              </motion.div>

              {/* Budget Caps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4 border border-blue-200 rounded-lg"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ApperIcon name="CreditCard" size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Budget Caps</h4>
                    <p className="text-xs text-gray-600">Monthly and daily spending limits with automatic controls</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="enableBudgetCaps"
                      checked={formData.enableBudgetCaps || false}
                      onChange={(e) => handleInputChange('enableBudgetCaps', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <label htmlFor="enableBudgetCaps" className="text-sm font-medium text-gray-700">
                      Enable Budget Caps
                    </label>
                  </div>
                  
                  {formData.enableBudgetCaps && (
                    <>
                      <FormField
                        type="number"
                        label="Monthly Budget ($)"
                        value={formData.monthlyBudget || ''}
                        onChange={(e) => handleInputChange('monthlyBudget', parseFloat(e.target.value) || 0)}
                        className="w-full"
                        placeholder="5000"
                      />
                      <FormField
                        type="number"
                        label="Daily Budget ($)"
                        value={formData.dailyBudget || ''}
                        onChange={(e) => handleInputChange('dailyBudget', parseFloat(e.target.value) || 0)}
                        className="w-full"
                        placeholder="200"
                      />
                      <FormField
                        type="select"
                        label="Action at Cap"
                        value={formData.budgetCapAction || ''}
                        onChange={(e) => handleInputChange('budgetCapAction', e.target.value)}
                        options={[
                          { value: 'block', label: 'Block Usage' },
                          { value: 'notify', label: 'Notify Only' },
                          { value: 'approve', label: 'Require Approval' }
                        ]}
                        className="w-full"
                      />
                    </>
                  )}
                </div>
              </motion.div>
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