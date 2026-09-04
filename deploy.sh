#!/bin/bash
# InfinityFree Deployment Package Generator
# Creates deploy/casagan-pigery-deploy.zip ready to upload
# Usage: bash deploy.sh

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DIST_DIR="$SCRIPT_DIR/deploy"
ZIP_FILE="$DIST_DIR/casagan-pigery-deploy.zip"

echo "=== CasaganPigery InfinityFree Deployment ==="
echo ""

# Clean previous build
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

# Step 1: Build frontend assets
echo "[1/3] Building frontend assets..."
cd "$SCRIPT_DIR"
if command -v npm &> /dev/null; then
    npm run build
else
    echo "ERROR: npm not found. Install Node.js first."
    exit 1
fi

# Step 2: Create deployment zip from public/ folder
echo "[2/3] Creating deployment package..."

cd "$SCRIPT_DIR/public"

zip -r "$ZIP_FILE" \
    .htaccess \
    index.php \
    robots.txt \
    sw.js \
    placeholder.svg \
    favicon.ico \
    assets/ \
    build/ \
    manifest.json \
    2>/dev/null

echo "[3/3] Adding Laravel backend files..."

cd "$SCRIPT_DIR"

# Add essential Laravel directories
for dir in app bootstrap config database routes; do
    zip -r "$ZIP_FILE" "$dir" -x "*/node_modules/*" 2>/dev/null
done

# Add storage framework + logs (not the whole storage/)
for dir in storage/framework storage/logs; do
    if [ -d "$dir" ]; then
        zip -r "$ZIP_FILE" "$dir" 2>/dev/null
    fi
done

# Add essential root files
zip -j "$ZIP_FILE" .env artisan composer.json 2>/dev/null

SIZE=$(du -h "$ZIP_FILE" | cut -f1)
echo ""
echo "=== Deployment package ready ==="
echo "File: $ZIP_FILE"
echo "Size: $SIZE"
echo ""
echo "Deploy steps:"
echo "  1. Upload deploy/casagan-pigery-deploy.zip to InfinityFree File Manager"
echo "  2. Extract it in /htdocs/ on InfinityFree"
echo "  3. Done!"
