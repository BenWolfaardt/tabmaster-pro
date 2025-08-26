import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
import "@github/spark/spark"

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'

import "./main.css"

// Ensure DOM is loaded and root element exists
function initializeApp() {
  const rootElement = document.getElementById('root')
  
  if (!rootElement) {
    console.error('Root element not found! Make sure there is a div with id="root" in your HTML.')
    
    // Create root element if it doesn't exist
    const newRoot = document.createElement('div')
    newRoot.id = 'root'
    newRoot.className = 'min-h-screen bg-background'
    document.body.appendChild(newRoot)
    
    // Try again with the newly created element
    setTimeout(initializeApp, 100)
    return
  }

  try {
    const root = createRoot(rootElement)
    root.render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <App />
      </ErrorBoundary>
    )
  } catch (error) {
    console.error('Failed to render React app:', error)
    
    // Fallback: Show error message in plain HTML
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; color: #ef4444; font-family: Inter, sans-serif;">
        <h2 style="margin-bottom: 10px;">⚠️ Tab Manager Pro - Loading Error</h2>
        <p style="margin-bottom: 20px;">The application failed to load properly.</p>
        <details style="text-align: left; background: #fee; padding: 10px; border-radius: 4px;">
          <summary style="cursor: pointer; font-weight: bold;">Error Details</summary>
          <pre style="margin-top: 10px; font-size: 12px; white-space: pre-wrap;">${error}</pre>
        </details>
        <button onclick="location.reload()" style="
          margin-top: 20px; 
          padding: 8px 16px; 
          background: #3b82f6; 
          color: white; 
          border: none; 
          border-radius: 4px; 
          cursor: pointer;
        ">Refresh Page</button>
      </div>
    `
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp)
} else {
  initializeApp()
}