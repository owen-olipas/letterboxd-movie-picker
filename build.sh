#!/bin/bash

# Build script for Letterboxd Movie Picker Chrome Extension
# Creates a zip file excluding development files

set -e

EXTENSION_DIR="letterboxd-movie-picker"
OUTPUT_DIR="dist"
ZIP_NAME="letterboxd-movie-picker.zip"

echo "📦 Building Chrome extension package..."
echo ""

# Check if extension directory exists
if [ ! -d "$EXTENSION_DIR" ]; then
    echo "Extension directory not found: $EXTENSION_DIR"
    exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Create temporary directory
TEMP_DIR="$OUTPUT_DIR/temp-extension"
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"

echo "📋 Copying files..."

# Copy essential files
cp "$EXTENSION_DIR/manifest.json" "$TEMP_DIR/"
cp "$EXTENSION_DIR/styles.css" "$TEMP_DIR/"

# Copy js directory
cp -r "$EXTENSION_DIR/js" "$TEMP_DIR/"

# Copy images directory
cp -r "$EXTENSION_DIR/images" "$TEMP_DIR/"

# Create zip file
ZIP_PATH="$OUTPUT_DIR/$ZIP_NAME"
echo ""
echo "🗜️  Creating zip file: $ZIP_PATH..."

cd "$TEMP_DIR"
zip -r "../$ZIP_NAME" . > /dev/null
cd - > /dev/null

# Clean up temp directory
rm -rf "$TEMP_DIR"

# Get file size
if [[ "$OSTYPE" == "darwin"* ]]; then
    SIZE=$(stat -f%z "$ZIP_PATH" | awk '{printf "%.2f", $1/1024}')
else
    SIZE=$(stat -c%s "$ZIP_PATH" | awk '{printf "%.2f", $1/1024}')
fi

echo ""
echo "Extension package created successfully!"
echo "File: $ZIP_PATH"
echo "Size: $SIZE KB"
echo ""
echo "Ready to upload to Chrome Web Store!"
echo ""

