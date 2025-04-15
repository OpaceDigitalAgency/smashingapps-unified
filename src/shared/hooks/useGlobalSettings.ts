import { useState, useEffect } from 'react';
import {
  getGlobalSettings,
  updateGlobalSettings,
  GlobalSettings
} from '../services/globalSettingsService';

/**
 * Custom hook for accessing and modifying global settings
 *
 * This hook provides a consistent interface for applications to interact with
 * the global settings system. It ensures that any changes made to settings
 * are properly synchronized across all applications.
 *
 * @returns An object with the current settings and functions to update them
 */
export function useGlobalSettings() {
  const [settings, setSettings] = useState<GlobalSettings>(getGlobalSettings());

  // Initialize settings on mount
  useEffect(() => {
    // Get the latest settings
    const currentSettings = getGlobalSettings();
    console.log('useGlobalSettings: Initial settings loaded', currentSettings);
    
    // Ensure the default model is set to gpt-3.5-turbo
    if (currentSettings.defaultModel !== 'gpt-3.5-turbo') {
      console.log('useGlobalSettings: Fixing model persistence - setting to gpt-3.5-turbo');
      const updatedSettings = updateGlobalSettings({ defaultModel: 'gpt-3.5-turbo' });
      setSettings(updatedSettings);
    } else {
      setSettings(currentSettings);
    }
  }, []);

  // Listen for global settings changes
  useEffect(() => {
    const handleSettingsChange = (e: CustomEvent<GlobalSettings>) => {
      console.log('useGlobalSettings: Settings changed event received', e.detail);
      setSettings(e.detail);
    };

    // Add event listener
    window.addEventListener('globalSettingsChanged', handleSettingsChange as EventListener);

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('globalSettingsChanged', handleSettingsChange as EventListener);
    };
  }, []);

  /**
   * Update global settings
   * @param newSettings Partial settings to update
   */
  const updateSettings = (newSettings: Partial<GlobalSettings>) => {
    console.log('useGlobalSettings: Updating settings', newSettings);
    const updatedSettings = updateGlobalSettings(newSettings);
    setSettings(updatedSettings);
    
    // Validate that model setting is persisted if it was updated
    if (newSettings.defaultModel === 'gpt-3.5-turbo') {
      // Double-check localStorage directly to ensure it was saved
      const storedSettings = localStorage.getItem('smashingapps-global-settings');
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        if (parsedSettings.defaultModel !== 'gpt-3.5-turbo') {
          console.warn('useGlobalSettings: Model setting not persisted correctly, fixing...');
          const fixedSettings = updateGlobalSettings({ defaultModel: 'gpt-3.5-turbo' });
          setSettings(fixedSettings);
          return fixedSettings;
        }
      }
    }
    
    return updatedSettings;
  };

  return {
    settings,
    updateSettings
  };
}

export default useGlobalSettings;