import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { projectsService } from '@/services/api/projectsService'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  useEffect(() => {
    loadProjects()
  }, [])
  
  useEffect(() => {
    if (searchTerm) {
      const filtered = projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredProjects(filtered)
    } else {
      setFilteredProjects(projects)
    }
  }, [searchTerm, projects])
  
  const loadProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await projectsService.getAll()
      setProjects(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return { variant: 'success', label: 'Active' }
      case 'pending':
        return { variant: 'warning', label: 'Pending' }
      case 'completed':
        return { variant: 'primary', label: 'Completed' }
      case 'cancelled':
        return { variant: 'error', label: 'Cancelled' }
      case 'on-hold':
        return { variant: 'default', label: 'On Hold' }
      default:
        return { variant: 'default', label: status }
    }
  }
  
  if (loading) return <Loading type="list" />
  if (error) return <Error onRetry={loadProjects} />
  if (!projects.length) return <Empty title="No projects found" message="Create your first project to start tracking milestones and payments" icon="FolderOpen" actionLabel="Create Project" />
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">Manage milestone-based projects and track progress</p>
        </div>
        <Button variant="primary" icon="Plus">
          Create Project
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          onSearch={setSearchTerm}
          placeholder="Search projects..."
          className="flex-1"
        />
        <Button variant="outline" icon="Filter" className="sm:w-auto">
          Filter
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => {
          const statusBadge = getStatusBadge(project.status)
          const progressPercentage = (project.milestonesCompleted / project.totalMilestones) * 100
          
          return (
            <motion.div
              key={project.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-accent to-yellow-500 rounded-lg flex items-center justify-center">
                      <ApperIcon name="FolderOpen" className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-600">{project.clientName}</p>
                    </div>
                  </div>
                  <Badge variant={statusBadge.variant} size="sm">
                    {statusBadge.label}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{project.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{project.milestonesCompleted}/{project.totalMilestones} milestones</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="text-lg font-semibold text-gray-900">${project.totalValue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Paid Amount</p>
                    <p className="text-lg font-semibold text-green-600">${project.paidAmount.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>Due Date: {project.dueDate}</span>
                  <span>{project.daysRemaining} days left</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="ghost" size="sm" icon="Edit" className="px-3">
                  </Button>
                  <Button variant="ghost" size="sm" icon="Calendar" className="px-3">
                  </Button>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default Projects