export interface IVoltageRegulator {
  id: string;
  name: string;
  type: "linear" | "switching";
  efficiency?: number; // Represented as decimal, eg: 0.85 for 85% (only for switching)
  RthetaJA: number; // Thermal resistance junction-to-ambient (°C/W)
}

export interface IMicrocontroller {
  id: string;
  name: string;
  maxCurrentDraw: number; // In Amperes (Peak current draw)
}
