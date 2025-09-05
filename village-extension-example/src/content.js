// Village Extension - Import Village SDK and use paths/intro components
console.log('🚀 Village Extension Content Script: STARTING');
console.log('📍 Content script running on:', window.location.href);
console.log('🕐 Time:', new Date().toLocaleTimeString());

// This will enable full-page Village modals!

const people = [
  {
    id: 1,
    name: "Ziad Ibrahim",
    linkedinUrl: "https://www.linkedin.com/in/ziad-ibrahim-12391279/",
  },
  {
    id: 2,
    name: "4dx ventures",
    linkedinUrl: "https://www.linkedin.com/company/4dx-ventures/",
  },
  {
    id: 3,
    name: "rafaelmuttoni", 
    linkedinUrl: "https://www.linkedin.com/in/rafaelmuttoni/",
  },
];

const sampleCompanies = [
  {
    name: "Google",
    linkedinUrl: "https://www.linkedin.com/company/google",
  },
  {
    name: "Microsoft", 
    linkedinUrl: "https://www.linkedin.com/company/microsoft",
  },
];

async function main() {
  try {
    // Import Village SDK - this is the key part!
    console.log('📦 Importing Village SDK...');
    const VillageModule = await import(chrome.runtime.getURL('public/village-sdk.mjs'));
    villageSDK = VillageModule.default;
    
    // Make it globally available for HTML attributes
    window.Village = villageSDK;
    
    console.log('✅ Village SDK imported successfully');
    console.log('📋 Village object type:', typeof villageSDK);
    console.log('📋 Current page URL:', window.location.href);
    console.log('📋 Is LinkedIn page?', window.location.href.includes('linkedin.com'));
    
    // Initialize Village
    villageSDK.init('pk_SMhdS08sJc8UIIxDJbeN7lEeFekDcK9');
    console.log('🔧 Village initialized');
    
    // Try to authorize (in real extension, get token from your backend)
    try {
      const result = await villageSDK.authorize('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkZW50aWZpZXIiOiIxNTYiLCJwdWJsaWNfa2V5IjoicGtfelQ0SHpabjdvVjh4N2RnN1l1Q2pCRUc0MEFNNERoenUiLCJqdGkiOiJmZGU5MTdmMTRkNzc1OGJkN2UxOTE5YTc4MmYzZjI1NyIsImlhdCI6MTc1Njk4Njc1MCwiZXhwIjoxNzg4NTIyNzUwfQ.Jz5KEbfy-61egZ44a3JkpBK7ZKrAvXd5ZFbU_S3W7HQ');
      console.log('🔐 Village auth result:', result);
    } catch (e) {
      console.log('⚠️ Auth failed, but SDK works:', e);
    }
    
    // First, add a simple test element to see if content script works
    addTestElement();
    
    // Add Village components to current page
    console.log('🎯 Adding Village components...');
    addVillageComponents();
    console.log('✅ Village components added');
    
    // Set up event listeners for Village modals
    setupVillageEventListeners();
    
    // Wait a moment then manually trigger Village to process the new elements
    setTimeout(() => {
      console.log('🔄 Manually triggering Village to process elements...');
      processVillageElements();
    }, 2000);
    
  } catch (error) {
    console.error('❌ Village Extension failed:', error);
  }
}

function addVillageComponents() {
  const currentUrl = window.location.href;
  
  console.log('🔍 Checking if should add components...');
  console.log('📍 Current URL:', currentUrl);
  console.log('🌐 Is LinkedIn?', currentUrl.includes('linkedin.com'));
  
  // Add floating Village panel on ALL pages for debugging
  console.log('➕ Creating Village panel for full-page modals...');
  createVillagePanel();
  
  // Add intro buttons to profiles if on LinkedIn
  if (currentUrl.includes('linkedin.com')) {
    console.log('➕ Adding intro buttons to LinkedIn profiles...');
    addIntroButtonsToProfiles();
  }
  
  console.log('✅ Village components added to page');
}

function createIntroButtonsSection() {
  const section = document.createElement('div');
  section.style.cssText = 'margin-bottom: 16px;';
  
  const title = document.createElement('h4');
  title.style.cssText = 'margin: 0 0 12px 0; font-size: 14px; color: #f97316; font-weight: 600;';
  title.textContent = '🤝 Find Intro Buttons';
  
  const container = document.createElement('div');
  container.style.cssText = 'background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 12px;';
  
  const description = document.createElement('p');
  description.style.cssText = 'margin: 0 0 12px 0; font-size: 12px; color: #c2410c;';
  description.textContent = 'Get introductions using imported Village module - same HTML attributes work!';
  
  container.appendChild(description);
  
  // Add each person
  people.forEach(person => {
    const personDiv = document.createElement('div');
    personDiv.style.cssText = 'display: flex; align-items: center; justify-content: space-between; padding: 12px; background: white; border-radius: 6px; margin-bottom: 8px; border: 1px solid #fed7aa;';
    
    const nameSpan = document.createElement('span');
    nameSpan.style.cssText = 'font-size: 14px; font-weight: 500; color: #1f2937;';
    nameSpan.textContent = person.name;
    
    const button = document.createElement('button');
    button.setAttribute('village-data-url', person.linkedinUrl);
    button.style.cssText = 'display: inline-flex; align-items: center; padding: 8px 12px; border: none; font-size: 12px; font-weight: 500; border-radius: 6px; color: white; background: #ea580c; cursor: pointer; transition: background-color 0.2s;';
    
    button.innerHTML = `
      <span village-paths-availability="found" style="display: inline-flex; align-items: center;">
          <span village-paths-data="facepiles" style="display: flex; margin-right: 8px;"></span>
        <span village-paths-data="count"></span>
        <span style="margin-left: 4px;">paths found →</span>
        </span>
        <span village-paths-availability="not-found">
        Get Intro →
        </span>
      <span village-paths-availability="loading" style="display: inline-flex; align-items: center;">
        <span style="display: inline-block; width: 12px; height: 12px; border: 2px solid white; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 4px;"></span>
          Loading...
        </span>
      `;
      
    button.addEventListener('mouseover', () => button.style.background = '#dc2626');
    button.addEventListener('mouseout', () => button.style.background = '#ea580c');
    
    personDiv.appendChild(nameSpan);
    personDiv.appendChild(button);
    container.appendChild(personDiv);
  });
  
  section.appendChild(title);
  section.appendChild(container);
  return section;
}

function createCompanyPathsSection() {
  const section = document.createElement('div');
  section.style.cssText = 'margin-bottom: 16px;';
  
  const title = document.createElement('h4');
  title.style.cssText = 'margin: 0 0 12px 0; font-size: 14px; color: #7c3aed; font-weight: 600;';
  title.textContent = '🛤️ Browse Paths Widget';
  
  const container = document.createElement('div');
  container.style.cssText = 'background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 8px; padding: 12px;';
  
  const description = document.createElement('p');
  description.style.cssText = 'margin: 0 0 12px 0; font-size: 12px; color: #6b7280;';
  description.textContent = 'Browse connection paths to companies - powered by imported module!';
  
  const grid = document.createElement('div');
  grid.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 8px;';
  
  // Add each company
  sampleCompanies.forEach(company => {
    const companyDiv = document.createElement('div');
    companyDiv.setAttribute('village-module', 'paths');
    companyDiv.setAttribute('village-data-url', company.linkedinUrl);
    companyDiv.style.cssText = 'border: 1px solid #c084fc; border-radius: 6px; padding: 12px; cursor: pointer; background: white; transition: background-color 0.2s; min-height: 120px; display: flex; align-items: center; justify-content: center;';
    
    companyDiv.innerHTML = `
      <div village-paths-availability="found" style="text-align: center;">
        <div style="display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 6px;">
          <span village-paths-data="facepiles" style="display: flex;"></span>
          <span style="font-weight: 500; color: #7c3aed; font-size: 12px;">
            <span village-paths-data="count"></span> paths
          </span>
        </div>
        <p style="margin: 0; font-size: 10px; color: #6b7280;">to ${company.name}</p>
        <p style="margin: 2px 0 0 0; font-size: 9px; color: #9ca3af;">Click to view</p>
      </div>
      <div village-paths-availability="not-found" style="text-align: center; color: #6b7280;">
        <p style="margin: 0; font-size: 11px;">No paths</p>
        <p style="margin: 0; font-size: 11px;">to ${company.name}</p>
        <p style="margin: 4px 0 0 0; font-size: 9px; color: #9ca3af;">Click to sync</p>
      </div>
      <div village-paths-availability="loading" style="text-align: center; color: #6b7280;">
        <div style="width: 20px; height: 20px; border: 2px solid #e5e7eb; border-top: 2px solid #7c3aed; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 4px;"></div>
        <p style="margin: 0; font-size: 10px;">Checking...</p>
      </div>
    `;
    
    companyDiv.addEventListener('mouseover', () => companyDiv.style.background = '#faf5ff');
    companyDiv.addEventListener('mouseout', () => companyDiv.style.background = 'white');
    
    grid.appendChild(companyDiv);
  });
  
  container.appendChild(description);
  container.appendChild(grid);
  section.appendChild(title);
  section.appendChild(container);
  return section;
}

function createSyncSection() {
  const section = document.createElement('div');
  section.style.cssText = 'margin-bottom: 16px;';
  
  const title = document.createElement('h4');
  title.style.cssText = 'margin: 0 0 12px 0; font-size: 14px; color: #3b82f6; font-weight: 600;';
  title.textContent = '🔄 Sync Network Widget';
  
  const container = document.createElement('div');
  container.style.cssText = 'background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 12px;';
  
  const description = document.createElement('p');
  description.style.cssText = 'margin: 0 0 12px 0; font-size: 12px; color: #1e40af;';
  description.textContent = 'Sync your network to unlock more connection opportunities and get better intro suggestions.';
  
  const button = document.createElement('button');
  button.setAttribute('village-module', 'sync');
  button.style.cssText = 'width: 100%; padding: 12px; background: #2563eb; color: white; border: none; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; transition: background-color 0.2s;';
  button.textContent = 'Sync Network';
  
  button.addEventListener('mouseover', () => button.style.background = '#1d4ed8');
  button.addEventListener('mouseout', () => button.style.background = '#2563eb');
  
  container.appendChild(description);
  container.appendChild(button);
  section.appendChild(title);
  section.appendChild(container);
  return section;
}

function createCurrentPagePaths() {
  const section = document.createElement('div');
  section.style.cssText = 'margin-bottom: 16px;';
  
  const title = document.createElement('h4');
  title.style.cssText = 'margin: 0 0 12px 0; font-size: 14px; color: #374151; font-weight: 600;';
  title.textContent = '🛤️ Current Page Paths';
  
  const pathsDiv = document.createElement('div');
  pathsDiv.setAttribute('village-module', 'paths');
  pathsDiv.setAttribute('village-data-url', window.location.href);
  pathsDiv.style.cssText = 'border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; cursor: pointer; background: #f8fafc; min-height: 80px; display: flex; align-items: center; justify-content: center;';
  
  pathsDiv.innerHTML = `
    <div village-paths-availability="found" style="text-align: center;">
      <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 4px;">
        <span village-paths-data="facepiles" style="display: flex;"></span>
        <span style="font-weight: 500; color: #6366f1;">
          <span village-paths-data="count"></span> paths available
        </span>
      </div>
      <p style="margin: 0; font-size: 12px; color: #6b7280;">Click to view paths</p>
    </div>
    <div village-paths-availability="not-found" style="text-align: center; color: #6b7280;">
      <p style="margin: 0; font-size: 12px;">No paths found</p>
      <p style="margin: 4px 0 0 0; font-size: 11px;">Click to sync network</p>
    </div>
    <div village-paths-availability="loading" style="text-align: center; color: #6b7280;">
      <div style="width: 20px; height: 20px; border: 2px solid #e2e8f0; border-top: 2px solid #6366f1; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 8px;"></div>
      <p style="margin: 0; font-size: 12px;">Checking paths...</p>
    </div>
  `;
  
  section.appendChild(title);
  section.appendChild(pathsDiv);
  return section;
}

function createVillagePanel() {
  // Don't add if already exists
  if (document.querySelector('#village-extension-panel')) return;
  
  const panel = document.createElement('div');
  panel.id = 'village-extension-panel';
  panel.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 580px;
    max-height: 800px;
    overflow-y: auto;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    z-index: 99999;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  `;
  
  console.log('🎨 Panel created with styles');
  
  // Create header
  const header = document.createElement('div');
  header.style.cssText = 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px; border-radius: 12px 12px 0 0;';
  header.innerHTML = `
    <h3 style="margin: 0; font-size: 16px;">🏘️ Village Network</h3>
    <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">Importable SDK Demo</p>
  `;
  
  // Create content container
  const content = document.createElement('div');
  content.style.cssText = 'padding: 16px;';
  
  // Add current page paths
  const currentPathsSection = createCurrentPagePaths();
  content.appendChild(currentPathsSection);
  
  // Add intro buttons for people
  const introSection = createIntroButtonsSection();
  content.appendChild(introSection);
  
  // Add company paths
  const companyPathsSection = createCompanyPathsSection();
  content.appendChild(companyPathsSection);
  
  // Add sync button (no search widget)
  const syncSection = createSyncSection();
  content.appendChild(syncSection);
  
  panel.appendChild(header);
  panel.appendChild(content);
  document.body.appendChild(panel);
  
  console.log('✅ Village panel added to DOM');
  console.log('📏 Panel dimensions: 580px x 800px max');
  console.log('📍 Panel position: fixed top-right');
  
  // Verify panel is visible
  setTimeout(() => {
    const addedPanel = document.querySelector('#village-extension-panel');
    if (addedPanel) {
      console.log('✅ Panel confirmed in DOM:', addedPanel);
      console.log('👁️ Panel visible?', addedPanel.offsetWidth > 0 && addedPanel.offsetHeight > 0);
    } else {
      console.log('❌ Panel not found in DOM!');
    }
  }, 100);
  
  // Add CSS for animations
  if (!document.querySelector('#village-extension-styles')) {
        const style = document.createElement('style');
    style.id = 'village-extension-styles';
        style.textContent = `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
      
      /* Village facepiles styling */
      [village-paths-data="facepiles"] img {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        margin-left: -6px;
      }
      
      [village-paths-data="facepiles"] img:first-child {
        margin-left: 0;
      }
      
      /* Hide elements by default until Village loads them */
      [village-paths-availability="found"],
      [village-paths-availability="not-found"] {
        display: none;
      }
      
      [village-paths-availability="loading"] {
        display: block;
      }
    `;
    document.head.appendChild(style);
  }
}

function addIntroButtonsToProfiles() {
  // Add intro buttons to LinkedIn profile action areas
  const actionAreas = document.querySelectorAll('.pv-s-profile-actions, .org-top-card-primary-actions');
  
  actionAreas.forEach((area, index) => {
    if (area.querySelector('.village-intro-btn')) return; // Already added
    
    const introBtn = document.createElement('button');
    introBtn.className = 'village-intro-btn';
    introBtn.setAttribute('village-data-url', window.location.href);
    introBtn.style.cssText = `
      margin-left: 8px;
      padding: 8px 16px;
        background: #6366f1;
        color: white;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
        cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    `;
    
    introBtn.innerHTML = `
      <span village-paths-availability="found" style="display: flex; align-items: center; gap: 6px;">
        <span village-paths-data="facepiles" style="display: flex;"></span>
        <span village-paths-data="count"></span> paths found
        </span>
        <span village-paths-availability="not-found">
        Get Intro via Village
        </span>
        <span village-paths-availability="loading">
        <span style="display: inline-block; width: 12px; height: 12px; border: 2px solid white; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 4px;"></span>
        Loading...
        </span>
      `;
      
    area.appendChild(introBtn);
    console.log(`✅ Added Village intro button to profile action area ${index + 1}`);
  });
}

function processVillageElements() {
  console.log('🔧 Processing Village elements manually...');
  
  // Find all Village elements and make them visible
  const villageElements = document.querySelectorAll('[village-data-url], [village-module]');
  console.log(`📊 Found ${villageElements.length} Village elements`);
  
  villageElements.forEach((element, index) => {
    console.log(`Processing element ${index + 1}:`, element);
    
    // For intro buttons - show "Get Intro" by default
    if (element.hasAttribute('village-data-url')) {
      const foundSpan = element.querySelector('[village-paths-availability="found"]');
      const notFoundSpan = element.querySelector('[village-paths-availability="not-found"]');
      const loadingSpan = element.querySelector('[village-paths-availability="loading"]');
      
      // Hide loading, show "Get Intro" by default
      if (loadingSpan) loadingSpan.style.display = 'none';
      if (notFoundSpan) notFoundSpan.style.display = 'inline-block';
      if (foundSpan) foundSpan.style.display = 'none';
      
      console.log(`✅ Processed intro button for: ${element.getAttribute('village-data-url')}`);
    }
    
    // For paths modules - show "No paths found" by default
    if (element.hasAttribute('village-module') && element.getAttribute('village-module') === 'paths') {
      const foundDiv = element.querySelector('[village-paths-availability="found"]');
      const notFoundDiv = element.querySelector('[village-paths-availability="not-found"]');
      const loadingDiv = element.querySelector('[village-paths-availability="loading"]');
      
      // Hide loading, show "No paths found" by default
      if (loadingDiv) loadingDiv.style.display = 'none';
      if (notFoundDiv) notFoundDiv.style.display = 'block';
      if (foundDiv) foundDiv.style.display = 'none';
      
      console.log(`✅ Processed paths widget for: ${element.getAttribute('village-data-url')}`);
    }
  });
  
  console.log('✅ All Village elements processed and made visible');
}

function setupVillageEventListeners() {
  if (!window.Village) return;
  
  // Listen for Village events
  window.Village.on(window.Village.VillageEvents.pathCtaClicked, (data) => {
    console.log('🔗 Village Path CTA clicked:', data);
  });
  
  window.Village.on(window.Village.VillageEvents.syncCompleted, () => {
    console.log('🔄 Village sync completed');
  });
  
  console.log('✅ Village event listeners set up');
}

// Watch for page changes (LinkedIn is a SPA)
function observePageChanges() {
  let currentUrl = window.location.href;
  
  const observer = new MutationObserver(() => {
    if (window.location.href !== currentUrl) {
      currentUrl = window.location.href;
      console.log('🔄 Page changed, re-adding Village components');
      
      // Small delay to let LinkedIn finish loading
      setTimeout(() => {
        addVillageComponents();
      }, 1000);
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

function addTestElement() {
  console.log('🧪 Adding test element to verify content script works...');
  
  const testElement = document.createElement('div');
  testElement.id = 'village-content-test';
  testElement.style.cssText = `
    position: fixed;
    top: 10px;
    left: 10px;
    background: #10b981;
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    z-index: 99999;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  `;
  testElement.textContent = '✅ Village Content Script Working!';
  
  document.body.appendChild(testElement);
  console.log('✅ Test element added - if you see green badge, content script works');
  
  // Remove test element after 5 seconds
  setTimeout(() => {
    testElement.remove();
    console.log('🧹 Test element removed');
  }, 5000);
}

// Start when ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}

// Also set up page change observer
setTimeout(() => {
  observePageChanges();
}, 1000);