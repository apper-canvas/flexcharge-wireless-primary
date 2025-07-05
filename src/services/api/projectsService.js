import mockData from '@/services/mockData/projects.json'

let projects = [...mockData]

export const projectsService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return [...projects]
  },
  
  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return projects.find(project => project.Id === id)
  },
  
  create: async (projectData) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newProject = {
      ...projectData,
      Id: Math.max(...projects.map(p => p.Id)) + 1
    }
    projects.push(newProject)
    return newProject
  },
  
  update: async (id, projectData) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = projects.findIndex(project => project.Id === id)
    if (index !== -1) {
      projects[index] = { ...projects[index], ...projectData }
      return projects[index]
    }
    throw new Error('Project not found')
  },
  
  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = projects.findIndex(project => project.Id === id)
    if (index !== -1) {
      projects.splice(index, 1)
      return true
    }
    throw new Error('Project not found')
  }
}