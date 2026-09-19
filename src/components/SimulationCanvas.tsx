import React, { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import useSimulationStore from '../store/useSimulationStore'

const UI_UPDATE_INTERVAL = 0.08
const MISSILE_ORBIT_RADIUS = 54
const UP_AXIS = new THREE.Vector3(0, 1, 0)
const UAV_STATION_1 = new THREE.Vector3(-34, 0, -18)
const UAV_STATION_2 = new THREE.Vector3(34, 0, 18)

class CircularTrajectory extends THREE.Curve<THREE.Vector3> {
  constructor(
    private readonly radius: number,
    private readonly altitude: number,
  ) {
    super()
  }

  getPoint(t: number): THREE.Vector3 {
    const theta = t * Math.PI * 2

    return new THREE.Vector3(
      Math.cos(theta) * this.radius,
      this.altitude,
      Math.sin(theta) * this.radius,
    )
  }
}

const normalizeProgress = (value: number) => ((value % 1) + 1) % 1

const pointsToPositions = (points: THREE.Vector3[], yOffset = 0) =>
  new Float32Array(points.flatMap((point) => [point.x, point.y + yOffset, point.z]))

const getSectorLabel = (direction: THREE.Vector3) => {
  if (Math.abs(direction.x) < 0.001 && Math.abs(direction.z) < 0.001) return 'CENTER'

  const bearing = (THREE.MathUtils.radToDeg(Math.atan2(direction.x, direction.z)) + 360) % 360
  const sectors = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']

  return sectors[Math.round(bearing / 45) % sectors.length]
}

const getGridAddress = (position: THREE.Vector3) => {
  const sector = getSectorLabel(position)
  const ring = Math.max(1, Math.ceil(Math.hypot(position.x, position.z) / 24))

  return `GRID ${sector}-${ring.toString().padStart(2, '0')}`
}

const orientConeFromApex = (mesh: THREE.Mesh, apex: THREE.Vector3, direction: THREE.Vector3, length: number) => {
  if (direction.lengthSq() === 0) return

  const aim = direction.clone().normalize()
  mesh.position.copy(apex).addScaledVector(aim, length / 2)
  mesh.quaternion.setFromUnitVectors(UP_AXIS, aim.clone().negate())
}

const orientCylinderBetween = (mesh: THREE.Mesh, start: THREE.Vector3, end: THREE.Vector3) => {
  const direction = end.clone().sub(start)
  const length = direction.length()

  if (length === 0) return

  mesh.position.copy(start).addScaledVector(direction, 0.5)
  mesh.quaternion.setFromUnitVectors(UP_AXIS, direction.normalize())
  mesh.scale.set(1, length, 1)
}

const setLineStatus = (mesh: THREE.Mesh | null, isLocked: boolean) => {
  const material = mesh?.material

  if (material instanceof THREE.MeshBasicMaterial) {
    material.color.set(isLocked ? '#7dd3fc' : '#fb7185')
    material.opacity = isLocked ? 0.78 : 0.32
  }
}

function Scene(): JSX.Element {
  const uav1Ref = useRef<THREE.Group | null>(null)
  const uav2Ref = useRef<THREE.Group | null>(null)
  const sensor1Ref = useRef<THREE.Mesh | null>(null)
  const sensor2Ref = useRef<THREE.Mesh | null>(null)
  const range1Ref = useRef<THREE.Mesh | null>(null)
  const range2Ref = useRef<THREE.Mesh | null>(null)
  const blind1Ref = useRef<THREE.Mesh | null>(null)
  const blind2Ref = useRef<THREE.Mesh | null>(null)
  const los1Ref = useRef<THREE.Mesh | null>(null)
  const los2Ref = useRef<THREE.Mesh | null>(null)
  const missileRef = useRef<THREE.Group | null>(null)
  const simTimeRef = useRef(useSimulationStore.getState().time)
  const lastUiUpdateRef = useRef(-Infinity)

  const isRunning = useSimulationStore((state) => state.isRunning)
  const time = useSimulationStore((state) => state.time)
  const playbackSpeed = useSimulationStore((state) => state.playbackSpeed)
  const missileStartPos = useSimulationStore((state) => state.missileStartPos)
  const missileSpeed = useSimulationStore((state) => state.missileSpeed)
  const missileAltitude = useSimulationStore((state) => state.missileAltitude)
  const uavAltitude = useSimulationStore((state) => state.uavAltitude)
  const sensorFOV = useSimulationStore((state) => state.sensorFOV)
  const simulationLaps = useSimulationStore((state) => state.simulationLaps)
  const realisticFlightDynamics = useSimulationStore((state) => state.realisticFlightDynamics)
  const mpcPrediction = useSimulationStore((state) => state.mpcPrediction)
  const updateSimulationStats = useSimulationStore((state) => state.updateSimulationStats)

  const missileOrbitAltitude = useMemo(() => THREE.MathUtils.clamp(5 + missileAltitude * 0.18, 5, 24), [missileAltitude])
  const escortAltitude = useMemo(() => THREE.MathUtils.clamp(16 + uavAltitude / 700, 20, 42), [uavAltitude])
  const sensorRange = useMemo(() => THREE.MathUtils.clamp(58 + sensorFOV * 5.5, 58, 114), [sensorFOV])
  const sensorConeRadius = useMemo(
    () => Math.max(sensorRange * Math.tan(THREE.MathUtils.degToRad(Math.max(sensorFOV, 1.5) * 2.4)), 4),
    [sensorFOV, sensorRange],
  )
  const blindSpotRange = useMemo(() => sensorRange * 0.42, [sensorRange])
  const missileCurve = useMemo(
    () => new CircularTrajectory(MISSILE_ORBIT_RADIUS, missileOrbitAltitude),
    [missileOrbitAltitude],
  )
  const missilePositions = useMemo(() => pointsToPositions(missileCurve.getPoints(220), 0.35), [missileCurve])

  useEffect(() => {
    simTimeRef.current = time
  }, [time])

  useFrame((_, delta) => {
    let nextTime = simTimeRef.current

    if (isRunning) {
      nextTime += delta * playbackSpeed * 0.5
      simTimeRef.current = nextTime
    }

    const speedScale = THREE.MathUtils.clamp(missileSpeed / 700, 0.35, 3)
    const lapScale = Math.max(simulationLaps, 1)
    const missileProgress = normalizeProgress((nextTime * 0.0008 * speedScale) / lapScale + missileStartPos * 0.01)
    const missilePoint = missileCurve.getPointAt(missileProgress)
    const missileNext = missileCurve.getPointAt(normalizeProgress(missileProgress + 0.01))
    const stationHover = isRunning ? Math.sin(nextTime * 0.85) * 0.55 : 0
    const uav1Point = new THREE.Vector3(
      UAV_STATION_1.x,
      missileOrbitAltitude + escortAltitude + stationHover,
      UAV_STATION_1.z,
    )
    const uav2Point = new THREE.Vector3(
      UAV_STATION_2.x,
      missileOrbitAltitude + escortAltitude + 4 + Math.cos(nextTime * 0.78) * 0.55,
      UAV_STATION_2.z,
    )
    const uav1ToMissile = missilePoint.clone().sub(uav1Point)
    const uav2ToMissile = missilePoint.clone().sub(uav2Point)
    const uav1Distance = uav1ToMissile.length()
    const uav2Distance = uav2ToMissile.length()
    const uav1Locked = uav1Distance <= sensorRange
    const uav2Locked = uav2Distance <= sensorRange

    if (missileRef.current) {
      missileRef.current.position.copy(missilePoint)
      missileRef.current.lookAt(missileNext)
    }

    if (uav1Ref.current) {
      uav1Ref.current.position.copy(uav1Point)
      uav1Ref.current.lookAt(missilePoint)
    }

    if (uav2Ref.current) {
      uav2Ref.current.position.copy(uav2Point)
      uav2Ref.current.lookAt(missilePoint)
    }

    if (sensor1Ref.current) orientConeFromApex(sensor1Ref.current, uav1Point, uav1ToMissile, sensorRange)
    if (sensor2Ref.current) orientConeFromApex(sensor2Ref.current, uav2Point, uav2ToMissile, sensorRange)
    if (blind1Ref.current) orientConeFromApex(blind1Ref.current, uav1Point, uav1ToMissile.clone().negate(), blindSpotRange)
    if (blind2Ref.current) orientConeFromApex(blind2Ref.current, uav2Point, uav2ToMissile.clone().negate(), blindSpotRange)
    if (range1Ref.current) range1Ref.current.position.copy(uav1Point)
    if (range2Ref.current) range2Ref.current.position.copy(uav2Point)
    if (los1Ref.current) orientCylinderBetween(los1Ref.current, uav1Point, missilePoint)
    if (los2Ref.current) orientCylinderBetween(los2Ref.current, uav2Point, missilePoint)
    setLineStatus(los1Ref.current, uav1Locked)
    setLineStatus(los2Ref.current, uav2Locked)

    if ((isRunning && nextTime - lastUiUpdateRef.current >= UI_UPDATE_INTERVAL) || lastUiUpdateRef.current < 0) {
      lastUiUpdateRef.current = nextTime
      const bankMultiplier = realisticFlightDynamics ? 1 : 0.35
      const baseline = uav1Point.distanceTo(uav2Point)
      const triangulationAngle = THREE.MathUtils.radToDeg(uav1ToMissile.angleTo(uav2ToMissile))
      const uav1Confidence = uav1Locked ? 99 - (uav1Distance / sensorRange) * 18 : 18
      const uav2Confidence = uav2Locked ? 97 - (uav2Distance / sensorRange) * 20 : 12
      const uav1Bearing = getSectorLabel(uav1ToMissile)
      const uav2Bearing = getSectorLabel(uav2ToMissile)
      const uav1BlindSector = `AFT ${getSectorLabel(uav1ToMissile.clone().negate())}`
      const uav2BlindSector = `AFT ${getSectorLabel(uav2ToMissile.clone().negate())}`
      const handoffStatus = uav1Locked && uav2Locked
        ? 'DUAL UAV LOCK'
        : uav1Locked
          ? 'UAV 1 LOCK'
          : uav2Locked
            ? 'UAV 2 LOCK'
            : 'BLIND SPOT'

      updateSimulationStats({
        time: nextTime,
        distance: (nextTime * missileSpeed) / 36000,
        handoffStatus: mpcPrediction ? handoffStatus : 'FUSION ACTIVE',
        gdop: 180 + (uav1Locked && uav2Locked ? 0 : 420) + Math.abs(Math.sin(nextTime * 0.01)) * 35,
        angle: triangulationAngle,
        baseline,
        uav1: {
          position: [uav1Point.x, uav1Point.y, uav1Point.z],
          address: getGridAddress(uav1Point),
          blindSpot: uav1Locked ? uav1BlindSector : `OUT OF RANGE ${uav1Bearing}`,
          missileBearing: uav1Bearing,
          rangeToMissile: uav1Distance,
          sensorRange,
          lookAzimuth: (Math.atan2(uav1ToMissile.z, uav1ToMissile.x) * 180) / Math.PI,
          lookElevation: (Math.atan2(uav1ToMissile.y, Math.hypot(uav1ToMissile.x, uav1ToMissile.z)) * 180) / Math.PI,
          status: uav1Locked ? 'TRACKING' : 'LOS_LOST',
          bank: Math.sin(nextTime * 0.9) * 1.5 * bankMultiplier,
          g: 1 + Math.abs(Math.sin(nextTime * 0.5)) * 0.04 * bankMultiplier,
          mode: uav1Locked ? 'TRACKING' : 'OTHER',
          energy: 289 + Math.sin(nextTime * 0.18) * 6,
          turnRadius: MISSILE_ORBIT_RADIUS * 10 + Math.cos(nextTime * 0.32) * 15,
          confidence: uav1Confidence,
        },
        uav2: {
          position: [uav2Point.x, uav2Point.y, uav2Point.z],
          address: getGridAddress(uav2Point),
          blindSpot: uav2Locked ? uav2BlindSector : `OUT OF RANGE ${uav2Bearing}`,
          missileBearing: uav2Bearing,
          rangeToMissile: uav2Distance,
          sensorRange,
          lookAzimuth: (Math.atan2(uav2ToMissile.z, uav2ToMissile.x) * 180) / Math.PI,
          lookElevation: (Math.atan2(uav2ToMissile.y, Math.hypot(uav2ToMissile.x, uav2ToMissile.z)) * 180) / Math.PI,
          status: uav2Locked ? 'TRACKING' : 'LOS_LOST',
          bank: Math.cos(nextTime * 0.8) * 1.9 * bankMultiplier,
          g: 1 + Math.abs(Math.cos(nextTime * 0.4)) * 0.05 * bankMultiplier,
          mode: uav2Locked ? 'TRACKING' : 'OTHER',
          energy: 276 + Math.sin(nextTime * 0.13) * 5,
          turnRadius: MISSILE_ORBIT_RADIUS * 10 + Math.cos(nextTime * 0.22) * 12,
          confidence: uav2Confidence,
        },
      })
    }
  })

  return (
    <>
      <fog attach="fog" args={['#07111f', 90, 260]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[50, 80, 50]} intensity={1.2} color="#d7f3ff" />
      <directionalLight position={[-40, 35, -50]} intensity={0.45} color="#7a9cff" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[240, 240]} />
        <meshStandardMaterial color="#08131f" roughness={0.92} metalness={0.08} />
      </mesh>

      <gridHelper args={[240, 48, '#1dd3d3', '#243649']} position={[0, 0.02, 0]} />

      <mesh>
        <tubeGeometry args={[missileCurve, 240, 0.58, 14, true]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f97316" emissiveIntensity={0.85} roughness={0.24} />
      </mesh>

      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[missilePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#fed7aa" transparent opacity={0.96} />
      </line>

      <mesh ref={range1Ref}>
        <sphereGeometry args={[sensorRange, 28, 18]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.055} wireframe depthWrite={false} />
      </mesh>

      <mesh ref={range2Ref}>
        <sphereGeometry args={[sensorRange, 28, 18]} />
        <meshBasicMaterial color="#4ade80" transparent opacity={0.055} wireframe depthWrite={false} />
      </mesh>

      <mesh ref={sensor1Ref}>
        <coneGeometry args={[sensorConeRadius, sensorRange, 40, 1, true]} />
        <meshStandardMaterial color="#7dd3fc" transparent opacity={0.13} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      <mesh ref={sensor2Ref}>
        <coneGeometry args={[sensorConeRadius, sensorRange, 40, 1, true]} />
        <meshStandardMaterial color="#86efac" transparent opacity={0.13} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      <mesh ref={blind1Ref}>
        <coneGeometry args={[blindSpotRange * 0.45, blindSpotRange, 28, 1, true]} />
        <meshStandardMaterial color="#f43f5e" transparent opacity={0.1} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      <mesh ref={blind2Ref}>
        <coneGeometry args={[blindSpotRange * 0.45, blindSpotRange, 28, 1, true]} />
        <meshStandardMaterial color="#f43f5e" transparent opacity={0.1} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      <mesh ref={los1Ref}>
        <cylinderGeometry args={[0.07, 0.07, 1, 8]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.78} depthWrite={false} />
      </mesh>

      <mesh ref={los2Ref}>
        <cylinderGeometry args={[0.07, 0.07, 1, 8]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.78} depthWrite={false} />
      </mesh>

      <group ref={missileRef}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[1.25, 5.4, 18]} />
          <meshStandardMaterial color="#fb7185" emissive="#f97316" emissiveIntensity={0.85} roughness={0.32} />
        </mesh>
        <pointLight color="#fb923c" intensity={1.2} distance={24} />
      </group>

      <group ref={uav1Ref}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[1.25, 4.4, 10]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.65} />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[5.2, 0.22, 0.7]} />
          <meshStandardMaterial color="#bae6fd" emissive="#0284c7" emissiveIntensity={0.35} />
        </mesh>
      </group>

      <group ref={uav2Ref}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[1.25, 4.4, 10]} />
          <meshStandardMaterial color="#4ade80" emissive="#16a34a" emissiveIntensity={0.55} />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[5.2, 0.22, 0.7]} />
          <meshStandardMaterial color="#bbf7d0" emissive="#16a34a" emissiveIntensity={0.32} />
        </mesh>
      </group>

      <OrbitControls target={[0, 18, 0]} enableDamping dampingFactor={0.08} maxDistance={240} minDistance={45} />
    </>
  )
}

const SimulationCanvas: React.FC = () => (
  <Canvas camera={{ position: [12, 88, 142], fov: 36 }} gl={{ antialias: true, powerPreference: 'high-performance' }}>
    <Scene />
  </Canvas>
)

export default SimulationCanvas
