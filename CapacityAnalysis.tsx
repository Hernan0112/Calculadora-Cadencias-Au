import React, { useState, useMemo } from 'react';
import { MotorcycleModel, ShiftConfig, LineName } from '../types';
import { Star, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface CapacityAnalysisProps {
  models: MotorcycleModel[];
  shiftConfig: ShiftConfig;
  availableMinutes: number;
}

export const CapacityAnalysis: React.FC<CapacityAnalysisProps> = ({ models, shiftConfig, availableMinutes }) => {
  const [selectedLine, setSelectedLine] = useState<LineName>(LineName.L1);
  const [starModelId, setStarModelId] = useState<string>('');
  const [targetCadence, setTargetCadence] = useState<number>(0);

  const lineModels = useMemo(() => models.filter(m => m.line === selectedLine), [models, selectedLine]);
  const starModel = useMemo(() => models.find(m => m.id === starModelId), [models, starModelId]);

  const analysisData = useMemo(() => {
    if (!starModel || targetCadence <= 0) return [];

    // 1. calculo personal fijo según el modelo estrella
    // MOD = (Cadence * WC) / 60
    const fixedPersonnel = (targetCadence * starModel.workContent) / 60;

    // 2. Capacidad de proyecto para todos los demás modelos de la línea que utilizan ese personal fijo
    return lineModels.map(model => {
      // Cadence = (60 * MOD) / WC
      const projectedCadence = (60 * fixedPersonnel) / model.workContent;
      const monthlyOutput = projectedCadence * (availableMinutes / 60) * shiftConfig.workingDaysPerMonth;
      
      return {
        name: model.name,
        workContent: model.workContent,
        projectedCadence,
        monthlyOutput
      };
    });
  }, [starModel, targetCadence, lineModels, availableMinutes, shiftConfig]);

  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
            <label className="block text-sm font-bold text-indigo-900 mb-1">Línea de Producción</label>
            <div className="flex gap-4">
                <button 
                    onClick={() => setSelectedLine(LineName.L1)}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${selectedLine === LineName.L1 ? 'bg-auteco-blue text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                >
                    {LineName.L1}
                </button>
                 <button 
                    onClick={() => setSelectedLine(LineName.L2)}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${selectedLine === LineName.L2 ? 'bg-auteco-blue text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                >
                    {LineName.L2}
                </button>
            </div>
        </div>
        
        <div className="flex-1 w-full">
             <label className="block text-sm font-bold text-indigo-900 mb-1 flex items-center">
                 <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
                 Modelo Estrella (Referencia)
             </label>
              <select 
                className="w-full border border-indigo-200 rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
                value={starModelId}
                onChange={(e) => setStarModelId(e.target.value)}
              >
                <option value="">-- Seleccionar --</option>
                {lineModels.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
        </div>

        <div className="flex-1 w-full">
             <label className="block text-sm font-bold text-indigo-900 mb-1">Cadencia Objetivo (M/h)</label>
              <input
                type="number"
                min="1"
                className="w-full border border-indigo-200 rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
                value={targetCadence || ''}
                placeholder="Ej. 30"
                onChange={(e) => setTargetCadence(parseFloat(e.target.value))}
              />
        </div>
      </div>

      {analysisData.length > 0 && (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-auteco-blue" />
                        Proyección de Cadencias
                    </h3>
                    <p className="text-sm text-slate-500 mb-4">
                        Si configuramos el personal para hacer <strong>{targetCadence} M/h</strong> de <strong>{starModel?.name}</strong>, esta sería la velocidad para los demás:
                    </p>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analysisData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 11}} />
                                <Tooltip formatter={(val: number) => val.toFixed(1)} />
                                <Legend />
                                <Bar dataKey="projectedCadence" name="Cadencia Proyectada (M/h)" fill="#003DA5" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                 <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Tabla de Capacidad</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-slate-600">Modelo</th>
                                    <th className="px-4 py-3 text-right font-medium text-slate-600">Work Content</th>
                                    <th className="px-4 py-3 text-right font-medium text-slate-600">Cadencia (M/h)</th>
                                    <th className="px-4 py-3 text-right font-medium text-slate-600">Prod. Mensual</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {analysisData.map((row) => (
                                    <tr key={row.name} className={row.name === starModel?.name ? 'bg-yellow-50' : ''}>
                                        <td className="px-4 py-2 font-medium text-slate-900">
                                            {row.name}
                                            {row.name === starModel?.name && <Star className="inline w-3 h-3 ml-1 text-yellow-500 fill-yellow-500" />}
                                        </td>
                                        <td className="px-4 py-2 text-right text-slate-600">{row.workContent.toFixed(2)}</td>
                                        <td className="px-4 py-2 text-right font-bold text-auteco-blue">{row.projectedCadence.toFixed(1)}</td>
                                        <td className="px-4 py-2 text-right text-slate-900">{Math.floor(row.monthlyOutput).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
      )}
    </div>
  );
};
