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

const CreditConfig = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({})
  const [configData, setConfigData] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true)
        const config = await billingModelConfigService.getConfigByType('credit')
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
      await billingModelConfigService.saveConfig('credit', formData)
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
{/* Credit Definition Section */}
          <Card className="p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <ApperIcon name="Settings" size={20} className="text-primary" />
              <h3 className="text-lg font-semibold text-gray-900">Credit Definition</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                type="text"
                label="Credit Name"
                value={formData.creditName || ''}
                onChange={(e) => handleInputChange('creditName', e.target.value)}
                className="w-full"
                placeholder="e.g., FlexCredits"
              />
              <FormField
                type="text"
                label="Credit Symbol"
                value={formData.creditSymbol || ''}
                onChange={(e) => handleInputChange('creditSymbol', e.target.value)}
                className="w-full"
                placeholder="e.g., FC"
              />
              <FormField
                type="number"
                label="Base Value (USD)"
                value={formData.baseValue || ''}
                onChange={(e) => handleInputChange('baseValue', parseFloat(e.target.value) || 0)}
                className="w-full"
                placeholder="0.01"
              />
            </div>
          </Card>

          {/* Credit Packages Section */}
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Package" size={20} className="text-primary" />
                <h3 className="text-lg font-semibold text-gray-900">Credit Packages</h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newPackage = {
                    id: Date.now(),
                    packageName: 'New Package',
                    credits: 100,
                    price: 10,
                    bonusCredits: 0,
                    badge: '',
                    order: (formData.creditPackages || []).length + 1
                  }
                  handleInputChange('creditPackages', [...(formData.creditPackages || []), newPackage])
                }}
                icon="Plus"
              >
                Add Package
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(formData.creditPackages || []).map((pkg, index) => (
                <motion.div
                  key={pkg.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="GripVertical" size={16} className="text-gray-400 cursor-move" />
                      <span className="text-sm font-medium text-gray-600">#{pkg.order || index + 1}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const packages = formData.creditPackages.filter((_, i) => i !== index)
                        handleInputChange('creditPackages', packages)
                      }}
                      icon="Trash2"
                      className="text-red-500 hover:text-red-700"
                    />
                  </div>
                  <div className="space-y-3">
                    <FormField
                      type="text"
                      label="Package Name"
                      value={pkg.packageName || ''}
                      onChange={(e) => {
                        const packages = [...formData.creditPackages]
                        packages[index].packageName = e.target.value
                        handleInputChange('creditPackages', packages)
                      }}
                      className="w-full"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        type="number"
                        label="Credits"
                        value={pkg.credits || ''}
                        onChange={(e) => {
                          const packages = [...formData.creditPackages]
                          packages[index].credits = parseInt(e.target.value) || 0
                          handleInputChange('creditPackages', packages)
                        }}
                        className="w-full"
                      />
                      <FormField
                        type="number"
                        label="Price ($)"
                        value={pkg.price || ''}
                        onChange={(e) => {
                          const packages = [...formData.creditPackages]
                          packages[index].price = parseFloat(e.target.value) || 0
                          handleInputChange('creditPackages', packages)
                        }}
                        className="w-full"
                      />
                    </div>
                    <FormField
                      type="number"
                      label="Bonus Credits"
                      value={pkg.bonusCredits || ''}
                      onChange={(e) => {
                        const packages = [...formData.creditPackages]
                        packages[index].bonusCredits = parseInt(e.target.value) || 0
                        handleInputChange('creditPackages', packages)
                      }}
                      className="w-full"
                    />
                    <FormField
                      type="text"
                      label="Badge/Label"
                      value={pkg.badge || ''}
                      onChange={(e) => {
                        const packages = [...formData.creditPackages]
                        packages[index].badge = e.target.value
                        handleInputChange('creditPackages', packages)
                      }}
                      className="w-full"
                      placeholder="e.g., Popular, Best Value"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Credit Rules Section */}
          <Card className="p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <ApperIcon name="Shield" size={20} className="text-primary" />
              <h3 className="text-lg font-semibold text-gray-900">Credit Rules</h3>
            </div>
<div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FormField
                    type="number"
                    label="Credit Expiration (days)"
                    value={formData.creditExpiration || ''}
                    onChange={(e) => handleInputChange('creditExpiration', parseInt(e.target.value) || 0)}
                    className="w-full"
                    placeholder="365 (0 for no expiration)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Number of days before unused credits expire</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="allowNegativeBalance"
                      checked={formData.allowNegativeBalance || false}
                      onChange={(e) => handleInputChange('allowNegativeBalance', e.target.checked)}
                      className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                    />
                    <div>
                      <label htmlFor="allowNegativeBalance" className="text-sm font-medium text-gray-700">
                        Allow Negative Balance
                      </label>
                      <p className="text-xs text-gray-500">Allow users to go below zero credits</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="autoRechargeEnabled"
                      checked={formData.autoRechargeEnabled || false}
                      onChange={(e) => handleInputChange('autoRechargeEnabled', e.target.checked)}
                      className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                    />
                    <div>
                      <label htmlFor="autoRechargeEnabled" className="text-sm font-medium text-gray-700">
                        Auto-recharge
                      </label>
                      <p className="text-xs text-gray-500">Automatically recharge when balance is low</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Dynamic Fields - Grace Amount when Allow Negative Balance is enabled */}
              {formData.allowNegativeBalance && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div>
                    <FormField
                      type="number"
                      label="Grace Amount"
                      value={formData.graceAmount || ''}
                      onChange={(e) => handleInputChange('graceAmount', parseInt(e.target.value) || 0)}
                      className="w-full"
                      placeholder="100"
                    />
                    <p className="text-xs text-gray-500 mt-1">Maximum negative balance allowed before restrictions</p>
                  </div>
                  <div></div>
                </motion.div>
              )}
              
              {/* Dynamic Fields - Threshold and Package when Auto-recharge is enabled */}
              {formData.autoRechargeEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div>
                    <FormField
                      type="number"
                      label="Threshold"
                      value={formData.rechargeThreshold || ''}
                      onChange={(e) => handleInputChange('rechargeThreshold', parseInt(e.target.value) || 0)}
                      className="w-full"
                      placeholder="50"
                    />
                    <p className="text-xs text-gray-500 mt-1">Credit balance threshold to trigger auto-recharge</p>
                  </div>
                  <div>
                    <FormField
                      type="select"
                      label="Package to Purchase"
                      value={formData.autoRechargePackage || ''}
                      onChange={(e) => handleInputChange('autoRechargePackage', e.target.value)}
                      className="w-full"
                      options={[
                        { value: '', label: 'Select a package' },
                        ...(formData.creditPackages || []).map(pkg => ({
                          value: pkg.id,
                          label: `${pkg.packageName} - ${pkg.credits} credits ($${pkg.price})`
                        }))
                      ]}
                    />
                    <p className="text-xs text-gray-500 mt-1">Credit package to automatically purchase when threshold is reached</p>
                  </div>
                </motion.div>
              )}
            </div>
          </Card>

          {/* Consumption Rates Section */}
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Activity" size={20} className="text-primary" />
                <h3 className="text-lg font-semibold text-gray-900">Consumption Rates</h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newRate = {
                    id: Date.now(),
                    operation: 'New Operation',
                    creditsRequired: 1
                  }
                  handleInputChange('consumptionRates', [...(formData.consumptionRates || []), newRate])
                }}
                icon="Plus"
              >
                Add Operation
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Operation</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Credits Required</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Example</th>
                    <th className="text-right py-2 px-3 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(formData.consumptionRates || []).map((rate, index) => (
                    <tr key={rate.id || index} className="border-b border-gray-100">
                      <td className="py-3 px-3">
                        <FormField
                          type="text"
                          value={rate.operation || ''}
                          onChange={(e) => {
                            const rates = [...(formData.consumptionRates || [])]
                            rates[index].operation = e.target.value
                            handleInputChange('consumptionRates', rates)
                          }}
                          className="w-full"
                          placeholder="e.g., API Call"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <FormField
                          type="number"
                          value={rate.creditsRequired || ''}
                          onChange={(e) => {
                            const rates = [...(formData.consumptionRates || [])]
                            rates[index].creditsRequired = parseInt(e.target.value) || 0
                            handleInputChange('consumptionRates', rates)
                          }}
                          className="w-full"
                          placeholder="1"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-sm text-gray-500">
                          {rate.operation === 'API Call' ? 'GET /api/data' : 
                           rate.operation === 'File Upload' ? 'upload.pdf (10MB)' :
                           rate.operation === 'Report Generation' ? 'Monthly Sales Report' :
                           rate.operation === 'Email Send' ? 'notification@example.com' :
                           `${rate.operation?.toLowerCase()?.replace(/\s+/g, '_') || 'operation'}_example`}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const rates = (formData.consumptionRates || []).filter((_, i) => i !== index)
                            handleInputChange('consumptionRates', rates)
                          }}
                          icon="Trash2"
                          className="text-red-500 hover:text-red-700"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!formData.consumptionRates || formData.consumptionRates.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <ApperIcon name="Activity" size={32} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No consumption rates defined</p>
                  <p className="text-xs">Add operations to define how credits are consumed</p>
                </div>
              )}
            </div>
          </Card>

{/* Actions Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Configuration Actions</h3>
                <p className="text-sm text-gray-600">
                  Review your credit system configuration and save to continue
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormData(configData.defaultSettings)
                    toast.info('Configuration reset to defaults')
                  }}
                  icon="RotateCcw"
                >
                  Reset
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    console.log('Preview configuration:', formData)
                    toast.info('Configuration preview logged to console')
                  }}
                  icon="Eye"
                >
                  Preview
                </Button>
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

export default CreditConfig