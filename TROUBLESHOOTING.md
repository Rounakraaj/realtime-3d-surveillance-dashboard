# Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: Module not found errors
**Cause**: Dependencies not installed  
**Solution**: 
```bash
npm install
```

### Issue 2: TypeScript compilation errors
**Cause**: Type definitions missing  
**Solution**:
```bash
npm install --save-dev @types/three
npm run build
```

### Issue 3: CSS classes not recognized
**Cause**: Tailwind CSS not properly configured  
**Solution**: Ensure postcss.config.js and tailwind.config.js exist and are correct

### Issue 4: Canvas/Three.js not rendering
**Cause**: React context or fiber setup issue  
**Solution**: Restart dev server - `npm run dev`

### Issue 5: Port already in use
**Cause**: Vite default port 5173 is occupied  
**Solution**:
```bash
npm run dev -- --port 3000
```

## Running the Project

### Development Mode
```bash
npm run dev
```
Open http://localhost:5173 in your browser

### Production Build
```bash
npm run build
```
Output will be in the `dist/` folder

### Preview Production Build
```bash
npm run serve
```

## Environment Setup

- **Node.js**: v18+
- **npm**: v9+
- **Browser**: Chrome/Edge/Firefox (WebGL support required)

## Debug Mode

For detailed TypeScript checking:
```bash
npx tsc --noEmit
```

For checking for unused imports:
```bash
npm install --save-dev ts-unused-exports
npx ts-unused-exports tsconfig.json
```

## Still Having Issues?

1. **Delete node_modules and package-lock.json**:
   ```bash
   rm -r node_modules package-lock.json
   npm install
   ```

2. **Clear Vite cache**:
   ```bash
   rm -r node_modules/.vite
   ```

3. **Verify all required files are present**:
   - `src/main.tsx`
   - `src/App.tsx`
   - `src/styles/index.css`
   - `src/store/useSimulationStore.ts`
   - All component files in `src/components/`
   - `index.html`
   - `tsconfig.json`
   - `vite.config.ts`
