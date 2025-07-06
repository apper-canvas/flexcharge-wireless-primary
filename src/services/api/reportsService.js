export const reportsService = {
  getReports: async (period = '30d') => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400))
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Calculate date range based on period
      const now = new Date();
      let startDate;
      switch(period) {
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '1y':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
      
      // Fetch orders within date range
      const ordersParams = {
        fields: [
          { field: { Name: "amount" } },
          { field: { Name: "date" } },
          { field: { Name: "customerName" } },
          { field: { Name: "productName" } },
          { field: { Name: "billingModel" } },
          { field: { Name: "status" } }
        ],
        where: [
          {
            FieldName: "date",
            Operator: "GreaterThanOrEqualTo",
            Values: [startDate.toISOString().split('T')[0]]
          }
        ],
        pagingInfo: {
          limit: 1000,
          offset: 0
        }
      };
      
      const ordersResponse = await apperClient.fetchRecords('order', ordersParams);
      const orders = ordersResponse.success ? ordersResponse.data || [] : [];
      
      // Fetch products for analysis
      const productsParams = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "price" } }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };
      
      const productsResponse = await apperClient.fetchRecords('product', productsParams);
      const products = productsResponse.success ? productsResponse.data || [] : [];
      
      // Calculate metrics
      const completedOrders = orders.filter(order => order.status === 'completed');
      const totalRevenue = completedOrders.reduce((sum, order) => sum + (parseFloat(order.amount) || 0), 0);
      const totalOrders = completedOrders.length;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      
      // Group by products
      const productSales = {};
      completedOrders.forEach(order => {
        if (!productSales[order.productName]) {
          productSales[order.productName] = { sales: 0, revenue: 0 };
        }
        productSales[order.productName].sales += 1;
        productSales[order.productName].revenue += parseFloat(order.amount) || 0;
      });
      
      const topProducts = Object.entries(productSales)
        .map(([name, data], index) => ({
          Id: index + 1,
          name,
          sales: data.sales,
          revenue: data.revenue
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
      
      // Group by customers
      const customerSales = {};
      completedOrders.forEach(order => {
        if (!customerSales[order.customerName]) {
          customerSales[order.customerName] = { orders: 0, totalSpent: 0 };
        }
        customerSales[order.customerName].orders += 1;
        customerSales[order.customerName].totalSpent += parseFloat(order.amount) || 0;
      });
      
      const topCustomers = Object.entries(customerSales)
        .map(([name, data], index) => ({
          Id: index + 1,
          name,
          orders: data.orders,
          totalSpent: data.totalSpent
        }))
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 5);
      
      // Revenue breakdown by billing model
      const modelBreakdown = {};
      completedOrders.forEach(order => {
        const model = order.billingModel || 'unknown';
        if (!modelBreakdown[model]) {
          modelBreakdown[model] = 0;
        }
        modelBreakdown[model] += parseFloat(order.amount) || 0;
      });
      
      const revenueBreakdown = Object.entries(modelBreakdown)
        .map(([model, amount]) => ({
          model: model.charAt(0).toUpperCase() + model.slice(1),
          amount,
          percentage: totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0,
          icon: getModelIcon(model),
          color: getModelColor(model)
        }))
        .sort((a, b) => b.amount - a.amount);
      
      return {
        totalRevenue,
        revenueGrowth: Math.floor(Math.random() * 30) + 5, // Placeholder growth calculation
        totalOrders,
        ordersGrowth: Math.floor(Math.random() * 20) + 5, // Placeholder growth calculation
        averageOrderValue,
        aovGrowth: Math.floor(Math.random() * 10) + 2, // Placeholder growth calculation
        conversionRate: 3.5 + Math.random() * 2, // Placeholder conversion rate
        conversionGrowth: Math.random() * 1, // Placeholder conversion growth
        topProducts,
        topCustomers,
        revenueBreakdown
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching reports:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      
      // Return default structure on error
      return {
        totalRevenue: 0,
        revenueGrowth: 0,
        totalOrders: 0,
        ordersGrowth: 0,
        averageOrderValue: 0,
        aovGrowth: 0,
        conversionRate: 0,
        conversionGrowth: 0,
        topProducts: [],
        topCustomers: [],
        revenueBreakdown: []
      };
    }
  }
}

function getModelIcon(model) {
  const icons = {
    'one-time': 'ShoppingCart',
    'credit': 'Coins',
    'usage': 'Activity',
    'marketplace': 'Store',
    'milestone': 'Calendar'
  };
  return icons[model] || 'ShoppingCart';
}

function getModelColor(model) {
  const colors = {
    'one-time': 'bg-gradient-to-r from-blue-500 to-blue-600',
    'credit': 'bg-gradient-to-r from-green-500 to-green-600',
    'usage': 'bg-gradient-to-r from-purple-500 to-purple-600',
    'marketplace': 'bg-gradient-to-r from-orange-500 to-orange-600',
    'milestone': 'bg-gradient-to-r from-pink-500 to-pink-600'
  };
  return colors[model] || 'bg-gradient-to-r from-gray-500 to-gray-600';
}