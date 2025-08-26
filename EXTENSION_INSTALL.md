# Tab Manager Pro Extension Installation Guide

## Installation Steps

### 1. Prepare Extension Files
Make sure you have all the required files in your directory:
- `manifest.json`
- `background.js`
- `popup.html`
- `popup.js`
- `index.html`
- `icons/` folder with icon files

### 2. Load Extension in Chrome

1. **Open Chrome Extensions Page**
   - Go to `chrome://extensions/` in your browser
   - Or click the three dots menu → More tools → Extensions

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

3. **Load Unpacked Extension**
   - Click "Load unpacked" button
   - Select the folder containing your extension files (the entire `/workspaces/spark-template` directory)
   - The extension should appear in your extensions list

### 3. Test the Extension

1. **Check Extension Icon**
   - Look for the Tab Manager Pro icon in your Chrome toolbar
   - If not visible, click the puzzle piece icon and pin Tab Manager Pro

2. **Test Popup**
   - Click the extension icon to open the popup
   - Should show current tabs and quick actions

3. **Test Full Interface**
   - Click "Open Full" in the popup, or
   - Right-click the extension icon and select "Open full app"

### 4. Troubleshooting

#### If extension fails to load:
- Check the Chrome Extensions page for error messages
- Look in the browser console (F12) for JavaScript errors
- Verify all files exist in the correct locations

#### If popup doesn't work:
- Right-click the extension icon → Inspect popup
- Check for console errors in the popup inspector

#### If background script fails:
- Go to chrome://extensions/
- Find Tab Manager Pro and click "Details"
- Click "Inspect views: background page" or "service worker"
- Check for errors in the background script console

## File Structure
```
/workspaces/spark-template/
├── manifest.json          # Extension manifest
├── background.js          # Background service worker
├── popup.html            # Extension popup
├── popup.js              # Popup JavaScript
├── index.html            # Full app interface
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── src/                  # Web app source files
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    └── ...
```

## Permissions
The extension requests minimal permissions:
- `tabs` - To read tab information
- `tabGroups` - To create and manage tab groups
- `storage` - To save settings and session data

## Testing Features
1. **Current Tabs View** - See all open tabs
2. **Create Groups** - Select tabs and group them
3. **Search** - Find tabs by title or URL
4. **Sessions** - Save and restore tab sessions
5. **Suspend Tabs** - Pause inactive tabs to save memory