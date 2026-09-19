import { create } from 'zustand'

export type UavStatus = 'TRACKING' | 'LOS_LOST'

export interface UavState {
  position: [number, number, number]
  address: string
  blindSpot: string
  missileBearing: string
  rangeToMissile: number
  sensorRange: number
  lookAzimuth: number
  lookElevation: number
  status: UavStatus
  bank: number
  g: number
  mode: 'TRACKING' | 'OTHER'
  energy: number
  turnRadius: number
  confidence: number
}

interface SimulationState {
  missileSpeed: number
  missileAltitude: number
  uavAltitude: number
  sensorFOV: number
  simulationLaps: number
  missileStartPos: number
  playbackSpeed: number
  realisticFlightDynamics: boolean
  mpcPrediction: boolean
  isRunning: boolean
  time: number
  distance: number
  handoffStatus: string
  gdop: number
  angle: number
  baseline: number
  uav1: UavState
  uav2: UavState
  setMissileSpeed: (value: number) => void
  setMissileAltitude: (value: number) => void
  setUavAltitude: (value: number) => void
  setSensorFOV: (value: number) => void
  setSimulationLaps: (value: number) => void
  setMissileStartPos: (value: number) => void
  setPlaybackSpeed: (value: number) => void
  toggleRealisticFlightDynamics: () => void
  toggleMpcPrediction: () => void
  runSimulation: () => void
  pauseSimulation: () => void
  updateSimulationStats: (payload: Partial<Omit<SimulationState, 'updateSimulationStats'>>) => void
}

const useSimulationStore = create<SimulationState>((set) => ({
  missileSpeed: 700,
  missileAltitude: 10,
  uavAltitude: 8000,
  sensorFOV: 3,
  simulationLaps: 1,
  missileStartPos: 0,
  playbackSpeed: 84,
  realisticFlightDynamics: true,
  mpcPrediction: true,
  isRunning: false,
  time: 0,
  distance: 0,
  handoffStatus: 'FUSION ACTIVE',
  gdop: 135285.08,
  angle: 10.2,
  baseline: 14.8,
  uav1: {
    position: [12.4, 8.0, -2.2],
    address: 'GRID NE-01',
    blindSpot: 'AFT SW',
    missileBearing: 'SE',
    rangeToMissile: 0,
    sensorRange: 0,
    lookAzimuth: 102.1,
    lookElevation: 7.3,
    status: 'TRACKING',
    bank: 0.0,
    g: 1.0,
    mode: 'TRACKING',
    energy: 289.3,
    turnRadius: 405,
    confidence: 95.1,
  },
  uav2: {
    position: [-10.2, 6.3, 18.1],
    address: 'GRID NW-01',
    blindSpot: 'AFT SE',
    missileBearing: 'SW',
    rangeToMissile: 0,
    sensorRange: 0,
    lookAzimuth: 74.5,
    lookElevation: 5.1,
    status: 'TRACKING',
    bank: 0.0,
    g: 1.0,
    mode: 'TRACKING',
    energy: 275.8,
    turnRadius: 382,
    confidence: 92.7,
  },
  setMissileSpeed: (value) => set({ missileSpeed: value }),
  setMissileAltitude: (value) => set({ missileAltitude: value }),
  setUavAltitude: (value) => set({ uavAltitude: value }),
  setSensorFOV: (value) => set({ sensorFOV: value }),
  setSimulationLaps: (value) => set({ simulationLaps: value }),
  setMissileStartPos: (value) => set({ missileStartPos: value }),
  setPlaybackSpeed: (value) => set({ playbackSpeed: value }),
  toggleRealisticFlightDynamics: () =>
    set((state) => ({ realisticFlightDynamics: !state.realisticFlightDynamics })),
  toggleMpcPrediction: () => set((state) => ({ mpcPrediction: !state.mpcPrediction })),
  runSimulation: () => set({ isRunning: true }),
  pauseSimulation: () => set({ isRunning: false }),
  updateSimulationStats: (payload) => set((state) => ({ ...state, ...payload })),
}))

export default useSimulationStore
