# Quick Start Guide

## ⚡ 5-Minute Setup

### On Windows:
1. **Double-click**: `start-dev.bat`
2. **Wait** for dependencies to install (first time only)
3. **Browser opens** at http://localhost:5173
4. **Done!** 🎉

### On macOS/Linux:
1. **Open terminal** in project directory
2. **Run**: `npm run dev`
3. **Open**: http://localhost:5173 in your browser

## 📋 What Each Command Does

```bash
npm run dev     # Start development server (hot reload enabled)
npm run build   # Create production build (optimized, minified)
npm run serve   # Preview the production build
```

## 🎮 How to Use the Dashboard

### Left Panel (3D Fusion Engine)
- **Missile Speed**: 0-2000 km/h
- **Missile Altitude**: 0-100 m
- **UAV Altitude**: 0-15000 m
- **Sensor FOV**: 0-10°
- **Simulation Laps**: 1-10
- **Playback Speed**: 1-100x
- **Checkboxes**: Toggle Realistic Flight Dynamics & MPC Prediction
- **Buttons**: RUN SIMULATION or PAUSE

### Right Panels
- **Fusion Analytics**: Shows GDOP, Angle, Baseline, Confidence
- **Flight Dynamics**: Bank angle, G-force, Mode, Energy, Turn Radius
- **UAV Telemetry**: Position coordinates, Look angles, Tracking status

### Center Display
- **3D Scene**: Real-time visualization of UAV flight paths
- **Grid**: Reference grid for spatial orientation
- **Trajectories**: Flight paths for both UAVs

## 🐛 Troubleshooting

### Port 5173 already in use?
```bash
npm run dev -- --port 3000
```

### Module errors?
```bash
rm -r node_modules package-lock.json
npm install
```

### Want to see TypeScript errors?
```bash
npx tsc --noEmit
```

## 📁 Project Structure

```
src/
├── main.tsx                 # Entry point
├── App.tsx                  # Main component
├── styles/
│   └── index.css           # Tailwind CSS
├── components/
│   ├── SimulationCanvas.tsx
│   ├── FusionEnginePanel.tsx
│   ├── FusionAnalyticsPanel.tsx
│   ├── FlightDynamicsPanel.tsx
│   └── UavTelemetryPanel.tsx
├── store/
│   └── useSimulationStore.ts  # Zustand state
└── types/
    └── simulation.ts        # Type definitions
```

## ✅ All Errors Fixed

- ✅ TypeScript strict mode compliance
- ✅ All type definitions included
- ✅ No missing modules
- ✅ Proper React component typing
- ✅ Build configuration verified

## 🎯 Next Steps

1. Run the dev server
2. Play with the simulation parameters
3. Watch the 3D visualization
4. Monitor the real-time telemetry

---

**Questions?** See TROUBLESHOOTING.md or FIX_SUMMARY.md
