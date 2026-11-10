/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

export interface RagdollNodes {
  root: THREE.Group;
  pelvis: THREE.Group;
  pelvisMesh: THREE.Mesh;
  waistBall: THREE.Mesh;
  spine: THREE.Group;
  chestMesh: THREE.Mesh;
  neckBall: THREE.Mesh;
  head: THREE.Group;
  headMesh: THREE.Mesh;

  // Membros Superiores
  leftClavicle: THREE.Group;
  leftShoulderBall: THREE.Mesh;
  leftUpperArm: THREE.Mesh;
  leftElbow: THREE.Group;
  leftElbowBall: THREE.Mesh;
  leftLowerArm: THREE.Mesh;
  leftWristBall: THREE.Mesh;
  leftHand: THREE.Group;

  rightClavicle: THREE.Group;
  rightShoulderBall: THREE.Mesh;
  rightUpperArm: THREE.Mesh;
  rightElbow: THREE.Group;
  rightElbowBall: THREE.Mesh;
  rightLowerArm: THREE.Mesh;
  rightWristBall: THREE.Mesh;
  rightHand: THREE.Group;

  // Membros Inferiores
  leftHip: THREE.Group;
  leftHipBall: THREE.Mesh;
  leftThigh: THREE.Mesh;
  leftKnee: THREE.Group;
  leftKneeBall: THREE.Mesh;
  leftPatella: THREE.Mesh;
  leftCalf: THREE.Mesh;
  leftAnkle: THREE.Group;
  leftAnkleBall: THREE.Mesh;
  leftFoot: THREE.Group;

  rightHip: THREE.Group;
  rightHipBall: THREE.Mesh;
  rightThigh: THREE.Mesh;
  rightKnee: THREE.Group;
  rightKneeBall: THREE.Mesh;
  rightPatella: THREE.Mesh;
  rightCalf: THREE.Mesh;
  rightAnkle: THREE.Group;
  rightAnkleBall: THREE.Mesh;
  rightFoot: THREE.Group;

  // Destaque de Síntese Óssea / Pinos Cirúrgicos
  implantPinGroup: THREE.Group;
  implantPins: THREE.Mesh[];

  materials: {
    naturalWood: THREE.MeshStandardMaterial;
    jointWood: THREE.MeshStandardMaterial;
    operatedWood: THREE.MeshStandardMaterial;
    metalTitanium: THREE.MeshStandardMaterial;
    muscleHighlight: THREE.MeshStandardMaterial;
  };
}

export interface EnvironmentProps {
  root: THREE.Group;
  mat: THREE.Mesh;
  chair: THREE.Group;
  wall: THREE.Mesh;
  towel: THREE.Mesh;
  pillow: THREE.Mesh;
  setPropVisibility: (propType: 'mat' | 'chair' | 'towel' | 'wall' | 'pillow' | 'none', exerciseId?: string) => void;
}

// Gerador procedural de textura de veios de madeira natural (Zero 404s)
function createProceduralWoodTexture(
  baseColor: string = '#d7b388', 
  grainColor: string = '#a8794c',
  ringFrequency: number = 30
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 512, 512);

  // Desenha anéis e veios longitudinais orgânicos
  ctx.strokeStyle = grainColor;
  ctx.lineWidth = 1.2;
  ctx.globalAlpha = 0.22;

  for (let i = 0; i < 512; i += 3) {
    ctx.beginPath();
    let y = 0;
    ctx.moveTo(i, y);
    while (y < 512) {
      const offset = Math.sin((y / 512) * Math.PI * ringFrequency) * 4 + Math.sin(y * 0.05) * 2;
      ctx.lineTo(i + offset, y);
      y += 6;
    }
    ctx.stroke();
  }

  // Fibras microscópicas sutis
  ctx.globalAlpha = 0.08;
  for (let j = 0; j < 300; j++) {
    const rx = Math.random() * 512;
    const ry = Math.random() * 512;
    const rh = 10 + Math.random() * 40;
    ctx.fillStyle = grainColor;
    ctx.fillRect(rx, ry, 1, rh);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createBiomechanicalRagdoll(): RagdollNodes {
  const root = new THREE.Group();
  root.name = 'RagdollRoot';

  // 1. Texturas procedurais de madeira
  const lightWoodTexture = createProceduralWoodTexture('#dfbe97', '#ab8156', 24);
  const darkEbonyTexture = createProceduralWoodTexture('#473322', '#2a1e14', 36);

  // 2. Materiais PBR de acabamento de estúdio clássico
  const naturalWood = new THREE.MeshStandardMaterial({
    map: lightWoodTexture,
    color: 0xf3d2a7, // Madeira clara torneada clássica
    roughness: 0.38,
    metalness: 0.04,
  });

  const jointWood = new THREE.MeshStandardMaterial({
    color: 0xb5885c, // Madeira de junta torneada mais escura
    roughness: 0.32,
    metalness: 0.06,
  });

  // Madeira contrastante para a perna com implantes/pinos (Ébano cirúrgico)
  const operatedWood = new THREE.MeshStandardMaterial({
    map: darkEbonyTexture,
    color: 0x5a3d28, // Nogueira / ébano escuro de alto contraste
    roughness: 0.35,
    metalness: 0.08,
  });

  const metalTitanium = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.22,
    metalness: 0.92,
  });

  const muscleHighlight = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.45,
    metalness: 0.1,
  });

  // Geometrias anatômicas reutilizáveis
  const sphereGeom = new THREE.SphereGeometry(1, 24, 24);

  // --- 1. Pelve & Cintura Lombar ---
  const pelvis = new THREE.Group();
  pelvis.position.set(0, 0.98, 0);
  root.add(pelvis);

  // Bacia torneada côncava (cesta pélvica)
  const pelvisGeom = new THREE.CylinderGeometry(0.18, 0.13, 0.16, 24);
  const pelvisMesh = new THREE.Mesh(pelvisGeom, naturalWood);
  pelvisMesh.castShadow = true;
  pelvisMesh.receiveShadow = true;
  pelvis.add(pelvisMesh);

  // Esfera de cintura lombar (ball-and-socket que conecta pelve ao tórax)
  const waistBall = new THREE.Mesh(sphereGeom, jointWood);
  waistBall.scale.set(0.10, 0.10, 0.10);
  waistBall.position.set(0, 0.09, 0);
  waistBall.castShadow = true;
  pelvis.add(waistBall);

  // --- 2. Coluna e Tórax Torneado ---
  const spine = new THREE.Group();
  spine.position.set(0, 0.09, 0);
  pelvis.add(spine);

  // Caixa torácica esculpida em forma de barril com afunilamento anatômico
  const chestGeom = new THREE.CylinderGeometry(0.19, 0.14, 0.28, 24);
  const chestMesh = new THREE.Mesh(chestGeom, naturalWood);
  chestMesh.position.set(0, 0.17, 0);
  chestMesh.castShadow = true;
  chestMesh.receiveShadow = true;
  spine.add(chestMesh);

  // Pectoral / ombros em bloco torneado
  const clavicleBlockGeom = new THREE.BoxGeometry(0.42, 0.06, 0.18);
  const clavicleBlock = new THREE.Mesh(clavicleBlockGeom, naturalWood);
  clavicleBlock.position.set(0, 0.29, 0);
  clavicleBlock.castShadow = true;
  spine.add(clavicleBlock);

  // Esfera de pescoço
  const neckBall = new THREE.Mesh(sphereGeom, jointWood);
  neckBall.scale.set(0.065, 0.075, 0.065);
  neckBall.position.set(0, 0.35, 0);
  neckBall.castShadow = true;
  spine.add(neckBall);

  // Cabeça esculpida em ovoide clássico com orientador facial
  const head = new THREE.Group();
  head.position.set(0, 0.44, 0);
  spine.add(head);

  const headGeom = new THREE.SphereGeometry(0.115, 24, 24);
  headGeom.scale(1.0, 1.35, 1.15);
  const headMesh = new THREE.Mesh(headGeom, naturalWood);
  headMesh.castShadow = true;
  head.add(headMesh);

  // Plano sutil de queixo / face do manequim
  const chinGeom = new THREE.BoxGeometry(0.07, 0.09, 0.05);
  const chin = new THREE.Mesh(chinGeom, naturalWood);
  chin.position.set(0, -0.06, 0.08);
  chin.rotation.x = -0.3;
  head.add(chin);

  // --- 3. Membros Superiores (Ombro -> Braço -> Cotovelo -> Antebraço -> Punho -> Mão) ---
  // Braço Esquerdo
  const leftClavicle = new THREE.Group();
  leftClavicle.position.set(-0.24, 0.28, 0);
  spine.add(leftClavicle);

  const leftShoulderBall = new THREE.Mesh(sphereGeom, jointWood);
  leftShoulderBall.scale.set(0.06, 0.06, 0.06);
  leftShoulderBall.castShadow = true;
  leftClavicle.add(leftShoulderBall);

  const armGeom = new THREE.CylinderGeometry(0.045, 0.038, 0.24, 20);
  const leftUpperArm = new THREE.Mesh(armGeom, naturalWood);
  leftUpperArm.position.set(0, -0.14, 0);
  leftUpperArm.castShadow = true;
  leftClavicle.add(leftUpperArm);

  const leftElbow = new THREE.Group();
  leftElbow.position.set(0, -0.14, 0);
  leftUpperArm.add(leftElbow);

  const leftElbowBall = new THREE.Mesh(sphereGeom, jointWood);
  leftElbowBall.scale.set(0.045, 0.045, 0.045);
  leftElbowBall.castShadow = true;
  leftElbow.add(leftElbowBall);

  const forearmGeom = new THREE.CylinderGeometry(0.038, 0.030, 0.22, 20);
  const leftLowerArm = new THREE.Mesh(forearmGeom, naturalWood);
  leftLowerArm.position.set(0, -0.12, 0);
  leftLowerArm.castShadow = true;
  leftElbow.add(leftLowerArm);

  const leftWristBall = new THREE.Mesh(sphereGeom, jointWood);
  leftWristBall.scale.set(0.032, 0.032, 0.032);
  leftWristBall.position.set(0, -0.12, 0);
  leftLowerArm.add(leftWristBall);

  const leftHand = new THREE.Group();
  leftHand.position.set(0, -0.15, 0);
  leftLowerArm.add(leftHand);

  const handGeom = new THREE.BoxGeometry(0.045, 0.07, 0.022);
  const leftHandPalm = new THREE.Mesh(handGeom, naturalWood);
  leftHandPalm.position.set(0, -0.015, 0);
  leftHandPalm.castShadow = true;
  leftHand.add(leftHandPalm);

  // Braço Direito
  const rightClavicle = new THREE.Group();
  rightClavicle.position.set(0.24, 0.28, 0);
  spine.add(rightClavicle);

  const rightShoulderBall = new THREE.Mesh(sphereGeom, jointWood);
  rightShoulderBall.scale.set(0.06, 0.06, 0.06);
  rightShoulderBall.castShadow = true;
  rightClavicle.add(rightShoulderBall);

  const rightUpperArm = new THREE.Mesh(armGeom, naturalWood);
  rightUpperArm.position.set(0, -0.14, 0);
  rightUpperArm.castShadow = true;
  rightClavicle.add(rightUpperArm);

  const rightElbow = new THREE.Group();
  rightElbow.position.set(0, -0.14, 0);
  rightUpperArm.add(rightElbow);

  const rightElbowBall = new THREE.Mesh(sphereGeom, jointWood);
  rightElbowBall.scale.set(0.045, 0.045, 0.045);
  rightElbowBall.castShadow = true;
  rightElbow.add(rightElbowBall);

  const rightLowerArm = new THREE.Mesh(forearmGeom, naturalWood);
  rightLowerArm.position.set(0, -0.12, 0);
  rightLowerArm.castShadow = true;
  rightElbow.add(rightLowerArm);

  const rightWristBall = new THREE.Mesh(sphereGeom, jointWood);
  rightWristBall.scale.set(0.032, 0.032, 0.032);
  rightWristBall.position.set(0, -0.12, 0);
  rightLowerArm.add(rightWristBall);

  const rightHand = new THREE.Group();
  rightHand.position.set(0, -0.15, 0);
  rightLowerArm.add(rightHand);

  const rightHandPalm = new THREE.Mesh(handGeom, naturalWood);
  rightHandPalm.position.set(0, -0.015, 0);
  rightHandPalm.castShadow = true;
  rightHand.add(rightHandPalm);

  // --- 4. Membros Inferiores (Quadril -> Coxa -> Joelho/Patela -> Perna/Tíbia -> Tornozelo -> Pé) ---
  // Geometrias das Pernas
  const thighGeom = new THREE.CylinderGeometry(0.075, 0.055, 0.38, 24);
  const calfGeom = new THREE.CylinderGeometry(0.058, 0.042, 0.38, 24);

  // Perna Esquerda (Perna Sadia - Madeira Clara)
  const leftHip = new THREE.Group();
  leftHip.position.set(-0.12, -0.07, 0);
  pelvis.add(leftHip);

  const leftHipBall = new THREE.Mesh(sphereGeom, jointWood);
  leftHipBall.scale.set(0.068, 0.068, 0.068);
  leftHipBall.castShadow = true;
  leftHip.add(leftHipBall);

  const leftThigh = new THREE.Mesh(thighGeom, naturalWood);
  leftThigh.position.set(0, -0.20, 0);
  leftThigh.castShadow = true;
  leftThigh.receiveShadow = true;
  leftHip.add(leftThigh);

  const leftKnee = new THREE.Group();
  leftKnee.position.set(0, -0.20, 0);
  leftThigh.add(leftKnee);

  const leftKneeBall = new THREE.Mesh(sphereGeom, jointWood);
  leftKneeBall.scale.set(0.058, 0.058, 0.058);
  leftKneeBall.castShadow = true;
  leftKnee.add(leftKneeBall);

  // Patela anatômica frontal
  const patellaGeom = new THREE.CylinderGeometry(0.032, 0.028, 0.015, 16);
  patellaGeom.rotateX(Math.PI / 2);
  const leftPatella = new THREE.Mesh(patellaGeom, naturalWood);
  leftPatella.position.set(0, 0, 0.052);
  leftKnee.add(leftPatella);

  const leftCalf = new THREE.Mesh(calfGeom, naturalWood);
  leftCalf.position.set(0, -0.20, 0);
  leftCalf.castShadow = true;
  leftCalf.receiveShadow = true;
  leftKnee.add(leftCalf);

  const leftAnkle = new THREE.Group();
  leftAnkle.position.set(0, -0.20, 0);
  leftCalf.add(leftAnkle);

  const leftAnkleBall = new THREE.Mesh(sphereGeom, jointWood);
  leftAnkleBall.scale.set(0.045, 0.045, 0.045);
  leftAnkleBall.castShadow = true;
  leftAnkle.add(leftAnkleBall);

  // Pé esquerdo articulado (Calcanhar + Cunha de antepé anatômico)
  const leftFoot = new THREE.Group();
  leftFoot.position.set(0, -0.04, 0.04);
  leftAnkle.add(leftFoot);

  const heelGeom = new THREE.SphereGeometry(0.042, 16, 16);
  const leftHeel = new THREE.Mesh(heelGeom, naturalWood);
  leftHeel.scale.set(1.0, 0.7, 1.2);
  leftHeel.position.set(0, 0, -0.04);
  leftHeel.castShadow = true;
  leftFoot.add(leftHeel);

  const forefootGeom = new THREE.BoxGeometry(0.082, 0.038, 0.14);
  const leftForefoot = new THREE.Mesh(forefootGeom, naturalWood);
  leftForefoot.position.set(0, -0.012, 0.05);
  leftForefoot.castShadow = true;
  leftFoot.add(leftForefoot);

  // --- Perna Direita (Perna Operada com Pinos Metálicos - Madeira Ébano de Alto Contraste) ---
  const rightHip = new THREE.Group();
  rightHip.position.set(0.12, -0.07, 0);
  pelvis.add(rightHip);

  const rightHipBall = new THREE.Mesh(sphereGeom, jointWood);
  rightHipBall.scale.set(0.068, 0.068, 0.068);
  rightHipBall.castShadow = true;
  rightHip.add(rightHipBall);

  const rightThigh = new THREE.Mesh(thighGeom, naturalWood);
  rightThigh.position.set(0, -0.20, 0);
  rightThigh.castShadow = true;
  rightThigh.receiveShadow = true;
  rightHip.add(rightThigh);

  const rightKnee = new THREE.Group();
  rightKnee.position.set(0, -0.20, 0);
  rightThigh.add(rightKnee);

  const rightKneeBall = new THREE.Mesh(sphereGeom, jointWood);
  rightKneeBall.scale.set(0.058, 0.058, 0.058);
  rightKneeBall.castShadow = true;
  rightKnee.add(rightKneeBall);

  const rightPatella = new THREE.Mesh(patellaGeom, naturalWood);
  rightPatella.position.set(0, 0, 0.052);
  rightKnee.add(rightPatella);

  // CANELA OPERADA (Tíbia Direita): Acabamento contrastante escuro em madeira nobre
  const rightCalf = new THREE.Mesh(calfGeom, operatedWood);
  rightCalf.position.set(0, -0.20, 0);
  rightCalf.castShadow = true;
  rightCalf.receiveShadow = true;
  rightKnee.add(rightCalf);

  // Anéis e marcadores de parafuso de titânio (Pinos Cirúrgicos de Síntese Óssea)
  const implantPinGroup = new THREE.Group();
  rightCalf.add(implantPinGroup);

  const ringGeom = new THREE.CylinderGeometry(0.062, 0.062, 0.018, 24);
  const topRing = new THREE.Mesh(ringGeom, metalTitanium);
  topRing.position.set(0, 0.12, 0);
  implantPinGroup.add(topRing);

  const bottomRing = new THREE.Mesh(ringGeom, metalTitanium);
  bottomRing.position.set(0, -0.10, 0);
  implantPinGroup.add(bottomRing);

  // Parafusos transversais de fixação cirúrgica com cabeça arredondada
  const screwGeom = new THREE.CylinderGeometry(0.012, 0.012, 0.13, 12);
  screwGeom.rotateZ(Math.PI / 2);

  const screw1 = new THREE.Mesh(screwGeom, metalTitanium);
  screw1.position.set(0, 0.12, 0);
  implantPinGroup.add(screw1);

  const screw2 = new THREE.Mesh(screwGeom, metalTitanium);
  screw2.position.set(0, -0.10, 0);
  implantPinGroup.add(screw2);

  const rightAnkle = new THREE.Group();
  rightAnkle.position.set(0, -0.20, 0);
  rightCalf.add(rightAnkle);

  const rightAnkleBall = new THREE.Mesh(sphereGeom, jointWood);
  rightAnkleBall.scale.set(0.045, 0.045, 0.045);
  rightAnkleBall.castShadow = true;
  rightAnkle.add(rightAnkleBall);

  // Pé direito articulado
  const rightFoot = new THREE.Group();
  rightFoot.position.set(0, -0.04, 0.04);
  rightAnkle.add(rightFoot);

  const rightHeel = new THREE.Mesh(heelGeom, naturalWood);
  rightHeel.scale.set(1.0, 0.7, 1.2);
  rightHeel.position.set(0, 0, -0.04);
  rightHeel.castShadow = true;
  rightFoot.add(rightHeel);

  const rightForefoot = new THREE.Mesh(forefootGeom, naturalWood);
  rightForefoot.position.set(0, -0.012, 0.05);
  rightForefoot.castShadow = true;
  rightFoot.add(rightForefoot);

  return {
    root,
    pelvis,
    pelvisMesh,
    waistBall,
    spine,
    chestMesh,
    neckBall,
    head,
    headMesh,
    leftClavicle,
    leftShoulderBall,
    leftUpperArm,
    leftElbow,
    leftElbowBall,
    leftLowerArm,
    leftWristBall,
    leftHand,
    rightClavicle,
    rightShoulderBall,
    rightUpperArm,
    rightElbow,
    rightElbowBall,
    rightLowerArm,
    rightWristBall,
    rightHand,
    leftHip,
    leftHipBall,
    leftThigh,
    leftKnee,
    leftKneeBall,
    leftPatella,
    leftCalf,
    leftAnkle,
    leftAnkleBall,
    leftFoot,
    rightHip,
    rightHipBall,
    rightThigh,
    rightKnee,
    rightKneeBall,
    rightPatella,
    rightCalf,
    rightAnkle,
    rightAnkleBall,
    rightFoot,
    implantPinGroup,
    implantPins: [topRing, bottomRing, screw1, screw2],
    materials: {
      naturalWood,
      jointWood,
      operatedWood,
      metalTitanium,
      muscleHighlight,
    }
  };
}

export function createEnvironmentProps(): EnvironmentProps {
  const root = new THREE.Group();
  root.name = 'EnvironmentProps';

  // 1. Tatame / Colchonete Clínico
  const matGeom = new THREE.BoxGeometry(1.3, 0.03, 2.2);
  const matMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.85,
    metalness: 0.05,
  });
  const mat = new THREE.Mesh(matGeom, matMat);
  mat.position.set(0, 0.015, 0);
  mat.receiveShadow = true;
  root.add(mat);

  // 2. Cadeira de Reabilitação Sólida Torneada (Box Squat)
  const chair = new THREE.Group();
  chair.position.set(0, 0, -0.42);
  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x2b374a,
    roughness: 0.5,
  });

  const seatGeom = new THREE.BoxGeometry(0.54, 0.04, 0.50);
  const seat = new THREE.Mesh(seatGeom, woodMat);
  seat.position.set(0, 0.48, 0);
  seat.castShadow = true;
  seat.receiveShadow = true;
  chair.add(seat);

  const backGeom = new THREE.BoxGeometry(0.54, 0.48, 0.04);
  const back = new THREE.Mesh(backGeom, woodMat);
  back.position.set(0, 0.74, -0.23);
  back.castShadow = true;
  chair.add(back);

  // Pernas torneadas da cadeira
  const legGeom = new THREE.CylinderGeometry(0.022, 0.018, 0.48, 12);
  const legPositions = [
    [-0.23, 0.24, -0.21],
    [0.23, 0.24, -0.21],
    [-0.23, 0.24, 0.21],
    [0.23, 0.24, 0.21]
  ];
  legPositions.forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(legGeom, woodMat);
    leg.position.set(x, y, z);
    leg.castShadow = true;
    chair.add(leg);
  });
  root.add(chair);

  // 3. Parede para apoio / dorsiflexão
  const wallGeom = new THREE.BoxGeometry(0.9, 2.5, 0.06);
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x1e2638,
    roughness: 0.9,
  });
  const wall = new THREE.Mesh(wallGeom, wallMat);
  wall.position.set(0, 1.25, 0.18);
  wall.receiveShadow = true;
  root.add(wall);

  // 4. Toalha Enrolada (para Extensão isométrica de joelho)
  const towelGeom = new THREE.CylinderGeometry(0.055, 0.055, 0.42, 16);
  towelGeom.rotateZ(Math.PI / 2);
  const towelMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7, // Azul toalha
    roughness: 0.9,
  });
  const towel = new THREE.Mesh(towelGeom, towelMat);
  towel.position.set(0.12, 0.055, 0.38);
  towel.castShadow = true;
  root.add(towel);

  // 5. Almofada / Travesseiro Firme (Aperto de adutores / Postura da Criança)
  const pillowGeom = new THREE.BoxGeometry(0.26, 0.16, 0.30);
  const pillowMat = new THREE.MeshStandardMaterial({
    color: 0xd97706, // Âmbar têxtil
    roughness: 0.9,
  });
  const pillow = new THREE.Mesh(pillowGeom, pillowMat);
  pillow.position.set(0, 0.38, 0.16);
  pillow.castShadow = true;
  root.add(pillow);

  const setPropVisibility = (propType: 'mat' | 'chair' | 'towel' | 'wall' | 'pillow' | 'none', exerciseId = '') => {
    mat.visible = propType === 'mat' || propType === 'towel' || propType === 'pillow' || exerciseId === 'drenagem_postural';
    chair.visible = propType === 'chair';
    wall.visible = propType === 'wall';
    wall.position.z = exerciseId === 'drenagem_postural' ? 0.48 : exerciseId === 'dorsiflexao_parede' ? 0.27 : 0.18;
    towel.visible = propType === 'towel';
    towel.position.z = exerciseId === 'alongamento_toalha_panturrilha' ? 0.86 : 0.38;
    pillow.visible = propType === 'pillow';
  };

  setPropVisibility('chair');

  return {
    root,
    mat,
    chair,
    wall,
    towel,
    pillow,
    setPropVisibility,
  };
}
