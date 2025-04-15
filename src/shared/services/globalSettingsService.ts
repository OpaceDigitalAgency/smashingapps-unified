import { AIProvider } from '../types/aiProviders';
import { aiServiceRegistry } from './aiServices';

// Define the global settings type
export interface GlobalSettings {
  defaultProvider: AIProvider;
  defaultModel: string;
  defaultTemperature: number;
  defaultMaxTokens: number;
}

// Default global settings
const DEFAULT_GLOBAL_SETTINGS: GlobalSettings = {
  defaultProvider: 'openai',
  defaultModel: 'gpt-4o',
  defaultTemperature: 0.7,
  defaultMaxTokens: 1000,
};

// Storage keys for settings
const GLOBAL_SETTINGS_KEY = 'smashingapps_globalSettings';
const ARTICLE_SMASHER_SETTINGS_KEY = 'article_smasher_prompt_settings';
const TASK_SMASHER_PROVIDER_KEY = 'smashingapps_activeProvider';

// Custom events for settings changes
const GLOBAL_SETTINGS_CHANGED_EVENT = 'globalSettingsChanged';
const TASK_SMASHER_SETTINGS_CHANGED_EVENT = 'taskSmasherSettingsChanged';
const ARTICLE_SMASHER_SETTINGS_CHANGED_EVENT = 'articleSmasherSettingsChanged';

/**
 * Get global settings from localStorage
 */
export const getGlobalSettings = (): GlobalSettings => {
  try {
    console.log('[globalSettingsService] getGlobalSettings: entry');
    if (typeof localStorage === "undefined") {
      throw new Error("localStorage is not available in this environment.");
    }
    const settingsStr = localStorage.getItem(GLOBAL_SETTINGS_KEY);
    if (settingsStr) {
      try {
        const parsed = JSON.parse(settingsStr);
        // Only return if parsed is a valid object with required keys
        if (
          parsed &&
          typeof parsed === "object" &&
          "defaultProvider" in parsed &&
          "defaultModel" in parsed &&
          "defaultTemperature" in parsed &&
          "defaultMaxTokens" in parsed
        ) {
          console.log('[globalSettingsService] getGlobalSettings: loaded from storage', parsed);
          return parsed;
        }
        // If malformed, fall through to set defaults
      } catch (parseError) {
        console.error('[globalSettingsService] Error parsing global settings:', parseError);
        // If parsing fails, fall through to set defaults
      }
    }
    // Only set defaults if settings are truly missing or malformed, and prevent sync loop
    setGlobalSettings(DEFAULT_GLOBAL_SETTINGS, true);
    console.log('[globalSettingsService] getGlobalSettings: using defaults', DEFAULT_GLOBAL_SETTINGS);
    return DEFAULT_GLOBAL_SETTINGS;
  } catch (error) {
    console.error('[globalSettingsService] Error loading global settings:', error);
    if (typeof window !== "undefined") {
      (window as any).__GLOBAL_SETTINGS_ERROR__ = error;
    }
    // Optionally, throw here to surface the error in the UI
    // throw error;
    // As a fallback, return defaults (but do NOT set them to storage)
    return DEFAULT_GLOBAL_SETTINGS;
  }
};

/**
 * Save global settings to localStorage
 */
export const setGlobalSettings = (settings: GlobalSettings, skipSync: boolean = false): void => {
  try {
    console.log('[globalSettingsService] setGlobalSettings: entry', settings);
    if (typeof localStorage === "undefined") {
      throw new Error("localStorage is not available in this environment.");
    }
    localStorage.setItem(GLOBAL_SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent(GLOBAL_SETTINGS_CHANGED_EVENT, { detail: settings }));
    if (!skipSync) {
      applyGlobalSettingsToAllApps();
    }
    console.log('[globalSettingsService] setGlobalSettings: success');
  } catch (error) {
    console.error('[globalSettingsService] Error saving global settings:', error);
    if (typeof window !== "undefined") {
      (window as any).__GLOBAL_SETTINGS_ERROR__ = error;
    }
    // Optionally, throw here to surface the error in the UI
    // throw error;
  }
};

/**
 * Update global settings
 */
export const updateGlobalSettings = (settings: Partial<GlobalSettings>, skipSync: boolean = false): GlobalSettings => {
  const currentSettings = getGlobalSettings();
  const updatedSettings = {
    ...currentSettings,
    ...settings,
  };
  
  setGlobalSettings(updatedSettings, skipSync);
  
  // Update the default provider in the AI service registry
  if (settings.defaultProvider) {
    aiServiceRegistry.setDefaultProvider(settings.defaultProvider);
  }
  
  return updatedSettings;
};

/**
 * Get ArticleSmasher settings from localStorage
 */
export const getArticleSmasherSettings = () => {
  try {
    const settingsStr = localStorage.getItem(ARTICLE_SMASHER_SETTINGS_KEY);
    if (settingsStr) {
      return JSON.parse(settingsStr);
    }
  } catch (error) {
    console.error('Error loading ArticleSmasher settings:', error);
  }
  
  // Initialize with global settings if no stored settings
  const globalSettings = getGlobalSettings();
  const defaultSettings = {
    defaultModel: globalSettings.defaultModel,
    defaultTemperature: globalSettings.defaultTemperature,
    defaultMaxTokens: globalSettings.defaultMaxTokens,
    enabledCategories: ['topic', 'keyword', 'outline', 'content', 'image']
  };
  
  localStorage.setItem(ARTICLE_SMASHER_SETTINGS_KEY, JSON.stringify(defaultSettings));
  return defaultSettings;
};

/**
 * Get TaskSmasher settings
 */
export const getTaskSmasherSettings = () => {
  try {
    const activeProvider = localStorage.getItem(TASK_SMASHER_PROVIDER_KEY);
    const globalSettings = getGlobalSettings();
    
    return {
      activeProvider: activeProvider || globalSettings.defaultProvider,
      ...globalSettings
    };
  } catch (error) {
    console.error('Error loading TaskSmasher settings:', error);
    return getGlobalSettings();
  }
};

/**
 * Apply global settings to ArticleSmasher
 */
export const applyGlobalSettingsToArticleSmasher = (): void => {
  try {
    const globalSettings = getGlobalSettings();
    const articleSmasherSettings = getArticleSmasherSettings();
    
    // Update ArticleSmasher settings with global settings
    articleSmasherSettings.defaultModel = globalSettings.defaultModel;
    articleSmasherSettings.defaultTemperature = globalSettings.defaultTemperature;
    articleSmasherSettings.defaultMaxTokens = globalSettings.defaultMaxTokens;
    
    // Save updated settings
    localStorage.setItem(ARTICLE_SMASHER_SETTINGS_KEY, JSON.stringify(articleSmasherSettings));
    
    // Dispatch event to notify ArticleSmasher of the change
    window.dispatchEvent(new CustomEvent(ARTICLE_SMASHER_SETTINGS_CHANGED_EVENT, {
      detail: articleSmasherSettings
    }));
  } catch (error) {
    console.error('Error applying global settings to ArticleSmasher:', error);
  }
};

/**
 * Apply global settings to TaskSmasher
 */
export const applyGlobalSettingsToTaskSmasher = (): void => {
  try {
    const globalSettings = getGlobalSettings();
    
    // Update the active provider in localStorage
    localStorage.setItem(TASK_SMASHER_PROVIDER_KEY, globalSettings.defaultProvider);
    
    // Dispatch a custom event to notify TaskSmasher of the change
    window.dispatchEvent(new CustomEvent(TASK_SMASHER_SETTINGS_CHANGED_EVENT, {
      detail: globalSettings
    }));
  } catch (error) {
    console.error('Error applying global settings to TaskSmasher:', error);
  }
};

/**
 * Apply ArticleSmasher settings to global settings
 */
export const applyArticleSmasherSettingsToGlobal = (): void => {
  try {
    const articleSmasherSettings = getArticleSmasherSettings();
    
    // Update global settings with ArticleSmasher settings
    updateGlobalSettings({
      defaultModel: articleSmasherSettings.defaultModel,
      defaultTemperature: articleSmasherSettings.defaultTemperature,
      defaultMaxTokens: articleSmasherSettings.defaultMaxTokens
    }, true); // Skip sync to avoid circular updates
    
    // Apply to TaskSmasher only
    applyGlobalSettingsToTaskSmasher();
  } catch (error) {
    console.error('Error applying ArticleSmasher settings to global:', error);
  }
};

/**
 * Apply TaskSmasher settings to global settings
 */
export const applyTaskSmasherSettingsToGlobal = (): void => {
  try {
    const activeProvider = localStorage.getItem(TASK_SMASHER_PROVIDER_KEY);
    
    if (activeProvider) {
      // Update global settings with TaskSmasher provider
      updateGlobalSettings({
        defaultProvider: activeProvider as AIProvider
      }, true); // Skip sync to avoid circular updates
      
      // Apply to ArticleSmasher only
      applyGlobalSettingsToArticleSmasher();
    }
  } catch (error) {
    console.error('Error applying TaskSmasher settings to global:', error);
  }
};

/**
 * Apply global settings to all apps
 */
export const applyGlobalSettingsToAllApps = (): void => {
  applyGlobalSettingsToArticleSmasher();
  applyGlobalSettingsToTaskSmasher();
};

/**
 * Initialize global settings service
 * This should be called when the application starts
 */
export const initGlobalSettingsService = (): void => {
  try {
    console.log('[globalSettingsService] initGlobalSettingsService: entry');
    if (typeof localStorage === "undefined") {
      throw new Error("localStorage is not available in this environment.");
    }
    if (!localStorage.getItem(GLOBAL_SETTINGS_KEY)) {
      setGlobalSettings(DEFAULT_GLOBAL_SETTINGS);
    }
    applyGlobalSettingsToAllApps();
    window.addEventListener('storage', (e) => {
      if (e.key === GLOBAL_SETTINGS_KEY && e.newValue) {
        try {
          // Only apply if the new value is different from the current value
          const current = localStorage.getItem(GLOBAL_SETTINGS_KEY);
          if (current !== e.newValue) {
            applyGlobalSettingsToAllApps();
          }
        } catch (error) {
          console.error('[globalSettingsService] Error handling global settings storage event:', error);
        }
      } else if (e.key === ARTICLE_SMASHER_SETTINGS_KEY && e.newValue) {
        try {
          applyArticleSmasherSettingsToGlobal();
        } catch (error) {
          console.error('[globalSettingsService] Error handling ArticleSmasher settings storage event:', error);
        }
      } else if (e.key === TASK_SMASHER_PROVIDER_KEY && e.newValue) {
        try {
          applyTaskSmasherSettingsToGlobal();
        } catch (error) {
          console.error('[globalSettingsService] Error handling TaskSmasher settings storage event:', error);
        }
      }
    });
    window.addEventListener(ARTICLE_SMASHER_SETTINGS_CHANGED_EVENT, () => {
      applyArticleSmasherSettingsToGlobal();
    });
    window.addEventListener(TASK_SMASHER_SETTINGS_CHANGED_EVENT, () => {
      applyTaskSmasherSettingsToGlobal();
    });
    console.log('[globalSettingsService] initGlobalSettingsService: success');
  } catch (error) {
    console.error('[globalSettingsService] Fatal error in initGlobalSettingsService:', error);
    if (typeof window !== "undefined") {
      (window as any).__GLOBAL_SETTINGS_ERROR__ = error;
    }
    // Optionally, throw here to surface the error in the UI
    // throw error;
  }
};