/**
 * Calculates Power Dissipated (Pd) for Linear Regulators (LDOs).
 * Formula: Pd = (Vin - Vout) * Iout
 * 
 * @param Vin - Input Voltage
 * @param Vout - Output Voltage
 * @param Iout - Output Current
 * @returns Power dissipated in Watts
 */
export function calculatePLinear(Vin: number, Vout: number, Iout: number): number {
  return (Vin - Vout) * Iout;
}

/**
 * Calculates Power Dissipated (Pd) for Switching Regulators (Step-Down).
 * Formula: Pd = (Vout * Iout) * ((1 / efficiency) - 1)
 * 
 * @param Vout - Output Voltage
 * @param Iout - Output Current
 * @param efficiency - Efficiency as a decimal (e.g. 0.85 for 85%)
 * @returns Power dissipated in Watts
 */
export function calculatePSwitching(Vout: number, Iout: number, efficiency: number): number {
  if (efficiency <= 0 || efficiency > 1) {
    throw new Error("Efficiency must be between 0 and 1 (exclusive of 0).");
  }
  return (Vout * Iout) * ((1 / efficiency) - 1);
}

/**
 * Calculates Junction Temperature (Tj) of a component.
 * Formula: Tj = Ta + (Pd * RthetaJA)
 * 
 * @param Ta - Ambient Temperature (°C)
 * @param Pd - Power Dissipated (W)
 * @param RthetaJA - Thermal Resistance Junction-to-Ambient (°C/W)
 * @returns Junction Temperature in °C
 */
export function calculateTj(Ta: number, Pd: number, RthetaJA: number): number {
  return Ta + (Pd * RthetaJA);
}
