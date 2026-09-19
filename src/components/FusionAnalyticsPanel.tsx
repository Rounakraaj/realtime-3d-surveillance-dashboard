import React from 'react'
import useSimulationStore from '../store/useSimulationStore'

const FusionAnalyticsPanel: React.FC = () => {
  const gdop = useSimulationStore((state) => state.gdop)
  const angle = useSimulationStore((state) => state.angle)
  const baseline = useSimulationStore((state) => state.baseline)
  const uav1Confidence = useSimulationStore((state) => state.uav1.confidence)
  const handoffStatus = useSimulationStore((state) => state.handoffStatus)
  const isLocked = handoffStatus.includes('LOCK')

  return (
    <section className="rounded-lg border border-fuchsia-300/15 bg-slate-950/58 p-4 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.24em] text-fuchsia-200">Fusion Analytics</h2>
        <span className={`rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${isLocked ? 'bg-emerald-300/10 text-emerald-200' : 'bg-rose-300/10 text-rose-200'}`}>
          {handoffStatus}
        </span>
      </div>

      <div className="mt-4 rounded-md border border-slate-700/70 bg-slate-900/55 p-3">
        <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">GDOP</div>
        <div className="mt-1 font-mono text-2xl font-semibold text-white">{gdop.toFixed(2)}</div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-md bg-slate-900/65 p-2">
          <div className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Angle</div>
          <div className="mt-1 font-mono text-sm font-semibold text-white">{angle.toFixed(1)} deg</div>
        </div>
        <div className="rounded-md bg-slate-900/65 p-2">
          <div className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Base</div>
          <div className="mt-1 font-mono text-sm font-semibold text-white">{baseline.toFixed(1)} km</div>
        </div>
        <div className="rounded-md bg-slate-900/65 p-2">
          <div className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Conf</div>
          <div className={`mt-1 font-mono text-sm font-semibold ${uav1Confidence > 50 ? 'text-emerald-300' : 'text-rose-300'}`}>
            {uav1Confidence.toFixed(1)}%
          </div>
        </div>
      </div>
    </section>
  )
}

export default FusionAnalyticsPanel
