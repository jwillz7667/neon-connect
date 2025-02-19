module.exports = {
  onPreBuild: async ({ utils }) => {
    try {
      // Ensure models directory exists
      await utils.run.command('mkdir -p public/models');
      
      // Run the download script
      await utils.run.command('chmod +x scripts/download-face-models.sh');
      await utils.run.command('./scripts/download-face-models.sh');
      
      console.log('✓ Face detection models downloaded successfully');
    } catch (error) {
      utils.build.failBuild('Failed to download face detection models', { error });
    }
  },
  
  onBuild: async ({ utils }) => {
    try {
      // Verify models exist in the build output
      const modelsExist = await utils.cache.has('public/models');
      if (!modelsExist) {
        utils.build.failBuild('Face detection models not found in build output');
      }
      
      console.log('✓ Face detection models verified in build output');
    } catch (error) {
      utils.build.failBuild('Failed to verify face detection models', { error });
    }
  },
  
  onPostBuild: async ({ utils }) => {
    try {
      // Ensure models are copied to the final build directory
      await utils.run.command('cp -r public/models dist/models');
      
      // Cache the models for future builds
      await utils.cache.save('public/models', 'face-detection-models');
      
      console.log('✓ Face detection models cached for future builds');
    } catch (error) {
      console.warn('Warning: Failed to cache face detection models', error);
    }
  }
}; 