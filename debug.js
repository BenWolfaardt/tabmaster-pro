// Extension Debug Helper
// This script helps debug extension issues

console.log('=== Tab Manager Pro Debug Info ===');

// 1. Check Chrome APIs availability
console.log('Chrome APIs:', {
  runtime: !!chrome.runtime,
  tabs: !!chrome.tabs,
  tabGroups: !!chrome.tabGroups,
  storage: !!chrome.storage,
  runtimeId: chrome.runtime?.id
});

// 2. Test background script communication
if (chrome.runtime) {
  chrome.runtime.sendMessage({ action: 'ping' }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Background script communication failed:', chrome.runtime.lastError.message);
    } else {
      console.log('Background script response:', response);
    }
  });
}

// 3. Check current tabs
if (chrome.tabs) {
  chrome.tabs.query({}, (tabs) => {
    console.log(`Found ${tabs.length} tabs:`);
    tabs.slice(0, 3).forEach(tab => {
      console.log(`- ${tab.title} (${tab.url})`);
    });
  });
}

// 4. Check tab groups
if (chrome.tabGroups) {
  chrome.tabGroups.query({}, (groups) => {
    console.log(`Found ${groups.length} tab groups:`);
    groups.forEach(group => {
      console.log(`- Group: ${group.title || 'Untitled'} (${group.color})`);
    });
  });
} else {
  console.log('Tab Groups API not available (Chrome 88+ required)');
}

// 5. Storage test
if (chrome.storage) {
  chrome.storage.local.get(['test'], (result) => {
    console.log('Storage test result:', result);
    
    chrome.storage.local.set({ test: 'Extension working!' }, () => {
      console.log('Storage test completed');
    });
  });
}

// 6. Extension info
if (chrome.runtime) {
  const manifest = chrome.runtime.getManifest();
  console.log('Extension info:', {
    name: manifest.name,
    version: manifest.version,
    manifestVersion: manifest.manifest_version
  });
}

console.log('=== Debug Info Complete ===');