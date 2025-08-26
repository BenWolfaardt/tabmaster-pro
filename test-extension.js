// Simple test to validate the extension structure
console.log('Testing Chrome extension structure...');

// Check if required files exist
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'manifest.json',
  'background.js',
  'popup.html',
  'popup.js',
  'index.html',
  'icons/icon16.png',
  'icons/icon32.png',
  'icons/icon48.png',
  'icons/icon128.png'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`✓ ${file} exists`);
  } else {
    console.log(`✗ ${file} missing`);
    allFilesExist = false;
  }
});

// Check if background.js has valid syntax
try {
  const backgroundContent = fs.readFileSync('background.js', 'utf8');
  
  // Basic syntax checks
  if (backgroundContent.includes('class TabManagerBackground')) {
    console.log('✓ TabManagerBackground class found');
  } else {
    console.log('✗ TabManagerBackground class not found');
    allFilesExist = false;
  }
  
  // Check for proper class instantiation
  if (backgroundContent.includes('new TabManagerBackground()')) {
    console.log('✓ TabManagerBackground instantiated');
  } else {
    console.log('✗ TabManagerBackground not instantiated');
  }
  
} catch (error) {
  console.log(`✗ Error reading background.js: ${error.message}`);
  allFilesExist = false;
}

// Check manifest.json
try {
  const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
  
  if (manifest.manifest_version === 3) {
    console.log('✓ Manifest v3 format');
  } else {
    console.log('✗ Invalid manifest version');
  }
  
  if (manifest.background && manifest.background.service_worker === 'background.js') {
    console.log('✓ Background service worker configured');
  } else {
    console.log('✗ Background service worker not configured properly');
  }
  
} catch (error) {
  console.log(`✗ Error reading manifest.json: ${error.message}`);
  allFilesExist = false;
}

console.log('\n' + (allFilesExist ? '✓ Extension structure looks good!' : '✗ Extension has issues'));