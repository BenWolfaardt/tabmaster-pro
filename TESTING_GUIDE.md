# Tab Manager Pro - Installation Guide

## How to Install and Test Your Chrome Extension

### 1. Build the Extension
First, make sure you have all the necessary files in place:
- ✅ `manifest.json` (extension configuration)
- ✅ `background.js` (background script)
- ✅ `index.html` (popup interface)
- ✅ `icons/` folder with icon files
- ✅ `src/` folder with your app code

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

### 3. Test the Extension

1. **Access the Interface:**
   - Click the Tab Manager Pro icon in your toolbar
   - The popup should open with your interface

2. **Test Core Features:**
   - **Current Tabs**: Should show your open tabs
   - **Create Groups**: Select tabs and create a group
   - **Tab Groups**: View and manage your groups
   - **Search**: Search across tabs and groups
   - **Sessions**: Save and restore tab sessions

### 4. Debugging

If something isn't working:

1. **Check Console Errors:**
   - Right-click on the extension popup → "Inspect"
   - Look for errors in the Console tab

2. **Check Background Script:**
   - Go to `chrome://extensions/`
   - Click "service worker" link next to your extension
   - Check for errors in the background script console

3. **Reload Extension:**
   - After making changes, click the refresh icon on your extension
   - Or disable/enable the extension

### 5. Common Issues

- **"Could not load manifest"**: Check `manifest.json` syntax
- **Icon not loading**: Ensure icon files exist in `icons/` folder
- **Features not working**: Check browser permissions in manifest
- **Background script errors**: Check `background.js` for syntax errors

### 6. Extension Permissions

This extension requires:
- `tabs` - Read and manage tabs
- `tabGroups` - Create and manage tab groups  
- `storage` - Save data locally
- `activeTab` - Access current tab information
- `<all_urls>` - Access tab URLs and favicons

### 7. Development Tips

- **Hot Reload**: Changes to content require extension reload
- **Storage**: Data is stored locally using Chrome's storage API
- **Cross-Device Sync**: Currently local only (cloud sync would require additional setup)

### 8. Building for Production

When ready to distribute:
1. Test thoroughly in multiple Chrome versions
2. Consider creating a proper Chrome Web Store listing
3. Add proper error handling and user feedback
4. Consider adding analytics and crash reporting

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