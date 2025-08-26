#!/bin/bash

# Tab Manager Pro - Extension Build & Test Script
# This script helps you package and test your Chrome extension

echo "🔧 Tab Manager Pro - Extension Setup"
echo "=================================="

# Check if we're in the correct directory
if [ ! -f "manifest.json" ]; then
    echo "❌ Error: manifest.json not found. Make sure you're in the project root directory."
    exit 1
fi

echo "✅ Found manifest.json"

# Create a simple icon (base64 encoded PNG)
echo "📸 Creating extension icons..."
mkdir -p icons

# Create simple placeholder icons using CSS/HTML trick (you can replace these with real icons later)
cat > icons/create_icons.html << 'EOF'
<!DOCTYPE html>
<html>
<head><title>Icon Generator</title></head>
<body>
<p>To create proper icons, you can:</p>
<ol>
<li>Use an online icon generator like <a href="https://icon.kitchen/">icon.kitchen</a></li>
<li>Upload a logo/image and generate all required sizes (16, 32, 48, 128px)</li>
<li>Download and place the files in the /icons directory</li>
<li>Or use the included placeholder icons for testing</li>
</ol>
</body>
</html>
EOF

echo "✅ Icon guidance created at icons/create_icons.html"

# Create basic development build
echo "🏗️  Preparing extension files..."

# Create .gitignore entries for Chrome extension testing
if [ ! -f ".gitignore" ] || ! grep -q "*.crx" .gitignore; then
    echo "
# Chrome Extension Development
*.crx
*.pem
web-store-upload.zip
" >> .gitignore
fi

echo "✅ Project prepared for Chrome extension development"
echo ""
echo "🚀 Next Steps:"
echo "=============="
echo ""
echo "1. 📦 INSTALL EXTENSION:"
echo "   • Open Chrome and go to chrome://extensions/"
echo "   • Enable 'Developer mode' (toggle in top-right)"
echo "   • Click 'Load unpacked'"
echo "   • Select this folder: $(pwd)"
echo ""
echo "2. 🧪 TEST EXTENSION:"
echo "   • Look for 'Tab Manager Pro' icon in Chrome toolbar"
echo "   • Click the icon to open popup interface"
echo "   • Click 'Open Full' to launch complete web interface"
echo "   • Open multiple tabs and test grouping/management"
echo ""
echo "3. 🔄 DURING DEVELOPMENT:"
echo "   • After code changes, click 'Reload' on chrome://extensions/"
echo "   • Extension will update with your latest changes"
echo "   • Check browser console for any errors"
echo ""
echo "4. 📱 TESTING FEATURES:"
echo "   • Tab grouping: Select tabs → Create Group"
echo "   • Session save: Groups auto-save every 5 minutes"
echo "   • Search: Find tabs across all windows"
echo "   • Suspend: Placeholder for future tab suspension"
echo ""
echo "🔍 TROUBLESHOOTING:"
echo "=================="
echo "• Check chrome://extensions/ for error messages"
echo "• Look at browser console (F12) for JavaScript errors"
echo "• Ensure all permissions are granted to the extension"
echo "• Try reloading the extension if it stops working"
echo ""
echo "Happy tab managing! 🎉"