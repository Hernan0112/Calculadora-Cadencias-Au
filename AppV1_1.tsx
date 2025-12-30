import React, { useState, useMemo } from 'react';
import { ShiftSettings } from './components/ShiftSettings';
import { CadenceSimulator } from './components/CadenceSimulator';
import { CapacityAnalysis } from './components/CapacityAnalysis';
import { SupportAreaCalculator } from './components/SupportAreaCalculator';
import { ShiftConfig, LineName } from './types';
import { MOTORCYCLE_DATABASE, DEFAULT_SHIFT_CONFIG } from './constants';
import { Activity, BarChart3, ArrowLeft, Construction, Users } from 'lucide-react';
import { Logo } from './components/Logo';

enum Tab {
  SIMULATOR = 'simulator',
  CAPACITY = 'capacity',
  SUPPORT = 'support'
}

interface AppV1_1Props {
  onBack: () => void;
}

const AppV1_1: React.FC<AppV1_1Props> = ({ onBack }) => {
  const [shiftConfig, setShiftConfig] = useState<ShiftConfig>(DEFAULT_SHIFT_CONFIG);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.SIMULATOR);
  const [selectedLineFilter, setSelectedLineFilter] = useState<LineName | 'ALL'>('ALL');

  // Calculate global available minutes once
  const availableMinutes = useMemo(() => {
    const start = shiftConfig.startTime.split(':').map(Number);
    const end = shiftConfig.endTime.split(':').map(Number);
    
    let totalMinutes = (end[0] * 60 + end[1]) - (start[0] * 60 + start[1]);
    if (totalMinutes < 0) totalMinutes += 24 * 60;

    const breakTime = shiftConfig.breaks.am + shiftConfig.breaks.lunch + shiftConfig.breaks.pm;
    return totalMinutes - breakTime;
  }, [shiftConfig]);

  const filteredModels = useMemo(() => {
    if (selectedLineFilter === 'ALL') return MOTORCYCLE_DATABASE;
    return MOTORCYCLE_DATABASE.filter(m => m.line === selectedLineFilter);
  }, [selectedLineFilter]);

  return (
    <div className="min-h-screen bg-slate-100 pb-12 border-t-4 border-amber-500">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <button 
                onClick={onBack}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                title="Volver al menú"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center">
                {/* Brand Logo */}
                <Logo className="h-10 w-auto mr-3" />
                <div className="h-6 w-px bg-slate-300 mx-2 hidden sm:block"></div>
                <h1 className="text-lg font-medium text-slate-600 hidden sm:block">
                  Calculadora Cadencias
                </h1>
              </div>
            </div>
            <div className="hidden sm:flex items-center text-sm text-slate-500">
              <span className="mr-2 flex items-center"><Construction className="w-4 h-4 mr-1 text-amber-500"/> Modo Desarrollo</span>
              <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                v1.1 (Beta)
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Global Settings Section */}
        {activeTab !== Tab.SUPPORT && (
           <ShiftSettings config={shiftConfig} onChange={setShiftConfig} />
        )}

        {/* Navigation Tabs */}
        <div className="mb-6 border-b border-slate-200 overflow-x-auto">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab(Tab.SIMULATOR)}
              className={`${
                activeTab === Tab.SIMULATOR
                  ? 'border-auteco-blue text-auteco-blue'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Activity className="w-4 h-4 mr-2" />
              Simulador de Cadencias
            </button>
            <button
              onClick={() => setActiveTab(Tab.CAPACITY)}
              className={`${
                activeTab === Tab.CAPACITY
                  ? 'border-auteco-blue text-auteco-blue'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Análisis de Capacidad
            </button>
            <button
              onClick={() => setActiveTab(Tab.SUPPORT)}
              className={`${
                activeTab === Tab.SUPPORT
                  ? 'border-auteco-blue text-auteco-blue'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Users className="w-4 h-4 mr-2" />
              Calculo otras areas
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="transition-all duration-300 ease-in-out">
          {activeTab === Tab.SIMULATOR && (
            <div>
              <div className="flex justify-end mb-4">
                 <select 
                  className="bg-white border border-slate-300 text-sm rounded-md p-2 focus:ring-2 focus:ring-auteco-blue"
                  value={selectedLineFilter}
                  onChange={(e) => setSelectedLineFilter(e.target.value as LineName | 'ALL')}
                 >
                   <option value="ALL">Todas las Líneas</option>
                   <option value={LineName.L1}>{LineName.L1}</option>
                   <option value={LineName.L2}>{LineName.L2}</option>
                 </select>
              </div>
              <CadenceSimulator 
                models={filteredModels} 
                shiftConfig={shiftConfig} 
                availableMinutes={availableMinutes}
              />
            </div>
          )}

          {activeTab === Tab.CAPACITY && (
            <CapacityAnalysis 
              models={MOTORCYCLE_DATABASE} 
              shiftConfig={shiftConfig}
              availableMinutes={availableMinutes}
            />
          )}

          {activeTab === Tab.SUPPORT && (
            <SupportAreaCalculator />
          )}
        </div>
      </main>
      
      <footer className="max-w-7xl mx-auto px-4 text-center py-6 text-slate-400 text-sm">
        <p>© 2025 Auteco. Creador: Hernán Ortiz Romani.</p>
      </footer>
    </div>
  );
};

export default AppV1_1;