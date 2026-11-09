/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RoutineType, WorkoutSessionLog } from '../types/workout';
import { storageService } from '../services/storage';
import { CheckCircle, AlertCircle, FileText, Check } from 'lucide-react';

interface PainModalProps {
  routineType: RoutineType;
  durationSeconds: number;
  completedExerciseIds: string[];
  onSaved: (session: WorkoutSessionLog) => void;
  onDismiss: () => void;
}

export const PainModal: React.FC<PainModalProps> = ({
  routineType,
  durationSeconds,
  completedExerciseIds,
  onSaved,
  onDismiss,
}) => {
  const [painScore, setPainScore] = useState<number>(1);
  const [implantDiscomfort, setImplantDiscomfort] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('Executado sem dor no trajeto da haste/parafusos. Amplitude normal.');

  const getPainLevelDescription = (score: number) => {
    if (score === 0) return '0 · Ausência Completa de Dor (Conforto pleno)';
    if (score <= 3) return `${score} · Desconforto Leve / Queimação Muscular Terapêutica (Seguro)`;
    if (score <= 6) return `${score} · Dor Moderada / Atenção à Amplitude (Recomenda-se reduzir carga)`;
    return `${score} · Dor Aguda / Sobrecarga Mecânica (Interromper ou rever exercício)`;
  };

  const handleSave = () => {
    const session = storageService.saveSession({
      routineType,
      durationCompletedSeconds: durationSeconds,
      painScore,
      implantDiscomfort,
      notes,
      exercisesCompleted: completedExerciseIds,
    });
    onSaved(session);
  };

  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 p-6 space-y-6 shadow-2xl">
        <div className="border-b border-slate-800 pb-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400 block mb-1">
            Registro Clínico Pós-Treino
          </span>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            Conclusão da Sessão & Diário de Sintomas
          </h2>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-1">
            <span>Duração: {minutes}m {seconds}s</span>
            <span>·</span>
            <span>Exercícios Concluídos: {completedExerciseIds.length}</span>
          </div>
        </div>

        {/* Escala Visual Analógica (EVA 0 a 10) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-semibold">Escala EVA de Dor Articular:</span>
            <span className={`font-bold ${painScore <= 3 ? 'text-emerald-400' : painScore <= 6 ? 'text-amber-400' : 'text-rose-400'}`}>
              {painScore} / 10
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={painScore}
            onChange={(e) => setPainScore(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-800 appearance-none cursor-pointer accent-sky-400 focus:outline-none"
          />

          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>0 Sem Dor</span>
            <span>3 Queimação Muscular</span>
            <span>6 Dor Moderada</span>
            <span>10 Máxima</span>
          </div>

          <div className="p-2.5 bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono">
            {getPainLevelDescription(painScore)}
          </div>
        </div>

        {/* Avaliação Específica do Implante e Pinos */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <span className="text-xs font-mono text-slate-300 font-semibold block">
            Interface Síntese Óssea / Pinos Metálicos:
          </span>
          <label className="flex items-start gap-3 p-3 bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={implantDiscomfort}
              onChange={(e) => setImplantDiscomfort(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded-none bg-slate-900 border-slate-700 accent-sky-500"
            />
            <div className="text-xs">
              <span className="text-slate-200 font-medium block">
                Senti pontada ou incômodo no trajeto dos pinos/parafusos
              </span>
              <span className="text-slate-500 text-[11px] block mt-0.5">
                Marque se a dor foi localizada especificamente sobre o metal ou osso operado.
              </span>
            </div>
          </label>
        </div>

        {/* Anotações Clínicas */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800">
          <label className="text-xs font-mono text-slate-300 font-semibold block">
            Observações Clínicas (Salvas Localmente):
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full bg-slate-950 border border-slate-800 p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-sky-500 resize-none"
            placeholder="Ex.: Realizado sem dor. Boa amplitude no agachamento..."
          />
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onDismiss}
            className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
          >
            Descartar
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Salvar no Histórico Local</span>
          </button>
        </div>
      </div>
    </div>
  );
};
