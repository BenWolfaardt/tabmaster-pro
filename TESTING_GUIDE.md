# Testing Tab Manager Pro Extension

## Loading the Extension in Chrome

### 1. Build the Extension
First, make sure you have all the necessary files in place:
- ✅ `manifest.json` (extension configuration)
- ✅ `background.js` (background script)  
- ✅ `popup.html` (popup interface)
- ✅ `popup.js` (popup script)
- ✅ `icons/` folder with icon files
- ✅ `src/` folder with your React app

### 2. Load Extension in Chrome (Developer Mode)

1. **Open Chrome Extensions page:**
   - Type `chrome://extensions/` in your address bar, OR
   - Go to Chrome menu → More tools → Extensions

2. **Enable Developer Mode:**
   - Toggle the "Developer mode" switch in the top-right corner

3. **Load Unpacked Extension:**
   - Click "Load unpacked" button
   - Navigate to your project folder (`/workspaces/spark-template`)
   - Select the folder and click "Open"

4. **Verify Installation:**
   - You should see "Tab Manager Pro" appear in your extensions list
   - The extension icon should appear in your Chrome toolbar

## Testing the Extension

### Popup Interface
- Click the Tab Manager Pro icon in your toolbar
- The popup should show:
  - Current tab count and group count
  - Recent tabs list with favicons  
  - Quick action buttons (Save Session, Suspend Inactive)
  - "Open Full" button to access the complete interface

### Full Web Interface  
- Click "Open Full" in the popup to open the complete tab manager
- This opens the React application in a new tab
- Test all features: grouping, searching, sessions, tab management

### Core Features to Test

1. **Tab Grouping**
   - Open several tabs in Chrome
   - Use the web interface to select multiple tabs
   - Create a group with a custom name and color
   - Verify the group appears in Chrome's native tab groups

2. **Tab Management**
   - Click the pause/play buttons on individual tabs to suspend/restore
   - Search for tabs by title, URL, or tags
   - Switch between tabs by clicking them in the popup

3. **Session Management**
   - Click "Save Session" in popup or web interface
   - Verify sessions are saved and can be restored
   - Test session auto-save when closing windows

4. **Search Functionality**
   - Use the search bar in the full web interface
   - Search across current tabs, groups, and sessions
   - Verify search results are filtered correctly

## Troubleshooting

### Extension Won't Load
- **"Could not load icon" Error**: Ensure all icon files exist in `icons/` folder:
  - `icon16.png`, `icon32.png`, `icon48.png`, `icon128.png`
- **"Could not load manifest" Error**: Check `manifest.json` syntax
- **Module Script Error**: This usually means a file path is incorrect in the manifest

### Popup Issues
- **Popup Won't Open**: Check that `popup.html` and `popup.js` exist
- **"Loading..." Stuck**: Open popup developer tools (right-click popup → Inspect)
- **API Errors**: Check that all required permissions are granted

### Background Script Issues
1. **Check Background Script Logs:**
   - Go to `chrome://extensions/`
   - Find Tab Manager Pro
   - Click "service worker" link to open background script console
   - Look for error messages or failed API calls

2. **Common Background Script Errors:**
   - Missing permissions in manifest
   - API calls to non-existent tabs
   - Storage quota exceeded

### Web Interface Issues
- **Extension features not working**: The web interface has two modes:
  - **Extension mode**: When opened via "Open Full" button (has Chrome API access)
  - **Demo mode**: When accessed directly via `npm run dev` (shows mock data)

## Development Testing

### Testing Web Interface Standalone
1. Run `npm run dev` to start the development server
2. Open `http://localhost:5173` to test the web interface
3. This shows demo data and doesn't require the extension to be loaded
4. Perfect for UI development and testing React components

### Testing Extension Integration
1. Load the extension in Chrome (steps above)
2. Click the extension icon to test the popup
3. Click "Open Full" to test the web interface with real Chrome data
4. Background script will handle all Chrome API communications

## Testing Checklist

### Basic Extension Loading
- [ ] Extension loads without errors in `chrome://extensions/`
- [ ] Extension icon appears in Chrome toolbar
- [ ] No error messages in extension details

### Popup Functionality  
- [ ] Popup opens when clicking extension icon
- [ ] Shows current tab count and group count correctly
- [ ] Displays recent tabs with favicons
- [ ] "Open Full" button works
- [ ] "Save Session" button works  
- [ ] Can click tabs to switch to them

### Web Interface Features
- [ ] Web interface opens in new tab when clicking "Open Full"
- [ ] Shows "Extension Active" badge when opened from extension
- [ ] Current tabs list shows all open browser tabs
- [ ] Can select multiple tabs using checkboxes
- [ ] Can create new groups with selected tabs
- [ ] Created groups appear in Chrome's native tab groups
- [ ] Tab groups section shows existing Chrome tab groups
- [ ] Search functionality works across tabs and groups
- [ ] Can collapse/expand tab groups
- [ ] Export functionality works (CSV/TXT downloads)

### Chrome Integration
- [ ] Extension can read all open tabs
- [ ] Extension can create native Chrome tab groups
- [ ] Tab groups created in extension appear in Chrome UI
- [ ] Tab groups created in Chrome appear in extension
- [ ] Tab suspension/restoration works (marks tabs appropriately)
- [ ] Session saving captures current browser state
- [ ] Background script logs tab events (create, close, update)

## File Structure
```
/workspaces/spark-template/
├── manifest.json          # Extension configuration
├── background.js          # Background service worker  
├── index.html            # Popup interface
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon32.png  
│   ├── icon48.png
│   └── icon128.png
├── src/                  # Your React app
│   ├── App.tsx
│   ├── main.tsx
│   └── ...
└── ...
```

## Next Steps

- Test all features thoroughly
- Add more advanced tab management features
- Consider cloud sync capabilities
- Optimize performance for large tab counts
- Add keyboard shortcuts
- Implement better error handling