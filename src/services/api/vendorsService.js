export const vendorsService = {
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
          { field: { Name: "email" } },
          { field: { Name: "status" } },
          { field: { Name: "productCount" } },
          { field: { Name: "totalSales" } },
          { field: { Name: "commissionRate" } },
          { field: { Name: "pendingPayout" } },
          { field: { Name: "joinDate" } },
          { field: { Name: "lastPayout" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };
      
      const response = await apperClient.fetchRecords('vendor', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching vendors:", error?.response?.data?.message);
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
          { field: { Name: "email" } },
          { field: { Name: "status" } },
          { field: { Name: "productCount" } },
          { field: { Name: "totalSales" } },
          { field: { Name: "commissionRate" } },
          { field: { Name: "pendingPayout" } },
          { field: { Name: "joinDate" } },
          { field: { Name: "lastPayout" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };
      
      const response = await apperClient.getRecordById('vendor', id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching vendor with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },
  
  create: async (vendorData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields
      const updateableData = {
        Name: vendorData.Name || vendorData.name,
        email: vendorData.email,
        status: vendorData.status,
        productCount: parseInt(vendorData.productCount) || 0,
        totalSales: parseFloat(vendorData.totalSales) || 0,
        commissionRate: parseInt(vendorData.commissionRate),
        pendingPayout: parseFloat(vendorData.pendingPayout) || 0,
        joinDate: vendorData.joinDate,
        lastPayout: vendorData.lastPayout,
        Tags: vendorData.Tags || "",
        Owner: vendorData.Owner
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.createRecord('vendor', params);
      
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
        console.error("Error creating vendor:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },
  
  update: async (id, vendorData) => {
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
        Name: vendorData.Name || vendorData.name,
        email: vendorData.email,
        status: vendorData.status,
        productCount: parseInt(vendorData.productCount),
        totalSales: parseFloat(vendorData.totalSales),
        commissionRate: parseInt(vendorData.commissionRate),
        pendingPayout: parseFloat(vendorData.pendingPayout),
        joinDate: vendorData.joinDate,
        lastPayout: vendorData.lastPayout,
        Tags: vendorData.Tags,
        Owner: vendorData.Owner
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.updateRecord('vendor', params);
      
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
        console.error("Error updating vendor:", error?.response?.data?.message);
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
      
      const response = await apperClient.deleteRecord('vendor', params);
      
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
        console.error("Error deleting vendor:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
}