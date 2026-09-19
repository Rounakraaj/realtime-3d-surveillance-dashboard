import React from 'react'
import useSimulationStore from '../store/useSimulationStore'

interface SliderControlProps {
  label: string
  value: number
  display: string
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
}

const SliderControl: React.FC<SliderControlProps> = ({ label, value, display, min, max, step, onChange }) => (
  <label className="block">
    <div className="flex items-center justify-between gap-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
      <span>{label}</span>
      <span className="font-mono text-cyan-200">{display}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      className="mt-2 w-full accent-cyan-300"
    />
  </label>
)

const FusionEnginePanel: React.FC = () => {
  const missileSpeed = useSimulationStore((state) => state.missileSpeed)
  const missileAltitude = useSimulationStore((state) => state.missileAltitude)
  const uavAltitude = useSimulationStore((state) => state.uavAltitude)
  const sensorFOV = useSimulationStore((state) => state.sensorFOV)
  const simulationLaps = useSimulationStore((state) => state.simulationLaps)
  const missileStartPos = useSimulationStore((state) => state.missileStartPos)
  const playbackSpeed = useSimulationStore((state) => state.playbackSpeed)
  const realisticFlightDynamics = useSimulationStore((state) => state.realisticFlightDynamics)
  const mpcPrediction = useSimulationStore((state) => state.mpcPrediction)
  const isRunning = useSimulationStore((state) => state.isRunning)
  const time = useSimulationStore((state) => state.time)
  const distance = useSimulationStore((state) => state.distance)
  const handoffStatus = useSimulationStore((state) => state.handoffStatus)
  const setMissileSpeed = useSimulationStore((state) => state.setMissileSpeed)
  const setMissileAltitude = useSimulationStore((state) => state.setMissileAltitude)
  const setUavAltitude = useSimulationStore((state) => state.setUavAltitude)
  const setSensorFOV = useSimulationStore((state) => state.setSensorFOV)
  const setSimulationLaps = useSimulationStore((state) => state.setSimulationLaps)
  const setMissileStartPos = useSimulationStore((state) => state.setMissileStartPos)
  const setPlaybackSpeed = useSimulationStore((state) => state.setPlaybackSpeed)
  const toggleRealisticFlightDynamics = useSimulationStore((state) => state.toggleRealisticFlightDynamics)
  const toggleMpcPrediction = useSimulationStore((state) => state.toggleMpcPrediction)
  const runSimulation = useSimulationStore((state) => state.runSimulation)
  const pauseSimulation = useSimulationStore((state) => state.pauseSimulation)

  return (
    <section className="w-[292px] rounded-lg border border-cyan-200/15 bg-slate-950/60 p-4 shadow-cyber backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-200">Fusion Engine</div>
          <div className="mt-1 text-xs text-slate-400">Live guidance controls</div>
        </div>
        <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${isRunning ? 'bg-emerald-400/15 text-emerald-200' : 'bg-slate-800 text-slate-300'}`}>
          {isRunning ? 'Live' : 'Paused'}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <SliderControl label="Missile speed" value={missileSpeed} display={`${missileSpeed.toFixed(0)} km/h`} min={0} max={2000} onChange={setMissileSpeed} />
        <SliderControl label="Missile altitude" value={missileAltitude} display={`${missileAltitude.toFixed(0)} m`} min={0} max={100} onChange={setMissileAltitude} />
        <SliderControl label="UAV altitude" value={uavAltitude} display={`${uavAltitude.toFixed(0)} m`} min={0} max={15000} onChange={setUavAltitude} />
        <SliderControl label="Sensor FOV" value={sensorFOV} display={`${sensorFOV.toFixed(1)} deg`} min={0} max={10} step={0.1} onChange={setSensorFOV} />
        <SliderControl label="Start position" value={missileStartPos} display={`${missileStartPos.toFixed(0)}%`} min={0} max={100} onChange={setMissileStartPos} />

        <div className="grid grid-cols-2 gap-3">
          <SliderControl label="Laps" value={simulationLaps} display={simulationLaps.toFixed(0)} min={1} max={10} onChange={setSimulationLaps} />
          <SliderControl label="Speed" value={playbackSpeed} display={`${playbackSpeed.toFixed(0)}x`} min={1} max={100} onChange={setPlaybackSpeed} />
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        <label className="flex items-center justify-between rounded-md border border-slate-700/80 bg-slate-900/55 px-3 py-2 text-xs text-slate-300">
          <span>Realistic dynamics</span>
          <input
            type="checkbox"
            checked={realisticFlightDynamics}
            onChange={toggleRealisticFlightDynamics}
            className="h-4 w-4 accent-cyan-300"
          />
        </label>

        <label className="flex items-center justify-between rounded-md border border-slate-700/80 bg-slate-900/55 px-3 py-2 text-xs text-slate-300">
          <span>MPC prediction</span>
          <input
            type="checkbox"
            checked={mpcPrediction}
            onChange={toggleMpcPrediction}
            className="h-4 w-4 accent-cyan-300"
          />
        </label>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={runSimulation}
          className="rounded-md border border-cyan-300/70 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-100 transition hover:bg-cyan-300/10"
        >
          Run
        </button>
        <button
          onClick={pauseSimulation}
          className="rounded-md bg-cyan-300 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-cyan-200"
        >
          Pause
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-md bg-slate-900/65 p-2">
          <div className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Time</div>
          <div className="mt-1 font-mono text-slate-100">{time.toFixed(1)} s</div>
        </div>
        <div className="rounded-md bg-slate-900/65 p-2">
          <div className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Range</div>
          <div className="mt-1 font-mono text-slate-100">{distance.toFixed(1)} km</div>
        </div>
        <div className="rounded-md bg-slate-900/65 p-2">
          <div className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Mode</div>
          <div className="mt-1 truncate font-mono text-cyan-200">{handoffStatus}</div>
        </div>
      </div>
    </section>
  )
}

export default FusionEnginePanel
