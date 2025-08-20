#!/bin/bash
# Fix markdown style issues across all documentation files

echo "🔧 Fixing markdown style issues..."

# Fix strong text headings to proper H4 headings
echo "Fixing strong text headings..."

# API Reference file
sed -i 's/\*\*Query Parameters:\*\*/#### Query Parameters/g' docs/object-store/api-reference.md
sed -i 's/\*\*Additional Headers:\*\*/#### Additional Headers/g' docs/object-store/api-reference.md
sed -i 's/\*\*Response Headers:\*\*/#### Response Headers/g' docs/object-store/api-reference.md

# System Requirements file  
sed -i 's/\*\*Standard Ports:\*\*/#### Standard Ports/g' docs/shared/system-requirements.md
sed -i 's/\*\*Custom Ports:\*\*/#### Custom Ports/g' docs/shared/system-requirements.md

echo "✅ Fixed strong text headings"

# Fix ordered list numbering (change 2., 3., etc. to 1.)
echo "Fixing ordered list numbering..."
find docs -name "*.md" -exec sed -i 's/^2\. /1. /g' {} \;
find docs -name "*.md" -exec sed -i 's/^3\. /1. /g' {} \;
find docs -name "*.md" -exec sed -i 's/^4\. /1. /g' {} \;
find docs -name "*.md" -exec sed -i 's/^5\. /1. /g' {} \;
find docs -name "*.md" -exec sed -i 's/^6\. /1. /g' {} \;
find docs -name "*.md" -exec sed -i 's/^7\. /1. /g' {} \;
find docs -name "*.md" -exec sed -i 's/^8\. /1. /g' {} \;

echo "✅ Fixed ordered list numbering"

echo "🎉 Markdown style fixes complete!"
echo "Note: Line length issues may need manual review"
