// =============================================================
//  RA — Estructura de proteínas e Inteligencia Artificial
//
//  Marcador 1  ->  proteína GFP completa
//  Marcador 2  ->  cadena de aminoácidos que se pliega en hélice
//  Marcador 3  ->  estructura terciaria (modelo completo)
//  Marcador 4  ->  estructura cuaternaria (cuatro subunidades)
// =============================================================

import * as THREE from 'three';
import { MindARThree } from './vendor/mindar/mindar-image-three.prod.js';
import { GLTFLoader } from './vendor/jsm/GLTFLoader.js';
import { DRACOLoader } from './vendor/jsm/DRACOLoader.js';
import { MARCADORES, SECCIONES, QUIZ, FUENTES } from './contenido.js';

// -------------------------------------------------------------
// CONFIGURACIÓN
// -------------------------------------------------------------
const CONFIG = {
  velocidadRotacion: 26,     // grados por segundo
  amplitudFlotacion: 0.045,  // qué tanto sube y baja
  velocidadFlotacion: 1.6,   // qué tan rápido sube y baja
  alturaBase: 0.14,          // altura sobre el marcador
  tamano: 0.72,              // proporción del ancho del marcador
  segundosPlegado: 5         // duración del ciclo de plegado
};

// -------------------------------------------------------------
// INTERFAZ
// -------------------------------------------------------------
const $ = (sel) => document.querySelector(sel);

const pantallaInicio = $('#pantallaInicio');
const contenedorAR   = $('#contenedorAR');
const hud            = $('#hud');
const mensaje        = $('#mensaje');
const panelInfo      = $('#panelInfo');
const infoTitulo     = $('#infoTitulo');
const infoSubtitulo  = $('#infoSubtitulo');
const infoPuntos     = $('#infoPuntos');
const btnSaberMas    = $('#btnSaberMas');
const cargando       = $('#cargando');
const cargandoTexto  = $('#cargandoTexto');
const lector         = $('#lector');
const lectorNav      = $('#lectorNav');
const lectorContenido = $('#lectorContenido');

let seccionDelMarcador = 'ia-biotec';

// -------------------------------------------------------------
// CARGA DE MODELOS
// -------------------------------------------------------------
let modeloCompleto = null;
let modeloLigero = null;

function nuevoCargador() {
  const draco = new DRACOLoader();
  draco.setDecoderPath('./js/vendor/draco/');
  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);
  return loader;
}

function normalizar(objeto, tamanoDeseado) {
  const caja = new THREE.Box3().setFromObject(objeto);
  const centro = caja.getCenter(new THREE.Vector3());
  const medidas = caja.getSize(new THREE.Vector3());
  const lado = Math.max(medidas.x, medidas.y, medidas.z) || 1;
  const escala = tamanoDeseado / lado;

  // Se envuelve en un grupo para que el centrado no pelee con la rotación
  const envoltura = new THREE.Group();
  objeto.position.set(-centro.x, -centro.y, -centro.z);
  envoltura.add(objeto);
  envoltura.scale.setScalar(escala);
  return envoltura;
}

async function cargarModelos() {
  if (modeloCompleto) return;
  const loader = nuevoCargador();
  const a = await loader.loadAsync('./assets/proteina.glb');
  modeloCompleto = a.scene;
  try {
    // Versión muy ligera: se repite cuatro veces en la estructura cuaternaria,
    // así que conviene que cada copia pese poco.
    const b = await loader.loadAsync('./assets/proteina_min.glb');
    modeloLigero = b.scene;
  } catch (e) {
    modeloLigero = modeloCompleto;   // si falla, se usa el completo
  }
}

function crearLuces() {
  const g = new THREE.Group();
  g.add(new THREE.HemisphereLight(0xffffff, 0x3d4a63, 1.5));
  const d1 = new THREE.DirectionalLight(0xffffff, 1.15);
  d1.position.set(1, 2, 3);
  g.add(d1);
  const d2 = new THREE.DirectionalLight(0x9fd8ff, 0.55);
  d2.position.set(-2, -1, 1.5);
  g.add(d2);
  return g;
}

// -------------------------------------------------------------
// NODOS 3D — cada uno devuelve { objeto, actualizar(t, dt) }
// -------------------------------------------------------------

// Modelo de la proteína girando y flotando
function nodoProteina(fuente, tamano) {
  const pivote = new THREE.Group();
  const envoltura = normalizar(fuente.clone(true), tamano);
  envoltura.rotation.x = -Math.PI / 2;   // el eje vertical del modelo sale del marcador
  pivote.add(envoltura);
  pivote.position.z = CONFIG.alturaBase;

  return {
    objeto: pivote,
    actualizar(t, dt) {
      pivote.rotation.z += THREE.MathUtils.degToRad(CONFIG.velocidadRotacion) * dt;
      pivote.position.z = CONFIG.alturaBase +
        Math.sin(t * CONFIG.velocidadFlotacion) * CONFIG.amplitudFlotacion;
    }
  };
}

// Cadena de aminoácidos que pasa de estirada (primaria) a hélice (secundaria)
function nodoCadenaPlegable(n = 26) {
  const pivote = new THREE.Group();
  pivote.position.z = CONFIG.alturaBase;

  const geoEsfera = new THREE.SphereGeometry(0.021, 16, 12);
  const esferas = [];

  for (let i = 0; i < n; i++) {
    const color = new THREE.Color().setHSL(0.58 - (i / n) * 0.45, 0.72, 0.56);
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.42, metalness: 0.05 });
    const m = new THREE.Mesh(geoEsfera, mat);
    pivote.add(m);
    esferas.push(m);
  }

  // Línea que une las esferas
  const posLinea = new Float32Array(n * 3);
  const geoLinea = new THREE.BufferGeometry();
  geoLinea.setAttribute('position', new THREE.BufferAttribute(posLinea, 3));
  const linea = new THREE.Line(
    geoLinea,
    new THREE.LineBasicMaterial({ color: 0xbcd8ff, transparent: true, opacity: 0.55 })
  );
  pivote.add(linea);

  const centrar = (n - 1) / 2;

  // Posición de cada esfera en cada estado
  function estirada(i, v) {
    v.set((i - centrar) * 0.036, 0, 0);
  }
  function helice(i, v) {
    const angulo = i * 1.745;          // ~100° por residuo, como una hélice alfa
    const radio = 0.085;
    v.set((i - centrar) * 0.021, radio * Math.cos(angulo), radio * Math.sin(angulo));
  }

  const a = new THREE.Vector3();
  const b = new THREE.Vector3();

  return {
    objeto: pivote,
    actualizar(t, dt) {
      // Ciclo de ida y vuelta entre los dos estados
      const ciclo = (t % CONFIG.segundosPlegado) / CONFIG.segundosPlegado;
      const bruto = ciclo < 0.5 ? ciclo * 2 : (1 - ciclo) * 2;
      const k = bruto * bruto * (3 - 2 * bruto);   // suavizado

      for (let i = 0; i < n; i++) {
        estirada(i, a);
        helice(i, b);
        const x = a.x + (b.x - a.x) * k;
        const y = a.y + (b.y - a.y) * k;
        const z = a.z + (b.z - a.z) * k;
        esferas[i].position.set(x, y, z);
        posLinea[i * 3] = x;
        posLinea[i * 3 + 1] = y;
        posLinea[i * 3 + 2] = z;
      }
      geoLinea.attributes.position.needsUpdate = true;
      geoLinea.computeBoundingSphere();

      pivote.rotation.z += THREE.MathUtils.degToRad(CONFIG.velocidadRotacion * 0.7) * dt;
      pivote.position.z = CONFIG.alturaBase +
        Math.sin(t * CONFIG.velocidadFlotacion) * CONFIG.amplitudFlotacion * 0.6;
    }
  };
}

// Cuatro subunidades ensambladas
function nodoComplejo(fuente) {
  const pivote = new THREE.Group();
  pivote.position.z = CONFIG.alturaBase;

  const sub = 0.3;
  const d = 0.19;
  const posiciones = [
    [-d, -d * 0.6, 0],
    [d, -d * 0.6, 0],
    [-d, d * 0.6, 0.03],
    [d, d * 0.6, 0.03]
  ];
  const tintes = [0x7ee0a8, 0x8fb8ff, 0xffc98a, 0xff9ab5];

  posiciones.forEach((p, i) => {
    const envoltura = normalizar(fuente.clone(true), sub);
    envoltura.rotation.x = -Math.PI / 2;
    envoltura.rotation.z = i * 1.2;
    envoltura.position.set(p[0], p[1], p[2]);

    // Un tinte distinto por subunidad, para distinguirlas
    envoltura.traverse((o) => {
      if (o.isMesh && o.material) {
        o.material = o.material.clone();
        if (o.material.color) o.material.color.lerp(new THREE.Color(tintes[i]), 0.55);
      }
    });

    pivote.add(envoltura);
  });

  return {
    objeto: pivote,
    actualizar(t, dt) {
      pivote.rotation.z += THREE.MathUtils.degToRad(CONFIG.velocidadRotacion * 0.6) * dt;
      pivote.position.z = CONFIG.alturaBase +
        Math.sin(t * CONFIG.velocidadFlotacion) * CONFIG.amplitudFlotacion;
    }
  };
}

// -------------------------------------------------------------
// MODO REALIDAD AUMENTADA
// -------------------------------------------------------------
let mindarThree = null;
let nodos = [];
let visibles = 0;

async function iniciarAR() {
  cargandoTexto.textContent = 'Cargando modelos 3D…';
  cargando.classList.remove('oculto');

  try {
    await cargarModelos();

    mindarThree = new MindARThree({
      container: contenedorAR,
      imageTargetSrc: './assets/targets.mind',
      uiLoading: 'no',
      uiScanning: 'no',
      uiError: 'no',
      maxTrack: 1,
      filterMinCF: 0.0001,
      filterBeta: 0.001
    });

    const { renderer, scene, camera } = mindarThree;
    scene.add(crearLuces());

    const constructores = [
      () => nodoProteina(modeloCompleto, CONFIG.tamano),
      () => nodoCadenaPlegable(),
      () => nodoProteina(modeloCompleto, CONFIG.tamano),
      () => nodoComplejo(modeloLigero)
    ];

    nodos = [];

    for (let i = 0; i < constructores.length; i++) {
      const anchor = mindarThree.addAnchor(i);
      const nodo = constructores[i]();
      anchor.group.add(nodo.objeto);
      nodos.push(nodo);

      anchor.onTargetFound = () => {
        visibles++;
        mostrarPanel(i);
        mensaje.classList.add('oculto');
      };
      anchor.onTargetLost = () => {
        visibles = Math.max(0, visibles - 1);
        if (visibles === 0) {
          panelInfo.classList.add('oculto');
          mensaje.classList.remove('oculto');
        }
      };
    }

    await mindarThree.start();

    pantallaInicio.classList.add('oculto');
    hud.classList.remove('oculto');
    mensaje.classList.remove('oculto');
    mensaje.textContent = 'Buscando marcador…';
    cargando.classList.add('oculto');

    const reloj = new THREE.Clock();
    renderer.setAnimationLoop(() => {
      const dt = reloj.getDelta();
      const t = reloj.getElapsedTime();
      for (const n of nodos) n.actualizar(t, dt);
      renderer.render(scene, camera);
    });

  } catch (e) {
    cargando.classList.add('oculto');
    alert('No se pudo iniciar la cámara.\n\nRevisa que la página abra con https, que hayas dado permiso de cámara y que uses Chrome (Android) o Safari (iPhone).\n\nDetalle: ' + e.message);
    console.error(e);
  }
}

function mostrarPanel(i) {
  const m = MARCADORES[i];
  if (!m) return;
  infoTitulo.textContent = m.titulo;
  infoSubtitulo.textContent = m.subtitulo;
  infoPuntos.innerHTML = '';
  m.puntos.forEach((p) => {
    const li = document.createElement('li');
    li.textContent = p;
    infoPuntos.appendChild(li);
  });
  seccionDelMarcador = m.seccion;
  panelInfo.classList.remove('oculto');
}

async function salirAR() {
  if (mindarThree) {
    mindarThree.renderer.setAnimationLoop(null);
    try { await mindarThree.stop(); } catch (e) { /* nada */ }
    mindarThree = null;
  }
  nodos = [];
  visibles = 0;
  contenedorAR.innerHTML = '';
  panelInfo.classList.add('oculto');
  hud.classList.add('oculto');
  pantallaInicio.classList.remove('oculto');
}

// -------------------------------------------------------------
// MODO SIN CÁMARA (respaldo para la exposición)
// -------------------------------------------------------------
let limpiarVisor = null;

async function verSoloModelo() {
  cargandoTexto.textContent = 'Cargando modelo 3D…';
  cargando.classList.remove('oculto');
  await cargarModelos();

  const escena = new THREE.Scene();
  escena.background = new THREE.Color(0x070c1a);
  escena.add(crearLuces());

  const pivote = new THREE.Group();
  pivote.add(normalizar(modeloCompleto.clone(true), 1.0));
  escena.add(pivote);

  const camara = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 100);
  camara.position.set(0, 0, 1.9);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  contenedorAR.innerHTML = '';
  contenedorAR.appendChild(renderer.domElement);

  let arrastrando = false, xAnt = 0, yAnt = 0;
  const abajo = (e) => { arrastrando = true; xAnt = e.clientX; yAnt = e.clientY; };
  const mover = (e) => {
    if (!arrastrando) return;
    pivote.rotation.y += (e.clientX - xAnt) * 0.01;
    pivote.rotation.x += (e.clientY - yAnt) * 0.01;
    xAnt = e.clientX; yAnt = e.clientY;
  };
  const arriba = () => { arrastrando = false; };
  renderer.domElement.addEventListener('pointerdown', abajo);
  renderer.domElement.addEventListener('pointermove', mover);
  window.addEventListener('pointerup', arriba);

  const redimensionar = () => {
    camara.aspect = window.innerWidth / window.innerHeight;
    camara.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', redimensionar);

  pantallaInicio.classList.add('oculto');
  hud.classList.remove('oculto');
  panelInfo.classList.add('oculto');
  mensaje.classList.remove('oculto');
  mensaje.textContent = 'Modo 3D — arrastra para girar';
  cargando.classList.add('oculto');

  const reloj = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    const dt = reloj.getDelta();
    const t = reloj.getElapsedTime();
    if (!arrastrando) pivote.rotation.y += THREE.MathUtils.degToRad(CONFIG.velocidadRotacion) * dt;
    pivote.position.y = Math.sin(t * CONFIG.velocidadFlotacion) * 0.05;
    renderer.render(escena, camara);
  });

  limpiarVisor = () => {
    renderer.setAnimationLoop(null);
    window.removeEventListener('resize', redimensionar);
    window.removeEventListener('pointerup', arriba);
    renderer.dispose();
    contenedorAR.innerHTML = '';
    hud.classList.add('oculto');
    pantallaInicio.classList.remove('oculto');
    limpiarVisor = null;
  };
}

// -------------------------------------------------------------
// LECTOR DE CONTENIDO
// -------------------------------------------------------------
function crearElemento(tag, clase, texto) {
  const el = document.createElement(tag);
  if (clase) el.className = clase;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

function pintarSeccion(id) {
  lectorContenido.innerHTML = '';
  lectorContenido.scrollTop = 0;

  Array.from(lectorNav.children).forEach((b) => {
    b.classList.toggle('activo', b.dataset.id === id);
  });

  if (id === 'quiz') { pintarQuiz(); return; }
  if (id === 'fuentes') { pintarFuentes(); return; }

  const sec = SECCIONES.find((s) => s.id === id);
  if (!sec) return;

  lectorContenido.appendChild(crearElemento('h2', null, sec.titulo));

  sec.bloques.forEach((b) => {
    if (b.tipo === 'p') {
      lectorContenido.appendChild(crearElemento('p', null, b.texto));

    } else if (b.tipo === 'lista') {
      const caja = crearElemento('div', 'bloque-lista');
      if (b.titulo) caja.appendChild(crearElemento('h4', null, b.titulo));
      const ul = crearElemento('ul');
      b.items.forEach((it) => ul.appendChild(crearElemento('li', null, it)));
      caja.appendChild(ul);
      lectorContenido.appendChild(caja);

    } else if (b.tipo === 'dato') {
      const caja = crearElemento('div', 'bloque-dato');
      caja.appendChild(crearElemento('span', 'cifra', b.numero));
      caja.appendChild(crearElemento('span', 'txt', b.texto));
      lectorContenido.appendChild(caja);

    } else if (b.tipo === 'pasos') {
      b.items.forEach((p, i) => {
        const fila = crearElemento('div', 'paso');
        fila.appendChild(crearElemento('div', 'num', String(i + 1)));
        const cuerpo = crearElemento('div');
        cuerpo.appendChild(crearElemento('h5', null, p.titulo));
        cuerpo.appendChild(crearElemento('p', null, p.texto));
        fila.appendChild(cuerpo);
        lectorContenido.appendChild(fila);
      });
    }
  });
}

function pintarQuiz() {
  lectorContenido.appendChild(crearElemento('h2', null, 'Ponte a prueba'));

  const marcador = crearElemento('div', null, 'Aciertos: 0 de ' + QUIZ.length);
  marcador.id = 'quizMarcador';
  lectorContenido.appendChild(marcador);

  let aciertos = 0;

  QUIZ.forEach((q) => {
    const caja = crearElemento('div', 'quiz-pregunta');
    caja.appendChild(crearElemento('p', null, q.pregunta));

    let respondida = false;
    const botones = [];

    q.opciones.forEach((texto, idx) => {
      const btn = crearElemento('button', 'quiz-op', texto);
      btn.addEventListener('click', () => {
        if (respondida) return;
        respondida = true;

        botones[q.correcta].classList.add('bien');
        if (idx !== q.correcta) {
          btn.classList.add('mal');
        } else {
          aciertos++;
          marcador.textContent = 'Aciertos: ' + aciertos + ' de ' + QUIZ.length;
        }

        const exp = crearElemento('p', 'quiz-exp', q.explicacion);
        caja.appendChild(exp);
      });
      botones.push(btn);
      caja.appendChild(btn);
    });

    lectorContenido.appendChild(caja);
  });
}

function pintarFuentes() {
  lectorContenido.appendChild(crearElemento('h2', null, 'Fuentes consultadas'));
  FUENTES.forEach((f) => {
    const caja = crearElemento('div', 'fuente');
    caja.appendChild(document.createTextNode(f.texto + ' '));
    const a = crearElemento('a', null, f.url);
    a.href = f.url;
    a.target = '_blank';
    a.rel = 'noopener';
    caja.appendChild(a);
    lectorContenido.appendChild(caja);
  });
}

function construirNav() {
  if (lectorNav.children.length) return;
  const items = SECCIONES.map((s) => ({ id: s.id, titulo: s.titulo }));
  items.push({ id: 'quiz', titulo: 'Ponte a prueba' });
  items.push({ id: 'fuentes', titulo: 'Fuentes' });

  items.forEach((it) => {
    const b = crearElemento('button', null, it.titulo);
    b.dataset.id = it.id;
    b.addEventListener('click', () => pintarSeccion(it.id));
    lectorNav.appendChild(b);
  });
}

function abrirLector(id) {
  construirNav();
  pintarSeccion(id || SECCIONES[0].id);
  lector.classList.remove('oculto');
}

function cerrarLector() {
  lector.classList.add('oculto');
}

// -------------------------------------------------------------
// BOTONES
// -------------------------------------------------------------
$('#btnIniciar').addEventListener('click', iniciarAR);
$('#btnLeer').addEventListener('click', () => abrirLector());
$('#btnSoloModelo').addEventListener('click', verSoloModelo);
$('#btnCerrarLector').addEventListener('click', cerrarLector);
$('#btnSaberMas').addEventListener('click', () => abrirLector(seccionDelMarcador));

$('#btnSalir').addEventListener('click', () => {
  if (limpiarVisor) limpiarVisor();
  else salirAR();
});
