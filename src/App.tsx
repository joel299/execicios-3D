/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { RoutineType, ExerciseDef, WorkoutSessionLog } from './types/workout';
import { 
  EXERCISE_DATABASE, 
  MORNING_ROUTINE_IDS, 
  NIGHT_ROUTINE_IDS 
} from './data/exercises';
import { WorkoutPlayer } from './components/WorkoutPlayer';
import { ExerciseLibrary } from './components/ExerciseLibrary';
import { HistoryView } from './components/HistoryView';
import { PainModal } from './components/PainModal';
import { RagdollViewport } from './three/RagdollViewport';
import { storageService } from './services/storage';
import { 
  Sun, 
  Moon, 
  Clock,
  ArrowRight
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'workout' | 'library' | 'history'>('home');
  const [activeRoutineType, setActiveRoutineType] = useState<RoutineType>('morning');
  const [activeExercises, setActiveExercises] = useState<ExerciseDef[]>([]);
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  const [showPainModal, setShowPainModal] = useState<boolean>(false);
  const [lastCompletedSession, setLastCompletedSession] = useState<{
    exerciseIds: string[];
    elapsedSeconds: number;
  } | null>(null);

  // Detecção de horário para sugerir o bloco da noite (próximo de 00:00 h)
  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 22 || currentHour < 5) {
      setIsNightMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleStartRoutine = (type: RoutineType) => {
    setActiveRoutineType(type);
    if (type === 'morning') {
      const exs = MORNING_ROUTINE_IDS.map(id => EXERCISE_DATABASE[id]).filter(Boolean);
      setActiveExercises(exs);
      setIsNightMode(false);
      document.documentElement.classList.remove('dark');
    } else if (type === 'night') {
      const exs = NIGHT_ROUTINE_IDS.map(id => EXERCISE_DATABASE[id]).filter(Boolean);
      setActiveExercises(exs);
      setIsNightMode(true);
      document.documentElement.classList.add('dark');
    }
    setCurrentView('workout');
  };

  const handleStartSingleExercise = (exercise: ExerciseDef) => {
    setActiveRoutineType('free');
    setActiveExercises([exercise]);
    setCurrentView('workout');
  };

  const handleFinishWorkout = (completedIds: string[], elapsedSecs: number) => {
    setLastCompletedSession({
      exerciseIds: completedIds,
      elapsedSeconds: elapsedSecs,
    });
    setShowPainModal(true);
  };

  const handlePainModalSaved = () => {
    setShowPainModal(false);
    setLastCompletedSession(null);
    setCurrentView('history');
  };

  const toggleTheme = () => {
    setIsNightMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  return (
    <div className={`min-h-screen flex flex-col ${isNightMode ? 'bg-[#0c0d10] text-slate-100' : 'bg-slate-950 text-slate-100'} transition-colors duration-300`}>
      {/* Top Bar Contract de Uma Linha: 3 Zonas Estritas */}
      <header className="h-14 border-b border-slate-800 px-4 md:px-8 flex items-center justify-between gap-8 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 shrink-0">
        {/* Zona 1: Brand Wordmark Sem Badges Sujos */}
        <div 
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
        >
          <span className="text-base font-bold tracking-tight text-slate-100">FisioLocal 3D</span>
        </div>

        {/* Zona 2: Links de Navegação em Texto Puro */}
        <nav className="flex items-center gap-6 text-xs font-mono">
          <button
            onClick={() => setCurrentView('home')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'home' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Rotinas
          </button>
          <button
            onClick={() => setCurrentView('library')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'library' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Exercícios
          </button>
          <button
            onClick={() => setCurrentView('history')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'history' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Histórico
          </button>
        </nav>

        {/* Zona 3: Ação / Modo Noite */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleTheme}
            className={`px-3 py-1.5 text-xs font-mono border flex items-center gap-1.5 transition-colors ${
              isNightMode 
                ? 'bg-amber-950/40 border-amber-800/80 text-amber-300' 
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Alternar entre paleta matutina e paleta noturna (proteção de sono)"
          >
            {isNightMode ? <Moon className="w-3.5 h-3.5 text-amber-400" /> : <Sun className="w-3.5 h-3.5 text-sky-400" />}
            <span className="hidden sm:inline">{isNightMode ? 'Modo Noite (00:00 h)' : 'Modo Dia'}</span>
          </button>
        </div>
      </header>

      {/* Roteamento de Visualização Principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {currentView === 'home' && (
          <div className="w-full flex-1 flex flex-col">
            {/* Seção Superior Hero: Biomecânica + Rotinas Primárias */}
            <div className="max-w-6xl w-full mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8 items-stretch flex-1">
              {/* Lado Esquerdo: Apresentação e Escolha dos Blocos de Treino */}
              <div className="flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-100 leading-tight">
                    Exercícios guiados com demonstração 3D
                  </h1>

                  <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                    Escolha uma rotina, acompanhe cada movimento e registre como se sentiu.
                  </p>
                </div>

                {/* Blocos de Treino Primários */}
                <div className="space-y-3">
                  {/* Bloco 1: Treino da Manhã (60 min) */}
                  <div 
                    onClick={() => handleStartRoutine('morning')}
                    className="p-5 bg-slate-900 border border-slate-800 hover:border-sky-500/80 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
                      <span className="text-sky-400 font-bold uppercase tracking-wider">Rotina da manhã</span>
                      <span className="flex items-center gap-1 text-slate-300">
                        <Clock className="w-3.5 h-3.5" /> 60 minutos
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
                      Mobilidade e fortalecimento
                    </h2>

                    <p className="text-xs text-slate-400 mt-1">
                      12 exercícios com instruções passo a passo e demonstração animada.
                    </p>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs font-mono">
                      <span className="text-slate-500">Acompanhe o ritmo guiado</span>
                      <span className="text-sky-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Iniciar Sessão <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  {/* Bloco 2: Treino da Noite (30 min / 00:00 h) */}
                  <div 
                    onClick={() => handleStartRoutine('night')}
                    className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500/80 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
                      <span className="text-amber-400 font-bold uppercase tracking-wider">Rotina da noite</span>
                      <span className="flex items-center gap-1 text-slate-300">
                        <Clock className="w-3.5 h-3.5" /> 30 minutos
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                      Movimentos leves para relaxar
                    </h2>

                    <p className="text-xs text-slate-400 mt-1">
                      5 exercícios com instruções e demonstrações animadas.
                    </p>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs font-mono">
                      <span className="text-slate-500">Rotina leve · ritmo guiado</span>
                      <span className="text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Iniciar Sessão Noturna <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-500">
                  As demonstrações são ilustrativas. Siga as orientações do profissional de saúde que acompanha você.
                </p>
              </div>

              {/* Lado Direito: Visualizador 3D Interativo do Exercício Piloto */}
              <div className="flex-1 flex flex-col h-[420px] lg:h-auto border border-slate-800 bg-slate-900 overflow-hidden">
                <div className="p-3 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">
                    Demonstração do exercício
                  </span>
                  <span className="text-xs font-mono text-sky-400 font-semibold">
                    Box Squat com Controle Articular
                  </span>
                </div>

                <div className="flex-1 relative">
                  <RagdollViewport
                    exercise={EXERCISE_DATABASE['box_squat_cadeira']}
                    isNightMode={isNightMode}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'workout' && (
          <WorkoutPlayer
            routineType={activeRoutineType}
            exercises={activeExercises}
            onFinishWorkout={handleFinishWorkout}
            onExit={() => setCurrentView('home')}
            isNightMode={isNightMode}
          />
        )}

        {currentView === 'library' && (
          <ExerciseLibrary
            onSelectForWorkout={handleStartSingleExercise}
            onStartMorningRoutine={() => handleStartRoutine('morning')}
            onStartNightRoutine={() => handleStartRoutine('night')}
            isNightMode={isNightMode}
          />
        )}

        {currentView === 'history' && (
          <HistoryView
            onBackToMenu={() => setCurrentView('home')}
            isNightMode={isNightMode}
          />
        )}
      </main>

      {/* Modal Clínico de Registro de Dor e Conclusão */}
      {showPainModal && lastCompletedSession && (
        <PainModal
          routineType={activeRoutineType}
          durationSeconds={lastCompletedSession.elapsedSeconds}
          completedExerciseIds={lastCompletedSession.exerciseIds}
          onSaved={handlePainModalSaved}
          onDismiss={() => {
            setShowPainModal(false);
            setLastCompletedSession(null);
            setCurrentView('home');
          }}
        />
      )}
    </div>
  );
}
