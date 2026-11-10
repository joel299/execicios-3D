/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ExerciseDef } from '../types/workout';

export const ExerciseReferenceVideo: React.FC<{ exercise: ExerciseDef }> = ({ exercise }) => {
  const { videoId, videoStartSeconds } = exercise;
  const startParam = videoStartSeconds ? `?start=${videoStartSeconds}` : '';

  return (
    <section className="h-full min-h-0 flex flex-col bg-slate-900">
      <header className="p-3 border-b border-slate-800">
        <p className="text-xs text-slate-400">Vídeo de referência</p>
        <h3 className="text-sm font-semibold text-slate-100 mt-1">{exercise.name}</h3>
      </header>

      {videoId ? (
        <>
          <div className="w-full aspect-video bg-black shrink-0">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}${startParam}`}
              title={`Vídeo de referência: ${exercise.name}`}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <a
            href={`https://www.youtube.com/watch?v=${videoId}${videoStartSeconds ? `&t=${videoStartSeconds}s` : ''}`}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 text-xs text-sky-300 hover:text-sky-200 underline underline-offset-2"
          >
            Abrir vídeo no YouTube
          </a>
        </>
      ) : (
        <div className="flex-1 min-h-[180px] grid place-items-center p-5 text-center text-sm text-slate-400">
          Ainda não há vídeo de referência para este exercício.
        </div>
      )}
    </section>
  );
};
