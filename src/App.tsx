import React from 'react'
import FusionEnginePanel from './components/FusionEnginePanel'
import FusionAnalyticsPanel from './components/FusionAnalyticsPanel'
import FlightDynamicsPanel from './components/FlightDynamicsPanel'
import UavTelemetryPanel from './components/UavTelemetryPanel'
import SimulationCanvas from './components/SimulationCanvas'

const App: React.FC = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 text-white">
      <SimulationCanvas />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-4 top-4 z-10 max-h-[calc(100vh-2rem)] pointer-events-auto">
          <FusionEnginePanel />
        </div>

        <div className="absolute right-4 top-4 z-10 w-[320px] max-h-[calc(100vh-2rem)] overflow-y-auto pointer-events-auto">
          <div className="grid gap-3">
            <FusionAnalyticsPanel />
            <FlightDynamicsPanel />
            <UavTelemetryPanel />
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-lg border border-amber-300/30 bg-slate-950/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200 backdrop-blur-md">
          Circular missile orbit | UAV range spheres | red blind zones
        </div>
      </div>
    </div>
  )
}

export default App;
