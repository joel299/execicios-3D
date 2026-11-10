/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RoutineType = 'morning' | 'night' | 'free';

export type ExerciseCategory = 
  | 'aquecimento' 
  | 'fortalecimento' 
  | 'volta_calma' 
  | 'drenagem' 
  | 'isometria' 
  | 'alongamento';

export type MuscleGroup = 
  | 'quadriceps' 
  | 'isquiotibiais' 
  | 'gluteo_medio' 
  | 'gluteo_maximo' 
  | 'panturrilha' 
  | 'adutores' 
  | 'tornozelo_tibial' 
  | 'core_lombar';

export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  quadriceps: 'Frente da coxa',
  isquiotibiais: 'Parte de trás da coxa',
  gluteo_medio: 'Lado do quadril',
  gluteo_maximo: 'Glúteos',
  panturrilha: 'Panturrilha',
  adutores: 'Parte interna da coxa',
  tornozelo_tibial: 'Canela e tornozelo',
  core_lombar: 'Abdômen e lombar',
};

export const EXERCISE_CATEGORY_LABELS: Record<ExerciseCategory, string> = {
  aquecimento: 'Aquecimento',
  fortalecimento: 'Fortalecimento',
  volta_calma: 'Relaxamento',
  drenagem: 'Circulação',
  isometria: 'Manter a posição',
  alongamento: 'Alongamento',
};

export interface ExerciseCadence {
  eccentric: number; // segundos descendo
  isometric: number; // segundos sustentando
  concentric: number; // segundos subindo
  restBetweenReps?: number;
}

export interface ExerciseDef {
  id: string;
  name: string;
  subtitle: string;
  category: ExerciseCategory;
  targetMuscles: MuscleGroup[];
  primaryJoint: string;
  targetAngleRange: string;
  volume: {
    sets: number;
    reps?: number;
    durationSeconds?: number;
    holdSeconds?: number;
    restSeconds: number;
  };
  cadence: ExerciseCadence;
  description: string[];
  safetyTips: string[];
  cameraPreset: 'front' | 'side' | 'isometric' | 'top';
  propType: 'mat' | 'chair' | 'towel' | 'wall' | 'pillow' | 'none';
}

export interface WorkoutSessionLog {
  id: string;
  timestamp: number;
  routineType: RoutineType;
  durationCompletedSeconds: number;
  painScore: number; // EVA 0 a 10
  implantDiscomfort: boolean;
  notes: string;
  exercisesCompleted: string[];
}
