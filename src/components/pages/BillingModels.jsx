import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import { billingModelsService } from "@/services/api/billingModelsService";
const BillingModels = () => {
  const navigate = useNavigate()
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  useEffect(() => {
    loadBillingModels()
  }, [])
  
  const loadBillingModels = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await billingModelsService.getAll()
      setModels(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const handleToggleModel = async (modelId) => {
    try {
      const model = models.find(m => m.Id === modelId)
      const updatedModel = await billingModelsService.update(modelId, {
        ...model,
        isActive: !model.isActive
      })
      setModels(models.map(m => m.Id === modelId ? updatedModel : m))
      toast.success(`${updatedModel.title} ${updatedModel.isActive ? 'activated' : 'deactivated'}`)
    } catch (err) {
      toast.error('Failed to update billing model')
    }
  }
  
  const handleSetPrimary = async (modelId) => {
    try {
      // First, unset all primary models
      const updatedModels = await Promise.all(
        models.map(model => 
          billingModelsService.update(model.Id, {
            ...model,
            isPrimary: model.Id === modelId,
            isActive: model.Id === modelId ? true : model.isActive
          })
        )
      )
      setModels(updatedModels)
      const primaryModel = updatedModels.find(m => m.Id === modelId)
      toast.success(`${primaryModel.title} set as primary billing model`)
    } catch (err) {
      toast.error('Failed to set primary billing model')
    }
}
  
  if (loading) return <Loading type="list" />
  if (error) return <Error onRetry={loadBillingModels} />
  if (!models.length) return <Empty title="No billing models configured" message="Configure your first billing model to get started" />
  
return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing Models</h1>
          <p className="text-gray-600">Manage your billing models and configurations</p>
        </div>
<Button variant="primary" icon="Plus" onClick={() => navigate('/billing-model-selection')}>
          Add Billing Model
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model, index) => (
          <motion.div
            key={model.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${model.gradient}`}>
                  <ApperIcon name={model.icon} className="w-6 h-6 text-white" />
                </div>
                <div className="flex space-x-2">
                  {model.isPrimary && (
                    <Badge variant="primary" size="sm">Primary</Badge>
                  )}
                  <Badge 
                    variant={model.isActive ? 'success' : 'warning'} 
                    size="sm"
                  >
                    {model.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{model.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{model.description}</p>
              
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-xs font-medium text-gray-700 mb-1">Configuration:</p>
                <p className="text-xs text-gray-600">{model.configurationSummary}</p>
              </div>
              
              <div className="flex flex-col space-y-2">
                <div className="flex space-x-2">
                  <Button
                    variant={model.isActive ? "outline" : "primary"}
                    size="sm"
                    onClick={() => handleToggleModel(model.Id)}
                    className="flex-1"
                  >
                    {model.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon="Settings"
                    className="px-3"
                  >
                  </Button>
                </div>
                
                {model.isActive && !model.isPrimary && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSetPrimary(model.Id)}
                    className="w-full"
                  >
                    Set as Primary
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

    </div>
  )
}

export default BillingModels