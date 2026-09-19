export interface SimulationState {
    missileSpeed: number; // in km/h
    missileAltitude: number; // in meters
    uavAltitude: number; // in meters
    sensorFOV: number; // in degrees
    simulationLaps: number; // number of laps
    missileStartPos: number; // percentage (0-100)
    playbackSpeed: number; // multiplier (1x-100x)
    realisticFlightDynamics: boolean; // toggle for realistic flight dynamics
    mpcPrediction: boolean; // toggle for MPC prediction
    time: number; // elapsed time in seconds
    distance: number; // distance covered in kilometers
    handoffStatus: string; // status of handoff (e.g., "FUSION ACTIVE")
}

export interface UavTelemetry {
    position: [number, number, number]; // [X, Y, Z] coordinates
    address: string; // grid address
    blindSpot: string; // blind-spot sector
    missileBearing: string; // bearing to target
    rangeToMissile: number; // current target range
    sensorRange: number; // maximum sensor range
    lookAzimuth: number; // azimuth angle
    lookElevation: number; // elevation angle
    status: 'TRACKING' | 'LOS_LOST'; // status of the UAV
}

export interface FlightDynamics {
    bank: number; // bank angle in degrees
    gForce: number; // G-force
    mode: 'TRACKING' | 'OTHER'; // flight mode
    energy: number; // energy in kJ
    turnRadius: number; // turn radius in meters
}

export interface FusionAnalytics {
    gdop: number; // Geometric Dilution of Precision
    angle: number; // angle in degrees
    baseline: number; // baseline distance in kilometers
    confidence: number; // confidence percentage
}
