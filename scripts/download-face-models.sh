#!/bin/bash

# Exit on any error
set -e

# Create models directory if it doesn't exist
mkdir -p public/models

# Base URL for the model files
BASE_URL="https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"

# Download function with retries
download_file() {
    local filename=$1
    local max_retries=3
    local retry_count=0

    while [ $retry_count -lt $max_retries ]; do
        echo "Downloading $filename (attempt $((retry_count + 1))/$max_retries)..."
        if curl -L --fail --silent --show-error --retry 3 --retry-delay 2 -o "public/models/$filename" "$BASE_URL/$filename"; then
            echo "✓ Successfully downloaded $filename"
            return 0
        else
            retry_count=$((retry_count + 1))
            if [ $retry_count -lt $max_retries ]; then
                echo "× Failed to download $filename, retrying in 5 seconds..."
                sleep 5
            else
                echo "× Failed to download $filename after $max_retries attempts"
                return 1
            fi
        fi
    done
    return 1
}

# Verify file integrity
verify_file() {
    local filename=$1
    if [ ! -f "public/models/$filename" ]; then
        echo "× File $filename is missing"
        return 1
    fi
    if [ ! -s "public/models/$filename" ]; then
        echo "× File $filename is empty"
        return 1
    fi
    echo "✓ Verified $filename"
    return 0
}

# List of files to download
files=(
    "ssd_mobilenetv1_model-weights_manifest.json"
    "ssd_mobilenetv1_model-shard1"
    "ssd_mobilenetv1_model-shard2"
    "face_landmark_68_model-weights_manifest.json"
    "face_landmark_68_model-shard1"
    "face_recognition_model-weights_manifest.json"
    "face_recognition_model-shard1"
    "face_recognition_model-shard2"
    "age_gender_model-weights_manifest.json"
    "age_gender_model-shard1"
)

echo "Starting face detection model download..."
echo "Target directory: public/models"

# Download each file
for file in "${files[@]}"; do
    if ! download_file "$file"; then
        echo "× Failed to download required model files"
        exit 1
    fi
done

# Verify all files
echo "Verifying downloaded files..."
for file in "${files[@]}"; do
    if ! verify_file "$file"; then
        echo "× File verification failed"
        exit 1
    fi
done

echo "✓ All model files downloaded and verified successfully!" 