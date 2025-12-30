import { MotorcycleModel, LineName } from './types';

// datos
export const MOTORCYCLE_DATABASE: MotorcycleModel[] = [
  // --- L1 CTG ---
  { id: '1', name: 'Apache 160 4V', maxCadence: 31, workContent: 110.3225806, line: LineName.L1 },
  { id: '2', name: 'Apache 160 4V Fi', maxCadence: 27.10843373, workContent: 152.72, line: LineName.L1 },
  { id: '3', name: 'Apache 200 4V', maxCadence: 28, workContent: 122.1428571, line: LineName.L1 },
  { id: '4', name: 'Apache 200 Fi', maxCadence: 28, workContent: 122.1428571, line: LineName.L1 },
  { id: '5', name: 'NEO 110', maxCadence: 31.88010899, workContent: 129.8615385, line: LineName.L1 },
  { id: '6', name: 'Ntorq 125', maxCadence: 23.44454463, workContent: 176.5869231, line: LineName.L1 },
  { id: '7', name: 'Raider 125', maxCadence: 41.45610068, workContent: 99.86467449, line: LineName.L1 },
  { id: '8', name: 'Raider 125 Fi', maxCadence: 39.18159969, workContent: 105.6618421, line: LineName.L1 },
  { id: '9', name: 'SPORT 100 ELS', maxCadence: 38.24615635, workContent: 87.85196529, line: LineName.L1 },
  { id: '10', name: 'SPORT 100 KLS', maxCadence: 35.01113586, workContent: 97.68320611, line: LineName.L1 },
  { id: '11', name: 'STRYKER 125 INDO', maxCadence: 26, workContent: 117.6923077, line: LineName.L1 },
  
  // --- L2 CTG ---
  { id: '12', name: '200 DUKE NG', maxCadence: 13, workContent: 180, line: LineName.L2 },
  { id: '13', name: '200 DUKE WO', maxCadence: 14, workContent: 167.1428571, line: LineName.L2 },
  { id: '14', name: '250 DUKE G3', maxCadence: 10, workContent: 210, line: LineName.L2 },
  { id: '15', name: '390 ADV', maxCadence: 7.03539823, workContent: 281.4339623, line: LineName.L2 },
  { id: '16', name: '390 DUKE G3', maxCadence: 9.31052123, workContent: 225.5512821, line: LineName.L2 },
  { id: '17', name: 'Apache 160 4V (L2)', maxCadence: 16, workContent: 146.25, line: LineName.L2 },
  { id: '18', name: 'Apache 160 4V Fi (L2)', maxCadence: 14.51612903, workContent: 144.6666667, line: LineName.L2 },
  { id: '19', name: 'Apache 200 4V (L2)', maxCadence: 14, workContent: 167.1428571, line: LineName.L2 },
  { id: '20', name: 'Apache 200 Fi (L2)', maxCadence: 14.27554652, workContent: 163.9166667, line: LineName.L2 },
  { id: '21', name: 'DAZZ 110', maxCadence: 16, workContent: 127.5, line: LineName.L2 },
  { id: '22', name: 'NEO 110 (L2)', maxCadence: 18.68806041, workContent: 112.3712121, line: LineName.L2 },
  { id: '23', name: 'Ntorq 125 (L2)', maxCadence: 19.55770181, workContent: 107.3745791, line: LineName.L2 },
  { id: '24', name: 'Ntorq 125 Fi (L2)', maxCadence: 17, workContent: 120, line: LineName.L2 },
  { id: '25', name: 'Raider 125 SBT', maxCadence: 13.78713767, workContent: 152.3158795, line: LineName.L2 },
  { id: '26', name: 'Raider 125 (L2)', maxCadence: 14.13818182, workContent: 140.0462963, line: LineName.L2 },
  { id: '27', name: 'Svartpilen 250', maxCadence: 8, workContent: 262.5, line: LineName.L2 },
  { id: '28', name: 'Svartpilen 401', maxCadence: 7, workContent: 282.8571429, line: LineName.L2 },
  { id: '29', name: '390 ADV R', maxCadence: 6.301279947, workContent: 333.265625, line: LineName.L2 },
  { id: '30', name: '390 SMC R', maxCadence: 6.301279947, workContent: 333.265625, line: LineName.L2 },
  { id: '31', name: '390 ADV X', maxCadence: 5.477070202, workContent: 383.4166667, line: LineName.L2 },
  { id: '32', name: '390 ENDURO R', maxCadence: 5.843575049, workContent: 359.3690476, line: LineName.L2 },
  { id: '33', name: 'Ntorq 125 SBT (L2)', maxCadence: 19.55770181, workContent: 107.3745791, line: LineName.L2 },
];

export const DEFAULT_SHIFT_CONFIG = {
  startTime: '06:00',
  endTime: '14:00',
  breaks: {
    am: 15,
    lunch: 30,
    pm: 15
  },
  workingDaysPerMonth: 24
};