import mockData from '@/services/mockData/reports.json'

export const reportsService = {
  getReports: async (period = '30d') => {
    await new Promise(resolve => setTimeout(resolve, 400))
    return mockData[period] || mockData['30d']
  }
}