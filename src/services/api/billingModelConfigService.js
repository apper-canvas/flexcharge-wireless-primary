const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const getConfigByType = async (modelType) => {
  try {
    await delay(300)
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "modelType" } },
        { field: { Name: "title" } },
        { field: { Name: "description" } },
        { field: { Name: "deliveryMethod" } },
        { field: { Name: "deliveryDelay" } },
        { field: { Name: "downloadLimit" } },
        { field: { Name: "accessDuration" } },
        { field: { Name: "webhookUrl" } },
        { field: { Name: "licenseType" } },
        { field: { Name: "customLicenseTerms" } },
        { field: { Name: "generateLicenseKeys" } },
        { field: { Name: "keyFormat" } },
        { field: { Name: "customKeyPattern" } },
        { field: { Name: "acceptPreorders" } },
        { field: { Name: "chargeTiming" } },
        { field: { Name: "releaseDate" } },
        { field: { Name: "partialPayments" } },
        { field: { Name: "minimumDeposit" } },
        { field: { Name: "maxInstallments" } },
        { field: { Name: "refundPolicyType" } },
        { field: { Name: "refundPolicyText" } },
        { field: { Name: "refundWindow" } },
        { field: { Name: "autoApproveRefunds" } }
      ],
      where: [
        {
          FieldName: "modelType",
          Operator: "EqualTo",
          Values: [modelType]
        }
      ]
    };
    
    const response = await apperClient.fetchRecords('billing_model_config', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(`Configuration not found for model type: ${modelType}`);
    }
    
    if (!response.data || response.data.length === 0) {
      throw new Error(`Configuration not found for model type: ${modelType}`);
    }
    
    return response.data[0];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching config:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
}

export const saveConfig = async (modelType, configData) => {
  try {
    await delay(500)
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Check if config exists
    const existingConfig = await getConfigByType(modelType);
    
    // Only include Updateable fields
    const updateableData = {
      modelType: modelType,
      title: configData.title,
      description: configData.description,
      deliveryMethod: configData.deliveryMethod,
      deliveryDelay: configData.deliveryDelay,
      downloadLimit: configData.downloadLimit,
      accessDuration: configData.accessDuration,
      webhookUrl: configData.webhookUrl,
      licenseType: configData.licenseType,
      customLicenseTerms: configData.customLicenseTerms,
      generateLicenseKeys: configData.generateLicenseKeys,
      keyFormat: configData.keyFormat,
      customKeyPattern: configData.customKeyPattern,
      acceptPreorders: configData.acceptPreorders,
      chargeTiming: configData.chargeTiming,
      releaseDate: configData.releaseDate,
      partialPayments: configData.partialPayments,
      minimumDeposit: configData.minimumDeposit,
      maxInstallments: configData.maxInstallments,
      refundPolicyType: configData.refundPolicyType,
      refundPolicyText: configData.refundPolicyText,
      refundWindow: configData.refundWindow,
      autoApproveRefunds: configData.autoApproveRefunds
    };
    
    let response;
    if (existingConfig) {
      // Update existing
      updateableData.Id = existingConfig.Id;
      const params = { records: [updateableData] };
      response = await apperClient.updateRecord('billing_model_config', params);
    } else {
      // Create new
      updateableData.Name = `${modelType} Configuration`;
      const params = { records: [updateableData] };
      response = await apperClient.createRecord('billing_model_config', params);
    }
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return { success: true, message: 'Configuration saved successfully' };
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error saving config:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
}

export const getDefaultConfig = async (modelType) => {
  try {
    await delay(200)
    
    // Return default settings based on model type
    const defaults = {
      'one-time': {
        deliveryMethod: 'instant',
        generateLicenseKeys: false,
        acceptPreorders: false,
        partialPayments: false,
        refundPolicyType: 'standard'
      },
      'credit': {
        creditName: 'FlexCredits',
        creditSymbol: 'FC',
        baseValue: 0.01,
        creditExpiration: 365,
        allowNegativeBalance: false,
        autoRechargeEnabled: false
      },
      'usage': {
        meterName: 'API Usage Meter',
        meterCode: 'API_CALLS',
        unitOfMeasure: 'calls',
        billingCycle: 'monthly',
        freeTier: 1000,
        usageTracking: 'api',
        overage: 'allow',
        aggregationMethod: 'sum',
        resetPeriod: 'monthly'
      },
      'milestone': {
        paymentTiming: 'on_completion',
        approvalRequired: true,
        partialPayments: false,
        retainerPercentage: 0,
        milestoneTemplate: 'custom'
      },
      'marketplace': {
        commissionType: 'percentage',
        commissionRate: 10,
        payoutSchedule: 'monthly',
        minimumPayout: 50,
        vendorVerificationRequired: true
      }
    };
    
    return defaults[modelType] || {};
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

export default {
  getConfigByType,
  saveConfig,
  getDefaultConfig
}