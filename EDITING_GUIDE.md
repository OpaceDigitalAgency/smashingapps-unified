# SmashingApps.ai - Quick Editing Guide for Non-Coders

This guide provides simple instructions for making common edits to the SmashingApps.ai website without coding knowledge.

## SEO Architecture Overview

The SEO system for SmashingApps.ai now uses a unified approach with a single source of truth for all SEO-related content. This ensures consistent metadata across the site and simplifies the editing process.

### Key Files and Their Roles

1. **`src/utils/seoMaster.ts`** - **SEO Master File**
   - This is the **SINGLE SOURCE OF TRUTH** for all SEO-related content (H1s, URLs, meta tags, etc.).
   - Contains all page titles, descriptions, metadata, and structured data.
   - **This is the only file you need to edit when changing SEO settings.**

2. **Styling Files:**
   - **`src/tools/task-smasher/components/styles.css`** - **TaskSmasher Consolidated Styles**
     - This is the **SINGLE SOURCE** for all TaskSmasher style overrides
     - Contains both desktop and mobile-specific styles in one file
     - Desktop styles are at the top and apply to all screen sizes
     - Mobile styles are in the media query section and only apply to mobile screens
     - Edit this file to change font sizes, layouts, and other styles for TaskSmasher
   - **Base Styles:** The underlying styles are defined using **Tailwind CSS utility classes** within the React component files, but you shouldn't need to edit these directly.
   - **`src/index.css`**: Contains basic global styles for the entire application.

3. **`src/utils/seoMaster.cjs.ts`** - CommonJS wrapper for SEO compatibility
   - DO NOT edit this file directly - it automatically exports the content from `seoMaster.ts`.
   - Used by build scripts to access the SEO data in CommonJS format.

4. **`src/components/SEO.tsx`** - React component that renders meta tags during runtime
   - Adds meta tags, OG tags, and Twitter tags to the page.
   - Gets data directly from `seoMaster.ts`.

5. **`scripts/inject-meta-tags.cjs`** - Script that injects meta tags during build
   - Runs during the Netlify build process.
   - Adds meta tags, OG tags, and Twitter tags to the static HTML files.
   - Gets data from the compiled version of `seoMaster.ts`.

6. **`src/components/StructuredData.tsx`** - React component for structured data
   - Adds JSON-LD structured data to the page.
   - Used by components that need structured data.

### Key Advantage of the New System

With the unified SEO system, you only need to edit one file (`seoMaster.ts`) to update all SEO elements. The system automatically ensures consistency across:
- Meta tags (title, description, keywords)
- Open Graph tags (for social media sharing)
- Twitter Card tags
- Structured data (JSON-LD)
- Fallback content (for search engines and users with JavaScript disabled)

## SEO Settings

### Main Website SEO (Homepage)

**File:** `src/utils/seoMaster.ts` (Around line 27-38)

```typescript
export const defaultMeta: MetaConfig = {
  title: 'SmashingApps.ai | Free AI Productivity Apps & Tools',
  description: 'SmashingApps.ai provides free AI productivity apps and tools. Smash your way through mundane tasks with smart AI-powered productivity tools.',
  image: `${BASE_URL}/og/default.png`,
  canonical: BASE_URL,
  urlPath: '/',
  robots: 'index, follow',
  keywords: 'free ai planner, magic to-do, ai task manager, ai task planner, smart to-do lists, auto task manager, ai to-do lists',
  structuredData: {
    // structured data content
  }
};
```

Simply edit the text between the quotes to change:
- `title`: The page title shown in search results and browser tabs
- `description`: The description shown in search results
- `keywords`: Keywords for search engines (not visible to users)
- `structuredData`: JSON-LD structured data for rich search results

### Route-Specific SEO (TaskSmasher, Contact, etc.)

**File:** `src/utils/seoMaster.ts` (Around line 105-160)

```typescript
export const routeMeta: MetaConfigMap = {
  '/': {
    // Homepage SEO settings
  },
  '/tools/task-smasher/': {
    title: 'TaskSmasher - Free AI Planner | Magic To-Do Lists & AI Task Manager',
    description: 'Smash complex tasks into smart, manageable lists using our free AI planner. TaskSmasher is an AI task manager tool that creates magic to-do lists for greater productivity.',
    image: `${BASE_URL}/og/task-smasher.png`,
    canonical: `${BASE_URL}/tools/task-smasher/`,
    urlPath: '/tools/task-smasher/',
    keywords: 'task management, AI task breakdown, AI TO-DO planner, AI Task planner, productivity tool, task organizer',
    structuredData: {
      // structured data content
    }
  },
  '/contact': {
    // Contact page SEO settings
  }
};
```

Edit the text between quotes to change the SEO for specific routes.

### Use Case SEO (Goal Planner, Daily Organizer, etc.)

**File:** `src/utils/seoMaster.ts` (Around line 40-100)

```typescript
export const useCaseDefinitions: UseCaseDefinitionsMap = {
  goals: {
    label: "Goal Planner",
    description: "Achieve goals faster using our free AI task planner. Break down objectives into smart to-do lists.",
    keywords: ["goal", "objective", "milestone", "achieve", "accomplish", "target"]
  },
  // other use cases...
};
```

Edit the text between quotes to change:
- `label`: The name of the use case shown to users
- `description`: The description shown to users and in search results
- `keywords`: Array of keywords related to this use case

### Complete List of All Pages/URLs

The following pages are automatically generated based on the use case definitions. Each page has its own SEO settings that are derived from the `useCaseDefinitions`, `articleSmasherUseCases`, and `routeMeta` objects in `src/utils/seoMaster.ts`:

1. **Homepage**: `/` - Edit in the `routeMeta` object
2. **TaskSmasher Main Page**: `/tools/task-smasher/` - Edit in the `routeMeta` object
3. **ArticleSmasher Main Page**: `/tools/article-smasher/` - Edit in the `routeMeta` object
4. **Contact Page**: `/contact` - Edit in the `routeMeta` object

**TaskSmasher Use Cases:**
5. **Daily Organizer**: `/tools/task-smasher/daily-organizer/` - Edit in the `useCaseDefinitions` object
6. **Goal Planner**: `/tools/task-smasher/goal-planner/` - Edit in the `useCaseDefinitions` object
7. **Marketing Tasks**: `/tools/task-smasher/marketing-tasks/` - Edit in the `useCaseDefinitions` object
8. **Recipe Steps**: `/tools/task-smasher/recipe-steps/` - Edit in the `useCaseDefinitions` object
9. **Home Chores**: `/tools/task-smasher/home-chores/` - Edit in the `useCaseDefinitions` object
10. **Trip Planner**: `/tools/task-smasher/trip-planner/` - Edit in the `useCaseDefinitions` object
11. **Study Plan**: `/tools/task-smasher/study-plan/` - Edit in the `useCaseDefinitions` object
12. **Event Planning**: `/tools/task-smasher/event-planning/` - Edit in the `useCaseDefinitions` object
13. **Freelancer Projects**: `/tools/task-smasher/freelancer-projects/` - Edit in the `useCaseDefinitions` object
14. **Shopping Tasks**: `/tools/task-smasher/shopping-tasks/` - Edit in the `useCaseDefinitions` object
15. **DIY Projects**: `/tools/task-smasher/diy-projects/` - Edit in the `useCaseDefinitions` object
16. **Creative Projects**: `/tools/task-smasher/creative-projects/` - Edit in the `useCaseDefinitions` object

**ArticleSmasher Use Cases:**
17. **Blog Post**: `/tools/article-smasher/blog-post/` - Edit in the `articleSmasherUseCases` object
18. **SEO Article**: `/tools/article-smasher/seo-article/` - Edit in the `articleSmasherUseCases` object
19. **Academic Paper**: `/tools/article-smasher/academic-paper/` - Edit in the `articleSmasherUseCases` object
20. **News Article**: `/tools/article-smasher/news-article/` - Edit in the `articleSmasherUseCases` object

When you edit the `label` or `description` in the `useCaseDefinitions` object, the changes will automatically be applied to the corresponding page's SEO settings.

**IMPORTANT:** With the new unified SEO system, you only need to update information in one place (`seoMaster.ts`). The system automatically ensures consistency across all SEO elements.

## OpenAI API Settings

### API Limits

**File:** `src/tools/task-smasher/utils/openaiService.ts` (Lines 10-20)

Look for lines like:
```javascript
const MAX_API_CALLS = 20;
const MAX_TOKENS = 1000;
```

Change the numbers to adjust:
- `MAX_API_CALLS`: Maximum number of API calls allowed per user
- `MAX_TOKENS`: Maximum tokens (words) allowed per API call

### AI Behavior Settings

**File:** `netlify/functions/openai-proxy.ts` (Around line 50)

Look for lines like:
```javascript
temperature: 0.7,
max_tokens: 1000,
```

Change the numbers to adjust:
- `temperature`: Higher values (0.7-1.0) make responses more creative/random, lower values (0.2-0.5) make them more focused/deterministic
- `max_tokens`: Maximum length of AI responses

## Use Case Prompts

**File:** `src/tools/task-smasher/utils/useCaseDefinitions.ts`

```javascript
goals: {
  label: "Goal Planner",
  description: "Break down long-term objectives into actionable steps",
  prompt: "Break down this goal into achievable subtasks with clear milestones...",
}
```

Edit the text between quotes to change:
- `prompt`: The instructions sent to the AI when generating tasks for this use case
- `description`: The description shown to users
- `label`: The name of the use case shown to users

## SEO Build Process

### Meta Tag Injection

**File:** `scripts/inject-meta-tags.cjs`

This script runs during the build process and injects meta tags into the HTML files. It:
1. Reads metadata from the compiled version of `src/utils/seoMaster.ts`
2. Injects meta tags, OG tags, and Twitter tags into each HTML file
3. Ensures that search engines see the correct metadata even before JavaScript loads

### Static HTML Generation

**File:** `tools/task-smasher/scripts/generate-static-pages.js`

This script generates static HTML files for each TaskSmasher use case. It:
1. Creates an HTML file for each use case
2. Injects the appropriate metadata from the seoMaster
3. Ensures that search engines can index all pages

### SEO Component

**File:** `src/components/SEO.tsx`

This React component adds meta tags to the page during runtime. It:
1. Reads metadata directly from `src/utils/seoMaster.ts`
2. Adds meta tags, OG tags, and Twitter tags to the page
3. Updates metadata when the route changes

### Structured Data Component

**File:** `src/components/StructuredData.tsx`

This React component adds structured data (JSON-LD) to the page. It:
1. Takes a data object as a prop
2. Serializes it as JSON-LD
3. Adds it to the page head

## How URLs and Pages Are Generated

### URL Structure

The website follows this URL structure:

1. **Main Homepage**: `/`
2. **TaskSmasher Tool**: `/tools/task-smasher/`
3. **Use Case Pages**: `/tools/task-smasher/[use-case-name]/`
   - Example: `/tools/task-smasher/goal-planner/`

### How New Pages Are Created

When you add a new use case to the `useCaseDefinitions` object in `src/utils/metaConfig.cjs`, a new page is automatically generated with the following URL pattern:

```
/tools/task-smasher/[lowercase-label-with-hyphens]/
```

For example, if you add:

```javascript
new_case: {
  label: "Project Timeline",
  description: "Create detailed project timelines with milestones and deadlines."
}
```

A new page will be created at `/tools/task-smasher/project-timeline/` with all the SEO settings automatically generated.

### Adding a Completely New Tool

If you want to add a completely new tool (not just a use case for TaskSmasher):

1. Add a new entry to the `metaConfig` object in `src/utils/metaConfig.cjs`:

```javascript
'/tools/new-tool/': {
  title: 'New Tool Name | SmashingApps.ai',
  description: 'Description of your new tool',
  image: `${BASE_URL}/og/new-tool.png`,
  canonical: `${BASE_URL}/tools/new-tool/`,
  keywords: 'relevant, keywords, here',
  // Add structured data if needed
}
```
2. Create the necessary React components for the new tool
3. Update the routing in the main application to include the new tool

## Adding a New Use Case

### Adding a New Use Case to TaskSmasher

If you want to add a new use case to TaskSmasher (like "Wedding Planning" or "Fitness Goals"), follow these steps:

#### Step 1: Edit the seoMaster.ts File

Open `src/utils/seoMaster.ts` and add a new entry to the `useCaseDefinitions` object:

```typescript
export const useCaseDefinitions: UseCaseDefinitionsMap = {
  // Existing use cases...
  
  // Add your new use case here
  wedding: {  // Use a short, unique ID (no spaces)
    label: "Wedding Planning",  // User-friendly name (shown to users)
    description: "Plan your perfect wedding day with AI assistance. Our Wedding Planning tool helps you organize venues, guest lists, vendors, and timelines for a stress-free celebration.",
    keywords: ["wedding", "bride", "groom", "venue", "ceremony", "reception", "guests"]
  }
};
```

#### Step 2: Add the Prompt in TaskSmasher's useCaseDefinitions.ts

Open `src/tools/task-smasher/utils/useCaseDefinitions.ts` and add a matching entry:

```typescript
export const useCaseDefinitions = {
  // Existing use cases...
  
  // Add your new use case here
  wedding: {
    label: "Wedding Planning",
    description: "Plan your perfect wedding day with AI assistance",
    prompt: "Break down this wedding planning task into clear, actionable subtasks. Include considerations for venue, catering, guest list, attire, decorations, and timeline. Provide specific, practical steps that will help the user organize their wedding effectively.",
    keywords: ["wedding", "bride", "groom", "venue", "ceremony", "reception", "guests"]
  }
};
```

The `prompt` is what gets sent to the AI when generating tasks, so make it detailed and specific to get the best results.

#### Step 3: Add an Icon (Optional)

If you want to add a custom icon for your new use case, you'll need to edit the `Sidebar.tsx` component.

That's it! The new use case will automatically appear in the sidebar menu, and a new page will be created at `/tools/task-smasher/wedding-planning/` with all the SEO settings automatically generated.

**IMPORTANT:** Make sure the description in TaskSmasher's useCaseDefinitions.ts matches what you added to seoMaster.ts for consistency in the user interface.

### Adding a New Use Case to ArticleSmasher

If you want to add a new use case to ArticleSmasher (like "Product Description" or "Technical Documentation"), follow these steps:

#### Step 1: Edit the seoMaster.ts File

Open `src/utils/seoMaster.ts` and add a new entry to the `articleSmasherUseCases` object:

```typescript
export const articleSmasherUseCases: UseCaseDefinitionsMap = {
  // Existing use cases...
  
  // Add your new use case here
  product: {  // Use a short, unique ID (no spaces)
    label: "Product Description",  // User-friendly name (shown to users)
    description: "Create compelling product descriptions that convert browsers into buyers. Our Product Description generator helps you highlight features, benefits, and unique selling points.",
    keywords: ["product", "description", "ecommerce", "features", "benefits", "selling", "conversion"]
  }
};
```

#### Step 2: Update ArticleSmasher's config.ts

Open `src/tools/article-smasher/config.ts` and add a matching entry to the `useCases` object:

```typescript
useCases: {
  // Existing use cases...
  
  // Add your new use case here
  product: {
    id: 'product',
    label: 'Product Description',
    description: 'Create compelling product descriptions that convert browsers into buyers',
    icon: ShoppingBag, // Import an appropriate icon from lucide-react
    promptTemplate: 'Write a product description for: {{topic}}. Highlight key features and benefits that would appeal to potential customers.'
  }
},
```

Also update the `routes.subRoutes` object to include the new use case:

```typescript
routes: {
  base: '/tools/article-smasher',
  subRoutes: {
    // Existing routes...
    product: '/tools/article-smasher/product-description'
  }
},
```

That's it! The new use case will automatically appear in the sidebar menu, and a new page will be created at `/tools/article-smasher/product-description/` with all the SEO settings automatically generated.

**IMPORTANT:** Make sure the description in ArticleSmasher's config.ts matches what you added to seoMaster.ts for consistency in the user interface.