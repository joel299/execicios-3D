/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExerciseDef } from '../types/workout';

export const EXERCISE_DATABASE: Record<string, ExerciseDef> = {
  // --- BLOCO DA MANHÃ (60 MINUTOS) ---
  'tornozelo_alfabeto': {
    id: 'tornozelo_alfabeto',
    name: 'Alfabeto com o Tornozelo',
    subtitle: 'Mobilidade articular multiplanar sem impacto',
    category: 'aquecimento',
    targetMuscles: ['tornozelo_tibial', 'panturrilha'],
    primaryJoint: 'Articulação Talocrural e Subtalar',
    targetAngleRange: 'Circunversão 360° (-20° a +30°)',
    volume: {
      sets: 2,
      durationSeconds: 120,
      restSeconds: 30,
    },
    cadence: { eccentric: 2, isometric: 1, concentric: 2 },
    description: [
      'Sente-se confortavelmente em uma cadeira com o tronco alinhado.',
      'Eleve ligeiramente a perna com o implante metálico do chão.',
      'Utilize a ponta do hálux (dedão) como uma caneta imaginária e desenhe no ar todas as letras do alfabeto (de A até Z).',
      'Mantenha o joelho e a coxa o mais estáveis possível, isolando o movimento no tornozelo.'
    ],
    safetyTips: [
      'Não force amplitudes que gerem pontadas nos parafusos de fixação.',
      'Mantenha respiração constante e ritmo moderado.'
    ],
    cameraPreset: 'side',
    propType: 'chair'
  },

  'dorsiflexao_parede': {
    id: 'dorsiflexao_parede',
    name: 'Dorsiflexão Assistida na Parede',
    subtitle: 'Ganho de amplitude do tendão de Aquiles e tríceps sural',
    category: 'aquecimento',
    targetMuscles: ['tornozelo_tibial', 'panturrilha'],
    primaryJoint: 'Tornozelo (Flexão Dorsal)',
    targetAngleRange: '0° a 35° de dorsiflexão',
    volume: {
      sets: 2,
      reps: 12,
      restSeconds: 40,
    },
    cadence: { eccentric: 3, isometric: 1, concentric: 2 },
    description: [
      'Posicione-se em pé a aproximadamente 10 a 15 cm de distância da parede.',
      'Mantenha o calcanhar do membro operado firmemente apoiado no solo (sem levantar o calcanhar).',
      'Avance suavemente o joelho em direção à parede até sentir uma tensão elástica no tendão de Aquiles.',
      'Retorne de forma controlada sem solavancos.'
    ],
    safetyTips: [
      'Se o calcanhar levantar do chão, recue ligeiramente o pé para não falsear a medição.',
      'Evite desvio em valgo (joelho colapsando para dentro).'
    ],
    cameraPreset: 'side',
    propType: 'wall'
  },

  'circulos_quadril': {
    id: 'circulos_quadril',
    name: 'Círculos Articulares de Quadril',
    subtitle: 'Lubrificação acetabular em decúbito dorsal',
    category: 'aquecimento',
    targetMuscles: ['gluteo_medio', 'adutores', 'quadriceps'],
    primaryJoint: 'Articulação Coxofemoral',
    targetAngleRange: 'Flexão 0° a 110° · Abdução 0° a 40°',
    volume: {
      sets: 2,
      reps: 10,
      restSeconds: 30,
    },
    cadence: { eccentric: 2, isometric: 1, concentric: 2 },
    description: [
      'Deite-se de costas em uma superfície firme ou tatame.',
      'Flexione o joelho e traga a coxa em direção ao tórax.',
      'Abra a perna suavemente para o lado e desça fazendo uma circunferência completa e contínua.',
      'Execute 10 voltas no sentido horário e 10 voltas no sentido anti-horário.'
    ],
    safetyTips: [
      'Mantenha a região lombar apoiada no chão, sem arquear a coluna.',
      'Execute o círculo apenas na amplitude em que não haja estalidos dolorosos.'
    ],
    cameraPreset: 'top',
    propType: 'mat'
  },

  'extensao_isometrica_quad': {
    id: 'extensao_isometrica_quad',
    name: 'Extensão Isométrica no Solo (Quad Sets)',
    subtitle: 'Ativação do vasto medial com apoio de toalha',
    category: 'fortalecimento',
    targetMuscles: ['quadriceps'],
    primaryJoint: 'Joelho (Extensão Terminal)',
    targetAngleRange: '0° (Extensão completa a 180° retilínea)',
    volume: {
      sets: 3,
      reps: 10,
      holdSeconds: 8,
      restSeconds: 45,
    },
    cadence: { eccentric: 1, isometric: 8, concentric: 2 },
    description: [
      'Sente-se no solo com as pernas esticadas à frente.',
      'Coloque uma toalha enrolada firme debaixo do joelho com o implante.',
      'Contraia ativamente a musculatura da coxa (quadríceps), esmagando a toalha contra o solo com a fossa poplítea.',
      'Puxe ativamente a ponta do pé na direção do seu rosto durante toda a contração.',
      'Sustente a contração máxima sem trancamento de respiração por 8 segundos.'
    ],
    safetyTips: [
      'Não tensione o pescoço ou ombros; a força deve ser puramente na coxa.',
      'Mantenha a contração constante sem oscilar a pressão.'
    ],
    cameraPreset: 'side',
    propType: 'towel'
  },

  'slr_elevacao_perna': {
    id: 'slr_elevacao_perna',
    name: 'Elevação de Perna Reta (SLR)',
    subtitle: 'Fortalecimento do reto femoral e estabilizadores pélvicos',
    category: 'fortalecimento',
    targetMuscles: ['quadriceps', 'core_lombar'],
    primaryJoint: 'Quadril (Flexão com Joelho Travado)',
    targetAngleRange: '0° a 45° de elevação',
    volume: {
      sets: 3,
      reps: 12,
      restSeconds: 45,
    },
    cadence: { eccentric: 3, isometric: 1, concentric: 2 },
    description: [
      'Deite-se de barriga para cima. Dobre uma das pernas apoiando o pé no chão para proteger a coluna lombar.',
      'A perna operada permanece totalmente esticada com a ponta dos dedos apontada para cima.',
      'Trave firmemente a extensão do joelho e eleve a perna reta até a altura da coxa oposta (cerca de 45°).',
      'Desça lentamente em 3 segundos, tocando de leve o calcanhar no solo antes de reiniciar.'
    ],
    safetyTips: [
      'Se o joelho dobrar durante a subida, reduza a altura da elevação.',
      'Mantenha o abdômen suavemente contraído.'
    ],
    cameraPreset: 'side',
    propType: 'mat'
  },

  'box_squat_cadeira': {
    id: 'box_squat_cadeira',
    name: 'Sentar e Levantar da Cadeira (Box Squat)',
    subtitle: 'Padrão funcional de agachamento com limite mecânico seguro',
    category: 'fortalecimento',
    targetMuscles: ['quadriceps', 'gluteo_maximo', 'isquiotibiais'],
    primaryJoint: 'Quadril e Joelho (Cadeia Fechada)',
    targetAngleRange: '0° a 90° de flexão de joelho',
    volume: {
      sets: 4,
      reps: 12,
      restSeconds: 60,
    },
    cadence: { eccentric: 3, isometric: 1, concentric: 2 },
    description: [
      'Fique em pé de costas para uma cadeira sólida e firme, com pés na largura dos ombros.',
      'Cruze os braços sobre o peito para não utilizar impulso das mãos.',
      'Inicie o movimento projetando o quadril para trás (como se fosse sentar ao fundo).',
      'Desça de maneira controlada (3 segundos) até tocar de leve as nádegas no assento.',
      'Sem relaxar o tronco, empurre o chão firme através do centro dos calcanhares para retornar à posição ereta.'
    ],
    safetyTips: [
      'Nunca despenque sobre a cadeira; o toque deve ser quase imperceptível.',
      'Garanta que os joelhos apontem na mesma direção da ponta dos pés.'
    ],
    cameraPreset: 'isometric',
    propType: 'chair'
  },

  'ponte_gluteo': {
    id: 'ponte_gluteo',
    name: 'Ponte de Glúteo no Solo (Pelvic Lift)',
    subtitle: 'Ativação do complexo glúteo-isquiotibial sem compressão',
    category: 'fortalecimento',
    targetMuscles: ['gluteo_maximo', 'isquiotibiais', 'core_lombar'],
    primaryJoint: 'Quadril (Extensão Pélvica)',
    targetAngleRange: 'Flexão 90° a Extensão 0° (Linha reta tronco-coxa)',
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
      'No topo do movimento, aperte ativamente os glúteos por 2 segundos inteiros.',
      'Retorne descendo vértebra por vértebra sem desabar o quadril.'
    ],
    safetyTips: [
      'Não hiperestenda a coluna lombar no topo; o movimento é puramente no quadril.',
      'Distribua o peso uniformemente nos dois calcanhares.'
    ],
    cameraPreset: 'side',
    propType: 'mat'
  },

  'panturrilha_apoio': {
    id: 'panturrilha_apoio',
    name: 'Elevação de Panturrilha com Apoio (Calf Raises)',
    subtitle: 'Bomba muscular venosa e fortalecimento do gastrocnêmio e sóleo',
    category: 'fortalecimento',
    targetMuscles: ['panturrilha', 'tornozelo_tibial'],
    primaryJoint: 'Tornozelo (Flexão Plantar)',
    targetAngleRange: '0° a 40° de flexão plantar',
    volume: {
      sets: 4,
      reps: 15,
      restSeconds: 45,
    },
    cadence: { eccentric: 3, isometric: 2, concentric: 2 },
    description: [
      'Em pé, apoie as mãos suavemente em uma parede ou no espaldar de uma cadeira para manter o equilíbrio.',
      'Com os pés paralelos e postura ereta, suba na ponta dos pés o mais alto possível.',
      'Sustente a altura máxima por 2 segundos sentindo a contração do tríceps sural.',
      'Desça lentamente em 3 segundos até os calcanhares tocarem o chão com delicadeza.'
    ],
    safetyTips: [
      'Não jogue o peso nas laterais dos pés; distribua a pressão entre o dedão e o segundo dedo.',
      'Evite balançar o corpo para frente e para trás.'
    ],
    cameraPreset: 'side',
    propType: 'wall'
  },

  'abducao_deitado': {
    id: 'abducao_deitado',
    name: 'Abdução de Quadril Deitado de Lado',
    subtitle: 'Isolamento do glúteo médio para evitar claudicação (manco)',
    category: 'fortalecimento',
    targetMuscles: ['gluteo_medio'],
    primaryJoint: 'Quadril (Abdução no Plano Frontal)',
    targetAngleRange: '0° a 45° de abdução',
    volume: {
      sets: 3,
      reps: 12,
      restSeconds: 45,
    },
    cadence: { eccentric: 3, isometric: 1, concentric: 2 },
    description: [
      'Deite-se de lado, mantendo o corpo perfeitamente reto da cabeça aos pés.',
      'A perna de baixo pode ficar ligeiramente flexionada para dar equilíbrio.',
      'A perna de cima permanece completamente esticada, com o calcanhar ligeiramente apontado para cima.',
      'Eleve a perna até cerca de 40° a 45° sem rodar a pelve para trás.',
      'Desça devagar resistindo à gravidade em 3 segundos.'
    ],
    safetyTips: [
      'Não aponte a ponta dos dedos para o teto, pois isso transfere o esforço para o flexor do quadril.',
      'Mantenha a pelve perpendicular ao solo.'
    ],
    cameraPreset: 'front',
    propType: 'mat'
  },

  'alongamento_toalha_panturrilha': {
    id: 'alongamento_toalha_panturrilha',
    name: 'Alongamento de Panturrilha com Toalha',
    subtitle: 'Descompressão fascial passiva e relaxamento muscular',
    category: 'volta_calma',
    targetMuscles: ['panturrilha'],
    primaryJoint: 'Tornozelo (Dorsiflexão Passiva)',
    targetAngleRange: 'Sustentação elástica 30s',
    volume: {
      sets: 3,
      holdSeconds: 30,
      restSeconds: 20,
    },
    cadence: { eccentric: 2, isometric: 30, concentric: 2 },
    description: [
      'Sentado no solo com pernas estendidas à frente.',
      'Passe uma toalha dobrada sob o antepé da perna operada.',
      'Segure as pontas da toalha com as duas mãos e puxe suavemente na direção do tronco mantendo o joelho esticado.',
      'Sinta o alongamento profundo na panturrilha e sustentando por 30 segundos com respiração tranquila.'
    ],
    safetyTips: [
      'Nunca dê puxões bruscos; o alongamento deve ser contínuo e progressivo.',
      'Mantenha a coluna ereta sem encurvar excessivamente o tronco.'
    ],
    cameraPreset: 'side',
    propType: 'towel'
  },

  'alongamento_isquiotibiais': {
    id: 'alongamento_isquiotibiais',
    name: 'Alongamento de Isquiotibiais no Solo',
    subtitle: 'Flexibilidade da cadeia posterior para descompressão poplítea',
    category: 'volta_calma',
    targetMuscles: ['isquiotibiais'],
    primaryJoint: 'Quadril e Fossa Poplítea',
    targetAngleRange: 'Sustentação passiva 30s',
    volume: {
      sets: 3,
      holdSeconds: 30,
      restSeconds: 20,
    },
    cadence: { eccentric: 2, isometric: 30, concentric: 2 },
    description: [
      'Deitado de costas, flexione uma perna com pé no chão.',
      'Com o auxílio das mãos ou de uma toalha atrás da coxa da perna operada, traga a perna em direção ao peito.',
      'Estenda o joelho gradualmente até o ponto de leve tensão na parte de trás da coxa.',
      'Mantenha a posição por 30 segundos respirando pelo diafragma.'
    ],
    safetyTips: [
      'Não permita que os ombros saiam do chão.',
      'Interrompa se sentir formigamento ou pontadas neurais.'
    ],
    cameraPreset: 'side',
    propType: 'mat'
  },

  'respiracao_diafragmatica': {
    id: 'respiracao_diafragmatica',
    name: 'Respiração Diafragmática e Descompressão',
    subtitle: 'Redução do tônus simpático e oxigenação tecidual',
    category: 'volta_calma',
    targetMuscles: ['core_lombar'],
    primaryJoint: 'Caixa Torácica e Diafragma',
    targetAngleRange: 'Expansão abdominal 4s in / 6s out',
    volume: {
      sets: 1,
      durationSeconds: 180,
      restSeconds: 0,
    },
    cadence: { eccentric: 4, isometric: 2, concentric: 6 },
    description: [
      'Deite-se confortavelmente de barriga para cima, olhos fechados e mãos sobre o abdômen.',
      'Puxe o ar profundamente pelo nariz expandindo a barriga sem movimentar o peito.',
      'Segure por 2 segundos e solte o ar suavemente pela boca em 6 segundos relaxando todo o corpo.',
      'Permaneça por 3 minutos completando o ciclo matutino.'
    ],
    safetyTips: [
      'Evite hiperventilar; respire devagar.',
      'Aproveite para perceber as sensações na perna fortalecida.'
    ],
    cameraPreset: 'top',
    propType: 'mat'
  },

  // --- BLOCO DA NOITE (30 MINUTOS / 00:00 H) ---
  'drenagem_postural': {
    id: 'drenagem_postural',
    name: 'Drenagem Postural Ativa com Pernas Elevadas',
    subtitle: 'Bomba circulatória anti-edema a 90° na parede',
    category: 'drenagem',
    targetMuscles: ['panturrilha', 'tornozelo_tibial'],
    primaryJoint: 'Tornozelo (Dorsiflexão e Flexão Plantar Alternadas)',
    targetAngleRange: 'Pernas a 90° com bombeamento contínuo',
    volume: {
      sets: 3,
      reps: 20,
      restSeconds: 60,
    },
    cadence: { eccentric: 2, isometric: 1, concentric: 2 },
    description: [
      'Deite-se no solo ou na cama e apoie as pernas esticadas verticalmente na parede formando um ângulo de aproximadamente 90°.',
      'Com as pernas elevadas, realize 20 movimentos lentos e amplos puxando a ponta do pé para você e esticando para cima (bomba muscular venosa).',
      'Descanse 1 minuto com as pernas imóveis na parede e repita por 3 ciclos.',
      'Excelente para drenar edemas gravitacionais acumulados durante o dia ao redor da haste metálica.'
    ],
    safetyTips: [
      'Se sentir formigamento nas pontas dos dedos, flexione ligeiramente os joelhos.',
      'Mantenha as costas e pescoço bem confortáveis.'
    ],
    cameraPreset: 'side',
    propType: 'wall'
  },

  'aperto_travesseiro': {
    id: 'aperto_travesseiro',
    name: 'Aperto de Travesseiro (Adutores)',
    subtitle: 'Fortalecimento isométrico do compartimento medial da coxa',
    category: 'isometria',
    targetMuscles: ['adutores', 'quadriceps'],
    primaryJoint: 'Quadril (Adução Isométrica)',
    targetAngleRange: 'Isometria de compressão medial',
    volume: {
      sets: 3,
      reps: 10,
      holdSeconds: 5,
      restSeconds: 30,
    },
    cadence: { eccentric: 1, isometric: 5, concentric: 1 },
    description: [
      'Deitado de costas com joelhos dobrados a 90° e pés firmes no solo.',
      'Posicione um travesseiro firme dobrado entre os dois joelhos.',
      'Aperte com firmeza os joelhos um contra o outro, comprimindo o travesseiro com toda a musculatura interna das coxas.',
      'Mantenha a pressão máxima por 5 segundos inteiros sem prender a respiração.',
      'Relaxe lentamente por 2 segundos antes de repetir.'
    ],
    safetyTips: [
      'Não eleve o quadril do solo durante o aperto; mantenha a coluna neutra.',
      'Garanta força simétrica em ambas as pernas.'
    ],
    cameraPreset: 'front',
    propType: 'pillow'
  },

  'ponte_isometrica_baixa': {
    id: 'ponte_isometrica_baixa',
    name: 'Ponte Isométrica Baixa',
    subtitle: 'Estabilidade lombo-pélvica com ativação suave sem fadiga',
    category: 'isometria',
    targetMuscles: ['gluteo_maximo', 'core_lombar'],
    primaryJoint: 'Quadril (Sustentação a 10 cm do solo)',
    targetAngleRange: 'Elevação de 10 cm · Sustentação 20s',
    volume: {
      sets: 3,
      holdSeconds: 20,
      restSeconds: 30,
    },
    cadence: { eccentric: 2, isometric: 20, concentric: 2 },
    description: [
      'Deite-se de costas com joelhos flexionados e pés apoiados no chão.',
      'Eleve o quadril apenas cerca de 10 centímetros do solo (não suba até o máximo).',
      'Mantenha a pelve suspensa imóvel por 20 segundos, contraindo suavemente os glúteos e abdômen.',
      'Desça devagar e descanse 30 segundos entre as repetições.'
    ],
    safetyTips: [
      'Como este treino é executado perto da hora de dormir, o objetivo não é exaustão, mas alinhamento e tônus calmo.',
      'Mantenha respiração lenta e nasal.'
    ],
    cameraPreset: 'side',
    propType: 'mat'
  },

  'alongamento_flexores_quadril': {
    id: 'alongamento_flexores_quadril',
    name: 'Alongamento dos Flexores de Quadril',
    subtitle: 'Abertura do psoas-ilíaco e alívio de tração femoral',
    category: 'alongamento',
    targetMuscles: ['quadriceps', 'core_lombar'],
    primaryJoint: 'Quadril (Extensão Passiva em Decúbito)',
    targetAngleRange: 'Sustentação 40s por perna',
    volume: {
      sets: 2,
      holdSeconds: 40,
      restSeconds: 20,
    },
    cadence: { eccentric: 2, isometric: 40, concentric: 2 },
    description: [
      'Deitado de costas, mantenha a perna operada estendida e relaxada no chão.',
      'Puxe o outro joelho de encontro ao peito, segurando com as mãos na canela.',
      'Sinta a abertura suave e descompressão na virilha da perna esticada.',
      'Segure por 40 segundos e alterne suavemente.'
    ],
    safetyTips: [
      'Não force o joelho contra o peito se houver desconforto no quadril flexionado.',
      'Mantenha a perna de baixo pesada contra o solo.'
    ],
    cameraPreset: 'side',
    propType: 'mat'
  },

  'postura_da_crianca': {
    id: 'postura_da_crianca',
    name: 'Postura da Criança (Balasana Adaptada)',
    subtitle: 'Descompressão axial da coluna e relaxamento do sistema nervoso',
    category: 'alongamento',
    targetMuscles: ['core_lombar', 'gluteo_maximo'],
    primaryJoint: 'Coluna e Quadril (Flexão com Almofada)',
    targetAngleRange: 'Flexão suave de repouso por 120s',
    volume: {
      sets: 1,
      durationSeconds: 120,
      restSeconds: 0,
    },
    cadence: { eccentric: 4, isometric: 120, concentric: 4 },
    description: [
      'Ajoelhe-se sobre um tatame ou cama macia com joelhos afastados na largura dos ombros.',
      'Coloque uma almofada ou travesseiro de apoio entre os calcanhares e as nádegas para não forçar a flexão extrema do joelho operado.',
      'Incline o tronco para a frente e estenda os braços no chão à sua frente.',
      'Descanse a testa no solo ou sobre um travesseiro e respire lentamente por 2 minutos antes de deitar-se para dormir.'
    ],
    safetyTips: [
      'Nunca force o joelho além do limite de conforto; use tantas almofadas de apoio quanto necessário.',
      'Solte todo o peso do corpo no solo.'
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
