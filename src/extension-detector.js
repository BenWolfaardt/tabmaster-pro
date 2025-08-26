// Extension detection script
function initializeExtensionDetection() {
  // Detect if running as Chrome extension and add visual indicator
  if (window.chrome && chrome.runtime && chrome.runtime.id) {
    document.body.classList.add('extension-mode');
    console.log('Running as Chrome extension');
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeExtensionDetection);
} else {
  initializeExtensionDetection();
}