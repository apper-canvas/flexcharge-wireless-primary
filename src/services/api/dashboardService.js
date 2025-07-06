export const dashboardService = {
  getDashboardData: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Fetch recent orders
      const ordersParams = {
        fields: [
          { field: { Name: "customerName" } },
          { field: { Name: "productName" } },
          { field: { Name: "amount" } },
          { field: { Name: "date" } }
        ],
        orderBy: [
          {
            fieldName: "date",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 5,
          offset: 0
        }
      };
      
      const ordersResponse = await apperClient.fetchRecords('order', ordersParams);
      
      const recentOrders = ordersResponse.success && ordersResponse.data ? 
        ordersResponse.data.map((order, index) => ({
          Id: order.Id || index + 1,
          customerName: order.customerName,
          product: order.productName,
          amount: order.amount,
          date: order.date
        })) : [];
      
      return {
        recentOrders
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching dashboard data:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      
      // Return empty data structure on error
      return {
        recentOrders: []
      };
    }
  }
}