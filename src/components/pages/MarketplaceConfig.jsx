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
const MarketplaceConfig = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
const [formData, setFormData] = useState({
    // Commission Structure
    commissionType: '',
    baseCommissionRate: 10,
    categoryCommissionRates: [
      { category: 'Electronics', rate: 8 },
      { category: 'Fashion', rate: 12 },
      { category: 'Home & Garden', rate: 10 }
    ],
    vendorTierRates: [
      { tier: 'Bronze', rate: 15 },
      { tier: 'Silver', rate: 12 },
      { tier: 'Gold', rate: 8 }
    ],
    volumeBasedRates: [
      { minAmount: 0, maxAmount: 1000, rate: 15 },
      { minAmount: 1001, maxAmount: 5000, rate: 12 },
      { minAmount: 5001, maxAmount: null, rate: 8 }
    ],
    // Additional Fees
    listingFeeEnabled: false,
    listingFeeAmount: 5,
    listingFeeFrequency: 'one-time',
    transactionFeeEnabled: false,
    transactionFeeType: 'fixed',
    transactionFeeAmount: 2.5,
    paymentProcessing: 'platform-pays',
    // Payout Settings
    payoutSchedule: 'monthly',
    minimumPayout: 50,
    holdPeriod: 7,
    // Vendor Requirements
    kycRequired: true,
    businessVendorsAllowed: true,
    internationalVendors: false
  })
  const [configData, setConfigData] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true)
        const config = await billingModelConfigService.getConfigByType('marketplace')
        setConfigData(config)
        if (config.defaultSettings) {
          setFormData(prev => ({
            ...prev,
            ...config.defaultSettings
          }))
        }
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

  const handleCategoryRateChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      categoryCommissionRates: prev.categoryCommissionRates.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const handleVendorTierRateChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      vendorTierRates: prev.vendorTierRates.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const addCategoryRate = () => {
    setFormData(prev => ({
      ...prev,
      categoryCommissionRates: [...prev.categoryCommissionRates, { category: '', rate: 10 }]
    }))
  }

  const removeCategoryRate = (index) => {
    setFormData(prev => ({
      ...prev,
      categoryCommissionRates: prev.categoryCommissionRates.filter((_, i) => i !== index)
    }))
  }

  const addVendorTierRate = () => {
    setFormData(prev => ({
      ...prev,
      vendorTierRates: [...prev.vendorTierRates, { tier: '', rate: 10 }]
    }))
  }

const removeVendorTierRate = (index) => {
    setFormData(prev => ({
      ...prev,
      vendorTierRates: prev.vendorTierRates.filter((_, i) => i !== index)
    }))
  }

  const handleVolumeBasedRateChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      volumeBasedRates: prev.volumeBasedRates.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const addVolumeBasedRate = () => {
    setFormData(prev => ({
      ...prev,
      volumeBasedRates: [...prev.volumeBasedRates, { minAmount: 0, maxAmount: null, rate: 10 }]
    }))
  }

  const removeVolumeBasedRate = (index) => {
    setFormData(prev => ({
      ...prev,
      volumeBasedRates: prev.volumeBasedRates.filter((_, i) => i !== index)
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await billingModelConfigService.saveConfig('marketplace', formData)
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace Configuration</h1>
          <p className="text-gray-600">Configure your marketplace billing settings, commission structure, and vendor requirements</p>
        </div>
<motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Commission Structure */}
          <Card className="p-6 mb-6">
            <div className="flex items-center mb-6">
              <ApperIcon name="Percent" className="w-5 h-5 text-primary mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Commission Structure</h2>
</div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  type="number"
                  label="Base Commission Rate (%)"
                  value={formData.baseCommissionRate}
                  onChange={(e) => handleInputChange('baseCommissionRate', Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="0.00"
                  className="w-full"
                />
<FormField
                  type="select"
                  label="Commission Type"
                  value={formData.commissionType}
                  onChange={(e) => handleInputChange('commissionType', e.target.value)}
                  options={[
                    { value: '', label: 'Select Commission Type...' },
                    { value: 'flat-rate', label: 'Flat rate for all' },
                    { value: 'category', label: 'Category-based' },
                    { value: 'vendor_tier', label: 'Vendor tier-based' },
                    { value: 'volume-based', label: 'Volume-based' }
                  ]}
                  className="w-full"
                  required
                />
              </div>

              {formData.commissionType === 'category' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Category Commission Rates</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addCategoryRate}
                        icon="Plus"
                      >
                        Add Category
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {formData.categoryCommissionRates.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <FormField
                            type="text"
                            placeholder="Category name"
                            value={item.category}
                            onChange={(e) => handleCategoryRateChange(index, 'category', e.target.value)}
                            className="flex-1"
                          />
                          <FormField
                            type="number"
                            placeholder="Rate (%)"
                            value={item.rate}
                            onChange={(e) => handleCategoryRateChange(index, 'rate', parseFloat(e.target.value) || 0)}
                            step="0.1"
                            className="w-24"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeCategoryRate(index)}
                            icon="Trash2"
                            className="text-red-600 hover:text-red-700"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {formData.commissionType === 'vendor_tier' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Vendor Tier Commission Rates</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addVendorTierRate}
                        icon="Plus"
                      >
                        Add Tier
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {formData.vendorTierRates.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <FormField
                            type="text"
                            placeholder="Tier name"
                            value={item.tier}
                            onChange={(e) => handleVendorTierRateChange(index, 'tier', e.target.value)}
                            className="flex-1"
                          />
                          <FormField
                            type="number"
                            placeholder="Rate (%)"
                            value={item.rate}
                            onChange={(e) => handleVendorTierRateChange(index, 'rate', parseFloat(e.target.value) || 0)}
                            step="0.1"
                            className="w-24"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeVendorTierRate(index)}
                            icon="Trash2"
                            className="text-red-600 hover:text-red-700"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
)}

              {formData.commissionType === 'volume-based' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Volume-based Commission Rates</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addVolumeBasedRate}
                        icon="Plus"
                      >
                        Add Volume Tier
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {formData.volumeBasedRates.map((item, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                          <FormField
                            type="number"
                            placeholder="Min Amount"
                            value={item.minAmount}
                            onChange={(e) => handleVolumeBasedRateChange(index, 'minAmount', parseFloat(e.target.value) || 0)}
                            step="0.01"
                          />
                          <FormField
                            type="number"
                            placeholder="Max Amount"
                            value={item.maxAmount || ''}
                            onChange={(e) => handleVolumeBasedRateChange(index, 'maxAmount', e.target.value ? parseFloat(e.target.value) : null)}
                            step="0.01"
                          />
                          <FormField
                            type="number"
                            placeholder="Rate (%)"
                            value={item.rate}
                            onChange={(e) => handleVolumeBasedRateChange(index, 'rate', parseFloat(e.target.value) || 0)}
                            step="0.1"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeVolumeBasedRate(index)}
                            icon="Trash2"
                            className="text-red-600 hover:text-red-700"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </Card>

{/* Additional Fees */}
          <Card className="p-6 mb-6">
            <div className="flex items-center mb-6">
              <ApperIcon name="DollarSign" className="w-5 h-5 text-primary mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Additional Fees</h2>
            </div>
            <div className="space-y-6">
              {/* Listing Fee */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="listingFeeEnabled"
                      checked={formData.listingFeeEnabled}
                      onChange={(e) => handleInputChange('listingFeeEnabled', e.target.checked)}
                      className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary focus:ring-2"
                    />
                    <label htmlFor="listingFeeEnabled" className="text-sm font-medium text-gray-700 cursor-pointer">
                      Listing Fee
                    </label>
                  </div>
                </div>
                {formData.listingFeeEnabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <FormField
                      type="number"
                      label="Amount ($)"
                      value={formData.listingFeeAmount}
                      onChange={(e) => handleInputChange('listingFeeAmount', Math.max(0, parseFloat(e.target.value) || 0))}
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="w-full"
                    />
                    <FormField
                      type="select"
                      label="Frequency"
                      value={formData.listingFeeFrequency}
                      onChange={(e) => handleInputChange('listingFeeFrequency', e.target.value)}
                      options={[
                        { value: 'one-time', label: 'One-time' },
                        { value: 'monthly', label: 'Monthly' }
                      ]}
                      className="w-full"
                    />
                  </motion.div>
                )}
              </div>

              {/* Transaction Fee */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="transactionFeeEnabled"
                      checked={formData.transactionFeeEnabled}
                      onChange={(e) => handleInputChange('transactionFeeEnabled', e.target.checked)}
                      className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary focus:ring-2"
                    />
                    <label htmlFor="transactionFeeEnabled" className="text-sm font-medium text-gray-700 cursor-pointer">
                      Transaction Fee
                    </label>
                  </div>
                </div>
                {formData.transactionFeeEnabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <FormField
                      type="select"
                      label="Type"
                      value={formData.transactionFeeType}
                      onChange={(e) => handleInputChange('transactionFeeType', e.target.value)}
                      options={[
                        { value: 'fixed', label: 'Fixed amount' },
                        { value: 'percentage', label: 'Percentage' }
                      ]}
                      className="w-full"
                    />
                    <FormField
                      type="number"
                      label={formData.transactionFeeType === 'fixed' ? 'Amount ($)' : 'Percentage (%)'}
                      value={formData.transactionFeeAmount}
                      onChange={(e) => handleInputChange('transactionFeeAmount', Math.max(0, parseFloat(e.target.value) || 0))}
                      step="0.01"
                      min="0"
                      max={formData.transactionFeeType === 'percentage' ? 100 : undefined}
                      placeholder="0.00"
                      className="w-full"
                    />
                  </motion.div>
                )}
              </div>

              {/* Payment Processing */}
              <div className="border border-gray-200 rounded-lg p-4">
                <FormField
                  type="select"
                  label="Payment Processing"
                  value={formData.paymentProcessing}
                  onChange={(e) => handleInputChange('paymentProcessing', e.target.value)}
                  options={[
                    { value: 'platform-pays', label: 'Platform pays' },
                    { value: 'deduct-from-vendor', label: 'Deduct from vendor' },
                    { value: 'split', label: 'Split' }
                  ]}
                  className="w-full"
                />
              </div>
            </div>
          </Card>

          {/* Payout Settings */}
          <Card className="p-6 mb-6">
            <div className="flex items-center mb-6">
              <ApperIcon name="Calendar" className="w-5 h-5 text-primary mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Payout Settings</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                type="select"
                label="Payout Schedule"
                value={formData.payoutSchedule}
                onChange={(e) => handleInputChange('payoutSchedule', e.target.value)}
                options={[
                  { value: 'daily', label: 'Daily' },
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'bi_weekly', label: 'Bi-weekly' },
                  { value: 'monthly', label: 'Monthly' }
                ]}
                className="w-full"
              />
              <FormField
                type="number"
                label="Minimum Payout ($)"
                value={formData.minimumPayout}
                onChange={(e) => handleInputChange('minimumPayout', parseFloat(e.target.value) || 0)}
                step="0.01"
                className="w-full"
              />
              <FormField
                type="number"
                label="Hold Period (days)"
                value={formData.holdPeriod}
                onChange={(e) => handleInputChange('holdPeriod', parseInt(e.target.value) || 0)}
                className="w-full"
              />
            </div>
          </Card>

          {/* Vendor Requirements */}
          <Card className="p-6 mb-6">
            <div className="flex items-center mb-6">
              <ApperIcon name="UserCheck" className="w-5 h-5 text-primary mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Vendor Requirements</h2>
            </div>
<div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  id="kycRequired"
                  checked={formData.kycRequired}
                  onChange={(e) => handleInputChange('kycRequired', e.target.checked)}
                  className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary focus:ring-2 mt-0.5"
                />
                <div className="flex-1">
                  <label htmlFor="kycRequired" className="text-sm font-medium text-gray-700 cursor-pointer">
                    KYC Required
                  </label>
                  <p className="text-xs text-gray-500 mt-1">Require Know Your Customer verification for all vendors</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  id="businessVendorsAllowed"
                  checked={formData.businessVendorsAllowed}
                  onChange={(e) => handleInputChange('businessVendorsAllowed', e.target.checked)}
                  className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary focus:ring-2 mt-0.5"
                />
                <div className="flex-1">
                  <label htmlFor="businessVendorsAllowed" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Business Vendors Allowed
                  </label>
                  <p className="text-xs text-gray-500 mt-1">Allow business entities to register as vendors</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  id="internationalVendors"
                  checked={formData.internationalVendors}
                  onChange={(e) => handleInputChange('internationalVendors', e.target.checked)}
                  className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary focus:ring-2 mt-0.5"
                />
                <div className="flex-1">
                  <label htmlFor="internationalVendors" className="text-sm font-medium text-gray-700 cursor-pointer">
                    International Vendors
                  </label>
                  <p className="text-xs text-gray-500 mt-1">Allow vendors from international markets</p>
                </div>
              </div>
            </div>
          </Card>

<Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Configuration Summary</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Review your marketplace settings and save to continue
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  icon="ArrowLeft"
                  className="order-2 sm:order-1"
                  disabled={saving}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  loading={saving}
                  icon={saving ? "Loader2" : "Save"}
                  className="order-1 sm:order-2"
                >
                  {saving ? 'Saving...' : 'Save & Continue'}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default MarketplaceConfig