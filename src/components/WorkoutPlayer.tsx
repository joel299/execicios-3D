/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { EXERCISE_CATEGORY_LABELS, ExerciseDef, MUSCLE_GROUP_LABELS, RoutineType } from '../types/workout';
import { ExerciseReferenceVideo } from './ExerciseReferenceVideo';
import { RagdollViewport } from '../three/RagdollViewport';
import { soundSynthesizer } from '../services/soundSynthesizer';
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  CheckCircle2, 
  AlertTriangle,
  Activity,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Timer,
  Clock
} from 'lucide-react';

interface WorkoutPlayerProps {
  routineType: RoutineType;
  exercises: ExerciseDef[];
  onFinishWorkout: (completedExerciseIds: string[], elapsedSeconds: number) => void;
  onExit: () => void;
  isNightMode?: boolean;
}

export const WorkoutPlayer: React.FC<WorkoutPlayerProps> = ({
  routineType,
  exercises,
  onFinishWorkout,
  onExit,
  isNightMode = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentSet, setCurrentSet] = useState<number>(1);
  const [isResting, setIsResting] = useState<boolean>(false);
  const [restSecondsRemaining, setRestSecondsRemaining] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [totalElapsedSeconds, setTotalElapsedSeconds] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(soundSynthesizer.getMuted());
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(soundSynthesizer.getVibrationEnabled());
  const [activeTab, setActiveTab] = useState<'passos' | 'seguranca' | 'musculos'>('passos');
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>([]);

  // Cadência ativa do ciclo de repetição (3s descendo, 1s sustentando, 2s subindo)
  const [cadencePhase, setCadencePhase] = useState<'descendo' | 'isometria' | 'subindo'>('descendo');
  const [cadenceSecond, setCadenceSecond] = useState<number>(1);

  const currentExercise = exercises[currentIndex] || exercises[0];

  // Cronômetro total de treino
  useEffect(() => {
    const timer = setInterval(() => {
      setTotalElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Loop de cadência sonora e marcação de tempo
  useEffect(() => {
    if (isResting || !isTimerRunning) return;

    let secondCounter = 0;
    const interval = setInterval(() => {
      secondCounter++;
      
      const eccentric = currentExercise.cadence.eccentric || 3;
      const isometric = currentExercise.cadence.isometric || 1;
      const concentric = currentExercise.cadence.concentric || 2;
      const totalCycle = eccentric + isometric + concentric;

      const currentCycleSecond = (secondCounter % totalCycle) || totalCycle;

      if (currentCycleSecond <= eccentric) {
        setCadencePhase('descendo');
        setCadenceSecond(currentCycleSecond);
        soundSynthesizer.playTick(600, 0.03);
      } else if (currentCycleSecond <= eccentric + isometric) {
        setCadencePhase('isometria');
        setCadenceSecond(currentCycleSecond - eccentric);
        soundSynthesizer.startHoldTone();
      } else {
        setCadencePhase('subindo');
        setCadenceSecond(currentCycleSecond - eccentric - isometric);
        soundSynthesizer.stopHoldTone();
        soundSynthesizer.playTick(850, 0.04);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      soundSynthesizer.stopHoldTone();
    };
  }, [currentIndex, currentSet, isResting, isTimerRunning, currentExercise]);

  // Contagem regressiva de descanso
  useEffect(() => {
    if (!isResting) return;

    if (restSecondsRemaining <= 0) {
      setIsResting(false);
      soundSynthesizer.playCompletionChime();
      return;
    }

    if (restSecondsRemaining <= 3) {
      soundSynthesizer.playCountdownWarning();
    }

    const timer = setTimeout(() => {
      setRestSecondsRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isResting, restSecondsRemaining]);

  const handleCompleteSet = () => {
    soundSynthesizer.stopHoldTone();
    soundSynthesizer.playCompletionChime();

    const totalSets = currentExercise.volume.sets;
    if (currentSet < totalSets) {
      setCurrentSet((prev) => prev + 1);
      setIsResting(true);
      setRestSecondsRemaining(currentExercise.volume.restSeconds);
    } else {
      // Concluiu todas as séries do exercício
      if (!completedExerciseIds.includes(currentExercise.id)) {
        setCompletedExerciseIds((prev) => [...prev, currentExercise.id]);
      }

      if (currentIndex < exercises.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setCurrentSet(1);
        setIsResting(true);
        setRestSecondsRemaining(currentExercise.volume.restSeconds);
      } else {
        // Treino Completo!
        onFinishWorkout([...completedExerciseIds, currentExercise.id], totalElapsedSeconds);
      }
    }
  };

  const handleNextExercise = () => {
    soundSynthesizer.stopHoldTone();
    if (!completedExerciseIds.includes(currentExercise.id)) {
      setCompletedExerciseIds((prev) => [...prev, currentExercise.id]);
    }
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setCurrentSet(1);
      setIsResting(false);
    } else {
      onFinishWorkout([...completedExerciseIds, currentExercise.id], totalElapsedSeconds);
    }
  };

  const handlePrevExercise = () => {
    soundSynthesizer.stopHoldTone();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setCurrentSet(1);
      setIsResting(false);
    }
  };

  const toggleSound = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    soundSynthesizer.setMuted(newState);
  };

  const toggleVibration = () => {
    const newState = !vibrationEnabled;
    setVibrationEnabled(newState);
    soundSynthesizer.setVibrationEnabled(newState);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`w-full h-screen flex flex-col ${isNightMode ? 'bg-[#0c0d10] text-slate-100' : 'bg-slate-950 text-slate-100'} select-none`}>
      {/* Top Bar de Sessão Clínica */}
      <header className="h-14 border-b border-slate-800 px-4 md:px-6 flex items-center justify-between shrink-0 bg-slate-900/90 backdrop-blur-sm z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={onExit}
            className="text-xs font-mono text-slate-400 hover:text-slate-100 flex items-center gap-1.5 transition-colors px-2 py-1 border border-slate-800 bg-slate-950"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Menu</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Rotina:</span>
            <span className="font-semibold text-slate-100 uppercase tracking-wide">
              {routineType === 'morning' ? 'Manhã (60 min)' : routineType === 'night' ? 'Noite (30 min)' : 'Livre'}
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-sky-400">
              Exercício {currentIndex + 1} de {exercises.length}
            </span>
          </div>
        </div>

        {/* Cronômetro Geral e Ações Rápidas */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs font-mono bg-slate-950 px-3 py-1 border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-300">Tempo de Treino:</span>
            <span className="font-bold text-sky-400 tabular-nums">{formatTime(totalElapsedSeconds)}</span>
          </div>

          <div className="flex items-center border border-slate-800 bg-slate-950 p-0.5">
            <button
              onClick={toggleSound}
              className={`p-1.5 transition-colors ${!isMuted ? 'text-sky-400' : 'text-slate-500 hover:text-slate-300'}`}
              title={isMuted ? 'Ativar áudio' : 'Mutar áudio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleVibration}
              className={`p-1.5 transition-colors ${vibrationEnabled ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
              title="Vibração tátil"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => onFinishWorkout([...completedExerciseIds, currentExercise.id], totalElapsedSeconds)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700 transition-colors"
          >
            Encerrar Treino
          </button>
        </div>
      </header>

      {/* Conteúdo Central Dividido: Viewport 3D + Painel Clínico Lateral */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Lado Esquerdo: Simulador Biomecânico Three.js */}
        <div className="flex-[1.4] min-w-0 min-h-0 flex flex-col xl:flex-row overflow-y-auto xl:overflow-hidden">
          <div className="flex-1 min-w-0 h-[55vh] min-h-[360px] xl:h-full xl:min-h-0">
            <RagdollViewport
              exercise={currentExercise}
              isNightMode={isNightMode}
            />
          </div>
          <div className="w-full h-[360px] min-h-[300px] xl:w-[360px] 2xl:w-[420px] xl:h-full xl:shrink-0 border-t xl:border-t-0 xl:border-l border-slate-800 overflow-y-auto">
            <ExerciseReferenceVideo exercise={currentExercise} />
          </div>
        </div>

        {/* Lado Direito: Painel de Controle de Séries, Cadência e Instruções */}
        <div className="w-full lg:w-[440px] flex flex-col bg-slate-900 shrink-0 border-t lg:border-t-0 border-slate-800 overflow-y-auto">
          {/* Cabeçalho do Exercício Ativo */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/40">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span>Tipo: {EXERCISE_CATEGORY_LABELS[currentExercise.category]}</span>
              <span>{currentExercise.primaryJoint}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-100 tracking-tight">
              {currentExercise.name}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {currentExercise.subtitle}
            </p>
          </div>

          {/* Monitor de Séries e Cadência Sonora */}
          <div className="p-4 border-b border-slate-800 bg-slate-900/60">
            {isResting ? (
              /* Tela de Descanso Entre Séries */
              <div className="p-4 bg-slate-950 border border-slate-800 flex flex-col items-center text-center">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block mb-1">
                  Pausa para descansar
                </span>
                <span className="text-4xl font-bold font-mono text-amber-400 tabular-nums">
                  {restSecondsRemaining}s
                </span>
                <p className="text-xs text-slate-400 mt-1">
                  Descanse a perna e respire de forma ritmada.
                </p>
                <button
                  onClick={() => setIsResting(false)}
                  className="mt-3 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700 transition-colors"
                >
                  Pular Descanso e Iniciar Série {currentSet}
                </button>
              </div>
            ) : (
              /* Monitor de Execução Ativa */
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-slate-950 p-2.5 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      Série Atual
                    </span>
                    <span className="text-2xl font-bold font-mono text-slate-100 tabular-nums">
                      {currentSet} <span className="text-xs text-slate-500 font-normal">/ {currentExercise.volume.sets}</span>
                    </span>
                  </div>

                  <div className="bg-slate-950 p-2.5 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      Nesta série
                    </span>
                    <span className="text-xl font-bold font-mono text-sky-400 tabular-nums">
                      {currentExercise.volume.reps ? `${currentExercise.volume.reps} repetições` : `${currentExercise.volume.durationSeconds || currentExercise.volume.holdSeconds}s`}
                    </span>
                  </div>
                </div>

                {/* Marcador Visual de Cadência 3-1-2 */}
                <div className="bg-slate-950 p-3 border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-slate-400">Ritmo 3-1-2:</span>
                    <span className="font-semibold uppercase tracking-wider text-sky-300">
                      {cadencePhase === 'descendo' && `Desça (${cadenceSecond}s / 3s)`}
                      {cadencePhase === 'isometria' && `Segure (${cadenceSecond}s / 1s)`}
                      {cadencePhase === 'subindo' && `Suba (${cadenceSecond}s / 2s)`}
                    </span>
                  </div>

                  {/* Barra segmentada */}
                  <div className="grid grid-cols-3 gap-1 h-2">
                    <div className={`transition-all ${cadencePhase === 'descendo' ? 'bg-sky-400' : 'bg-slate-800'}`} />
                    <div className={`transition-all ${cadencePhase === 'isometria' ? 'bg-amber-400' : 'bg-slate-800'}`} />
                    <div className={`transition-all ${cadencePhase === 'subindo' ? 'bg-emerald-400' : 'bg-slate-800'}`} />
                  </div>
                </div>

                {/* Botão de Conclusão da Série */}
                <button
                  onClick={handleCompleteSet}
                  className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Concluir Série {currentSet}</span>
                </button>
              </div>
            )}
          </div>

          {/* Abas Técnicas de Instrução e Segurança */}
          <div className="flex border-b border-slate-800 bg-slate-950 text-xs font-mono">
            <button
              onClick={() => setActiveTab('passos')}
              className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
                activeTab === 'passos' ? 'border-sky-400 text-sky-400 bg-slate-900/60 font-semibold' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Passo a Passo
            </button>
            <button
              onClick={() => setActiveTab('seguranca')}
              className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
                activeTab === 'seguranca' ? 'border-amber-400 text-amber-400 bg-slate-900/60 font-semibold' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Pinos & Segurança
            </button>
            <button
              onClick={() => setActiveTab('musculos')}
              className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
                activeTab === 'musculos' ? 'border-emerald-400 text-emerald-400 bg-slate-900/60 font-semibold' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Músculos Alvo
            </button>
          </div>

          {/* Conteúdo da Aba */}
          <div className="p-4 flex-1 text-xs text-slate-300 leading-relaxed overflow-y-auto">
            {activeTab === 'passos' && (
              <div className="space-y-3">
                <ol className="list-decimal list-inside space-y-2.5">
                  {currentExercise.description.map((step, idx) => (
                    <li key={idx} className="pl-1">
                      <span className="text-slate-200">{step}</span>
                    </li>
                  ))}
                </ol>

                <div className="mt-4 pt-3 border-t border-slate-800">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                    Dicas para fazer o exercício:
                  </span>
                  <ul className="space-y-1.5 list-disc list-inside text-slate-400">
                    {currentExercise.safetyTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'seguranca' && (
              <div className="space-y-3">
                <div className="bg-amber-950/30 border border-amber-800/50 p-3">
                  <div className="flex items-center gap-2 text-amber-400 font-mono text-[11px] uppercase tracking-wider mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Orientações</span>
                  </div>
                  <p className="text-amber-200/90 leading-relaxed">
                    As demonstrações são ilustrativas e não avaliam sua condição. Siga as orientações do profissional de saúde que acompanha você.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 space-y-2 text-slate-400">
                  <span className="font-semibold text-slate-200 block">Como usar esta demonstração</span>
                  <p>Use as instruções como referência visual. Se sentir desconforto, pare e consulte seu profissional de saúde.</p>
                </div>
              </div>
            )}

            {activeTab === 'musculos' && (
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2">
                    Músculos que você vai usar:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentExercise.targetMuscles.map((m) => (
                      <span key={m} className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-sky-300 font-mono text-xs">
                        {MUSCLE_GROUP_LABELS[m]}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 text-slate-400 space-y-1.5">
                  <p>
                    <span className="text-slate-200 font-semibold">Parte trabalhada:</span> {currentExercise.primaryJoint}
                  </p>
                  <p>
                    <span className="text-slate-200 font-semibold">Movimento:</span> {currentExercise.targetAngleRange}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Navegação Rápida entre Exercícios no Rodapé Lateral */}
          <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
            <button
              onClick={handlePrevExercise}
              disabled={currentIndex === 0}
              className="px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 border border-slate-800"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </button>

            <span className="text-xs font-mono text-slate-500">
              {currentIndex + 1} / {exercises.length}
            </span>

            <button
              onClick={handleNextExercise}
              className="px-3 py-1.5 text-xs font-mono text-slate-200 hover:text-white flex items-center gap-1 border border-slate-700 bg-slate-800"
            >
              <span>{currentIndex === exercises.length - 1 ? 'Finalizar' : 'Próximo'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
