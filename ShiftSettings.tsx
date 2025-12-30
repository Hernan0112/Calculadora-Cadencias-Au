import React, { useMemo } from 'react';
import { ShiftConfig } from '../types';
import { Clock, Coffee, Calendar } from 'lucide-react';

interface ShiftSettingsProps {
  config: ShiftConfig;
  onChange: (newConfig: ShiftConfig) => void;
}

export const ShiftSettings: React.FC<ShiftSettingsProps> = ({ config, onChange }) => {
  
  const calculateAvailableTime = useMemo(() => {
    const start = config.startTime.split(':').map(Number);
    const end = config.endTime.split(':').map(Number);
    
    let totalMinutes = (end[0] * 60 + end[1]) - (start[0] * 60 + start[1]);
    if (totalMinutes < 0) totalMinutes += 24 * 60; // Maneja turnos nocturnos si es necesario

    const breakTime = config.breaks.am + config.breaks.lunch + config.breaks.pm;
    return totalMinutes - breakTime;
  }, [config]);

  const handleChange = (field: keyof ShiftConfig, value: string | number) => {
    onChange({ ...config, [field]: value });
  };

  const handleBreakChange = (field: keyof ShiftConfig['breaks'], value: number) => {
    onChange({
      ...config,
      breaks: { ...config.breaks, [field]: value }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
      <h2 className="text-xl font-bold text-slate-800 flex items-center mb-4 border-b pb-2">
        <Clock className="w-5 h-5 mr-2 text-auteco-blue" />
        Configuración de Turno
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Rango de tiempo */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-600">Horario de Trabajo</label>
          <div className="flex gap-2 items-center">
            <input
              type="time"
              value={config.startTime}
              onChange={(e) => handleChange('startTime', e.target.value)}
              className="border border-slate-300 rounded px-2 py-1 w-full focus:ring-2 focus:ring-auteco-blue outline-none"
            />
            <span className="text-slate-400">a</span>
            <input
              type="time"
              value={config.endTime}
              onChange={(e) => handleChange('endTime', e.target.value)}
              className="border border-slate-300 rounded px-2 py-1 w-full focus:ring-2 focus:ring-auteco-blue outline-none"
            />
          </div>
        </div>

        {/* descansos */}
        <div className="space-y-3 col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-slate-600 flex items-center">
            <Coffee className="w-4 h-4 mr-1" /> Tiempos de Parada (minutos)
          </label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="text-xs text-slate-500 block">Merienda AM</span>
              <input
                type="number"
                min="0"
                value={config.breaks.am}
                onChange={(e) => handleBreakChange('am', parseInt(e.target.value) || 0)}
                className="border border-slate-300 rounded px-2 py-1 w-full focus:ring-2 focus:ring-auteco-blue outline-none"
              />
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Almuerzo</span>
              <input
                type="number"
                min="0"
                value={config.breaks.lunch}
                onChange={(e) => handleBreakChange('lunch', parseInt(e.target.value) || 0)}
                className="border border-slate-300 rounded px-2 py-1 w-full focus:ring-2 focus:ring-auteco-blue outline-none"
              />
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Merienda PM</span>
              <input
                type="number"
                min="0"
                value={config.breaks.pm}
                onChange={(e) => handleBreakChange('pm', parseInt(e.target.value) || 0)}
                className="border border-slate-300 rounded px-2 py-1 w-full focus:ring-2 focus:ring-auteco-blue outline-none"
              />
            </div>
          </div>
        </div>

        {/* dias laborables */}
         <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-600 flex items-center">
            <Calendar className="w-4 h-4 mr-1" /> Días Laborales / Mes
          </label>
           <input
              type="number"
              min="1"
              max="31"
              value={config.workingDaysPerMonth}
              onChange={(e) => handleChange('workingDaysPerMonth', parseInt(e.target.value) || 24)}
              className="border border-slate-300 rounded px-2 py-1 w-full focus:ring-2 focus:ring-auteco-blue outline-none"
            />
        </div>
      </div>

      {/* resumen */}
      <div className="mt-4 bg-blue-50 text-blue-800 p-3 rounded-md text-sm font-medium flex justify-between">
        <span>Tiempo Disponible Diario: {calculateAvailableTime} minutos</span>
        <span>Tiempo Efectivo: {(calculateAvailableTime / 60).toFixed(1)} horas</span>
      </div>
    </div>
  );
};
