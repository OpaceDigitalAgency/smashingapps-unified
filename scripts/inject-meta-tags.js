/**
 * Meta Tags Injector
 * 
 * This script directly injects meta tags into the index.html file
 * based on the metaConfig. This serves as a fallback in case the
 * prerendering process doesn't work as expected.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Wrap in an async IIFE to use await for dynamic import
(async () => {
  // Import the meta config
  // Use dynamic import for ES module compatibility
  let metaConfig, defaultMetaConfig;
  try {
    console.log('Attempting to import metaConfig...');
    const metaConfigModule = await import('../src/utils/metaConfig.js');
    metaConfig = metaConfigModule.default;
    defaultMetaConfig = metaConfigModule.defaultMetaConfig;
    console.log('Successfully imported metaConfig:', !!metaConfig, 'defaultMetaConfig:', !!defaultMetaConfig);
    if (!metaConfig || !defaultMetaConfig) {
      throw new Error('metaConfig or defaultMetaConfig is undefined after import.');
    }
  } catch (error) {
    console.error('Error importing metaConfig:', error);
    // Fallback to empty objects to prevent script failure
    metaConfig = {};
    defaultMetaConfig = { title: 'SmashingApps.ai', description: '', canonical: 'https://smashingapps.ai', image: '' }; // Basic fallback
    // Optionally, exit if config is crucial: process.exit(1);
  }

  /**
   * Create route-specific HTML files with proper meta tags and basic body content
   */
  async function injectMetaTagsAndContent() {
  console.log('Starting meta tags injection...');
  
  // Read the original index.html file
  const indexPath = path.resolve(__dirname, '../dist/index.html');
  const originalHtml = fs.readFileSync(indexPath, 'utf8');
  
  // Create a version with default meta tags
  let defaultHtml = originalHtml;
  
  // Replace title - Ensure defaultMetaConfig exists
  if (defaultMetaConfig.title) {
    defaultHtml = defaultHtml.replace(/<title>[^<]*<\/title>/, `<title>${defaultMetaConfig.title}</title>`);
  }
  
  // Replace or add meta description
  // Replace or add meta description - Ensure defaultMetaConfig exists
  if (defaultMetaConfig.description) {
    if (defaultHtml.includes('<meta name="description"')) {
      defaultHtml = defaultHtml.replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${defaultMetaConfig.description}">`);
    } else {
      defaultHtml = defaultHtml.replace('</head>', `  <meta name="description" content="${defaultMetaConfig.description}">\n  </head>`);
    }
  }
  
  // Replace or add canonical link
  // Replace or add canonical link - Ensure defaultMetaConfig exists
  if (defaultMetaConfig.canonical) {
    if (defaultHtml.includes('<link rel="canonical"')) {
      defaultHtml = defaultHtml.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${defaultMetaConfig.canonical}">`);
    } else {
      defaultHtml = defaultHtml.replace('</head>', `  <link rel="canonical" href="${defaultMetaConfig.canonical}">\n  </head>`);
    }
  }
  
  // Add robots meta tag
  // Add robots meta tag - Ensure defaultMetaConfig exists
  if (defaultMetaConfig.robots && !defaultHtml.includes('<meta name="robots"')) {
    defaultHtml = defaultHtml.replace('</head>', `  <meta name="robots" content="${defaultMetaConfig.robots}">\n  </head>`);
  }
  
  // Add Open Graph tags
  // Add Open Graph tags - Ensure defaultMetaConfig exists
  if (defaultMetaConfig.title && defaultMetaConfig.description && defaultMetaConfig.image && !defaultHtml.includes('<meta property="og:title"')) {
    const ogTags = `
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${defaultMetaConfig.canonical || 'https://smashingapps.ai'}" />
  <meta property="og:title" content="${defaultMetaConfig.title}" />
  <meta property="og:description" content="${defaultMetaConfig.description}" />
  <meta property="og:image" content="${defaultMetaConfig.image}" />
  <meta property="og:site_name" content="SmashingApps.ai" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${defaultMetaConfig.title}" />
  <meta name="twitter:description" content="${defaultMetaConfig.description}" />
  <meta name="twitter:image" content="${defaultMetaConfig.image}" />
`;
    defaultHtml = defaultHtml.replace('</head>', `${ogTags}\n  </head>`);
  }
  
  // Add structured data if available
  if (defaultMetaConfig.structuredData && !defaultHtml.includes('application/ld+json')) {
    const structuredDataTag = `
  <!-- Structured Data -->
  <script type="application/ld+json">
    ${JSON.stringify(defaultMetaConfig.structuredData, null, 2)}
  </script>
`;
    defaultHtml = defaultHtml.replace('</head>', `${structuredDataTag}\n  </head>`);
  }
  
  // Inject basic body content for default index.html
  const defaultBodyContent = `
      <div id="root-fallback" style="padding: 20px; font-family: sans-serif;">
        <h1>${defaultMetaConfig.title || 'SmashingApps.ai'}</h1>
        <p>${defaultMetaConfig.description || 'Loading...'}</p>
        <p><em>Content is loading... If it doesn't load, please ensure JavaScript is enabled.</em></p>
      </div>
    `;
  defaultHtml = defaultHtml.replace('<div id="root"></div>', `<div id="root">${defaultBodyContent}</div>`);

  // Write the updated default HTML back to index.html
  fs.writeFileSync(indexPath, defaultHtml);
  console.log(`✅ Updated default meta tags and basic content in ${indexPath}`);
  
  // Create route-specific HTML files for each route in metaConfig
  for (const [route, meta] of Object.entries(metaConfig)) {
    if (route === '/') continue; // Skip the homepage as we've already updated index.html
    
    // Create a copy of the HTML with route-specific meta tags
    let routeHtml = originalHtml;
    
    // Replace title - Ensure meta exists
    if (meta.title) {
      routeHtml = routeHtml.replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`);
    }
    
    // Replace or add meta description
    // Replace or add meta description - Ensure meta exists
    if (meta.description) {
      if (routeHtml.includes('<meta name="description"')) {
        routeHtml = routeHtml.replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${meta.description}">`);
      } else {
        routeHtml = routeHtml.replace('</head>', `  <meta name="description" content="${meta.description}">\n  </head>`);
      }
    }
    
    // Replace or add canonical link
    // Replace or add canonical link - Ensure meta exists
    if (meta.canonical) {
      if (routeHtml.includes('<link rel="canonical"')) {
        routeHtml = routeHtml.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${meta.canonical}">`);
      } else {
        routeHtml = routeHtml.replace('</head>', `  <link rel="canonical" href="${meta.canonical}">\n  </head>`);
      }
    }
    
    // Add robots meta tag
    // Add robots meta tag - Ensure meta exists
    if (meta.robots && !routeHtml.includes('<meta name="robots"')) {
      routeHtml = routeHtml.replace('</head>', `  <meta name="robots" content="${meta.robots}">\n  </head>`);
    }
    
    // Add Open Graph tags
    // Add Open Graph tags - Ensure meta exists
    if (meta.title && meta.description && meta.image && !routeHtml.includes('<meta property="og:title"')) {
      const ogTags = `
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${meta.canonical || 'https://smashingapps.ai' + route}" />
  <meta property="og:title" content="${meta.title}" />
  <meta property="og:description" content="${meta.description}" />
  <meta property="og:image" content="${meta.image}" />
  <meta property="og:site_name" content="SmashingApps.ai" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${meta.title}" />
  <meta name="twitter:description" content="${meta.description}" />
  <meta name="twitter:image" content="${meta.image}" />
`;
      routeHtml = routeHtml.replace('</head>', `${ogTags}\n  </head>`);
    }
    
    // Add structured data if available
    if (meta.structuredData && !routeHtml.includes('application/ld+json')) {
      const structuredDataTag = `
  <!-- Structured Data -->
  <script type="application/ld+json">
    ${JSON.stringify(meta.structuredData, null, 2)}
  </script>
`;
      routeHtml = routeHtml.replace('</head>', `${structuredDataTag}\n  </head>`);
    }
    
    // Create the directory structure for the route
    const routePath = route.substring(1); // Remove leading slash
    const outputDir = path.resolve(__dirname, '../dist', routePath);
    fs.mkdirSync(outputDir, { recursive: true });
    
    // Inject basic body content for the route
    const routeBodyContent = `
      <div id="root-fallback" style="padding: 20px; font-family: sans-serif;">
        <h1>${meta.title || 'SmashingApps.ai'}</h1>
        <p>${meta.description || 'Loading...'}</p>
        <p><em>Content is loading... If it doesn't load, please ensure JavaScript is enabled.</em></p>
      </div>
    `;
    routeHtml = routeHtml.replace('<div id="root"></div>', `<div id="root">${routeBodyContent}</div>`);

    // Write the HTML file
    const outputPath = path.join(outputDir, 'index.html');
    fs.writeFileSync(outputPath, routeHtml);
    console.log(`✅ Created ${outputPath} with route-specific meta tags and basic content`);
  }
  
  console.log('Meta tags injection complete!');
}

  // Run the injection process
  injectMetaTagsAndContent().catch(error => {
    console.error('Error during meta tags injection:', error);
    process.exit(1);
  });
})(); // End of async IIFE