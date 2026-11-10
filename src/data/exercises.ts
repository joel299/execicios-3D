/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExerciseDef } from '../types/workout';

export const EXERCISE_DATABASE: Record<string, ExerciseDef> = {
  // --- BLOCO DA MANHÃ (60 MINUTOS) ---
  'tornozelo_alfabeto': {
    id: 'tornozelo_alfabeto',
    name: 'Desenhar o Alfabeto com o Pé',
    subtitle: 'Movimente o tornozelo em todas as direções',
    category: 'aquecimento',
    targetMuscles: ['tornozelo_tibial', 'panturrilha'],
    primaryJoint: 'Tornozelo e pé',
    targetAngleRange: 'Desenhe as letras no ar com o pé',
    volume: {
      sets: 2,
      durationSeconds: 120,
      restSeconds: 30,
    },
    cadence: { eccentric: 2, isometric: 1, concentric: 2 },
    description: [
      'Sente-se confortavelmente em uma cadeira com o tronco alinhado.',
      'Sente-se com as costas apoiadas e levante um pouco do chão a perna com os pinos.',
      'Use a ponta do dedão como se fosse uma caneta e desenhe as letras de A a Z no ar.',
      'Tente manter a coxa e o joelho parados; mova o pé pelo tornozelo.'
    ],
    safetyTips: [
      'Pare se sentir uma pontada ou dor forte perto dos pinos.',
      'Respire normalmente e faça o movimento sem pressa.'
    ],
    cameraPreset: 'side',
    propType: 'chair'
  },

  'dorsiflexao_parede': {
    id: 'dorsiflexao_parede',
    name: 'Levar o Joelho até a Parede',
    subtitle: 'Alongue a panturrilha sem tirar o calcanhar do chão',
    category: 'aquecimento',
    targetMuscles: ['tornozelo_tibial', 'panturrilha'],
    primaryJoint: 'Tornozelo e panturrilha',
    targetAngleRange: 'Avance o joelho só até onde for confortável',
    volume: {
      sets: 2,
      reps: 12,
      restSeconds: 40,
    },
    cadence: { eccentric: 3, isometric: 1, concentric: 2 },
    description: [
      'Fique de frente para a parede, a cerca de 10 a 15 cm de distância.',
      'Mantenha o calcanhar da perna com os pinos apoiado no chão.',
      'Leve o joelho devagar em direção à parede até sentir um alongamento leve na panturrilha.',
      'Volte à posição inicial sem dar trancos.'
    ],
    safetyTips: [
      'Se o calcanhar sair do chão, afaste um pouco o pé da parede.',
      'Mantenha o joelho alinhado com o pé, sem deixá-lo cair para dentro.'
    ],
    cameraPreset: 'side',
    propType: 'wall'
  },

  'circulos_quadril': {
    id: 'circulos_quadril',
    name: 'Círculos com o Quadril',
    subtitle: 'Movimente o quadril de forma suave, deitado de costas',
    category: 'aquecimento',
    targetMuscles: ['gluteo_medio', 'adutores', 'quadriceps'],
    primaryJoint: 'Quadril',
    targetAngleRange: 'Faça círculos confortáveis para os dois lados',
    volume: {
      sets: 2,
      reps: 10,
      restSeconds: 30,
    },
    cadence: { eccentric: 2, isometric: 1, concentric: 2 },
    description: [
      'Deite-se de costas em uma superfície firme ou tatame.',
      'Flexione o joelho e traga a coxa em direção ao tórax.',
      'Leve a perna para o lado e faça um círculo lento e completo.',
      'Faça 10 círculos para um lado e 10 para o outro.'
    ],
    safetyTips: [
      'Mantenha a parte baixa das costas apoiada no chão.',
      'Faça círculos menores ou pare se sentir dor.'
    ],
    cameraPreset: 'top',
    propType: 'mat'
  },

  'extensao_isometrica_quad': {
    id: 'extensao_isometrica_quad',
    name: 'Apertar a Toalha com a Coxa',
    subtitle: 'Ative a coxa mantendo a perna esticada',
    category: 'fortalecimento',
    targetMuscles: ['quadriceps'],
    primaryJoint: 'Joelho e coxa',
    targetAngleRange: 'Mantenha o joelho esticado',
    volume: {
      sets: 3,
      reps: 10,
      holdSeconds: 8,
      restSeconds: 45,
    },
    cadence: { eccentric: 1, isometric: 8, concentric: 2 },
    description: [
      'Sente-se no solo com as pernas esticadas à frente.',
      'Coloque uma toalha enrolada debaixo do joelho da perna com os pinos.',
      'Aperte a coxa e pressione a parte de trás do joelho contra a toalha.',
      'Ao mesmo tempo, puxe a ponta do pé na direção do rosto.',
      'Mantenha a pressão por 8 segundos, sem prender a respiração.'
    ],
    safetyTips: [
      'Relaxe o pescoço e os ombros; concentre o esforço na coxa.',
      'Mantenha a pressão firme e constante.'
    ],
    cameraPreset: 'side',
    propType: 'towel'
  },

  'slr_elevacao_perna': {
    id: 'slr_elevacao_perna',
    name: 'Elevação da Perna Esticada',
    subtitle: 'Fortaleça a coxa sem dobrar o joelho',
    category: 'fortalecimento',
    targetMuscles: ['quadriceps', 'core_lombar'],
    primaryJoint: 'Quadril e joelho',
    targetAngleRange: 'Suba até a altura do outro joelho',
    volume: {
      sets: 3,
      reps: 12,
      restSeconds: 45,
    },
    cadence: { eccentric: 3, isometric: 1, concentric: 2 },
    description: [
      'Deite-se de costas e dobre uma perna, deixando o pé apoiado no chão.',
      'Mantenha a perna com os pinos esticada e os dedos apontados para cima.',
      'Sem dobrar o joelho, levante essa perna até a altura do outro joelho.',
      'Desça devagar por 3 segundos e recomece sem bater o calcanhar no chão.'
    ],
    safetyTips: [
      'Se o joelho começar a dobrar, levante menos a perna.',
      'Mantenha a barriga levemente contraída.'
    ],
    cameraPreset: 'side',
    propType: 'mat'
  },

  'box_squat_cadeira': {
    id: 'box_squat_cadeira',
    name: 'Sentar e Levantar da Cadeira',
    subtitle: 'Pratique o movimento com calma e controle',
    category: 'fortalecimento',
    targetMuscles: ['quadriceps', 'gluteo_maximo', 'isquiotibiais'],
    primaryJoint: 'Quadril e joelhos',
    targetAngleRange: 'Desça até tocar de leve na cadeira',
    volume: {
      sets: 4,
      reps: 12,
      restSeconds: 60,
    },
    cadence: { eccentric: 3, isometric: 1, concentric: 2 },
    description: [
      'Fique em pé de costas para uma cadeira sólida e firme, com pés na largura dos ombros.',
      'Cruze os braços sobre o peito para não utilizar impulso das mãos.',
      'Comece levando o quadril para trás, como se fosse sentar.',
      'Desça em 3 segundos até tocar de leve no assento.',
      'Empurre o chão com os calcanhares para voltar a ficar em pé.'
    ],
    safetyTips: [
      'Não se jogue na cadeira; sente com cuidado.',
      'Mantenha os joelhos apontados na mesma direção dos pés.'
    ],
    cameraPreset: 'isometric',
    propType: 'chair'
  },

  'ponte_gluteo': {
    id: 'ponte_gluteo',
    name: 'Ponte de Quadril',
    subtitle: 'Fortaleça os glúteos e a parte de trás das coxas',
    category: 'fortalecimento',
    targetMuscles: ['gluteo_maximo', 'isquiotibiais', 'core_lombar'],
    primaryJoint: 'Quadril e glúteos',
    targetAngleRange: 'Suba até alinhar ombros e joelhos',
    volume: {
      sets: 4,
      reps: 15,
      restSeconds: 45,
    },
    cadence: { eccentric: 3, isometric: 2, concentric: 2 },
    description: [
      'Deite-se de costas com joelhos dobrados a 90° e pés alinhados paralelos no solo.',
      'Apoie os braços ao lado do corpo para estabilidade.',
      'Eleve o quadril do solo até formar uma linha reta imaginária entre os ombros e os joelhos.',
      'No alto, aperte os glúteos e conte 2 segundos.',
      'Desça devagar, sem deixar o quadril cair de uma vez.'
    ],
    safetyTips: [
      'Não arqueie demais as costas quando subir.',
      'Mantenha o peso dividido entre os dois pés.'
    ],
    cameraPreset: 'side',
    propType: 'mat'
  },

  'panturrilha_apoio': {
    id: 'panturrilha_apoio',
    name: 'Subida na Ponta dos Pés com Apoio',
    subtitle: 'Fortaleça as panturrilhas com apoio para o equilíbrio',
    category: 'fortalecimento',
    targetMuscles: ['panturrilha', 'tornozelo_tibial'],
    primaryJoint: 'Tornozelo e panturrilha',
    targetAngleRange: 'Suba na ponta dos pés até onde for confortável',
    volume: {
      sets: 4,
      reps: 15,
      restSeconds: 45,
    },
    cadence: { eccentric: 3, isometric: 2, concentric: 2 },
    description: [
      'Em pé, apoie as mãos suavemente em uma parede ou no espaldar de uma cadeira para manter o equilíbrio.',
      'Fique em pé com os pés paralelos e o corpo ereto.',
      'Suba na ponta dos pés, segure por 2 segundos e perceba a panturrilha trabalhando.',
      'Desça em 3 segundos até apoiar os calcanhares no chão.'
    ],
    safetyTips: [
      'Distribua o peso pelos pés, sem apoiar só nas bordas.',
      'Evite balançar o corpo.'
    ],
    cameraPreset: 'side',
    propType: 'wall'
  },

  'abducao_deitado': {
    id: 'abducao_deitado',
    name: 'Elevação Lateral da Perna Deitado',
    subtitle: 'Fortaleça o lado do quadril',
    category: 'fortalecimento',
    targetMuscles: ['gluteo_medio'],
    primaryJoint: 'Quadril',
    targetAngleRange: 'Eleve a perna até cerca de 45°, sem forçar',
    volume: {
      sets: 3,
      reps: 12,
      restSeconds: 45,
    },
    cadence: { eccentric: 3, isometric: 1, concentric: 2 },
    description: [
      'Deite-se de lado e mantenha o corpo alinhado, da cabeça aos pés.',
      'Dobre um pouco a perna de baixo para ficar mais firme.',
      'Deixe a perna de cima esticada e com o calcanhar levemente voltado para cima.',
      'Levante essa perna até cerca de 40° ou 45°, sem girar o corpo para trás.',
      'Desça devagar, contando 3 segundos.'
    ],
    safetyTips: [
      'Não vire os dedos do pé para o teto; mantenha o calcanhar levemente para cima.',
      'Mantenha os quadris um sobre o outro, sem girar o tronco.'
    ],
    cameraPreset: 'front',
    propType: 'mat'
  },

  'alongamento_toalha_panturrilha': {
    id: 'alongamento_toalha_panturrilha',
    name: 'Alongar a Panturrilha com Toalha',
    subtitle: 'Alongue a panturrilha sentado, sem puxar com força',
    category: 'volta_calma',
    targetMuscles: ['panturrilha'],
    primaryJoint: 'Tornozelo e panturrilha',
    targetAngleRange: 'Mantenha por 30 segundos',
    volume: {
      sets: 3,
      holdSeconds: 30,
      restSeconds: 20,
    },
    cadence: { eccentric: 2, isometric: 30, concentric: 2 },
    description: [
      'Sentado no solo com pernas estendidas à frente.',
      'Passe uma toalha dobrada por baixo da parte da frente do pé da perna com os pinos.',
      'Segure as pontas da toalha e puxe devagar em direção ao corpo, mantendo o joelho esticado.',
      'Quando sentir a panturrilha alongar de leve, mantenha por 30 segundos e respire com calma.'
    ],
    safetyTips: [
      'Não dê trancos; puxe a toalha devagar.',
      'Mantenha as costas retas, sem se curvar demais.'
    ],
    cameraPreset: 'side',
    propType: 'towel'
  },

  'alongamento_isquiotibiais': {
    id: 'alongamento_isquiotibiais',
    name: 'Alongar a Parte de Trás da Coxa',
    subtitle: 'Alongue a coxa deitado de costas',
    category: 'volta_calma',
    targetMuscles: ['isquiotibiais'],
    primaryJoint: 'Quadril e parte de trás da coxa',
    targetAngleRange: 'Mantenha por 30 segundos',
    volume: {
      sets: 3,
      holdSeconds: 30,
      restSeconds: 20,
    },
    cadence: { eccentric: 2, isometric: 30, concentric: 2 },
    description: [
      'Deitado de costas, flexione uma perna com pé no chão.',
      'Segure a parte de trás da coxa da perna com os pinos ou use uma toalha para ajudar.',
      'Traga a perna em direção ao peito e estique o joelho aos poucos, até sentir um leve alongamento atrás da coxa.',
      'Mantenha por 30 segundos e respire com calma.'
    ],
    safetyTips: [
      'Não permita que os ombros saiam do chão.',
      'Pare se sentir formigamento ou uma pontada forte.'
    ],
    cameraPreset: 'side',
    propType: 'mat'
  },

  'respiracao_diafragmatica': {
    id: 'respiracao_diafragmatica',
    name: 'Respiração Lenta Deitado',
    subtitle: 'Respire devagar para relaxar o corpo',
    category: 'volta_calma',
    targetMuscles: ['core_lombar'],
    primaryJoint: 'Respiração e abdômen',
    targetAngleRange: 'Inspire por 4s, segure por 2s e solte por 6s',
    volume: {
      sets: 1,
      durationSeconds: 180,
      restSeconds: 0,
    },
    cadence: { eccentric: 4, isometric: 2, concentric: 6 },
    description: [
      'Deite-se de costas e coloque as mãos sobre a barriga.',
      'Inspire pelo nariz por 4 segundos, sentindo a barriga subir.',
      'Segure o ar por 2 segundos e solte devagar pela boca por 6 segundos.',
      'Continue por 3 minutos, sem pressa.'
    ],
    safetyTips: [
      'Não force a respiração; faça cada ciclo de forma confortável.',
      'Perceba como seu corpo está se sentindo.'
    ],
    cameraPreset: 'top',
    propType: 'mat'
  },

  // --- BLOCO DA NOITE (30 MINUTOS / 00:00 H) ---
  'drenagem_postural': {
    id: 'drenagem_postural',
    name: 'Movimentar os Pés com as Pernas na Parede',
    subtitle: 'Descanse com as pernas apoiadas e movimente os pés',
    category: 'drenagem',
    targetMuscles: ['panturrilha', 'tornozelo_tibial'],
    primaryJoint: 'Tornozelos e pés',
    targetAngleRange: 'Mantenha as pernas apoiadas na parede, se estiver confortável',
    volume: {
      sets: 3,
      reps: 20,
      restSeconds: 60,
    },
    cadence: { eccentric: 2, isometric: 1, concentric: 2 },
    description: [
      'Deite-se no chão ou na cama, perto de uma parede, e apoie as pernas esticadas nela.',
      'Puxe os dedos dos pés em sua direção e depois aponte-os para cima. Repita 20 vezes, devagar.',
      'Descanse por 1 minuto com as pernas apoiadas e faça mais duas séries.'
    ],
    safetyTips: [
      'Se sentir formigamento, dobre um pouco os joelhos ou pare o movimento.',
      'Ajuste a posição para manter as costas e o pescoço confortáveis.'
    ],
    cameraPreset: 'side',
    propType: 'wall'
  },

  'aperto_travesseiro': {
    id: 'aperto_travesseiro',
    name: 'Apertar o Travesseiro entre os Joelhos',
    subtitle: 'Fortaleça a parte interna das coxas',
    category: 'isometria',
    targetMuscles: ['adutores', 'quadriceps'],
    primaryJoint: 'Quadril e parte interna das coxas',
    targetAngleRange: 'Aperte por 5 segundos',
    volume: {
      sets: 3,
      reps: 10,
      holdSeconds: 5,
      restSeconds: 30,
    },
    cadence: { eccentric: 1, isometric: 5, concentric: 1 },
    description: [
      'Deitado de costas com joelhos dobrados a 90° e pés firmes no solo.',
      'Coloque um travesseiro firme entre os joelhos.',
      'Aperte o travesseiro com os joelhos e sinta a parte interna das coxas trabalhar.',
      'Mantenha a pressão por 5 segundos, sem prender a respiração.',
      'Relaxe devagar por 2 segundos antes de repetir.'
    ],
    safetyTips: [
      'Mantenha o quadril apoiado no chão enquanto aperta.',
      'Aperte com os dois lados com a mesma força.'
    ],
    cameraPreset: 'front',
    propType: 'pillow'
  },

  'ponte_isometrica_baixa': {
    id: 'ponte_isometrica_baixa',
    name: 'Ponte Baixa com Sustentação',
    subtitle: 'Mantenha o quadril um pouco elevado por alguns segundos',
    category: 'isometria',
    targetMuscles: ['gluteo_maximo', 'core_lombar'],
    primaryJoint: 'Quadril e glúteos',
    targetAngleRange: 'Eleve cerca de 10 cm e mantenha por 20s',
    volume: {
      sets: 3,
      holdSeconds: 20,
      restSeconds: 30,
    },
    cadence: { eccentric: 2, isometric: 20, concentric: 2 },
    description: [
      'Deite-se de costas com joelhos flexionados e pés apoiados no chão.',
      'Eleve o quadril apenas cerca de 10 centímetros do solo (não suba até o máximo).',
      'Mantenha o quadril parado por 20 segundos e contraia de leve os glúteos e a barriga.',
      'Desça devagar e descanse 30 segundos entre as repetições.'
    ],
    safetyTips: [
      'Faça o movimento com leveza; não tente se cansar.',
      'Respire devagar, pelo nariz, se for confortável.'
    ],
    cameraPreset: 'side',
    propType: 'mat'
  },

  'alongamento_flexores_quadril': {
    id: 'alongamento_flexores_quadril',
    name: 'Alongamento da Parte da Frente do Quadril',
    subtitle: 'Alongue a parte da frente do quadril deitado',
    category: 'alongamento',
    targetMuscles: ['quadriceps', 'core_lombar'],
    primaryJoint: 'Quadril',
    targetAngleRange: 'Mantenha por 40 segundos de cada lado',
    volume: {
      sets: 2,
      holdSeconds: 40,
      restSeconds: 20,
    },
    cadence: { eccentric: 2, isometric: 40, concentric: 2 },
    description: [
      'Deite-se de costas e deixe a perna com os pinos esticada no chão.',
      'Segure a outra perna pela canela e traga o joelho em direção ao peito.',
      'Perceba um alongamento leve na frente do quadril da perna esticada.',
      'Mantenha por 40 segundos e depois troque de lado, com calma.'
    ],
    safetyTips: [
      'Não puxe o joelho com força; pare se sentir desconforto.',
      'Mantenha a perna esticada apoiada no chão.'
    ],
    cameraPreset: 'side',
    propType: 'mat'
  },

  'postura_da_crianca': {
    id: 'postura_da_crianca',
    name: 'Postura de Descanso com Almofada',
    subtitle: 'Relaxe as costas e os quadris com apoio',
    category: 'alongamento',
    targetMuscles: ['core_lombar', 'gluteo_maximo'],
    primaryJoint: 'Costas e quadris',
    targetAngleRange: 'Descanse por até 2 minutos, sem forçar',
    volume: {
      sets: 1,
      durationSeconds: 120,
      restSeconds: 0,
    },
    cadence: { eccentric: 4, isometric: 120, concentric: 4 },
    description: [
      'Ajoelhe-se em uma superfície macia, deixando os joelhos afastados.',
      'Coloque uma almofada entre os calcanhares e o quadril para apoiar o corpo.',
      'Incline o tronco para a frente e estenda os braços no chão.',
      'Apoie a testa no chão ou em outra almofada e respire devagar por até 2 minutos.'
    ],
    safetyTips: [
      'Não force os joelhos; coloque mais almofadas se precisar de apoio.',
      'Relaxe o corpo sem deixar o peso pressionar os joelhos.'
    ],
    cameraPreset: 'side',
    propType: 'pillow'
  }
};

export const MORNING_ROUTINE_IDS = [
  'tornozelo_alfabeto',
  'dorsiflexao_parede',
  'circulos_quadril',
  'extensao_isometrica_quad',
  'slr_elevacao_perna',
  'box_squat_cadeira',
  'ponte_gluteo',
  'panturrilha_apoio',
  'abducao_deitado',
  'alongamento_toalha_panturrilha',
  'alongamento_isquiotibiais',
  'respiracao_diafragmatica'
];

export const NIGHT_ROUTINE_IDS = [
  'drenagem_postural',
  'aperto_travesseiro',
  'ponte_isometrica_baixa',
  'alongamento_flexores_quadril',
  'postura_da_crianca'
];
