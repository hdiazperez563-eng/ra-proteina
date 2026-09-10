# Proyecto de Realidad Aumentada — Proteína *Aequorea victoria* (GFP)

Aplicación web de RA que detecta 4 imágenes impresas de la maqueta y muestra
el modelo 3D de la proteína **girando y flotando** encima de ellas.

Funciona en cualquier teléfono desde el navegador. No hay que instalar nada.

---

## 1. Qué contiene la carpeta

```
ProyectoRA_Proteina/
├── index.html                  Pantalla de inicio
├── LEEME.md                    Este archivo
├── css/
│   └── estilos.css             Diseño de la interfaz
├── js/
│   ├── app.js                  Lógica: detección, carga del modelo, animación
│   └── vendor/                 Librerías incluidas (three.js, MindAR, Draco)
├── assets/
│   ├── proteina.glb            Modelo 3D optimizado (2.1 MB)
│   ├── proteina_ligera.glb     Versión ligera para celulares lentos (1.1 MB)
│   └── targets.mind            Las 4 imágenes compiladas para el rastreo
└── imprimir/
    ├── marcadores_para_imprimir.pdf   <-- IMPRIME ESTE
    └── target1..4.jpg          Las mismas imágenes sueltas
```

---

## 2. Pasos para dejarlo funcionando

### Paso 1 — Imprimir los marcadores

Imprime `imprimir/marcadores_para_imprimir.pdf` en hoja carta, **a color**.
Son 4 hojas, una por marcador.

> **Importante:** el rastreo funciona sobre superficies **planas**.
> Las hojas impresas funcionan bien; apuntar la cámara directo a la maqueta
> física de foamy da resultados inestables porque tiene relieve.

### Paso 2 — Subir la página a internet (con https)

El navegador **bloquea la cámara** si la página no está en `https`.
Por eso XAMPP en `http://` no sirve para probar desde el celular.

Opción gratis y rápida: **GitHub Pages**

1. Crea una cuenta en <https://github.com>
2. Botón **New repository** → nombre: `ra-proteina` → marca **Public** → *Create*
3. Entra al repo → **Add file → Upload files** → arrastra **el contenido** de esta
   carpeta (que `index.html` quede en la raíz, no dentro de otra subcarpeta)
4. **Commit changes**
5. **Settings → Pages → Branch: `main` → carpeta `/ (root)` → Save**
6. Espera 1–2 minutos. Te aparece el link:
   `https://TU_USUARIO.github.io/ra-proteina/`

### Paso 3 — Generar el código QR

Pega ese link en <https://www.qr-code-generator.com> y descarga el QR.
Imprímelo y pégalo junto a la maqueta.

---

## 3. Cómo se usa

1. Escanear el QR (o abrir el link).
2. Presionar **Iniciar RA** y **aceptar** el permiso de cámara.
3. Apuntar la cámara a cualquiera de las 4 hojas impresas.
4. La proteína aparece girando y flotando sobre la hoja.

**Botón de respaldo:** *"Ver modelo 3D sin cámara"* muestra el modelo girando
sin usar la cámara. Úsalo si el día de la exposición falla el permiso o hay
poca luz.

---

## 4. Cómo cambiar la animación

Todo está al inicio de `js/app.js`, en el bloque `CONFIG`.
Son los mismos parámetros del script original de Unity:

```js
const CONFIG = {
  velocidadRotacion: 30,    // grados por segundo
  amplitudFlotacion: 0.05,  // qué tanto sube y baja
  velocidadFlotacion: 2,    // qué tan rápido sube y baja
  alturaBase: 0.12,         // qué tan arriba de la hoja aparece
  tamano: 0.75              // 0.75 = ocupa 75% del ancho de la imagen
};
```

Guarda el archivo, vuelve a subirlo a GitHub y listo.

### Si el celular va lento

En `js/app.js` busca esta línea:

```js
const gltf = await loader.loadAsync('./assets/proteina.glb');
```

y cámbiala por:

```js
const gltf = await loader.loadAsync('./assets/proteina_ligera.glb');
```

---

## 5. Si algo falla

| Problema | Causa más probable | Solución |
|---|---|---|
| No pide permiso de cámara | La página está en `http`, no `https` | Súbela a GitHub Pages |
| Pantalla negra al iniciar | Se negó el permiso | Ajustes del navegador → Permisos → Cámara → Permitir |
| No detecta la imagen | Poca luz, o la hoja está doblada / con reflejo | Buena luz, hoja plana, sin brillo directo |
| Va lento / se traba | Modelo pesado para ese equipo | Usa `proteina_ligera.glb` |
| Se ve todo negro el modelo | Falló la carga de las luces | Recarga la página |

---

## 6. Contenido de la aplicación

Además de la RA, la app incluye una sección de lectura con seis apartados,
un quiz de cinco preguntas y las fuentes citadas. Todo el texto vive en
`js/contenido.js` — si quieres corregir una frase o agregar un dato, se edita
ahí y no hay que tocar `js/app.js`.

Cada marcador muestra algo distinto en 3D:

| Marcador | Qué aparece |
|---|---|
| 1 — Maqueta completa | La proteína GFP completa |
| 2 — Primaria y secundaria | Cadena de aminoácidos que se pliega en hélice alfa |
| 3 — Terciaria | La proteína GFP completa |
| 4 — Cuaternaria | Cuatro subunidades ensambladas, cada una de distinto color |

---

## 7. Nota técnica (por si la piden en la entrega)

- **Rastreo de imágenes:** MindAR (image target tracking) sobre WebGL.
- **Motor 3D:** three.js r147.
- **Modelo:** glTF binario comprimido con Draco — se redujo de **28 MB a 2.1 MB**
  sin pérdida visual, para que cargue con datos móviles.
- **Marcadores:** las 4 fotografías fueron recortadas y compiladas a un archivo
  `.mind` con entre 146 y 205 puntos característicos por imagen.
- **Animación:** rotación continua sobre el eje normal al marcador y flotación
  con una onda senoidal — equivalente web del script `FlotarYGirar.cs` de Unity.
