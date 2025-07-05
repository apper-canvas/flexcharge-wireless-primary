import { useState } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('organization')
  const [loading, setLoading] = useState(false)
  
  const tabs = [
    { id: 'organization', label: 'Organization', icon: 'Building' },
    { id: 'tax', label: 'Tax Settings', icon: 'Calculator' },
    { id: 'processors', label: 'Payment Processors', icon: 'CreditCard' },
    { id: 'integrations', label: 'Integrations', icon: 'Plug' }
  ]
  
  const handleSave = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Settings saved successfully')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }
  
  const renderOrganizationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Organization Name"
          placeholder="Enter organization name"
          required
        />
        <Select
          label="Business Type"
          placeholder="Select business type"
          options={[
            { value: 'saas', label: 'SaaS/Software' },
            { value: 'digital', label: 'Digital Products' },
            { value: 'services', label: 'Services' },
            { value: 'marketplace', label: 'Marketplace' },
            { value: 'mixed', label: 'Mixed' }
          ]}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Primary Currency"
          placeholder="Select currency"
          options={[
            { value: 'USD', label: 'USD - US Dollar' },
            { value: 'EUR', label: 'EUR - Euro' },
            { value: 'GBP', label: 'GBP - British Pound' },
            { value: 'CAD', label: 'CAD - Canadian Dollar' }
          ]}
        />
        <Select
          label="Country"
          placeholder="Select country"
          options={[
            { value: 'US', label: 'United States' },
            { value: 'GB', label: 'United Kingdom' },
            { value: 'CA', label: 'Canada' },
            { value: 'AU', label: 'Australia' }
          ]}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Organization Logo
        </label>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Building" className="w-8 h-8 text-white" />
          </div>
          <Button variant="outline" icon="Upload">
            Upload Logo
          </Button>
        </div>
      </div>
    </div>
  )
  
  const renderTaxSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Tax ID Number"
          placeholder="Enter tax ID"
        />
        <Select
          label="Tax System"
          placeholder="Select tax system"
          options={[
            { value: 'inclusive', label: 'Tax Inclusive' },
            { value: 'exclusive', label: 'Tax Exclusive' }
          ]}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Rates</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Default Tax Rate"
              placeholder="0.00"
              type="number"
              step="0.01"
            />
            <Input
              label="Digital Products Tax"
              placeholder="0.00"
              type="number"
              step="0.01"
            />
            <Input
              label="Services Tax"
              placeholder="0.00"
              type="number"
              step="0.01"
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="autoCalculate"
          className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
        />
        <label htmlFor="autoCalculate" className="text-sm text-gray-700">
          Auto-calculate tax based on customer location
        </label>
      </div>
    </div>
  )
  
  const renderProcessorSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: 'Stripe', icon: 'CreditCard', connected: true },
          { name: 'PayPal', icon: 'Wallet', connected: true },
          { name: 'Square', icon: 'Square', connected: false },
          { name: 'Razorpay', icon: 'DollarSign', connected: false }
        ].map((processor) => (
          <Card key={processor.name} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${processor.connected ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <ApperIcon name={processor.icon} className={`w-5 h-5 ${processor.connected ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{processor.name}</h3>
                  <p className="text-sm text-gray-600">
                    {processor.connected ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              <Button
                variant={processor.connected ? 'outline' : 'primary'}
                size="sm"
              >
                {processor.connected ? 'Configure' : 'Connect'}
              </Button>
            </div>
            {processor.connected && (
              <div className="text-sm text-gray-600">
                Processing fee: 2.9% + $0.30 per transaction
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
  
  const renderIntegrationsSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: 'Webhook URL', icon: 'Webhook', description: 'Receive real-time notifications' },
          { name: 'API Access', icon: 'Key', description: 'Generate API keys for integrations' },
          { name: 'Zapier', icon: 'Zap', description: 'Connect with 5000+ apps' },
          { name: 'Slack', icon: 'MessageSquare', description: 'Get notifications in Slack' }
        ].map((integration) => (
          <Card key={integration.name} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <ApperIcon name={integration.icon} className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{integration.name}</h3>
                  <p className="text-sm text-gray-600">{integration.description}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Setup
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Configure your billing system and integrations</p>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 space-y-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ApperIcon name={tab.icon} className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </motion.button>
          ))}
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h2>
              <p className="text-gray-600">
                {activeTab === 'organization' && 'Configure your organization details and branding'}
                {activeTab === 'tax' && 'Set up tax rates and calculation preferences'}
                {activeTab === 'processors' && 'Configure payment processors and fees'}
                {activeTab === 'integrations' && 'Connect with external services and APIs'}
              </p>
            </div>
            
            {activeTab === 'organization' && renderOrganizationSettings()}
            {activeTab === 'tax' && renderTaxSettings()}
            {activeTab === 'processors' && renderProcessorSettings()}
            {activeTab === 'integrations' && renderIntegrationsSettings()}
            
            <div className="mt-8 flex justify-end">
              <Button
                variant="primary"
                onClick={handleSave}
                loading={loading}
                icon="Save"
              >
                Save Changes
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Settings