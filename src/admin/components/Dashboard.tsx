import React from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { AIProvider } from '../../shared/types/aiProviders';
import {
  Server, 
  MessageSquare, 
  Settings, 
  BarChart3, 
  Users, 
  Zap, 
  Clock, 
  DollarSign 
} from 'lucide-react';

const Dashboard: React.FC = () => {
  // Call useAdmin at the top level, never inside try/catch or useEffect
  const adminData = useAdmin();
  const [error, setError] = React.useState<Error | null | unknown>(adminData?.error ?? null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (adminData?.error) {
      setError(adminData.error);
      // Log the error object and stack trace
      console.error("Dashboard: useAdmin returned error:", adminData.error, adminData);
      if (adminData.error instanceof Error) {
        console.error("Dashboard: useAdmin error stack:", adminData.error.stack || adminData.error.message);
      } else {
        console.error("Dashboard: useAdmin error value:", adminData.error);
      }
    }
  }, [adminData]);
  
  // Add an effect to handle any async loading or errors
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Short timeout to ensure UI is responsive
    
    return () => clearTimeout(timer);
  }, []);
  
  // If still loading, show a loading indicator
  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  // Safely destructure adminData with fallbacks
  const providers = adminData?.providers || {};
  const prompts = adminData?.prompts || [];
  const usageStats = adminData?.usageStats || { totalRequests: 0, costEstimate: 0 };
  const globalSettings = adminData?.globalSettings || {
    defaultProvider: 'unknown' as AIProvider,
    defaultModel: 'unknown',
    defaultTemperature: 0.7,
    defaultMaxTokens: 1000
  };

  // If useAdmin returned a fatal error, show it in the UI
  if (adminData?.error) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-red-600">Admin Context Error</h1>
          <p className="text-gray-600">
            There was a fatal error loading the admin context. This is likely due to a React hook violation, context misconfiguration, or a missing provider.
          </p>
        </div>
        <div className="bg-gray-100 p-4 rounded mb-4 overflow-auto">
          <pre className="text-sm">{adminData.error instanceof Error ? (adminData.error.stack || adminData.error.message) : String(adminData.error)}</pre>
        </div>
        <div className="bg-yellow-100 p-4 rounded mb-4 overflow-auto">
          <h2 className="font-bold text-yellow-700 mb-2">Admin Context State</h2>
          <pre className="text-xs text-yellow-900">{JSON.stringify(adminData, null, 2)}</pre>
        </div>
        <a
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
        >
          Return to Home
        </a>
      </div>
    );
  }

  // Count enabled providers with type safety
  const enabledProviders = Object.values(providers).filter((p: any) => p?.enabled).length;
  const totalProviders = Object.values(providers).length;

  // Stats cards data
  const statsCards = [
    {
      title: 'AI Providers',
      value: `${enabledProviders}/${totalProviders}`,
      icon: <Server className="w-6 h-6 text-blue-500" />,
      description: 'Active providers',
      color: 'bg-blue-50',
    },
    {
      title: 'Prompt Templates',
      value: prompts.length.toString(),
      icon: <MessageSquare className="w-6 h-6 text-purple-500" />,
      description: 'Available templates',
      color: 'bg-purple-50',
    },
    {
      title: 'API Requests',
      value: usageStats.totalRequests.toLocaleString(),
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      description: 'Total API calls',
      color: 'bg-yellow-50',
    },
    {
      title: 'Cost Estimate',
      value: `$${usageStats.costEstimate.toFixed(2)}`,
      icon: <DollarSign className="w-6 h-6 text-green-500" />,
      description: 'Estimated cost',
      color: 'bg-green-50',
    },
  ];

  // If there's an error, show a fallback UI
  if (error) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-red-600">Dashboard Error</h1>
          <p className="text-gray-600">
            There was an error loading the dashboard data. This is likely due to missing API keys or configuration issues.
          </p>
        </div>
        <div className="bg-gray-100 p-4 rounded mb-4 overflow-auto">
          <pre className="text-sm">{error instanceof Error ? error.message : String(error)}</pre>
        </div>
        <a
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
        >
          Return to Home
        </a>
      </div>
    );
  }

  // Render function with error handling
  const renderDashboard = () => {
    try {
      console.log('Dashboard: Rendering dashboard');
      
      // If adminData is not available yet, show loading state
      if (!adminData && !error) {
        return (
          <div className="p-6 flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        );
      }
      
      return (
        <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">
            Welcome to the unified admin interface for SmashingApps.ai
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((card, index) => (
            <div
              key={index}
              className={`${card.color} p-6 rounded-lg shadow-sm border border-gray-100`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-700">{card.title}</h2>
                {card.icon}
              </div>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                <p className="text-sm text-gray-500">{card.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/providers"
              className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all flex items-center"
            >
              <div className="bg-blue-50 p-3 rounded-lg mr-4">
                <Server className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Manage Providers</h3>
                <p className="text-sm text-gray-500">Configure AI providers and API keys</p>
              </div>
            </a>
            
            <a
              href="/admin/prompts"
              className="bg-white p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all flex items-center"
            >
              <div className="bg-purple-50 p-3 rounded-lg mr-4">
                <MessageSquare className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Manage Prompts</h3>
                <p className="text-sm text-gray-500">Create and edit prompt templates</p>
              </div>
            </a>
            
            <a
              href="/admin/settings"
              className="bg-white p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all flex items-center"
            >
              <div className="bg-green-50 p-3 rounded-lg mr-4">
                <Settings className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Global Settings</h3>
                <p className="text-sm text-gray-500">Configure application settings</p>
              </div>
            </a>
          </div>
        </div>

        {/* System Information */}
        <div>
          <h2 className="text-lg font-medium text-gray-800 mb-4">System Information</h2>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Default Configuration</h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <span className="text-gray-500 w-32">Default Provider:</span>
                    <span className="font-medium">{globalSettings.defaultProvider}</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="text-gray-500 w-32">Default Model:</span>
                    <span className="font-medium">{globalSettings.defaultModel}</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="text-gray-500 w-32">Temperature:</span>
                    <span className="font-medium">{globalSettings.defaultTemperature}</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="text-gray-500 w-32">Max Tokens:</span>
                    <span className="font-medium">{globalSettings.defaultMaxTokens}</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Active Providers</h3>
                <ul className="space-y-2">
                  {Object.entries(providers || {}).map(([key, provider]: [string, any]) => (
                    <li key={key} className="flex items-center text-sm">
                      <span className={`w-3 h-3 rounded-full mr-2 ${provider?.enabled ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      <span className="text-gray-800">{provider?.name || key}</span>
                      <span className="ml-2 text-xs text-gray-500">
                        {provider?.enabled ? 'Active' : 'Inactive'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        </div>
      );
    } catch (err) {
      console.error('Dashboard: Error rendering dashboard:', err);
      setError(err instanceof Error ? err : new Error('Error rendering dashboard'));
      return (
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-red-600">Rendering Error</h1>
            <p className="text-gray-600">
              There was an error rendering the dashboard. The application will attempt to recover automatically.
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded mb-4 overflow-auto">
            <pre className="text-sm">{err instanceof Error ? err.message : 'Unknown error'}</pre>
          </div>
          <div className="flex space-x-4">
            <a
              href="/"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
            >
              Return to Home
            </a>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 inline-block"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
  };
  
  // Main render with error boundary
  try {
    // If there's an error, show a fallback UI
    if (error) {
      return (
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-red-600">Dashboard Error</h1>
            <p className="text-gray-600">
              There was an error loading the dashboard data. This is likely due to missing API keys or configuration issues.
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded mb-4 overflow-auto">
            <pre className="text-sm">{error instanceof Error ? error.message : String(error)}</pre>
          </div>
          <div className="flex space-x-4">
            <a
              href="/"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
            >
              Return to Home
            </a>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 inline-block"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    
    return renderDashboard();
  } catch (finalErr) {
    console.error('Dashboard: Critical error in main render:', finalErr);
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-red-600">Critical Error</h1>
          <p className="text-gray-600">
            A critical error occurred in the dashboard. Please try again later.
          </p>
        </div>
        <a
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
        >
          Return to Home
        </a>
      </div>
    );
  }
};

export default Dashboard;