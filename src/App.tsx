/**
 * Main Application Router
 *
 * This is the entry point for the SmashingApps.ai unified application.
 * It handles routing for both the main homepage and all integrated tools.
 *
 * Architecture Overview:
 * - The application follows a unified architecture where multiple tools are integrated
 *   into a single React application.
 * - Each tool is contained in its own directory under src/tools/
 * - The main router (this file) handles routing to all tools
 *
 * Adding a new tool:
 * 1. Create a new directory in src/tools/ with your tool name (kebab-case)
 * 2. Create a main component for your tool (PascalCase + "App.tsx")
 * 3. Import the component here
 * 4. Add routes for your tool following the pattern below
 * 5. Update src/components/Tools.tsx to include your tool in the tools list
 *
 * See CONTRIBUTING.md for more detailed guidelines.
 */

import React, { useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import SEO from './components/SEO';
import GlobalSettingsProvider from './shared/components/GlobalSettingsProvider';
import StructuredData from './components/StructuredData';

// Import main site components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Tools from './components/Tools';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Contact from './components/Contact';
import Footer from './components/Footer';

// Import tool registry
import toolRegistry, { getToolConfig } from './tools/registry';

// Import tool components
// When adding a new tool, import its main component here
import TaskSmasherApp from './tools/task-smasher/TaskSmasherApp';
import AdminApp from './admin/AdminApp';
import ArticleSmasherV2App from './tools/article-smasher/ArticleSmasherV2App';

// Loading component for Suspense
const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Get the TaskSmasher tool configuration
const taskSmasherConfig = getToolConfig('task-smasher');

// HomePage component for the root route (without Navbar since it's now global)
const HomePage = () => (
  <div className="min-h-screen bg-gray-50">
    <StructuredData
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'SmashingApps.ai',
        'url': 'https://smashingapps.ai',
        'description': 'AI-powered micro-apps that help you smash through tasks with smart, fun, and focused tools',
        'potentialAction': {
          '@type': 'SearchAction',
          'target': 'https://smashingapps.ai/search?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      }}
    />
    <main>
      <Hero />
      <Tools />
      <Features />
      <Testimonials />
      <CTA />
    </main>
  </div>
);

/**
 * Main App component that handles all routing
 *
 * This component sets up the router and defines all routes for the application.
 * When adding a new tool, follow the pattern established for TaskSmasher:
 * 1. Add routes for the base path (both with and without trailing slash)
 * 2. Add routes for any specialized sub-paths if needed
 */
// BodyClassManager component to manage body classes based on route
const BodyClassManager = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Remove all tool-related classes
    document.body.classList.remove('home', 'admin', ...Object.keys(toolRegistry).map(id => id));
    
    // Add appropriate class based on the current route
    if (location.pathname === '/') {
      document.body.classList.add('home');
    } else if (location.pathname.startsWith('/admin')) {
      document.body.classList.add('admin');
    } else {
      // Find which tool this route belongs to
      for (const [id, config] of Object.entries(toolRegistry)) {
        if (location.pathname.includes(config.routes.base)) {
          document.body.classList.add(id);
          break;
        }
      }
    }
  }, [location.pathname]);
  
  return null;
};

function App() {
  return (
    <HelmetProvider>
      <GlobalSettingsProvider>
        <BrowserRouter>
        {/* Global SEO component - manages all meta tags */}
        <SEO />
        {/* Body class manager component */}
        <BodyClassManager />
        {/* Global Navbar - appears on all pages */}
        <Navbar />
        <div className="pt-0 min-h-screen flex flex-col"> {/* Add padding to account for the navbar */}
          <div className="flex-grow">
            <Routes>
            {/* Main homepage route */}
            <Route path="/" element={<HomePage />} />
            
            {/* Contact page route */}
            <Route path="/contact" element={<Contact />} />
            
            {/*
              Tool Routes Section
              
              Each tool should have at least two routes:
              - One without trailing slash: /tools/tool-name
              - One with trailing slash: /tools/tool-name/
              
              This ensures URLs work consistently regardless of how they're entered.
            */}
            
            {/* Generate routes for all registered tools */}
            {/* TaskSmasher base routes - handle both with and without trailing slash */}
            <Route path="/tools/task-smasher" element={<TaskSmasherApp />} />
            <Route path="/tools/task-smasher/" element={<TaskSmasherApp />} />
            
            {/* ArticleSmasher base routes */}
            <Route path="/tools/article-smasher" element={<ArticleSmasherV2App />} />
            <Route path="/tools/article-smasher/" element={<ArticleSmasherV2App />} />
            
            {/* Legacy ArticleSmasherV2 routes - redirect to new paths */}
            <Route path="/tools/article-smasherv2/*" element={<Navigate to="/tools/article-smasher" replace />} />
            
            {/* Admin routes */}
            <Route path="/admin/*" element={<AdminApp />} />
            
            {/* TaskSmasher use case routes - handle both with and without trailing slash */}
            {taskSmasherConfig && taskSmasherConfig.routes.subRoutes &&
              Object.entries(taskSmasherConfig.useCases).flatMap(([id, useCase]) => {
                const basePath = taskSmasherConfig.routes.subRoutes?.[id];
                if (!basePath) return [];
                
                const pathWithSlash = `${basePath}/`;
                
                return [
                  <Route key={`${id}-no-slash`} path={basePath} element={<TaskSmasherApp />} />,
                  <Route key={`${id}-with-slash`} path={pathWithSlash} element={<TaskSmasherApp />} />
                ];
              })
            }
            
            {/* ArticleSmasher use case routes */}
            {getToolConfig('article-smasher')?.routes.subRoutes &&
              Object.entries(getToolConfig('article-smasher')?.useCases || {}).flatMap(([id, useCase]) => {
                const basePath = getToolConfig('article-smasher')?.routes.subRoutes?.[id];
                if (!basePath) return [];
                
                const pathWithSlash = `${basePath}/`;
                
                return [
                  <Route key={`article-${id}-no-slash`} path={basePath} element={<ArticleSmasherV2App />} />,
                  <Route key={`article-${id}-with-slash`} path={pathWithSlash} element={<ArticleSmasherV2App />} />
                ];
              })
            }
            
            {/* Legacy ArticleSmasherV2 use case routes - redirect to new paths */}
            {getToolConfig('article-smasherv2')?.routes.subRoutes &&
              Object.entries(getToolConfig('article-smasherv2')?.useCases || {}).flatMap(([id, useCase]) => {
                const basePath = getToolConfig('article-smasherv2')?.routes.subRoutes?.[id];
                if (!basePath) return [];
                
                // Redirect to the corresponding article-smasher path
                const newPath = basePath.replace('article-smasherv2', 'article-smasher');
                
                return [
                  <Route key={`article-v2-${id}-redirect`} path={`${basePath}/*`} element={<Navigate to={newPath} replace />} />
                ];
              })
            }
            
            {/* Catch-all redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          {/* Global Footer - appears on all pages */}
          <Footer />
        </div>
        </BrowserRouter>
      </GlobalSettingsProvider>
    </HelmetProvider>
  );
}

export default App;