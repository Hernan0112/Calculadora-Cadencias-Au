import React, { useState, useMemo } from 'react';
import { MotorcycleModel, ShiftConfig, SimulationResult } from '../types';
import { Calculator, Users, Clock, Package, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface CadenceSimulatorProps {
  models: MotorcycleModel[];
  shiftConfig: ShiftConfig;
  availableMinutes: number;
}

export const CadenceSimulator: React.FC<CadenceSimulatorProps> = ({ models, shiftConfig, availableMinutes }) => {
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  const [currentPersonnel, setCurrentPersonnel] = useState<number>(0);
  const [targetCadence, setTargetCadence] = useState<number>(0);

  const selectedModel = useMemo(() => models.find(m => m.id === selectedModelId), [models, selectedModelId]);

  // efecto para establecer valores predeterminados cuando cambia el modelo
  React.useEffect(() => {
    if (selectedModel) {
      //  work_content = (60 * p) / c_a.
      // entonces, si seleccionamos un modelo, ¿sugerimos una cadencia predeterminada basada en el personal típico? :)
      // Supongamos que el personal estándar es de alrededor de 20 para la inicialización si 0
      if (currentPersonnel === 0) setCurrentPersonnel(20);
      if (targetCadence === 0) setTargetCadence(selectedModel.maxCadence);
    }
  }, [selectedModel]);

  const simulation: SimulationResult | null = useMemo(() => {
    if (!selectedModel || targetCadence <= 0 || currentPersonnel <= 0) return null;

    // WC constante desde la data
    const wc = selectedModel.workContent;

    // Calcular el personal requerido (MOD) para la nueva cadencia
    // Formula: Cadencia = (60 * MOD) / WC  =>  MOD = (Cadencia * WC) / 60
    const requiredPersonnel = (targetCadence * wc) / 60;
    
    // Takt Time = (60 / Cadencia) * 60 = 3600 / Cadencia (Seg/und)
    const taktTime = 3600 / targetCadence;

    // delta personal
    const personnelDelta = requiredPersonnel - currentPersonnel;

    // produccion
    const dailyOutput = targetCadence * (availableMinutes / 60);
    const monthlyOutput = dailyOutput * shiftConfig.workingDaysPerMonth;

    return {
      requiredPersonnel,
      taktTime,
      newWorkContent: wc,
      personnelDelta,
      dailyOutput,
      monthlyOutput
    };
  }, [selectedModel, targetCadence, currentPersonnel, availableMinutes, shiftConfig]);

  const chartData = useMemo(() => {
    if (!simulation) return [];
    return [
      {
        name: 'Actual',
        Personal: currentPersonnel,
        Cadencia: (currentPersonnel * 60) / (selectedModel?.workContent || 1) // calculo inverso para visual
      },
      {
        name: 'Simulado',
        Personal: simulation.requiredPersonnel,
        Cadencia: targetCadence
      }
    ];
  }, [simulation, currentPersonnel, targetCadence, selectedModel]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Inputs */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm col-span-1 md:col-span-1">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <Calculator className="w-5 h-5 mr-2 text-auteco-red" />
            Parámetros
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Modelo a Evaluar</label>
              <select 
                className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-auteco-blue"
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
              >
                <option value="">-- Seleccionar Modelo --</option>
                {models.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.line})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Personal Actual en Línea</label>
              <input
                type="number"
                min="1"
                className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-auteco-blue"
                value={currentPersonnel}
                onChange={(e) => setCurrentPersonnel(parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="pt-4 border-t border-slate-100">
               <label className="block text-sm font-bold text-auteco-blue mb-1">Cadencia Objetivo (Motos/Hora)</label>
              <input
                type="number"
                min="1"
                className="w-full border border-auteco-blue rounded-md p-2 text-lg font-semibold text-slate-900 focus:ring-2 focus:ring-auteco-blue"
                value={targetCadence}
                onChange={(e) => setTargetCadence(parseFloat(e.target.value) || 0)}
              />
              {selectedModel && (
                <p className="text-xs text-slate-500 mt-1">
                  Cadencia Máxima Histórica: {selectedModel.maxCadence} M/h
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Rresultados */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          {simulation ? (
            <>
              {/* tarjetas  */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-center text-blue-800 mb-2">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="text-sm font-semibold">Personal Requerido</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {simulation.requiredPersonnel.toFixed(2)}
                  </div>
                  <div className={`text-xs font-medium mt-1 ${simulation.personnelDelta > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {simulation.personnelDelta > 0 ? '+' : ''}{simulation.personnelDelta.toFixed(2)} vs Actual
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="flex items-center text-green-800 mb-2">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm font-semibold">Takt Time</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {simulation.taktTime.toFixed(1)} <span className="text-sm font-normal text-slate-500">seg/und</span>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                   <div className="flex items-center text-purple-800 mb-2">
                    <Package className="w-4 h-4 mr-2" />
                    <span className="text-sm font-semibold">Prod. Diaria</span>
                  </div>
                   <div className="text-2xl font-bold text-slate-900">
                    {Math.floor(simulation.dailyOutput)} <span className="text-sm font-normal text-slate-500">unds</span>
                  </div>
                </div>
                 <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                   <div className="flex items-center text-orange-800 mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm font-semibold">Prod. Mensual</span>
                  </div>
                   <div className="text-2xl font-bold text-slate-900">
                    {Math.floor(simulation.monthlyOutput).toLocaleString()} <span className="text-sm font-normal text-slate-500">unds</span>
                  </div>
                </div>
              </div>

              {/* cuadrito */}
              <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                <h4 className="text-md font-semibold text-slate-700 mb-4">Comparativa de Escenarios</h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#003DA5" />
                      <YAxis yAxisId="right" orientation="right" stroke="#E31837" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        formatter={(value: number) => value.toFixed(2)}
                      />
                      <Bar yAxisId="left" dataKey="Personal" fill="#003DA5" name="Personal (Personas)" barSize={50} />
                      <Bar yAxisId="right" dataKey="Cadencia" fill="#E31837" name="Cadencia (M/h)" barSize={50} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* recomendacion */}
              <div className="bg-slate-50 p-4 rounded-md border border-slate-200 text-sm text-slate-700">
                <h5 className="font-bold text-slate-900 mb-2">Conclusiones:</h5>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Para alcanzar <strong>{targetCadence} M/h</strong> en el modelo <strong>{selectedModel?.name}</strong>, se requieren <strong>{Math.ceil(simulation.requiredPersonnel)}</strong> personas en línea.
                  </li>
                  <li>
                    El tiempo disponible por puesto (Takt Time) será de <strong>{simulation.taktTime.toFixed(1)} segundos</strong>.
                  </li>
                  {simulation.personnelDelta > 0 ? (
                    <li className="text-auteco-red font-medium">
                      Acción requerida: Contratar o reasignar {Math.ceil(simulation.personnelDelta)} operarios adicionales.
                    </li>
                  ) : (
                     <li className="text-green-600 font-medium">
                      Acción posible: El equipo actual está sobredimensionado por {Math.abs(Math.floor(simulation.personnelDelta))} personas para esta cadencia.
                    </li>
                  )}
                </ul>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-lg p-10">
              <Calculator className="w-12 h-12 mb-2 opacity-50" />
              <p>Seleccione un modelo y defina parámetros para ver la simulación.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
