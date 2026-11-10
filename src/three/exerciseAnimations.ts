/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RagdollNodes } from './ragdollModel';

export interface FrameEvaluation {
  primaryAngleDegrees: number;
  primaryJointLabel: string;
  phaseLabel: string;
  isContracting: boolean;
}

// Interpolação suave cúbica / hermite
function smoothstep(min: number, max: number, value: number): number {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

function supine(ragdoll: RagdollNodes, z = 0) {
  ragdoll.pelvis.position.set(0, 0.20, z);
  ragdoll.pelvis.rotation.x = -Math.PI / 2;
}

export function resetRagdollPose(ragdoll: RagdollNodes) {
  // Posição ereta padrão (em pé) do manequim clássico torneado
  ragdoll.pelvis.position.set(0, 0.98, 0);
  ragdoll.pelvis.rotation.set(0, 0, 0);

  ragdoll.spine.rotation.set(0, 0, 0);
  ragdoll.head.rotation.set(0, 0, 0);

  ragdoll.leftClavicle.rotation.set(0, 0, 0);
  ragdoll.leftUpperArm.rotation.set(0, 0, 0);
  ragdoll.leftElbow.rotation.set(0, 0, 0);

  ragdoll.rightClavicle.rotation.set(0, 0, 0);
  ragdoll.rightUpperArm.rotation.set(0, 0, 0);
  ragdoll.rightElbow.rotation.set(0, 0, 0);

  ragdoll.leftHip.rotation.set(0, 0, 0);
  ragdoll.leftKnee.rotation.set(0, 0, 0);
  ragdoll.leftAnkle.rotation.set(0, 0, 0);

  ragdoll.rightHip.rotation.set(0, 0, 0);
  ragdoll.rightKnee.rotation.set(0, 0, 0);
  ragdoll.rightAnkle.rotation.set(0, 0, 0);

  // Mantém cor de juntas de madeira clássica e bétula polida
  ragdoll.materials.jointWood.color.setHex(0xb5885c);
  ragdoll.materials.muscleHighlight.color.setHex(0x38bdf8);
}

export function animateExercisePose(
  exerciseId: string,
  progress: number, // 0.0 a 1.0 (ciclo de repetição)
  ragdoll: RagdollNodes
): FrameEvaluation {
  resetRagdollPose(ragdoll);

  const t = Math.max(0, Math.min(1, progress));
  let primaryAngleDegrees = 0;
  let primaryJointLabel = 'Articulação';
  let phaseLabel = 'Execução';
  let isContracting = false;

  switch (exerciseId) {
    // 1. Sentar e Levantar da Cadeira (Box Squat)
    case 'box_squat_cadeira': {
      primaryJointLabel = 'Flexão do Joelho';
      // Cadência 3s descendo (0.0 a 0.5), 1s sustentando (0.5 a 0.65), 2s subindo (0.65 a 1.0)
      let depth = 0;
      if (t < 0.5) {
        depth = smoothstep(0, 0.5, t);
        phaseLabel = 'Descida Excêntrica (3s)';
      } else if (t < 0.65) {
        depth = 1.0;
        phaseLabel = 'Pausa no Assento (1s)';
        isContracting = true;
      } else {
        depth = 1.0 - smoothstep(0.65, 1.0, t);
        phaseLabel = 'Subida Concêntrica (2s)';
        isContracting = true;
      }

      const kneeAngleRad = depth * (Math.PI / 2.1); // ~85 graus de flexão
      const hipAngleRad = depth * (Math.PI / 2.2);

      ragdoll.pelvis.position.y = 0.95 - depth * 0.40;
      ragdoll.pelvis.position.z = -depth * 0.38;

      ragdoll.leftHip.rotation.x = -hipAngleRad;
      ragdoll.rightHip.rotation.x = -hipAngleRad;

      ragdoll.leftKnee.rotation.x = kneeAngleRad;
      ragdoll.rightKnee.rotation.x = kneeAngleRad;

      ragdoll.leftAnkle.rotation.x = -depth * 0.25;
      ragdoll.rightAnkle.rotation.x = -depth * 0.25;

      // Tronco com leve inclinação anterior para equilíbrio
      ragdoll.spine.rotation.x = depth * 0.28;

      // Braços cruzados sobre o peito (segurança)
      ragdoll.leftClavicle.rotation.x = -0.7;
      ragdoll.leftElbow.rotation.z = -Math.PI / 2;
      ragdoll.rightClavicle.rotation.x = -0.7;
      ragdoll.rightElbow.rotation.z = Math.PI / 2;

      primaryAngleDegrees = Math.round(depth * 88);
      break;
    }

    // 2. Extensão Isométrica no Solo (Quad Sets com toalha)
    case 'extensao_isometrica_quad': {
      primaryJointLabel = 'Extensão do Joelho';
      // Sentado no solo com pernas estendidas
      ragdoll.pelvis.position.set(0, 0.12, 0);
      ragdoll.spine.rotation.x = 0.15; // Tronco ereto sentado

      ragdoll.leftHip.rotation.x = -Math.PI / 2;
      ragdoll.rightHip.rotation.x = -Math.PI / 2;

      // Ciclo: relaxamento -> compressão isométrica contra a toalha -> retorno
      let press = 0;
      if (t < 0.15) {
        press = smoothstep(0, 0.15, t);
        phaseLabel = 'Início da Contração';
      } else if (t < 0.85) {
        press = 1.0;
        phaseLabel = 'Sustentação Isométrica Máxima';
        isContracting = true;
      } else {
        press = 1.0 - smoothstep(0.85, 1.0, t);
        phaseLabel = 'Descompressão Suave';
      }

      // Joelho direito pressiona para baixo (hiperextensão terapêutica de 0° a 5°)
      ragdoll.rightKnee.rotation.x = -press * 0.08;
      // Dorsiflexão ativa do pé (dedos puxando para o rosto)
      ragdoll.rightAnkle.rotation.x = -0.15 - press * 0.35;

      // Joelho esquerdo em leve repouso
      ragdoll.leftKnee.rotation.x = 0.05;

      // Mãos apoiadas no chão ao lado do corpo
      ragdoll.leftClavicle.rotation.z = -0.3;
      ragdoll.leftElbow.rotation.x = 0.2;
      ragdoll.rightClavicle.rotation.z = 0.3;
      ragdoll.rightElbow.rotation.x = 0.2;

      primaryAngleDegrees = Math.round(180 - press * 5);
      break;
    }

    // 3. Elevação de Perna Reta (SLR)
    case 'slr_elevacao_perna': {
      primaryJointLabel = 'Elevação do Quadril';
      // Deitado em decúbito dorsal
      supine(ragdoll);

      // Perna esquerda flexionada para proteger lombar
      ragdoll.leftHip.rotation.x = -Math.PI / 3;
      ragdoll.leftKnee.rotation.x = Math.PI / 2.5;

      // Perna direita totalmente reta subindo a 45 graus
      let lift = 0;
      if (t < 0.4) {
        lift = smoothstep(0, 0.4, t);
        phaseLabel = 'Elevação Concêntrica (2s)';
        isContracting = true;
      } else if (t < 0.55) {
        lift = 1.0;
        phaseLabel = 'Pausa no Ápice (1s)';
        isContracting = true;
      } else {
        lift = 1.0 - smoothstep(0.55, 1.0, t);
        phaseLabel = 'Descida Excêntrica Lenta (3s)';
      }

      ragdoll.rightHip.rotation.x = -lift * (Math.PI / 4); // 45 graus
      ragdoll.rightKnee.rotation.x = 0; // joelho estritamente travado reto
      ragdoll.rightAnkle.rotation.x = -0.25; // dorsiflexão constante

      primaryAngleDegrees = Math.round(lift * 45);
      break;
    }

    // 4. Alfabeto com o Tornozelo
    case 'tornozelo_alfabeto': {
      primaryJointLabel = 'Circunversão do Tornozelo';
      // Sentado na cadeira
      ragdoll.pelvis.position.set(0, 0.52, -0.28);
      ragdoll.leftHip.rotation.x = -Math.PI / 2.2;
      ragdoll.leftKnee.rotation.x = Math.PI / 2.2;

      // Perna direita ligeiramente elevada do solo
      ragdoll.rightHip.rotation.x = -Math.PI / 2.6;
      ragdoll.rightKnee.rotation.x = Math.PI / 3.0;

      // Movimento orbital do tornozelo simulando escrita das letras
      const orbit = t * Math.PI * 4;
      const angleX = Math.sin(orbit) * 0.35;
      const angleY = Math.cos(orbit) * 0.30;
      ragdoll.rightAnkle.rotation.x = angleX;
      ragdoll.rightAnkle.rotation.y = angleY;
      ragdoll.rightAnkle.rotation.z = Math.sin(orbit * 0.5) * 0.2;

      phaseLabel = `Desenhando Letra (${Math.floor(t * 26) + 1} de 26)`;
      primaryAngleDegrees = Math.round(Math.abs(angleX) * 90);
      isContracting = true;
      break;
    }

    // 5. Dorsiflexão Assistida na Parede
    case 'dorsiflexao_parede': {
      primaryJointLabel = 'Ângulo de Dorsiflexão';
      ragdoll.pelvis.position.set(0, 0.94, -0.05);

      // Mãos apoiadas na parede à frente
      ragdoll.leftClavicle.rotation.x = -Math.PI / 2.2;
      ragdoll.rightClavicle.rotation.x = -Math.PI / 2.2;

      let advance = 0;
      if (t < 0.5) {
        advance = smoothstep(0, 0.5, t);
        phaseLabel = 'Avanço do Joelho à Parede (3s)';
      } else if (t < 0.65) {
        advance = 1.0;
        phaseLabel = 'Alongamento no Limite Sem Descolar Calcanhar';
        isContracting = true;
      } else {
        advance = 1.0 - smoothstep(0.65, 1.0, t);
        phaseLabel = 'Retorno Controlado (2s)';
      }

      // Joelho direito avança para a frente sem levantar o calcanhar
      ragdoll.rightKnee.rotation.x = advance * 0.45;
      ragdoll.rightAnkle.rotation.x = -advance * 0.52; // ~30 graus de dorsiflexão
      ragdoll.pelvis.position.z = -0.05 + advance * 0.18;

      // Perna esquerda atrás como suporte
      ragdoll.leftHip.rotation.x = 0.25;
      ragdoll.leftKnee.rotation.x = 0.08;

      primaryAngleDegrees = Math.round(advance * 32);
      break;
    }

    // 6. Ponte de Glúteo no Solo (Pelvic Lift)
    case 'ponte_gluteo': {
      primaryJointLabel = 'Extensão Pélvica';
      supine(ragdoll);

      // Pés apoiados firmes com joelhos dobrados
      ragdoll.leftHip.rotation.x = -Math.PI / 2.2;
      ragdoll.leftKnee.rotation.x = Math.PI / 2.2;
      ragdoll.rightHip.rotation.x = -Math.PI / 2.2;
      ragdoll.rightKnee.rotation.x = Math.PI / 2.2;

      let lift = 0;
      if (t < 0.4) {
        lift = smoothstep(0, 0.4, t);
        phaseLabel = 'Elevação Pélvica (2s)';
        isContracting = true;
      } else if (t < 0.65) {
        lift = 1.0;
        phaseLabel = 'Aperto Máximo dos Glúteos (2s)';
        isContracting = true;
      } else {
        lift = 1.0 - smoothstep(0.65, 1.0, t);
        phaseLabel = 'Descida Vertebral Lenta (3s)';
      }

      // Pelve sobe do chão até alinhar tronco e fêmur
      ragdoll.pelvis.position.z = lift * 0.32;
      ragdoll.leftHip.rotation.x = -(Math.PI / 2.2) * (1 - lift);
      ragdoll.rightHip.rotation.x = -(Math.PI / 2.2) * (1 - lift);

      primaryAngleDegrees = Math.round(lift * 180);
      break;
    }

    // 7. Elevação de Panturrilha em Pé com Apoio (Calf Raises)
    case 'panturrilha_apoio': {
      primaryJointLabel = 'Flexão Plantar';
      ragdoll.pelvis.position.set(0, 0.95, -0.10);

      // Mãos apoiadas na parede
      ragdoll.leftClavicle.rotation.x = -Math.PI / 2.3;
      ragdoll.rightClavicle.rotation.x = -Math.PI / 2.3;

      let rise = 0;
      if (t < 0.35) {
        rise = smoothstep(0, 0.35, t);
        phaseLabel = 'Elevação na Ponta dos Pés (2s)';
        isContracting = true;
      } else if (t < 0.6) {
        rise = 1.0;
        phaseLabel = 'Pausa no Ápice (2s)';
        isContracting = true;
      } else {
        rise = 1.0 - smoothstep(0.6, 1.0, t);
        phaseLabel = 'Descida Excêntrica Lenta (3s)';
      }

      ragdoll.pelvis.position.y = 0.95 + rise * 0.12;
      ragdoll.leftAnkle.rotation.x = rise * 0.65; // ~38 graus
      ragdoll.rightAnkle.rotation.x = rise * 0.65;

      primaryAngleDegrees = Math.round(rise * 38);
      break;
    }

    // 8. Abdução de Quadril Deitado de Lado
    case 'abducao_deitado': {
      primaryJointLabel = 'Abdução do Glúteo Médio';
      // Deitado de lado (rotação no eixo Z)
      ragdoll.pelvis.position.set(0, 0.15, 0);
      ragdoll.pelvis.rotation.z = Math.PI / 2; // Decúbito lateral esquerdo

      // Perna de baixo (esquerda) levemente flexionada para estabilidade
      ragdoll.leftHip.rotation.x = -0.3;
      ragdoll.leftKnee.rotation.x = 0.4;

      let abduct = 0;
      if (t < 0.4) {
        abduct = smoothstep(0, 0.4, t);
        phaseLabel = 'Elevação Lateral (2s)';
        isContracting = true;
      } else if (t < 0.55) {
        abduct = 1.0;
        phaseLabel = 'Pausa no Topo (1s)';
        isContracting = true;
      } else {
        abduct = 1.0 - smoothstep(0.55, 1.0, t);
        phaseLabel = 'Descida Controlada (3s)';
      }

      // Perna direita abduz no plano frontal (rotação em Z da perna)
      ragdoll.rightHip.rotation.z = abduct * (Math.PI / 4.2); // ~42 graus
      ragdoll.rightKnee.rotation.x = 0; // joelho estendido

      primaryAngleDegrees = Math.round(abduct * 42);
      break;
    }

    // 9. Drenagem Postural Ativa com Pernas Elevadas (Noite)
    case 'drenagem_postural': {
      primaryJointLabel = 'Bomba Muscular Venosa';
      // Deitado com pernas a 90 graus na parede
      supine(ragdoll, -0.35);

      // Quadris flexionados a 90° na parede
      ragdoll.leftHip.rotation.x = -Math.PI / 2;
      ragdoll.rightHip.rotation.x = -Math.PI / 2;
      ragdoll.leftKnee.rotation.x = 0;
      ragdoll.rightKnee.rotation.x = 0;

      // Bomba de tornozelo alternada ou simultânea
      const pump = Math.sin(t * Math.PI * 6);
      ragdoll.rightAnkle.rotation.x = pump * 0.45;
      ragdoll.leftAnkle.rotation.x = pump * 0.45;

      phaseLabel = pump > 0 ? 'Flexão Plantar (Esvaziamento Venoso)' : 'Dorsiflexão Ativa';
      primaryAngleDegrees = Math.round(Math.abs(pump) * 35);
      isContracting = true;
      break;
    }

    // 10. Aperto de Travesseiro (Adutores)
    case 'aperto_travesseiro': {
      primaryJointLabel = 'Compressão Isométrica Adutora';
      supine(ragdoll);

      ragdoll.leftHip.rotation.x = -Math.PI / 2.3;
      ragdoll.leftKnee.rotation.x = Math.PI / 2.3;
      ragdoll.rightHip.rotation.x = -Math.PI / 2.3;
      ragdoll.rightKnee.rotation.x = Math.PI / 2.3;

      let squeeze = 0;
      if (t < 0.2) {
        squeeze = smoothstep(0, 0.2, t);
        phaseLabel = 'Aperto Inicial';
      } else if (t < 0.8) {
        squeeze = 1.0;
        phaseLabel = 'Sustentação Isométrica dos Adutores (5s)';
        isContracting = true;
      } else {
        squeeze = 1.0 - smoothstep(0.8, 1.0, t);
        phaseLabel = 'Relaxamento Lento';
      }

      // Joelhos comprimem para dentro (adução)
      ragdoll.leftHip.rotation.z = squeeze * 0.12;
      ragdoll.rightHip.rotation.z = -squeeze * 0.12;

      primaryAngleDegrees = Math.round(squeeze * 100);
      break;
    }

    case 'circulos_quadril': {
      primaryJointLabel = 'Mobilidade do Quadril';
      supine(ragdoll);
      const circle = t * Math.PI * 2;
      ragdoll.rightHip.rotation.x = -0.7 - Math.sin(circle) * 0.25;
      ragdoll.rightHip.rotation.z = Math.cos(circle) * 0.35;
      ragdoll.rightKnee.rotation.x = 1.0;
      phaseLabel = 'Círculo controlado do quadril';
      primaryAngleDegrees = Math.round(40 + Math.abs(Math.sin(circle)) * 20);
      break;
    }

    case 'alongamento_toalha_panturrilha': {
      primaryJointLabel = 'Alongamento da Panturrilha';
      ragdoll.pelvis.position.set(0, 0.52, -0.12);
      ragdoll.leftHip.rotation.x = -Math.PI / 2;
      ragdoll.rightHip.rotation.x = -Math.PI / 2;
      ragdoll.leftKnee.rotation.x = 0;
      ragdoll.rightKnee.rotation.x = 0;
      ragdoll.leftClavicle.rotation.x = -0.9;
      ragdoll.rightClavicle.rotation.x = -0.9;
      ragdoll.leftElbow.rotation.x = -0.7;
      ragdoll.rightElbow.rotation.x = -0.7;
      ragdoll.rightAnkle.rotation.x = -0.35;
      phaseLabel = 'Puxada suave com a toalha';
      primaryAngleDegrees = 30;
      break;
    }

    case 'alongamento_isquiotibiais': {
      primaryJointLabel = 'Alongamento Posterior da Coxa';
      supine(ragdoll);
      ragdoll.leftHip.rotation.x = -0.65;
      ragdoll.leftKnee.rotation.x = 1.0;
      ragdoll.rightHip.rotation.x = -0.8;
      ragdoll.rightKnee.rotation.x = 0.1;
      ragdoll.rightClavicle.rotation.x = -1.0;
      ragdoll.leftClavicle.rotation.x = -1.0;
      phaseLabel = 'Perna elevada e joelho estendido';
      primaryAngleDegrees = 45;
      break;
    }

    case 'respiracao_diafragmatica': {
      primaryJointLabel = 'Respiração';
      supine(ragdoll);
      ragdoll.leftHip.rotation.x = -0.35;
      ragdoll.rightHip.rotation.x = -0.35;
      ragdoll.leftKnee.rotation.x = 0.7;
      ragdoll.rightKnee.rotation.x = 0.7;
      phaseLabel = 'Repouso deitado';
      break;
    }

    case 'ponte_isometrica_baixa': {
      primaryJointLabel = 'Extensão Pélvica';
      supine(ragdoll);
      ragdoll.leftHip.rotation.x = -0.65;
      ragdoll.rightHip.rotation.x = -0.65;
      ragdoll.leftKnee.rotation.x = 1.1;
      ragdoll.rightKnee.rotation.x = 1.1;
      const lift = t < 0.25 ? smoothstep(0, 0.25, t) * 0.1 : 0.1;
      ragdoll.pelvis.position.y += lift;
      phaseLabel = lift ? 'Sustentação da ponte baixa' : 'Preparação da ponte';
      primaryAngleDegrees = Math.round(lift * 100);
      isContracting = lift > 0;
      break;
    }

    case 'alongamento_flexores_quadril': {
      primaryJointLabel = 'Alongamento do Quadril';
      supine(ragdoll);
      ragdoll.leftHip.rotation.x = -0.9;
      ragdoll.leftKnee.rotation.x = 1.1;
      ragdoll.rightHip.rotation.x = 0.1;
      ragdoll.rightKnee.rotation.x = 0;
      ragdoll.leftClavicle.rotation.x = -0.8;
      ragdoll.rightClavicle.rotation.x = -0.8;
      phaseLabel = 'Joelho ao peito, outra perna estendida';
      primaryAngleDegrees = 50;
      break;
    }

    case 'postura_da_crianca': {
      primaryJointLabel = 'Flexão de Quadril';
      ragdoll.pelvis.position.set(0, 0.48, 0);
      ragdoll.leftHip.rotation.x = -0.8;
      ragdoll.rightHip.rotation.x = -0.8;
      ragdoll.leftKnee.rotation.x = 1.2;
      ragdoll.rightKnee.rotation.x = 1.2;
      ragdoll.spine.rotation.x = 0.8;
      ragdoll.leftClavicle.rotation.x = -1.0;
      ragdoll.rightClavicle.rotation.x = -1.0;
      phaseLabel = 'Ajoelhado com o tronco inclinado';
      primaryAngleDegrees = 45;
      break;
    }

    // Padrão de repouso / outros exercícios
    default: {
      primaryJointLabel = 'Posição de Repouso';
      phaseLabel = 'Posição inicial';
      break;
    }
  }

  // Realce sutil nas juntas esféricas ativas quando há contração
  if (isContracting) {
    ragdoll.materials.jointWood.color.setHex(0xd97706); // Âmbar quente nas juntas ativas
    ragdoll.materials.muscleHighlight.color.setHex(0x0ea5e9);
  } else {
    ragdoll.materials.jointWood.color.setHex(0xb5885c);
    ragdoll.materials.muscleHighlight.color.setHex(0x38bdf8);
  }

  return {
    primaryAngleDegrees,
    primaryJointLabel,
    phaseLabel,
    isContracting,
  };
}
