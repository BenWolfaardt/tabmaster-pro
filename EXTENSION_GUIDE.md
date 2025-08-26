# Tab Manager Pro - Chrome Extension Integration

This directory contains the files needed to run Tab Manager Pro as a Chrome extension.

## Files Created:

### Core Extension Files:
- `manifest.json` - Chrome extension configuration
- `background.js` - Service worker handling tab management and browser integration  
- `popup.html` - Extension popup interface
- `popup.js` - Popup functionality and mini tab manager
- `icons/` - Extension icons directory

## How to Install and Test:

### Method 1: Load as Unpacked Extension (Development)

1. **Open Chrome Extensions Page:**
   - Go to `chrome://extensions/` 
   - Or Menu → More Tools → Extensions

2. **Enable Developer Mode:**
   - Toggle "Developer mode" in the top-right corner

3. **Load the Extension:**
   - Click "Load unpacked"
   - Navigate to this project directory (`/workspaces/spark-template`)
   - Select the folder containing `manifest.json`

4. **Test the Extension:**
   - Click the Tab Manager Pro icon in your Chrome toolbar
   - The popup will show current tabs and groups
   - Click "Open Full" to launch the complete web interface

### Method 2: Integration with Web Interface

The web interface (`index.html`) can also be accessed directly:
- Right-click the extension icon → "Options" 
- Or navigate to `chrome-extension://[extension-id]/index.html`

## Features Integrated:

✅ **Browser Tab Access:** Real tabs from Chrome API
✅ **Tab Grouping:** Create and manage Chrome tab groups  
✅ **Session Management:** Auto-save and restore sessions
✅ **Tab Suspension:** Mark tabs as suspended (placeholder)
✅ **Search:** Find tabs across all windows
✅ **Popup Interface:** Quick access mini manager
✅ **Auto-save:** Sessions saved every 5 minutes and on window close

## Permissions Used:

- `tabs` - Access tab information and manage tabs
- `tabGroups` - Create and manage tab groups  
- `storage` - Store sessions, groups, and preferences
- `activeTab` - Access current tab details
- `<all_urls>` - Access tab URLs for management

## Development Notes:

The extension uses Chrome's Manifest V3 with:
- Service worker background script (no persistent background page)
- Minimal permissions for security
- Integration with the existing React web interface
- Chrome storage API for data persistence

## Testing Different Features:

1. **Tab Management:** Open multiple tabs, use the popup to see them
2. **Grouping:** Select tabs in the web interface and create groups
3. **Search:** Use the search bar to find tabs by title/URL  
4. **Sessions:** Close Chrome completely, reopen to see auto-saved session
5. **Cross-device:** Enable Chrome sync to test across devices