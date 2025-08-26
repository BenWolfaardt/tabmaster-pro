#!/usr/bin/env node

// Extension Validation Script
// Checks that all required files exist and are properly formatted

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Tab Manager Pro Extension...\n');

const requiredFiles = [
  'manifest.json',
  'background.js',
  'popup.html',
  'popup.js',
  'icons/icon16.png',
  'icons/icon32.png', 
  'icons/icon48.png',
  'icons/icon128.png'
];

let allValid = true;

// Check required files
console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);
  
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
  
  if (!exists) {
    allValid = false;
  }
});

// Validate manifest.json
console.log('\n📋 Validating manifest.json:');
try {
  const manifestPath = path.join(__dirname, 'manifest.json');
  const manifestContent = fs.readFileSync(manifestPath, 'utf8');
  const manifest = JSON.parse(manifestContent);
  
  // Check required fields
  const requiredFields = ['manifest_version', 'name', 'version', 'permissions', 'background', 'action', 'icons'];
  requiredFields.forEach(field => {
    const hasField = field in manifest;
    console.log(`   ${hasField ? '✅' : '❌'} ${field}`);
    if (!hasField) allValid = false;
  });
  
  // Check manifest version
  if (manifest.manifest_version === 3) {
    console.log('   ✅ Using Manifest V3');
  } else {
    console.log('   ❌ Should use Manifest V3');
    allValid = false;
  }
  
  // Check permissions
  const hasTabsPermission = manifest.permissions && manifest.permissions.includes('tabs');
  const hasStoragePermission = manifest.permissions && manifest.permissions.includes('storage');
  
  console.log(`   ${hasTabsPermission ? '✅' : '❌'} tabs permission`);
  console.log(`   ${hasStoragePermission ? '✅' : '❌'} storage permission`);
  
  if (!hasTabsPermission || !hasStoragePermission) {
    allValid = false;
  }
  
} catch (error) {
  console.log('   ❌ Invalid JSON syntax');
  console.log(`   Error: ${error.message}`);
  allValid = false;
}

// Check background script
console.log('\n🔧 Validating background script:');
try {
  const backgroundPath = path.join(__dirname, 'background.js');
  const backgroundContent = fs.readFileSync(backgroundPath, 'utf8');
  
  // Check for required Chrome API usage
  const hasTabsAPI = backgroundContent.includes('chrome.tabs');
  const hasRuntimeAPI = backgroundContent.includes('chrome.runtime');
  const hasMessageListener = backgroundContent.includes('chrome.runtime.onMessage');
  
  console.log(`   ${hasTabsAPI ? '✅' : '❌'} Uses chrome.tabs API`);
  console.log(`   ${hasRuntimeAPI ? '✅' : '❌'} Uses chrome.runtime API`);
  console.log(`   ${hasMessageListener ? '✅' : '❌'} Has message listener`);
  
  if (!hasTabsAPI || !hasRuntimeAPI || !hasMessageListener) {
    allValid = false;
  }
  
} catch (error) {
  console.log('   ❌ Error reading background.js');
  allValid = false;
}

// Check popup files
console.log('\n🎯 Validating popup:');
try {
  const popupHtmlPath = path.join(__dirname, 'popup.html');
  const popupJsPath = path.join(__dirname, 'popup.js');
  
  const htmlExists = fs.existsSync(popupHtmlPath);
  const jsExists = fs.existsSync(popupJsPath);
  
  console.log(`   ${htmlExists ? '✅' : '❌'} popup.html exists`);
  console.log(`   ${jsExists ? '✅' : '❌'} popup.js exists`);
  
  if (htmlExists) {
    const htmlContent = fs.readFileSync(popupHtmlPath, 'utf8');
    const hasScript = htmlContent.includes('popup.js');
    console.log(`   ${hasScript ? '✅' : '❌'} popup.html loads popup.js`);
    if (!hasScript) allValid = false;
  }
  
  if (!htmlExists || !jsExists) {
    allValid = false;
  }
  
} catch (error) {
  console.log('   ❌ Error validating popup files');
  allValid = false;
}

// Final result
console.log('\n' + '='.repeat(50));
if (allValid) {
  console.log('🎉 Extension validation passed!');
  console.log('\n💡 Next steps:');
  console.log('   1. Open Chrome and go to chrome://extensions/');
  console.log('   2. Enable "Developer mode"');  
  console.log('   3. Click "Load unpacked" and select this folder');
  console.log('   4. Test the extension by clicking its icon');
} else {
  console.log('❌ Extension validation failed!');
  console.log('\n🔧 Please fix the issues above before loading the extension.');
}

console.log('\n📚 For detailed testing instructions, see TESTING_GUIDE.md');