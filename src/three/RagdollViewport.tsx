/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ExerciseDef } from '../types/workout';
import { createBiomechanicalRagdoll, createEnvironmentProps, RagdollNodes, EnvironmentProps } from './ragdollModel';
import { animateExercisePose, FrameEvaluation } from './exerciseAnimations';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Camera, 
  Eye, 
  Gauge, 
  ShieldCheck, 
  Zap,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface RagdollViewportProps {
  exercise: ExerciseDef;
  onAngleUpdate?: (angle: number) => void;
  speedMultiplier?: number;
  isNightMode?: boolean;
}

export const RagdollViewport: React.FC<RagdollViewportProps> = ({
  exercise,
  onAngleUpdate,
  speedMultiplier = 1.0,
  isNightMode = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Estados de controle interativo
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [activeSpeed, setActiveSpeed] = useState<number>(speedMultiplier);
  const [cameraPreset, setCameraPreset] = useState<'front' | 'side' | 'isometric' | 'top'>('side');
  const [showPinsHighlight, setShowPinsHighlight] = useState<boolean>(true);
  const [frameEval, setFrameEval] = useState<FrameEvaluation>({
    primaryAngleDegrees: 0,
    primaryJointLabel: exercise.primaryJoint,
    phaseLabel: 'Preparação',
    isContracting: false,
  });
  const [isControlsExpanded, setIsControlsExpanded] = useState<boolean>(true);

  // Referências mutáveis para o loop de animação do Three.js
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const ragdollRef = useRef<RagdollNodes | null>(null);
  const propsRef = useRef<EnvironmentProps | null>(null);
  const progressRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(true);
  const speedRef = useRef<number>(speedMultiplier);
  const exerciseIdRef = useRef<string>(exercise.id);

  // Sincroniza refs com state
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    speedRef.current = activeSpeed;
  }, [activeSpeed]);

  useEffect(() => {
    exerciseIdRef.current = exercise.id;
    if (propsRef.current) {
      propsRef.current.setPropVisibility(exercise.propType);
    }
    // Ajusta preset sugerido
    handleCameraPreset(exercise.cameraPreset);
  }, [exercise]);

  // Função para transição suave de câmera
  const handleCameraPreset = (preset: 'front' | 'side' | 'isometric' | 'top') => {
    setCameraPreset(preset);
    if (!cameraRef.current || !controlsRef.current) return;

    const camera = cameraRef.current;
    const controls = controlsRef.current;

    switch (preset) {
      case 'front':
        camera.position.set(0, 0.95, 2.4);
        controls.target.set(0, 0.75, 0);
        break;
      case 'side':
        camera.position.set(2.4, 0.85, 0);
        controls.target.set(0, 0.65, 0);
        break;
      case 'isometric':
        camera.position.set(1.9, 1.8, 1.9);
        controls.target.set(0, 0.65, 0);
        break;
      case 'top':
        camera.position.set(0, 2.8, 0.4);
        controls.target.set(0, 0.2, 0);
        break;
    }
    controls.update();
  };

  // Efeito principal de montagem da cena Three.js
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detecção segura de WebGL por software
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // 2. Configuração do Renderer de Alta Fidelidade
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Cena e Iluminação de Estúdio Biomecânico
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isNightMode ? 0x0c0d10 : 0x0f141c);
    sceneRef.current = scene;

    // Ambiente PBR com RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Iluminação 3-Pontos
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3, 4, 3);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 10;
      keyLight.shadow.camera.left = -2;
      keyLight.shadow.camera.right = 2;
      keyLight.shadow.camera.top = 2;
      keyLight.shadow.camera.bottom = -2;
    }
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x1e293b, 1.2);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.0);
    rimLight.position.set(-3, 2, -3);
    scene.add(rimLight);

    // Grade milimétrica clínica no solo
    const grid = new THREE.GridHelper(6, 24, 0x334155, 0x1e293b);
    grid.position.y = 0.001;
    scene.add(grid);

    // Sombra de contato suave radial no chão
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const shadowCtx = shadowCanvas.getContext('2d')!;
    const grad = shadowCtx.createRadialGradient(64, 64, 10, 64, 64, 60);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    shadowCtx.fillStyle = grad;
    shadowCtx.fillRect(0, 0, 128, 128);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const contactShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.6, 1.6),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.65,
      })
    );
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.002;
    scene.add(contactShadow);

    // 4. Câmera e Controles Orbitais
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      20
    );
    camera.position.set(2.4, 0.85, 0);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.08;
    controls.target.set(0, 0.65, 0);
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Não atravessar o piso
    controls.minDistance = 0.8;
    controls.maxDistance = 5.0;
    controlsRef.current = controls;

    // 5. Instanciação dos Modelos 3D
    const ragdoll = createBiomechanicalRagdoll();
    scene.add(ragdoll.root);
    ragdollRef.current = ragdoll;

    const envProps = createEnvironmentProps();
    scene.add(envProps.root);
    propsRef.current = envProps;
    envProps.setPropVisibility(exercise.propType);

    // 6. Loop de Renderização Contínuo e Paced
    let animationFrameId = 0;
    let lastTime = performance.now();

    const tick = () => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlayingRef.current) {
        // Velocidade base: 1 ciclo a cada 6 segundos (cadência 3-1-2)
        const cycleDuration = 6.0 / (speedRef.current || 1.0);
        progressRef.current = (progressRef.current + delta / cycleDuration) % 1.0;
        setProgress(progressRef.current);
      }

      // Aplica rotações nos segmentos articulados do ragdoll
      if (ragdollRef.current) {
        const ev = animateExercisePose(
          exerciseIdRef.current,
          progressRef.current,
          ragdollRef.current
        );
        setFrameEval(ev);
        if (onAngleUpdate) {
          onAngleUpdate(ev.primaryAngleDegrees);
        }

        // Toggle visibilidade e contraste da perna operada (tíbia direita)
        if (ragdollRef.current.rightCalf) {
          ragdollRef.current.rightCalf.material = showPinsHighlight
            ? ragdollRef.current.materials.operatedWood
            : ragdollRef.current.materials.naturalWood;
        }
        if (ragdollRef.current.implantPinGroup) {
          ragdollRef.current.implantPinGroup.visible = showPinsHighlight;
        }
      }

      controls.update();
      renderer.render(scene, camera);

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    // 7. Redimensionamento Responsivo
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isNightMode]);

  // Manipulador de scrubber temporal manual
  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    progressRef.current = val;
    setProgress(val);
    if (ragdollRef.current) {
      const ev = animateExercisePose(exerciseIdRef.current, val, ragdollRef.current);
      setFrameEval(ev);
      if (onAngleUpdate) {
        onAngleUpdate(ev.primaryAngleDegrees);
      }
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-slate-950 select-none">
      {/* Viewport 3D Canvas Mount (100% Desobstruído) */}
      <div 
        ref={mountRef} 
        className="w-full flex-1 relative cursor-grab active:cursor-grabbing focus:outline-none"
      />

      {/* Goniômetro Clínico e Metadados (Top Overlay Discreto) */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-none z-10">
        {/* Painel Esquerdo: Goniômetro Digital */}
        <div className="bg-slate-900/90 border border-slate-700/80 px-3.5 py-2.5 backdrop-blur-md flex items-center gap-4 pointer-events-auto">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
              {frameEval.primaryJointLabel}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-sky-400 tabular-nums">
                {frameEval.primaryAngleDegrees}°
              </span>
              <span className="text-xs text-slate-400 font-mono">
                / {exercise.targetAngleRange}
              </span>
            </div>
          </div>

          <div className="h-7 w-px bg-slate-700" />

          {/* Fase e Contração */}
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
              Fase da Cadência
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold ${frameEval.isContracting ? 'text-amber-400' : 'text-slate-200'}`}>
                {frameEval.phaseLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Painel Direito: Status Clínico do Implante & Câmera */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setShowPinsHighlight(!showPinsHighlight)}
            className={`px-3 py-1.5 text-xs font-mono border flex items-center gap-1.5 transition-colors ${
              showPinsHighlight 
                ? 'bg-amber-500/10 border-amber-500/50 text-amber-300' 
                : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Destacar marcação contrastante da perna operada e pinos cirúrgicos"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Perna com Pinos {showPinsHighlight ? 'Destacada' : 'Normal'}</span>
          </button>

          {/* Seletor de Câmera Biomecânica */}
          <div className="flex items-center bg-slate-900/90 border border-slate-700 p-0.5">
            <button
              onClick={() => handleCameraPreset('front')}
              className={`px-2.5 py-1 text-xs font-mono transition-colors ${
                cameraPreset === 'front' ? 'bg-sky-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Frontal
            </button>
            <button
              onClick={() => handleCameraPreset('side')}
              className={`px-2.5 py-1 text-xs font-mono transition-colors ${
                cameraPreset === 'side' ? 'bg-sky-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sagital
            </button>
            <button
              onClick={() => handleCameraPreset('isometric')}
              className={`px-2.5 py-1 text-xs font-mono transition-colors ${
                cameraPreset === 'isometric' ? 'bg-sky-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Isométrico
            </button>
          </div>
        </div>
      </div>

      {/* Dock de Controle Inferior (Collapsible Dock Centralizado) */}
      <div className="w-full bg-slate-900/95 border-t border-slate-800 p-3 z-20">
        {/* Toggle para expandir/recolher controles finos */}
        <div className="max-w-4xl mx-auto flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pausar Loop' : 'Reproduzir'}</span>
            </button>

            <button
              onClick={() => {
                progressRef.current = 0;
                setProgress(0);
              }}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1 transition-colors border border-slate-700"
              title="Reiniciar repetição"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>0%</span>
            </button>

            {/* Velocidade de demonstração */}
            <div className="flex items-center bg-slate-950 border border-slate-800 p-0.5">
              {[0.5, 1.0, 1.5].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setActiveSpeed(spd)}
                  className={`px-2 py-1 text-xs font-mono transition-colors ${
                    activeSpeed === spd ? 'bg-slate-700 text-sky-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Cadência 3-1-2 descrita */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Cadência:</span>
            <span className="text-sky-300">{exercise.cadence.eccentric}s Descendo</span>
            <span>·</span>
            <span className="text-amber-300">{exercise.cadence.isometric}s Isometria</span>
            <span>·</span>
            <span className="text-emerald-300">{exercise.cadence.concentric}s Subindo</span>
          </div>

          <button
            onClick={() => setIsControlsExpanded(!isControlsExpanded)}
            className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors"
            title={isControlsExpanded ? 'Recolher detalhes' : 'Expandir detalhes'}
          >
            {isControlsExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Scrubber Temporal de Alta Precisão */}
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <span className="text-[11px] font-mono text-slate-400 w-12 tabular-nums">
            {Math.round(progress * 100)}%
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.005"
            value={progress}
            onChange={handleScrubberChange}
            className="flex-1 h-1.5 bg-slate-800 rounded-none appearance-none cursor-pointer accent-sky-400 focus:outline-none"
          />
          <span className="text-[11px] font-mono text-slate-400 w-16 text-right">
            {(progress * 6.0).toFixed(1)}s / 6s
          </span>
        </div>

        {/* Detalhes Expansíveis de Biomecânica e Segurança */}
        {isControlsExpanded && (
          <div className="max-w-4xl mx-auto mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950/70 p-2.5 border border-slate-800">
              <span className="text-[10px] text-sky-400 font-mono uppercase tracking-wider block mb-1">
                Biomecânica & Músculos Ativados
              </span>
              <p className="text-slate-300 leading-relaxed">
                {exercise.subtitle}. Foco em {exercise.targetMuscles.map(m => m.replace('_', ' ')).join(', ')}.
              </p>
            </div>

            <div className="bg-slate-950/70 p-2.5 border border-amber-900/40">
              <span className="text-[10px] text-amber-400 font-mono uppercase tracking-wider block mb-1">
                Segurança Clínica para Implantes Metálicos
              </span>
              <p className="text-amber-200/90 leading-relaxed">
                {exercise.implantPrecautions}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
