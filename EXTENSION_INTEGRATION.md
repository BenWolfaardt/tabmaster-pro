# Extension Integration Guide

## Current Status

The Tab Manager Pro extension is set up with the following components:

### ✅ Working Components
- **Extension popup** (`popup.html` + `popup.js`) - Shows tab counts, recent tabs, quick actions
- **Background script** (`background.js`) - Handles Chrome API integration, tab events, auto-save
- **Manifest** (`manifest.json`) - Extension configuration with proper permissions

### ⚠️ Integration Notes

The main web interface (React app) currently requires a development server to run properly. Here's how to test:

## Testing the Extension

### 1. Load Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the project folder (`/workspaces/spark-template`)
5. Extension should load with Tab Manager Pro icon in toolbar

### 2. Test Extension Popup

- Click the Tab Manager Pro icon in Chrome toolbar
- Should show:
  - Current tab count and group count
  - List of recent tabs with favicons
  - Quick action buttons (Save Session, Suspend Inactive)
  - "Open Full" button

### 3. Test Full Interface

**Current Setup:**
- The `index.html` in extension mode shows a development interface helper
- Click "Development Interface" to open the full React app at `http://localhost:5173`
- The React app will detect it's being used with the extension and show "Extension Active" badge

**To test integration:**
1. Run `npm run dev` in the project directory to start development server
2. Open the extension popup and click "Open Full" OR click "Development Interface"
3. The React app should load with extension integration

## Extension Features

### Background Script (`background.js`)
- ✅ Monitors tab creation, updates, and removal
- ✅ Auto-saves sessions when windows close
- ✅ Handles tab grouping via Chrome API
- ✅ Responds to messages from popup and web interface
- ✅ Implements tab search across all open tabs

### Popup Interface (`popup.html`)
- ✅ Shows live tab and group counts
- ✅ Displays recent tabs with click-to-switch
- ✅ Save session functionality
- ✅ Opens full web interface
- ✅ Responsive design optimized for 400x600px popup

### Chrome Integration
- ✅ Tab management (create, close, switch, group)
- ✅ Tab groups (create, update, remove)  
- ✅ Session management (save/restore tab states)
- ✅ Auto-save on window close
- ✅ Tab search and filtering

## API Messages Supported

The extension responds to these messages from the React app:

- `getCurrentTabs` - Returns all open tabs with metadata
- `getTabGroups` - Returns all tab groups with their tabs
- `createTabGroup` - Creates a new tab group with selected tabs
- `suspendTab` / `restoreTab` - Mark tabs as suspended
- `saveSession` / `loadSession` - Save and restore browsing sessions
- `searchTabs` - Search across all tabs and groups

## Development Workflow

### Working with Extension Integration

1. **Load extension in Chrome** (steps above)
2. **Start development server:** `npm run dev` 
3. **Test popup functionality** by clicking extension icon
4. **Test full interface** by opening `http://localhost:5173`
5. **Use Chrome DevTools** to debug:
   - Popup: Right-click popup → Inspect
   - Background: chrome://extensions → Service Worker
   - Web interface: Standard DevTools

### Key Integration Points

**React App Detection:**
```javascript
// In App.tsx
const isExtension = !!(window.chrome && chrome.runtime && chrome.runtime.id)
```

**Message Passing:**
```javascript
// From React app to background script
const response = await sendMessageToBackground({ action: 'getCurrentTabs' })
```

**Chrome API Usage:**
```javascript
// Background script can access all Chrome APIs
const tabs = await chrome.tabs.query({})
const groups = await chrome.tabGroups.query({})
```

## Next Steps for Production

To make this production-ready:

1. **Build React app** for extension bundle
2. **Update manifest** to point to built files  
3. **Add error boundaries** for extension API failures
4. **Implement proper tab suspension** (replace tab content)
5. **Add cloud sync** for cross-device functionality

## Troubleshooting

### Extension Won't Load
- Check all required files exist (manifest.json, background.js, popup.html, icons/)
- Verify manifest.json syntax
- Check Chrome DevTools console for errors

### Popup Issues  
- Right-click popup → Inspect to open DevTools
- Check for JavaScript errors in popup console
- Verify Chrome extension permissions

### Background Script Issues
1. Go to chrome://extensions/
2. Find Tab Manager Pro extension
3. Click "Service Worker" to open background script console
4. Check for API errors or permission issues

### React App Integration
- Make sure development server is running (`npm run dev`)
- Check that extension is loaded in Chrome
- Verify the React app can detect Chrome extension APIs