export const projectsService = {
  getAll: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "clientName" } },
          { field: { Name: "description" } },
          { field: { Name: "status" } },
          { field: { Name: "totalValue" } },
          { field: { Name: "paidAmount" } },
          { field: { Name: "totalMilestones" } },
          { field: { Name: "milestonesCompleted" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "daysRemaining" } },
          { field: { Name: "startDate" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };
      
      const response = await apperClient.fetchRecords('project', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching projects:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },
  
  getById: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "clientName" } },
          { field: { Name: "description" } },
          { field: { Name: "status" } },
          { field: { Name: "totalValue" } },
          { field: { Name: "paidAmount" } },
          { field: { Name: "totalMilestones" } },
          { field: { Name: "milestonesCompleted" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "daysRemaining" } },
          { field: { Name: "startDate" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };
      
      const response = await apperClient.getRecordById('project', id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching project with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },
  
  create: async (projectData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields
      const updateableData = {
        Name: projectData.Name || projectData.name,
        clientName: projectData.clientName,
        description: projectData.description,
        status: projectData.status,
        totalValue: parseInt(projectData.totalValue),
        paidAmount: parseInt(projectData.paidAmount),
        totalMilestones: parseInt(projectData.totalMilestones),
        milestonesCompleted: parseInt(projectData.milestonesCompleted),
        dueDate: projectData.dueDate,
        daysRemaining: parseInt(projectData.daysRemaining),
        startDate: projectData.startDate,
        Tags: projectData.Tags || "",
        Owner: projectData.Owner
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.createRecord('project', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating project:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },
  
  update: async (id, projectData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields
      const updateableData = {
        Id: parseInt(id),
        Name: projectData.Name || projectData.name,
        clientName: projectData.clientName,
        description: projectData.description,
        status: projectData.status,
        totalValue: parseInt(projectData.totalValue),
        paidAmount: parseInt(projectData.paidAmount),
        totalMilestones: parseInt(projectData.totalMilestones),
        milestonesCompleted: parseInt(projectData.milestonesCompleted),
        dueDate: projectData.dueDate,
        daysRemaining: parseInt(projectData.daysRemaining),
        startDate: projectData.startDate,
        Tags: projectData.Tags,
        Owner: projectData.Owner
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.updateRecord('project', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating project:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('project', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting project:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
}