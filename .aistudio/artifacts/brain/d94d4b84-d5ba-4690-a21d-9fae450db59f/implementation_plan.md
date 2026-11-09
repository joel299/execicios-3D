# Aprimoramento do Modelo 3D — Manequim Biomecânico de Madeira Clássico

Plano para substituir os modelos anatômicos primitivos anteriores por um **manequim biomecânico articulado completo de madeira clássica** (estilo *gestalt / artist wooden mannequin*), com volumes anatômicos esculpidos, articulações esféricas completas, mãos, pés, patela e marcação em cor contrastante para a perna operada com pinos.

---

### Decisões Críticas Confirmadas com o Usuário

> [!IMPORTANT]
> - **Estilo Visual do Modelo**: Manequim biomecânico articulado no estilo clássico de madeira torneada (bétula/marfim com textura de veios de madeira procedurais, verniz acetinado e juntas esféricas torneadas).
> - **Anatomia Completa**: Cabeça esculpida com queixo e crânio, pescoço com pivô duplo, tórax volumoso, cintura esférica de transição lombar, bacia pélvica modelada, coxas com curvatura de quadríceps, patela esférica no joelho, panturrilha com bojo muscular anatômico, tornozelos esféricos e pés de 2 segmentos (calcanhar e cunha de antepé), além de braços, cotovelos, punhos e mãos articuladas.
> - **Identificação da Perna com Pinos Metálicos**: Marcação em cor de alto contraste na tíbia direita (madeira nobre escura/ébano com anéis de titânio acetinado e marcadores de parafuso de fixação cirúrgica), permitindo ao paciente identificar instantaneamente a perna operada e a área de proteção mecânica em qualquer ângulo de câmera.

---

## 1. Visão Geral e Benefício Clínico

Os modelos anteriores eram compostos por cilindros e caixas desarticuladas, o que dificultava a compreensão da postura correta (especialmente o alinhamento da coluna, ângulo da bacia, apoio do calcanhar e rotação do quadril). 

O novo modelo traz:
1. **Legibilidade Corporal Imediata**: O manequim de madeira clássico é o padrão ouro universal para representação de movimento humano, proporções anatômicas e alinhamento biomecânico.
2. **Continuidade de Superfície**: Todas as partes corporais se conectam através de encaixes esféricos côncavos e convexos (*ball-and-socket*), eliminando a sensação de modelo "incompleto" ou "quebrado".
3. **Contraste Didático**: A perna com síntese óssea destaca-se claramente com acabamento escurecido e faixas metálicas de fixação, facilitando a visualização dos limites de segurança em agachamentos e mobilizações.

---

## 2. Anatomia Detalhada do Manequim 3D

```
                     ┌───────────┐
                     │  Cabeça   │ (Ovoide de madeira torneada + queixo)
                     └─────┬─────┘
                           │ (Pescoço cilíndrico torneado)
                     ┌─────┴─────┐
           ┌─────────┤   Tórax   ├─────────┐
           │ (Ombro) └─────┬─────┘ (Ombro) │
     ┌─────┴─────┐         │         ┌─────┴─────┐
     │  Braço E  │   ┌─────┴─────┐   │  Braço D  │
     └─────┬─────┘   │  Cintura  │   └─────┬─────┘
    (Cotovelo O)     └─────┬─────┘  (Cotovelo O)
     ┌─────┴─────┐   ┌─────┴─────┐   ┌─────┴─────┐
     │Antebraço E│   │   Pelve   │   │Antebraço D│
     └─────┬─────┘   └─────┬─────┘   └─────┬─────┘
      (Punho O)            │          (Punho O)
     ┌─────┴─────┐   ┌─────┴─────┐   ┌─────┴─────┐
     │   Mão E   │   │           │   │   Mão D   │
     └───────────┘   │           │   └───────────┘
               ┌─────┴─────┐ ┌───┴─────────┐
               │  Coxa E   │ │   Coxa D    │ (Curvatura de quadríceps)
               └─────┬─────┘ └─────┬───────┘
                 (Joelho O)    (Joelho O)
               ┌─────┴─────┐ ┌─────┴───────┐
               │ Canela E  │ │ Perna com   │ ◄── [Marcação Contrastante Ébano]
               │  (Clara)  │ │ Pinos (D)   │     [+ Anéis de Titânio/Parafusos]
               └─────┬─────┘ └─────┬───────┘
               (Tornozelo)   (Tornozelo)
               ┌─────┴─────┐ ┌─────┴───────┐
               │   Pé E    │ │   Pé D      │ (Calcanhar + Cunha de antepé)
               └───────────┘ └─────────────┘
```

### Componentes Modelados:
- **Cabeça & Pescoço**: Cabeça esculpida em forma ovoide anatômica com plano facial orientado, pescoço torneado com junção esférica.
- **Tórax e Tronco**: Caixa torácica esculpida em madeira clara, conectada à pelve por uma esfera lombar que permite inclinações naturais (como no Box Squat e na Postura da Criança).
- **Pelve & Quadris**: Berço pélvico torneado com cavidades acetabulares esféricas para encaixe perfeito dos fêmures.
- **Braços e Mãos**: Ombro esférico, braço cônico, cotovelo esférico, antebraço cônico, punho e mão com bloco palmar e polegar orientador.
- **Pernas**: Coxas esculpidas com volume do quadríceps, articulação de joelho esférica com relevo de patela, panturrilha com curva ergonômica afunilada para o tornozelo.
- **Pés**: Calcanhar arredondado e antepé em cunha plana para pouso perfeito no solo e demonstração de dorsiflexão sem deformações.
- **Perna Operada com Pinos**: Segmento tibial em madeira escura contrastante com dois anéis de fixação cirúrgica em titânio e parafusos transversais destacados.

---

## 3. Arquitetura Técnica & Renderização

1. **Textura Procedural de Madeira Realista (Zero Dependências / Zero 404s)**:
   - Geração de textura procedural em runtime via Canvas 2D (`CanvasTexture`), com veios de madeira de bétula natural, anéis de crescimento e polimento acetinado PBR (`MeshStandardMaterial` com `roughness: 0.35` e `metalness: 0.04`).
   - Material secundário para a perna operada com textura de nogueira/ébano escuro e anéis metálicos (`metalness: 0.9`, `roughness: 0.2`).
2. **Hierarquia Cinemática Compatível**:
   - Manutenção de todos os nós de articulação (`spine`, `hips`, `knees`, `ankles`, `arms`) para preservar 100% da precisão das animações de cada um dos 15 exercícios do programa.
3. **Pacing e Performance**:
   - Respeito integral às diretrizes Three.js (`RoomEnvironment`, `isSoftwareGl`, sombras suaves de contato).

---

## 4. Plano de Implementação

1. **`src/three/ragdollModel.ts`**:
   - Criar o gerador procedural de textura de madeira (*birch wood* e *ebony contrast*).
   - Substituir os blocos primitivos pelas geometrias torneadas (tórax, cintura, pelve, patela, membros com afunilamento anatômico, mãos e pés).
   - Implementar o acabamento contrastante na tíbia direita com os anéis metálicos dos pinos.
2. **`src/three/exerciseAnimations.ts`**:
   - Ajustar as âncoras e pivôs cinemáticos para a nova volumetria articular (especialmente contato de calcanhar e rotação de bacia).
3. **Verificação & Testes**:
   - Executar `compile_applet` e `lint_applet` para assegurar integridade tipográfica e de execução.
