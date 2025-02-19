#!/bin/bash

# Source logo file
SOURCE="public/images/neon-logo.png"

# Create icons directory if it doesn't exist
mkdir -p public/icons

# Function to generate icon
generate_icon() {
    local size=$1
    local output=$2
    convert "$SOURCE" -resize ${size}x${size}^ \
            -gravity center \
            -extent ${size}x${size} \
            -background none \
            "$output"
    echo "Generated: $output"
}

# Generate Android icons
generate_icon 36 "public/android-icon-36x36.png"
generate_icon 48 "public/android-icon-48x48.png"
generate_icon 72 "public/android-icon-72x72.png"
generate_icon 96 "public/android-icon-96x96.png"
generate_icon 144 "public/android-icon-144x144.png"
generate_icon 192 "public/android-icon-192x192.png"

# Generate Apple icons
generate_icon 57 "public/apple-icon-57x57.png"
generate_icon 60 "public/apple-icon-60x60.png"
generate_icon 72 "public/apple-icon-72x72.png"
generate_icon 76 "public/apple-icon-76x76.png"
generate_icon 114 "public/apple-icon-114x114.png"
generate_icon 120 "public/apple-icon-120x120.png"
generate_icon 144 "public/apple-icon-144x144.png"
generate_icon 152 "public/apple-icon-152x152.png"
generate_icon 180 "public/apple-icon-180x180.png"

# Generate favicon sizes
generate_icon 16 "public/favicon-16x16.png"
generate_icon 32 "public/favicon-32x32.png"
generate_icon 96 "public/favicon-96x96.png"

# Generate MS icon
generate_icon 144 "public/ms-icon-144x144.png"

echo "All icons generated successfully!" 