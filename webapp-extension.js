// Extension detection for the main webapp
(function() {
  function initializeExtensionDetection() {
    if (window.chrome && chrome.runtime && chrome.runtime.id) {
      document.body.classList.add('extension-mode');
      console.log('Running as Chrome extension');
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeExtensionDetection);
  } else {
    initializeExtensionDetection();
  }
})();