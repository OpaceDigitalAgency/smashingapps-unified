import { PromptTemplate, PromptSettings } from '../types';

// Function to create deterministic IDs based on prompt name and category
const createDeterministicId = (name: string, category: string): string => {
  // Create a simple hash from the name and category
  const baseString = `${name}-${category}`.toLowerCase().replace(/\s+/g, '-');
  return `prompt-${baseString}`;
};

// Local storage keys
const PROMPTS_STORAGE_KEY = 'article_smasher_prompts';
const SETTINGS_STORAGE_KEY = 'article_smasher_prompt_settings';

// Default prompt templates
const DEFAULT_PROMPTS: PromptTemplate[] = [
  {
    id: createDeterministicId('Topic Generator', 'topic'),
    name: 'Topic Generator',
    description: 'Generates article topic ideas based on the selected article type',
    systemPrompt: 'You are a professional content strategist specializing in creating engaging article topics. Your task is to generate 5 compelling topic ideas for the specified article type.',
    userPromptTemplate: 'Generate 5 engaging topic ideas for a {{articleType}} about {{subject}}. Each topic should be SEO-friendly and appeal to my target audience.',
    category: 'topic',
    temperature: 0.8,
    maxTokens: 500,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: createDeterministicId('Keyword Researcher', 'keyword'),
    name: 'Keyword Researcher',
    description: 'Identifies relevant keywords for the selected topic',
    systemPrompt: 'You are an SEO expert specializing in keyword research. Your task is to identify the most relevant keywords for the given topic.',
    userPromptTemplate: 'Identify 10 relevant keywords for an article titled "{{title}}". For each keyword, provide an estimated search volume (high/medium/low), difficulty score (1-10), and potential CPC value.',
    category: 'keyword',
    temperature: 0.5,
    maxTokens: 800,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: createDeterministicId('Article Outliner', 'outline'),
    name: 'Article Outliner',
    description: 'Creates a detailed outline for the article based on the topic and keywords',
    systemPrompt: 'You are a professional content outliner. Your task is to create a comprehensive, well-structured outline for an article based on the provided topic and keywords.',
    userPromptTemplate: 'Create a detailed outline for an article titled "{{title}}". The article should incorporate these keywords: {{keywords}}. Include an introduction, 4-6 main sections with subsections where appropriate, and a conclusion.',
    category: 'outline',
    temperature: 0.6,
    maxTokens: 1000,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: createDeterministicId('Content Generator', 'content'),
    name: 'Content Generator',
    description: 'Generates the full article content based on the outline',
    systemPrompt: 'You are a professional content writer specializing in creating engaging, informative articles. Your task is to write a complete article following the provided outline and incorporating the specified keywords naturally.',
    userPromptTemplate: 'Write a comprehensive article titled "{{title}}" following this outline: {{outline}}. Naturally incorporate these keywords: {{keywords}}. The article should be engaging, informative, and written in a conversational tone. Include appropriate headings for each section.',
    category: 'content',
    temperature: 0.7,
    maxTokens: 3000,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: createDeterministicId('Image Prompt Generator', 'image'),
    name: 'Image Prompt Generator',
    description: 'Creates prompts for generating images related to the article',
    systemPrompt: 'You are a professional image prompt creator. Your task is to create detailed prompts for generating images that complement the article content.',
    userPromptTemplate: 'Create 3 detailed image prompts for an article titled "{{title}}" about {{keywords}}. Each prompt should describe a scene or concept that would visually enhance the article. Make the prompts detailed enough for an AI image generator to create compelling visuals.',
    category: 'image',
    temperature: 0.8,
    maxTokens: 500,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Default settings
const DEFAULT_SETTINGS: PromptSettings = {
  defaultModel: 'gpt-4o',
  defaultTemperature: 0.7,
  defaultMaxTokens: 1000,
  enabledCategories: ['topic', 'keyword', 'outline', 'content', 'image']
};

/**
 * Loads prompts from local storage or initializes with defaults
 */
export const loadPrompts = (): PromptTemplate[] => {
  try {
    const storedPrompts = localStorage.getItem(PROMPTS_STORAGE_KEY);
    if (storedPrompts) {
      const parsedPrompts = JSON.parse(storedPrompts);
      // Convert string dates back to Date objects
      return parsedPrompts.map((prompt: any) => ({
        ...prompt,
        createdAt: new Date(prompt.createdAt),
        updatedAt: new Date(prompt.updatedAt)
      }));
    }
    // Initialize with defaults if no stored prompts
    savePrompts(DEFAULT_PROMPTS);
    return DEFAULT_PROMPTS;
  } catch (error) {
    console.error('Error loading prompts:', error);
    return DEFAULT_PROMPTS;
  }
};

/**
 * Saves prompts to local storage
 */
export const savePrompts = (prompts: PromptTemplate[]): void => {
  try {
    localStorage.setItem(PROMPTS_STORAGE_KEY, JSON.stringify(prompts));
  } catch (error) {
    console.error('Error saving prompts:', error);
  }
};

/**
 * Loads settings from local storage or initializes with defaults
 */
export const loadSettings = (): PromptSettings => {
  try {
    const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (storedSettings) {
      return JSON.parse(storedSettings);
    }
    // Initialize with defaults if no stored settings
    saveSettings(DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error loading settings:', error);
    return DEFAULT_SETTINGS;
  }
};

/**
 * Saves settings to local storage
 */
export const saveSettings = (settings: PromptSettings): void => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

/**
 * Adds a new prompt
 */
export const addPrompt = (prompt: Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt'>): PromptTemplate => {
  const prompts = loadPrompts();
  const newPrompt: PromptTemplate = {
    ...prompt,
    id: createDeterministicId(prompt.name, prompt.category),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  prompts.push(newPrompt);
  savePrompts(prompts);
  return newPrompt;
};

/**
 * Updates an existing prompt
 */
export const updatePrompt = (id: string, promptUpdate: Partial<PromptTemplate>): PromptTemplate | null => {
  const prompts = loadPrompts();
  const index = prompts.findIndex(p => p.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const updatedPrompt = {
    ...prompts[index],
    ...promptUpdate,
    updatedAt: new Date()
  };
  
  prompts[index] = updatedPrompt;
  savePrompts(prompts);
  return updatedPrompt;
};

/**
 * Deletes a prompt
 */
export const deletePrompt = (id: string): boolean => {
  const prompts = loadPrompts();
  const filteredPrompts = prompts.filter(p => p.id !== id);
  
  if (filteredPrompts.length === prompts.length) {
    return false;
  }
  
  savePrompts(filteredPrompts);
  return true;
};

/**
 * Gets prompts by category
 */
export const getPromptsByCategory = (category: PromptTemplate['category']): PromptTemplate[] => {
  const prompts = loadPrompts();
  return prompts.filter(p => p.category === category);
};

/**
 * Updates settings
 */
export const updateSettings = (settingsUpdate: Partial<PromptSettings>): PromptSettings => {
  const currentSettings = loadSettings();
  const updatedSettings = {
    ...currentSettings,
    ...settingsUpdate
  };
  
  saveSettings(updatedSettings);
  return updatedSettings;
};

/**
 * Processes a prompt template by replacing variables
 */
export const processPromptTemplate = (
  template: string, 
  variables: Record<string, string>
): string => {
  let processedTemplate = template;
  
  // Replace all variables in the format {{variableName}}
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    processedTemplate = processedTemplate.replace(regex, value);
  });
  
  return processedTemplate;
};