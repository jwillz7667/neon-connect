#!/bin/bash

# Create models directory if it doesn't exist
mkdir -p public/models

# Copy models from node_modules
echo "Copying face-api.js models..."
cp -r node_modules/@vladmandic/face-api/model/* public/models/

# Verify the copy
if [ $? -eq 0 ]; then
    echo "Models copied successfully!"
    ls -l public/models
else
    echo "Failed to copy models"
    exit 1
fi 