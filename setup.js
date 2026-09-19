#!/usr/bin/env node

/**
 * Setup and Installation Script
 * This script ensures all dependencies are properly installed
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n🚀 Real-Time 3D Surveillance Dashboard - Setup Script\n');

try {
  // Check if node_modules exists
  if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed\n');
  } else {
    console.log('✅ Dependencies already installed\n');
  }

  // Check for critical files
  const requiredFiles = [
    'src/main.tsx',
    'src/App.tsx',
    'index.html',
    'tsconfig.json',
    'vite.config.ts',
  ];

  console.log('✓ Verifying project structure...');
  for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(__dirname, file))) {
      throw new Error(`Missing critical file: ${file}`);
    }
  }
  console.log('✅ Project structure verified\n');

  console.log('✨ Setup complete! You can now run:');
  console.log('   npm run dev    - Start development server');
  console.log('   npm run build  - Build for production');
  console.log('   npm run serve  - Preview production build\n');

} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}
