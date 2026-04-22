import { z } from "zod";

export const calcSchema = z.object({
  Vin: z.number().positive("A tensão de entrada deve ser positiva").max(100, "Tensão muito alta para esta calculadora"),
  Vout: z.number().positive("A tensão de saída deve ser positiva"),
  Iout: z.number().positive("A corrente deve ser positiva"),
  Ta: z.number().min(-40, "A temperatura ambiente é muito baixa").max(125, "A temperatura ambiente é muito alta").default(25),
}).refine(data => data.Vin > data.Vout, {
  message: "A Tensão de Entrada (Vin) deve ser maior que a Tensão de Saída (Vout)",
  path: ["Vin"]
});

export type CalcInputs = z.infer<typeof calcSchema>;
