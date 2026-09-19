import React from 'react'
import useSimulationStore, { UavState } from '../store/useSimulationStore'

const clampPercent = (value: number) => Math.max(0, Math.min(100, value))

const TelemetryBlock: React.FC<{ title: string; uav: UavState; accent: string; bar: string }> = ({
  title,
  uav,
  accent,
  bar,
}) => {
  const rangePercent = uav.sensorRange > 0 ? clampPercent((uav.rangeToMissile / uav.sensorRange) * 100) : 0
  const remainingRange = Math.max(uav.sensorRange - uav.rangeToMissile, 0)
  const isTracking = uav.status === 'TRACKING'

  return (
    <div className="rounded-md border border-slate-700/70 bg-slate-900/55 p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{title}</div>
          <div className="mt-1 font-mono text-[11px] text-slate-300">{uav.address}</div>
        </div>
        <span className={`rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${isTracking ? 'bg-emerald-400/10 text-emerald-300' : 'bg-rose-400/10 text-rose-300'}`}>
          {uav.status}
        </span>
      </div>

      <div className="mt-3 grid gap-2 text-xs">
        <div>
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-slate-500">
            <span>Missile range</span>
            <span className={isTracking ? 'text-emerald-300' : 'text-rose-300'}>
              {uav.rangeToMissile.toFixed(1)} / {uav.sensorRange.toFixed(1)}
            </span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-800">
            <div className={`h-full rounded-full ${bar}`} style={{ width: `${rangePercent}%` }} />
          </div>
          <div className="mt-1 font-mono text-[11px] text-slate-400">
            {isTracking ? `${remainingRange.toFixed(1)} units inside detection range` : 'Target outside max range'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Bearing</div>
            <div className={`mt-1 rounded-md bg-slate-950/50 px-2 py-1 font-mono text-white ring-1 ${accent}`}>
              {uav.missileBearing}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Blind spot</div>
            <div className="mt-1 rounded-md bg-rose-950/30 px-2 py-1 font-mono text-rose-200 ring-1 ring-rose-400/30">
              {uav.blindSpot}
            </div>
          </div>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Position XYZ</div>
          <div className={`mt-1 rounded-md bg-slate-950/50 px-2 py-1 font-mono text-white ring-1 ${accent}`}>
            [{uav.position.map((value) => value.toFixed(1)).join(', ')}]
          </div>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Look Az / El</div>
          <div className="mt-1 rounded-md bg-slate-950/50 px-2 py-1 font-mono text-white ring-1 ring-slate-700/70">
            [{uav.lookAzimuth.toFixed(1)}, {uav.lookElevation.toFixed(1)}]
          </div>
        </div>
      </div>
    </div>
  )
}

const UavTelemetryPanel: React.FC = () => {
  const uav1 = useSimulationStore((state) => state.uav1)
  const uav2 = useSimulationStore((state) => state.uav2)

  return (
    <section className="rounded-lg border border-cyan-300/15 bg-slate-950/58 p-4 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-200">UAV Telemetry</h2>
        <span className="rounded-md bg-cyan-300/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-200">
          Live
        </span>
      </div>
      <div className="mt-3 grid gap-2">
        <TelemetryBlock title="UAV 1" uav={uav1} accent="ring-sky-400/40" bar="bg-sky-300" />
        <TelemetryBlock title="UAV 2" uav={uav2} accent="ring-emerald-400/40" bar="bg-emerald-300" />
      </div>
    </section>
  )
}

export default UavTelemetryPanel
