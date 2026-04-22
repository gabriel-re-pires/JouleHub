"use client";

import { useState } from "react";
import { MACRO_CONTROLLERS } from "@/data/microcontrollers";
import { REGULATORS } from "@/data/regulators";
import { calculatePLinear, calculatePSwitching, calculateTj } from "@/core/electronics/thermalMath";
import { calcSchema } from "@/lib/validations/calcSchema";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Flame, AlertTriangle, Zap, CheckCircle2 } from "lucide-react";

export function Calculator() {
  const [vin, setVin] = useState<string>("12");
  const [vout, setVout] = useState<string>("5");
  const [iout, setIout] = useState<string>("0.5");
  const [ta, setTa] = useState<string>("25");

  // Helper to safely parse floats
  const nVin = parseFloat(vin) || 0;
  const nVout = parseFloat(vout) || 0;
  const nIout = parseFloat(iout) || 0;
  const nTa = parseFloat(ta) || 25;

  const handleMcuSelect = (val: string) => {
    const mcu = MACRO_CONTROLLERS.find(m => m.id === val);
    if (mcu) {
      setIout(mcu.maxCurrentDraw.toString());
    }
  };

  const currentInputs = { Vin: nVin, Vout: nVout, Iout: nIout, Ta: nTa };
  const validation = calcSchema.safeParse(currentInputs);
  const isValid = validation.success;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-6xl mx-auto">
      {/* Inputs Form */}
      <Card className="lg:col-span-4 border-border/40 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-primary flex items-center gap-2">
            <Zap className="w-5 h-5" /> Parâmetros de Projeto
          </CardTitle>
          <CardDescription>Insira os requisitos de potência do seu projeto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="mcu-preset" className="text-muted-foreground font-medium">Predefinição de MCU (Preenche Corrente)</Label>
            <Select onValueChange={handleMcuSelect}>
              <SelectTrigger id="mcu-preset" className="border-border/50">
                <SelectValue placeholder="Selecione uma predefinição..." />
              </SelectTrigger>
              <SelectContent>
                {MACRO_CONTROLLERS.map(mcu => (
                  <SelectItem key={mcu.id} value={mcu.id}>
                    {mcu.name} {mcu.maxCurrentDraw > 0 ? `(${mcu.maxCurrentDraw}A)` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="vin">Tensão de Entrada (V)</Label>
              <Input id="vin" type="number" step="0.1" value={vin} onChange={(e) => setVin(e.target.value)} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vout">Tensão de Saída (V)</Label>
              <Input id="vout" type="number" step="0.1" value={vout} onChange={(e) => setVout(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="iout">Corrente do Regulador (A)</Label>
              <Input id="iout" type="number" step="0.01" value={iout} onChange={(e) => setIout(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ta">Temp. Ambiente (°C)</Label>
              <Input id="ta" type="number" step="1" value={ta} onChange={(e) => setTa(e.target.value)} />
            </div>
          </div>

          {!validation.success && (
            <Alert variant="destructive" className="bg-destructive/10 text-destructive border-none">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Entrada Inválida</AlertTitle>
              <AlertDescription className="text-xs">
                {validation.error.issues[0]?.message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Results Display */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        {validation.success ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {REGULATORS.map((reg) => {
                let pd = 0;
                let efficiencyOutput = 0;
                
                if (reg.type === "linear") {
                  pd = calculatePLinear(nVin, nVout, nIout);
                  efficiencyOutput = (nVout / nVin) * 100;
                } else if (reg.type === "switching" && reg.efficiency) {
                  pd = calculatePSwitching(nVout, nIout, reg.efficiency);
                  efficiencyOutput = reg.efficiency * 100;
                }
                
                const tj = calculateTj(nTa, pd, reg.RthetaJA);
                const isCritTemp = tj > 125;
                const isWarnPd = pd > 1.5;

                return (
                  <Card key={reg.id} className="border-border/40 relative overflow-hidden flex flex-col">
                    <div className={`absolute top-0 left-0 w-full h-1 ${reg.type === 'linear' ? 'bg-orange-500' : 'bg-primary'}`} />
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{reg.name}</CardTitle>
                          <CardDescription className="uppercase tracking-widest text-[10px] font-bold mt-1">
                            REGULADOR {reg.type === "linear" ? "LINEAR" : "CHAVEADO"}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="font-mono bg-background">
                          Efic: {efficiencyOutput.toFixed(1)}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4">
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                          <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Geração Calor (Pd)</div>
                          <div className="text-2xl font-bold font-mono text-foreground/90">{pd.toFixed(2)}W</div>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                          <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Temp. Est. (Tj)</div>
                          <div className={`text-2xl font-bold font-mono ${isCritTemp ? 'text-red-500' : 'text-primary'}`}>{tj.toFixed(1)}°C</div>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        {isCritTemp ? (
                          <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-500">
                            <Flame className="h-4 w-4" />
                            <AlertTitle className="text-sm font-bold">Falha Destrutiva</AlertTitle>
                            <AlertDescription className="text-xs leading-relaxed opacity-90">
                              O componente irá queimar. Adicione um dissipador grande ou reduza a queda de tensão imediatamente.
                            </AlertDescription>
                          </Alert>
                        ) : (
                           <Alert className="bg-green-500/10 border-green-500/20 text-green-500">
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertTitle className="text-sm font-bold">Zona Térmica Segura</AlertTitle>
                            <AlertDescription className="text-xs opacity-90">
                              A temperatura da junção está dentro dos limites operacionais seguros.
                            </AlertDescription>
                           </Alert>
                        )}

                        {isWarnPd && !isCritTemp && (
                          <Alert className="bg-orange-500/10 border-orange-500/20 text-orange-400">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle className="text-sm font-bold">Aviso de Encapsulamento</AlertTitle>
                            <AlertDescription className="text-xs opacity-90">
                              Risco de deformação em cases impressos 3D (PLA/PETG) sem ventilação ativa.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                      
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        ) : (
          <Card className="h-full min-h-[300px] flex items-center justify-center border-dashed bg-muted/10">
            <CardContent className="text-muted-foreground flex flex-col items-center gap-2">
              <AlertTriangle className="h-8 w-8 opacity-50" />
              <span>Por favor, insira parâmetros válidos para ver a análise térmica.</span>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
