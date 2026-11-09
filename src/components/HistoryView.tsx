/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storage';
import { WorkoutSessionLog } from '../types/workout';
import { EXERCISE_DATABASE } from '../data/exercises';
import { 
  Calendar, 
  Clock, 
  Activity, 
  AlertCircle, 
  FileText, 
  CheckCircle,
  RotateCcw,
  Sun,
  Moon,
  Trash2
} from 'lucide-react';

interface HistoryViewProps {
  onBackToMenu: () => void;
  isNightMode?: boolean;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  onBackToMenu,
  isNightMode = false,
}) => {
  const [sessions, setSessions] = useState<WorkoutSessionLog[]>([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    averagePain: '0.0',
    recentSessions: [] as WorkoutSessionLog[],
  });

  const loadData = () => {
    const s = storageService.getSessions();
    setSessions(s);
    setStats(storageService.getStats());
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="w-full flex-1 flex flex-col p-4 md:p-8 max-w-5xl mx-auto overflow-y-auto">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400 block mb-1">
            Seus registros neste navegador
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">
            Histórico de treinos
          </h2>
        </div>

        <button
          onClick={onBackToMenu}
          className="px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-slate-100 border border-slate-800 bg-slate-900 transition-colors"
        >
          Voltar ao Treino
        </button>
      </div>

      {/* Cartões Estatísticos de Reabilitação (Técnicos, sem badges circulares) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
            Sessões Concluídas
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-slate-100 tabular-nums">
              {stats.totalSessions}
            </span>
            <span className="text-xs text-slate-500 font-mono">treinos</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
            Tempo Total em Exercício
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-sky-400 tabular-nums">
              {stats.totalMinutes}
            </span>
            <span className="text-xs text-slate-500 font-mono">minutos</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
            Média de dor informada
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-emerald-400 tabular-nums">
              {stats.averagePain}
            </span>
            <span className="text-xs text-slate-500 font-mono">/ 10</span>
          </div>
        </div>
      </div>

      {/* Tabela de Registros de Sessões */}
      <div className="space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
          Sessões anteriores
        </span>

        {sessions.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-slate-800 bg-slate-950/40">
            <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-mono text-slate-400">
              Nenhuma sessão registrada ainda.
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Inicie um treino matutino ou noturno para registrar sua adesão e sintomas.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800 border border-slate-800 bg-slate-900">
            {sessions.map((item) => {
              const minutes = Math.floor(item.durationCompletedSeconds / 60);
              const seconds = item.durationCompletedSeconds % 60;
              return (
                <div key={item.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="font-semibold text-slate-200">
                        {item.routineType === 'morning' ? 'Bloco da Manhã (60 min)' : item.routineType === 'night' ? 'Bloco da Noite (30 min)' : 'Treino Livre'}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400">{formatDate(item.timestamp)}</span>
                    </div>

                    <p className="text-xs text-slate-300">
                      {item.notes || 'Sem observações adicionais.'}
                    </p>

                    <div className="flex flex-wrap gap-2 text-[10px] font-mono text-slate-500 pt-1">
                      <span>Duração: {minutes}m {seconds}s</span>
                      <span>·</span>
                      <span>{item.exercisesCompleted.length} exercícios executados</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    {/* Indicador de Dor EVA */}
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                        Dor informada
                      </span>
                      <span className={`text-sm font-bold font-mono ${item.painScore <= 3 ? 'text-emerald-400' : item.painScore <= 6 ? 'text-amber-400' : 'text-rose-400'}`}>
                        {item.painScore} / 10
                      </span>
                    </div>

                    {/* Status do Implante */}
                    <div className="text-right border-l border-slate-800 pl-4">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                        Região operada
                      </span>
                      <span className={`text-xs font-mono ${item.implantDiscomfort ? 'text-amber-400 font-semibold' : 'text-slate-400'}`}>
                        {item.implantDiscomfort ? 'Incômodo Referido' : 'Sem Pontadas'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
