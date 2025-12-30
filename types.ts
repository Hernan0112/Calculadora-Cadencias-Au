export enum LineName {
  L1 = 'L1 CTG',
  L2 = 'L2 CTG'
}

export interface MotorcycleModel {
  id: string;
  name: string;
  maxCadence: number;
  workContent: number; // En minutos por unidad (derivado de W.C o calculado)
  line: LineName;
}

export interface ShiftConfig {
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  breaks: {
    am: number; // min
    pm: number; // min
    lunch: number; // min
  };
  workingDaysPerMonth: number;
}

export interface SimulationResult {
  requiredPersonnel: number;
  taktTime: number; // seg
  newWorkContent: number; // esto puede ser estático, pero es bueno tenerlo como resultado.
  personnelDelta: number; // Diferencia con la actual
  dailyOutput: number;
  monthlyOutput: number;
}
