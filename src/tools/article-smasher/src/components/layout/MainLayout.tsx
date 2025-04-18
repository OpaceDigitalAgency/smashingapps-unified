import React, { ReactNode } from 'react';
import { useArticleWizard } from '../../contexts/ArticleWizardContext';
import WizardHeader from './WizardHeader';
import FixedNavigation from './FixedNavigation';
import StepNavigation from './StepNavigation';
import ArticleTypeSidebar from '../ArticleTypeSidebar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { 
    selectedArticleType, 
    setSelectedArticleType, 
    isArticleTypeLocked, 
    currentStep,
    generateTopicIdeas 
  } = useArticleWizard();
  
  return (
    <div className="min-h-screen bg-gray-50 pb-24 article-smasher-container">
      <WizardHeader />
      
      <div className="mobile-container py-4">
        <StepNavigation />
        
        <div className="main-content-flex">
          {/* Sidebar - always visible for consistent layout */}
          <div className="flex-shrink-0">
            <ArticleTypeSidebar
              selectedType={selectedArticleType}
              onSelectType={setSelectedArticleType}
              isLocked={isArticleTypeLocked || currentStep > 1}
              onGenerateIdeas={generateTopicIdeas}
            />
          </div>
          
          {/* Fixed Navigation Buttons */}
          <FixedNavigation />
          
          {/* Main Content */}
          <div className="flex-grow bg-white rounded-xl shadow-card p-4 mb-20">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;