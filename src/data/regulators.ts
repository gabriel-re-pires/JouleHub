import { IVoltageRegulator } from "@/core/types";

export const REGULATORS: IVoltageRegulator[] = [
  {
    id: "lm7805",
    name: "LM7805 (TO-220)",
    type: "linear",
    RthetaJA: 65, // °C/W
  },
  {
    id: "ams1117",
    name: "AMS1117 (SOT-223)",
    type: "linear",
    RthetaJA: 90, // °C/W
  },
  {
    id: "lm2596",
    name: "LM2596 Module",
    type: "switching",
    RthetaJA: 50, // °C/W (Module estimate)
    efficiency: 0.85, // 85% typical
  },
  {
    id: "mp1584",
    name: "MP1584 Mini Module",
    type: "switching",
    RthetaJA: 60, // °C/W (Module estimate)
    efficiency: 0.90, // 90% typical
  }
];
