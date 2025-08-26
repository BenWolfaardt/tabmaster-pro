// Extension interface handlers - separate file to avoid CSP violations

function openPopup() {
    // Open the popup interface
    if (window.chrome && chrome.windows) {
        chrome.windows.create({
            url: chrome.runtime.getURL('popup.html'),
            type: 'popup',
            width: 400,
            height: 600
        });
    }
}

function openDevInterface() {
    // Open the full web application interface
    if (window.chrome && chrome.tabs) {
        chrome.tabs.create({
            url: chrome.runtime.getURL('webapp.html')
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Extension detection
    if (window.chrome && chrome.runtime && chrome.runtime.id) {
        console.log('Running as Chrome extension');
        document.body.classList.add('extension-mode');
    }

    // Bind button events
    const popupBtn = document.getElementById('open-popup-btn');
    const devBtn = document.getElementById('open-dev-btn');
    
    if (popupBtn) {
        popupBtn.addEventListener('click', openPopup);
    }
    
    if (devBtn) {
        devBtn.addEventListener('click', openDevInterface);
    }

    // Auto-redirect to development interface after 3 seconds
    setTimeout(() => {
        if (confirm('Would you like to open the full Tab Manager interface?')) {
            openDevInterface();
        }
    }, 3000);
});