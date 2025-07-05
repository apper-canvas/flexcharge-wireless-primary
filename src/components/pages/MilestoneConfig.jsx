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

const MilestoneConfig = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({})
  const [configData, setConfigData] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true)
        const config = await billingModelConfigService.getConfigByType('milestone')
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
      await billingModelConfigService.saveConfig('milestone', formData)
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
<div className="space-y-6 mb-6">
            {/* Project Templates Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ApperIcon name="FileText" size={20} className="mr-2" />
                  Project Templates (Optional)
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Enable Project Templates</label>
                      <p className="text-xs text-gray-500">Allow users to create projects from predefined templates</p>
                    </div>
                    <button
                      type="button"
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.enableProjectTemplates ? 'bg-primary' : 'bg-gray-200'
                      }`}
                      onClick={() => handleInputChange('enableProjectTemplates', !formData.enableProjectTemplates)}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.enableProjectTemplates ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  {formData.enableProjectTemplates && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        type="select"
                        label="Default Template"
                        value={formData.defaultTemplate || ''}
                        onChange={(e) => handleInputChange('defaultTemplate', e.target.value)}
                        options={[
                          { value: '', label: 'Select a template' },
                          { value: 'software', label: 'Software Development' },
                          { value: 'marketing', label: 'Marketing Campaign' },
                          { value: 'construction', label: 'Construction Project' },
                          { value: 'consulting', label: 'Consulting Engagement' },
                          { value: 'design', label: 'Design & Creative' }
                        ]}
                        className="w-full"
                      />
                      <FormField
                        type="number"
                        label="Template Limit"
                        value={formData.templateLimit || ''}
                        onChange={(e) => handleInputChange('templateLimit', parseInt(e.target.value) || 0)}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Payment Terms Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ApperIcon name="CreditCard" size={20} className="mr-2" />
                  Payment Terms
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    type="select"
                    label="Default Payment Schedule"
                    value={formData.paymentSchedule || ''}
                    onChange={(e) => handleInputChange('paymentSchedule', e.target.value)}
                    options={[
                      { value: '', label: 'Select payment schedule' },
                      { value: 'milestone', label: 'Per Milestone' },
                      { value: 'percentage', label: 'Percentage Based' },
                      { value: 'fixed', label: 'Fixed Intervals' },
                      { value: 'completion', label: 'On Completion' }
                    ]}
                    className="w-full"
                  />
                  <FormField
                    type="number"
                    label="Payment Due Days"
                    value={formData.paymentDueDays || ''}
                    onChange={(e) => handleInputChange('paymentDueDays', parseInt(e.target.value) || 0)}
                    className="w-full"
                  />
                  <FormField
                    type="number"
                    label="Late Payment Fee (%)"
                    value={formData.lateFeePercentage || ''}
                    onChange={(e) => handleInputChange('lateFeePercentage', parseFloat(e.target.value) || 0)}
                    className="w-full"
                  />
                  <FormField
                    type="number"
                    label="Advance Payment (%)"
                    value={formData.advancePaymentPercentage || ''}
                    onChange={(e) => handleInputChange('advancePaymentPercentage', parseFloat(e.target.value) || 0)}
                    className="w-full"
                  />
                </div>
              </Card>
            </motion.div>

            {/* Milestone Evidence Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ApperIcon name="CheckCircle" size={20} className="mr-2" />
                  Milestone Evidence
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Required Evidence Types
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { value: 'documents', label: 'Documents & Files' },
                      { value: 'screenshots', label: 'Screenshots' },
                      { value: 'videos', label: 'Video Recordings' },
                      { value: 'reports', label: 'Progress Reports' },
                      { value: 'deliverables', label: 'Deliverables' },
                      { value: 'approvals', label: 'Client Approvals' }
                    ].map((evidence) => (
                      <div key={evidence.value} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id={evidence.value}
                          checked={formData.evidenceTypes?.includes(evidence.value) || false}
                          onChange={(e) => {
                            const current = formData.evidenceTypes || []
                            const updated = e.target.checked
                              ? [...current, evidence.value]
                              : current.filter(type => type !== evidence.value)
                            handleInputChange('evidenceTypes', updated)
                          }}
                          className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                        />
                        <label htmlFor={evidence.value} className="text-sm font-medium text-gray-700">
                          {evidence.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Dispute Resolution Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ApperIcon name="AlertTriangle" size={20} className="mr-2" />
                  Dispute Resolution
                </h3>
                <div className="space-y-4">
                  <FormField
                    type="select"
                    label="Resolution Method"
                    value={formData.resolutionMethod || ''}
                    onChange={(e) => handleInputChange('resolutionMethod', e.target.value)}
                    options={[
                      { value: '', label: 'Select resolution method' },
                      { value: 'mediation', label: 'Mediation' },
                      { value: 'arbitration', label: 'Arbitration' },
                      { value: 'litigation', label: 'Litigation' },
                      { value: 'internal', label: 'Internal Review' },
                      { value: 'third-party', label: 'Third-party Intervention' }
                    ]}
                    className="w-full"
                  />
                  <FormField
                    type="textarea"
                    label="Dispute Resolution Terms"
                    value={formData.disputeTerms || ''}
                    onChange={(e) => handleInputChange('disputeTerms', e.target.value)}
                    className="w-full"
                    rows={4}
                  />
                  <FormField
                    type="number"
                    label="Resolution Timeframe (Days)"
                    value={formData.resolutionTimeframe || ''}
                    onChange={(e) => handleInputChange('resolutionTimeframe', parseInt(e.target.value) || 0)}
                    className="w-full"
                  />
                </div>
              </Card>
            </motion.div>

            {/* Available Actions Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ApperIcon name="Settings" size={20} className="mr-2" />
                  Available Actions
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Allowed Project Actions
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { value: 'create', label: 'Create Projects' },
                      { value: 'edit', label: 'Edit Projects' },
                      { value: 'delete', label: 'Delete Projects' },
                      { value: 'duplicate', label: 'Duplicate Projects' },
                      { value: 'archive', label: 'Archive Projects' },
                      { value: 'export', label: 'Export Project Data' },
                      { value: 'share', label: 'Share Projects' },
                      { value: 'collaborate', label: 'Team Collaboration' }
                    ].map((action) => (
                      <div key={action.value} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id={action.value}
                          checked={formData.availableActions?.includes(action.value) || false}
                          onChange={(e) => {
                            const current = formData.availableActions || []
                            const updated = e.target.checked
                              ? [...current, action.value]
                              : current.filter(act => act !== action.value)
                            handleInputChange('availableActions', updated)
                          }}
                          className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                        />
                        <label htmlFor={action.value} className="text-sm font-medium text-gray-700">
                          {action.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

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

export default MilestoneConfig