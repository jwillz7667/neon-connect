#!/bin/bash

# Create models directory if it doesn't exist
mkdir -p public/models

# Base URL for the model files
BASE_URL="https://vladmandic.github.io/face-api/model"

# Download function
download_file() {
    local filename=$1
    echo "Downloading $filename..."
    curl -L -o "public/models/$filename" "$BASE_URL/weights/$filename"
    if [ $? -eq 0 ]; then
        echo "Successfully downloaded $filename"
        return 0
    else
        echo "Failed to download $filename"
        return 1
    fi
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

# Download each file
for file in "${files[@]}"; do
    if ! download_file "$file"; then
        exit 1
    fi
done

echo "All model files downloaded successfully!" 