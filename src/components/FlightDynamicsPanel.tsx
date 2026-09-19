import React from 'react'
import useSimulationStore, { UavState } from '../store/useSimulationStore'

const FlightBlock: React.FC<{ title: string; uav: UavState; accent: string }> = ({ title, uav, accent }) => (
  <div className="rounded-md border border-slate-700/70 bg-slate-900/55 p-3">
    <div className="flex items-center justify-between">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{title}</div>
      <span className={`h-2 w-2 rounded-full ${accent}`} />
    </div>

    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
      <div className="flex justify-between gap-2 text-slate-300">
        <span>Bank</span>
        <span className="font-mono text-white">{uav.bank.toFixed(1)} deg</span>
      </div>
      <div className="flex justify-between gap-2 text-slate-300">
        <span>G</span>
        <span className="font-mono text-white">{uav.g.toFixed(2)}</span>
      </div>
      <div className="flex justify-between gap-2 text-slate-300">
        <span>Energy</span>
        <span className="font-mono text-white">{uav.energy.toFixed(1)}</span>
      </div>
      <div className="flex justify-between gap-2 text-slate-300">
        <span>Turn</span>
        <span className="font-mono text-white">{uav.turnRadius.toFixed(0)} m</span>
      </div>
    </div>

    <div className="mt-3 flex items-center justify-between border-t border-slate-700/70 pt-2 text-xs">
      <span className="uppercase tracking-[0.16em] text-slate-500">Mode</span>
      <span className={uav.mode === 'TRACKING' ? 'font-semibold text-emerald-300' : 'font-semibold text-rose-300'}>
        {uav.mode}
      </span>
    </div>
  </div>
)

const FlightDynamicsPanel: React.FC = () => {
  const uav1 = useSimulationStore((state) => state.uav1)
  const uav2 = useSimulationStore((state) => state.uav2)

  return (
    <section className="rounded-lg border border-slate-300/15 bg-slate-950/58 p-4 backdrop-blur-xl">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-100">Flight Dynamics</h2>
      <div className="mt-3 grid gap-2">
        <FlightBlock title="UAV 1" uav={uav1} accent="bg-sky-300" />
        <FlightBlock title="UAV 2" uav={uav2} accent="bg-emerald-300" />
      </div>
    </section>
  )
}

export default FlightDynamicsPanel
