import React, { useState, useMemo } from 'react';
import { Users, ArrowRight, TrendingUp, Calculator } from 'lucide-react';

export const SupportAreaCalculator: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [currentLineStaff, setCurrentLineStaff] = useState<number>(0);
  const [targetLineStaff, setTargetLineStaff] = useState<number>(0);
  const [currentAreaStaff, setCurrentAreaStaff] = useState<number>(0);

  const supportAreas = [
    "Desempaque",
    "Q Ajustes",
    "Q Proceso",
    "Abastecimiento",
    "Carguesa"
  ];

  const result = useMemo(() => {
    if (!currentLineStaff || !targetLineStaff || !currentAreaStaff) return null;

    // Logic: Proportional Scaling
    // If the main line grows by X%, the support area should ideally grow by X% to maintain service level.
    const growthFactor = targetLineStaff / currentLineStaff;
    const requiredAreaStaffExact = currentAreaStaff * growthFactor;
    const requiredAreaStaff = Math.ceil(requiredAreaStaffExact); // Always round up to ensure coverage
    const delta = requiredAreaStaff - currentAreaStaff;

    return {
      factor: growthFactor,
      required: requiredAreaStaff,
      exact: requiredAreaStaffExact,
      delta: delta
    };
  }, [currentLineStaff, targetLineStaff, currentAreaStaff]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center mb-6 pb-4 border-b border-slate-100">
          <Users className="w-6 h-6 text-auteco-blue mr-2" />
          <div>
            <h2 className="text-xl font-bold text-slate-800">Dimensionamiento de Áreas de Soporte</h2>
            <p className="text-sm text-slate-500">
              Cálculo basado en la variación proporcional del personal de la Línea de Ensamble.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Área a Calcular</label>
              <select
                className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-auteco-blue"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
              >
                <option value="">-- Seleccionar Área --</option>
                {supportAreas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            <div className="bg-slate-50 p-4 rounded-md border border-slate-200 space-y-4">
              <h3 className="font-semibold text-slate-700 text-sm flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" /> Datos Línea de Ensamble
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Personal Actual (Línea)</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-auteco-blue"
                    value={currentLineStaff || ''}
                    placeholder="Ej. 40"
                    onChange={(e) => setCurrentLineStaff(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-auteco-blue font-bold mb-1">Personal Futuro (Línea)</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full border border-auteco-blue rounded-md p-2 focus:ring-2 focus:ring-auteco-blue bg-blue-50"
                    value={targetLineStaff || ''}
                    placeholder="Ej. 60"
                    onChange={(e) => setTargetLineStaff(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Personal Actual en {selectedArea || 'el Área'}
              </label>
              <input
                type="number"
                min="0"
                className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-auteco-blue"
                value={currentAreaStaff || ''}
                placeholder="Ej. 5"
                onChange={(e) => setCurrentAreaStaff(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Results */}
          <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 flex flex-col justify-center">
            {result ? (
              <div className="text-center space-y-6">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Factor de Crecimiento</span>
                  <div className="text-3xl font-light text-slate-600">
                    {(result.factor * 100).toFixed(0)}%
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    La línea crecerá {((result.factor - 1) * 100).toFixed(1)}%
                  </p>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                    Personal Requerido en {selectedArea}
                  </span>
                  <div className="flex items-center justify-center mt-2">
                    <div className="text-5xl font-extrabold text-auteco-blue">
                      {result.required}
                    </div>
                    <span className="ml-2 text-lg text-slate-500">Personas</span>
                  </div>
                  <div className={`mt-2 text-sm font-bold ${result.delta > 0 ? 'text-auteco-red' : 'text-green-600'}`}>
                    {result.delta > 0 ? `+${result.delta} Adicionales` : 'Sin cambios necesarios'}
                  </div>
                </div>

                <div className="bg-yellow-50 p-3 rounded text-left text-xs text-yellow-800 border border-yellow-100 flex items-start">
                   <Calculator className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                   <p>
                     Cálculo matemático exacto: <strong>{result.exact.toFixed(2)}</strong> personas. 
                     Se redondea al entero superior para asegurar la capacidad operativa del área de soporte.
                   </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 h-full opacity-60">
                <Calculator className="w-16 h-16 mb-4" />
                <p className="text-center">Ingrese los datos de la línea y del área para calcular.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
