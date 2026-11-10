/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EXERCISE_DATABASE, MORNING_ROUTINE_IDS, NIGHT_ROUTINE_IDS } from '../data/exercises';
import { EXERCISE_CATEGORY_LABELS, ExerciseDef } from '../types/workout';
import { RagdollViewport } from '../three/RagdollViewport';
import { 
  Play, 
  Eye, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  Search, 
  Filter,
  ArrowRight
} from 'lucide-react';

interface ExerciseLibraryProps {
  onSelectForWorkout: (exercise: ExerciseDef) => void;
  onStartMorningRoutine: () => void;
  onStartNightRoutine: () => void;
  isNightMode?: boolean;
}

export const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({
  onSelectForWorkout,
  onStartMorningRoutine,
  onStartNightRoutine,
  isNightMode = false,
}) => {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('box_squat_cadeira');
  const [filterCategory, setFilterCategory] = useState<'all' | 'morning' | 'night' | 'fortalecimento'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allExercises = Object.values(EXERCISE_DATABASE);

  const filteredExercises = allExercises.filter((ex) => {
    if (filterCategory === 'morning' && !MORNING_ROUTINE_IDS.includes(ex.id)) return false;
    if (filterCategory === 'night' && !NIGHT_ROUTINE_IDS.includes(ex.id)) return false;
    if (filterCategory === 'fortalecimento' && ex.category !== 'fortalecimento' && ex.category !== 'isometria') return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = ex.name.toLowerCase().includes(q);
      const matchSubtitle = ex.subtitle.toLowerCase().includes(q);
      const matchMuscles = ex.targetMuscles.some(m => m.toLowerCase().includes(q));
      return matchName || matchSubtitle || matchMuscles;
    }

    return true;
  });

  const activeExercise = EXERCISE_DATABASE[selectedExerciseId] || allExercises[0];

  return (
    <div className="w-full h-[calc(100vh-3.5rem)] min-h-0 flex flex-col lg:flex-row overflow-hidden bg-slate-950 text-slate-100">
      {/* Coluna da Esquerda: Catálogo Técnico de Exercícios */}
      <div className="w-full h-[42vh] lg:h-full lg:w-[480px] min-h-0 flex flex-col border-r border-slate-800 bg-slate-900/60 shrink-0 overflow-hidden">
        {/* Barra de Filtros e Busca */}
        <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-950/80">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar exercício..."
              className="w-full bg-slate-900 border border-slate-800 pl-9 pr-3 py-2 text-xs text-slate-200 font-mono placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center gap-1 text-xs font-mono">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1.5 transition-colors border ${
                filterCategory === 'all'
                  ? 'bg-slate-800 text-sky-400 border-slate-700 font-bold'
                  : 'text-slate-400 border-slate-800/80 hover:text-slate-200'
              }`}
            >
              Todos ({allExercises.length})
            </button>
            <button
              onClick={() => setFilterCategory('morning')}
              className={`px-3 py-1.5 transition-colors border ${
                filterCategory === 'morning'
                  ? 'bg-slate-800 text-sky-400 border-slate-700 font-bold'
                  : 'text-slate-400 border-slate-800/80 hover:text-slate-200'
              }`}
            >
              Manhã ({MORNING_ROUTINE_IDS.length})
            </button>
            <button
              onClick={() => setFilterCategory('night')}
              className={`px-3 py-1.5 transition-colors border ${
                filterCategory === 'night'
                  ? 'bg-slate-800 text-sky-400 border-slate-700 font-bold'
                  : 'text-slate-400 border-slate-800/80 hover:text-slate-200'
              }`}
            >
              Noite ({NIGHT_ROUTINE_IDS.length})
            </button>
            <button
              onClick={() => setFilterCategory('fortalecimento')}
              className={`px-3 py-1.5 transition-colors border ${
                filterCategory === 'fortalecimento'
                  ? 'bg-slate-800 text-sky-400 border-slate-700 font-bold'
                  : 'text-slate-400 border-slate-800/80 hover:text-slate-200'
              }`}
            >
              Força & Tônus
            </button>
          </div>
        </div>

        {/* Lista de Exercícios com Scroll */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
          {filteredExercises.map((ex) => {
            const isSelected = ex.id === activeExercise.id;
            return (
              <div
                key={ex.id}
                onClick={() => setSelectedExerciseId(ex.id)}
                className={`p-4 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-slate-800/90 border-l-2 border-sky-400'
                    : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span className="uppercase tracking-wider">
                    {EXERCISE_CATEGORY_LABELS[ex.category]}
                  </span>
                  <span>
                    {ex.volume.sets} séries · {ex.volume.reps ? `${ex.volume.reps} repetições` : `${ex.volume.durationSeconds || ex.volume.holdSeconds}s`}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className={`text-sm font-semibold tracking-tight ${isSelected ? 'text-sky-300' : 'text-slate-200'}`}>
                      {ex.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {ex.subtitle}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-sky-400 translate-x-0.5' : 'text-slate-600'}`} />
                </div>

                <p className="mt-2 text-[11px] text-slate-500">{ex.volume.restSeconds}s de descanso entre séries</p>
              </div>
            );
          })}

          {filteredExercises.length === 0 && (
            <div className="p-8 text-center text-xs font-mono text-slate-500">
              Nenhum exercício encontrado com estes critérios.
            </div>
          )}
        </div>
      </div>

      {/* Coluna da Direita: Inspetor 3D em Tempo Real do Exercício Selecionado */}
      <div className="flex-1 min-h-0 flex flex-col h-full overflow-hidden bg-slate-950">
        {/* Cabeçalho do Inspetor com Ações Rápidas */}
        <div className="p-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
              <span>Demonstração</span>
              <span>·</span>
              <span className="text-sky-400 font-semibold">{activeExercise.primaryJoint}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-100">
              {activeExercise.name}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectForWorkout(activeExercise)}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Treinar Este Exercício</span>
            </button>
          </div>
        </div>

        {/* Viewport 3D do Exercício */}
        <div className="flex-1 min-h-0 relative">
          <RagdollViewport
            exercise={activeExercise}
            isNightMode={isNightMode}
          />
        </div>
      </div>
    </div>
  );
};
