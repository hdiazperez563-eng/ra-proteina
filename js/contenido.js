// =============================================================
//  CONTENIDO DE LA APLICACIÓN
//  Aquí vive todo el texto. Si quieres cambiar algo, es aquí.
//  No hay que tocar app.js.
// =============================================================

// -------------------------------------------------------------
// Lo que aparece cuando la cámara detecta cada marcador
// El orden importa: debe coincidir con el orden de targets.mind
// -------------------------------------------------------------
export const MARCADORES = [
  {
    titulo: 'Proteína verde fluorescente (GFP)',
    subtitulo: 'Aequorea victoria',
    puntos: [
      'Proteína aislada de una medusa del Pacífico; emite luz verde al recibir luz azul.',
      'Se usa como "marcador luminoso" para ver dónde y cuándo se activa un gen dentro de una célula viva.',
      'Su forma de barril protege al centro que produce la fluorescencia.'
    ],
    seccion: 'proteinas'
  },
  {
    titulo: 'Estructura primaria y secundaria',
    subtitulo: 'De la cadena al plegamiento',
    puntos: [
      'La estructura primaria es la secuencia de aminoácidos, como las letras de una palabra.',
      'La secundaria son los primeros dobleces locales: hélices alfa y hojas beta.',
      'Observa la animación: la cadena estirada se enrolla sola en una hélice.'
    ],
    seccion: 'alphafold'
  },
  {
    titulo: 'Estructura terciaria',
    subtitulo: 'La forma tridimensional completa',
    puntos: [
      'Es el plegamiento final de toda la cadena en el espacio.',
      'Esta forma determina la función: si cambia la forma, cambia lo que la proteína puede hacer.',
      'Predecir esta estructura a partir de la secuencia es exactamente el problema que resolvió AlphaFold2.'
    ],
    seccion: 'alphafold'
  },
  {
    titulo: 'Estructura cuaternaria',
    subtitulo: 'Varias subunidades trabajando juntas',
    puntos: [
      'Ocurre cuando dos o más cadenas ya plegadas se ensamblan en un solo complejo.',
      'Muchos blancos de medicamentos son complejos, no proteínas sueltas.',
      'Predecir cómo encajan entre sí es más difícil que predecir una sola cadena.'
    ],
    seccion: 'farmacos'
  }
];

// -------------------------------------------------------------
// Secciones de lectura
// tipos de bloque: 'p' (párrafo), 'lista', 'dato', 'pasos'
// -------------------------------------------------------------
export const SECCIONES = [
  {
    id: 'ia-biotec',
    titulo: 'La IA en la biotecnología',
    bloques: [
      { tipo: 'p', texto: 'La biotecnología genera muchísimos más datos de los que una persona puede revisar: genomas completos, millones de secuencias de proteínas, imágenes de cultivos, resultados de miles de experimentos. La inteligencia artificial entra justo ahí, encontrando patrones dentro de esa montaña de información.' },
      { tipo: 'p', texto: 'Lo importante es entender qué tipo de ayuda da. La IA no descubre por sí sola: reduce el espacio de búsqueda. En lugar de probar un millón de posibilidades en el laboratorio, propone las cien más prometedoras y los científicos las verifican.' },
      { tipo: 'lista', titulo: 'Dónde se está aplicando hoy', items: [
        'Predicción de la estructura tridimensional de proteínas',
        'Diseño de moléculas nuevas que aún no existen',
        'Identificación de blancos terapéuticos en enfermedades',
        'Mejoramiento genético de cultivos y monitoreo agrícola',
        'Análisis de imágenes de microscopía y diagnóstico'
      ]},
      { tipo: 'dato', numero: '2024', texto: 'El Nobel de Química se otorgó a Demis Hassabis y John Jumper por predicción de estructura de proteínas, y a David Baker por diseño computacional de proteínas.' }
    ]
  },
  {
    id: 'proteinas',
    titulo: 'Por qué importa la forma',
    bloques: [
      { tipo: 'p', texto: 'Una proteína es una cadena de aminoácidos, pero esa cadena no se queda estirada: se pliega sobre sí misma hasta tomar una forma tridimensional muy específica. Esa forma es la que determina qué hace la proteína.' },
      { tipo: 'p', texto: 'Piénsalo como una llave. La secuencia de aminoácidos es el metal con el que está hecha; la forma plegada son los dientes de la llave. Solo la forma correcta abre la cerradura correcta. Por eso un cambio pequeño en la secuencia puede deformar la proteína y provocar una enfermedad.' },
      { tipo: 'lista', titulo: 'Los cuatro niveles', items: [
        'Primaria: el orden de los aminoácidos en la cadena',
        'Secundaria: dobleces locales, hélices alfa y hojas beta',
        'Terciaria: el plegamiento completo de la cadena en el espacio',
        'Cuaternaria: varias cadenas plegadas ensambladas en un complejo'
      ]},
      { tipo: 'p', texto: 'Conocer la forma permite diseñar moléculas que encajen en ella, entender qué falla en una mutación y proponer tratamientos dirigidos.' }
    ]
  },
  {
    id: 'alphafold',
    titulo: 'Cómo la IA predice una estructura',
    bloques: [
      { tipo: 'p', texto: 'Durante casi cincuenta años, pasar de la secuencia a la forma fue uno de los problemas abiertos de la biología. Determinar una sola estructura en el laboratorio podía tomar años, si es que se lograba. Con AlphaFold2 el mismo resultado se obtiene en minutos.' },
      { tipo: 'pasos', items: [
        { titulo: 'Se parte de la secuencia', texto: 'Se obtiene el orden de aminoácidos de la proteína que se quiere estudiar. Es el único dato de entrada obligatorio.' },
        { titulo: 'Se compara con proteínas conocidas', texto: 'El sistema busca secuencias parecidas en otros organismos y las alinea. Si dos aminoácidos siempre cambian juntos a lo largo de la evolución, probablemente estén cerca en el espacio. De ahí salen las primeras pistas de contacto.' },
        { titulo: 'La red neuronal predice la forma', texto: 'Un modelo de aprendizaje profundo, entrenado con estructuras ya resueltas experimentalmente, propone cómo se acomoda la cadena en tres dimensiones.' },
        { titulo: 'Se evalúa la confianza', texto: 'Este paso es clave y es lo que hace confiable al sistema: el modelo indica qué tan seguro está de cada región. Las zonas con baja confianza se toman con reserva en lugar de darlas por buenas.' },
        { titulo: 'Interpretación biológica', texto: 'Con la estructura predicha se estudian sitios activos, se analizan mutaciones y se buscan moléculas capaces de unirse ahí. Después se verifica en el laboratorio.' }
      ]},
      { tipo: 'dato', numero: '200 millones', texto: 'Estructuras predichas disponibles públicamente, de más de un millón de organismos. La base abrió en julio de 2021 con unas 360,000 y hoy cubre prácticamente todas las proteínas identificadas.' },
      { tipo: 'p', texto: 'Para octubre de 2024, AlphaFold2 había sido utilizado por más de dos millones de personas en 190 países.' }
    ]
  },
  {
    id: 'farmacos',
    titulo: 'Fármacos: de años a meses',
    bloques: [
      { tipo: 'p', texto: 'Desarrollar un medicamento es lento y caro. La etapa inicial, donde se identifica el blanco de la enfermedad y se diseña una molécula candidata, es de las más largas. Es justo la etapa donde la IA está teniendo más efecto.' },
      { tipo: 'dato', numero: '12 a 18 meses', texto: 'Tiempo promedio que tardaron los candidatos de Insilico Medicine entre 2021 y 2024 para llegar de inicio de proyecto a candidato preclínico, frente a los 2.5 a 4.5 años que suele tomar el proceso tradicional.' },
      { tipo: 'p', texto: 'El caso más avanzado es el rentosertib, para fibrosis pulmonar idiopática. Su blanco terapéutico fue identificado con IA y su estructura química fue diseñada con IA generativa. Los resultados de la fase IIa se publicaron en Nature Medicine en junio de 2025 y el compuesto avanzó a fase III.' },
      { tipo: 'lista', titulo: 'Dónde acelera', items: [
        'Identificar qué proteína atacar en una enfermedad',
        'Generar moléculas candidatas que encajen en ese blanco',
        'Descartar por computadora las que serían tóxicas o inestables',
        'Reducir cuántas moléculas hay que sintetizar de verdad'
      ]},
      { tipo: 'p', texto: 'En esos programas se sintetizaron y probaron solo entre 60 y 200 moléculas por proyecto, muy por debajo de lo habitual. Ahí está el ahorro real: menos experimentos físicos, no menos rigor.' }
    ]
  },
  {
    id: 'cultivos',
    titulo: 'Cultivos y agricultura',
    bloques: [
      { tipo: 'p', texto: 'Mejorar una variedad de cultivo tradicionalmente toma varios ciclos de siembra, porque hay que cruzar plantas, esperar a que crezcan y medirlas una por una. La IA acorta ese ciclo por dos lados: prediciendo qué combinaciones genéticas conviene probar, y midiendo las plantas automáticamente.' },
      { tipo: 'lista', titulo: 'Cómo se aplica', items: [
        'Predicción genómica: estimar el rendimiento de una variedad antes de sembrarla',
        'Fenotipado de alto rendimiento: drones y sensores que miden miles de plantas en minutos',
        'Detección temprana de estrés hídrico, plagas y enfermedades',
        'Edición genómica dirigida a los genes que el modelo señala como relevantes'
      ]},
      { tipo: 'p', texto: 'Un análisis publicado en Nature en 2025 propone una hoja de ruta que integra inteligencia artificial con edición genómica, diseño de proteínas, fenotipado de alto rendimiento y tecnologías ómicas, con el objetivo de acelerar el desarrollo de cultivos más productivos y resilientes al cambio climático.' },
      { tipo: 'p', texto: 'Un ejemplo concreto en la región: investigadores del INTA en Argentina usan drones con sensores multiespectrales y térmicos para anticipar el rendimiento del maíz, con más del 92% de precisión en híbridos comerciales, reemplazando mediciones manuales que consumían muchísimas horas de campo.' }
    ]
  },
  {
    id: 'limites',
    titulo: 'Lo que la IA no resuelve',
    bloques: [
      { tipo: 'p', texto: 'Esta parte importa tanto como los logros. Presentar solo los éxitos da una imagen falsa de la tecnología.' },
      { tipo: 'lista', titulo: 'Limitaciones reales', items: [
        'Una predicción es una hipótesis: sigue necesitando verificación experimental',
        'Las proteínas se mueven; el modelo entrega una forma estática',
        'Predecir complejos de varias cadenas es más difícil que una sola',
        'Si los datos de entrenamiento tienen sesgos, las predicciones los heredan',
        'Acelerar el descubrimiento no garantiza que el fármaco funcione en pacientes'
      ]},
      { tipo: 'p', texto: 'El DSP-1181, una de las primeras moléculas diseñadas con IA en llegar a ensayos clínicos, fue descontinuada después de la fase I a pesar de tener un perfil de seguridad favorable. La velocidad en el laboratorio no se traduce automáticamente en un medicamento aprobado.' },
      { tipo: 'p', texto: 'La lectura correcta es que la IA es una herramienta más dentro del proceso científico, no un reemplazo del método experimental.' }
    ]
  }
];

// -------------------------------------------------------------
// Quiz
// -------------------------------------------------------------
export const QUIZ = [
  {
    pregunta: '¿Qué determina la función de una proteína?',
    opciones: ['Su tamaño total', 'La cantidad de aminoácidos', 'Su forma tridimensional', 'Su color'],
    correcta: 2,
    explicacion: 'La forma plegada es la que permite que encaje con otras moléculas. Si la forma cambia, la función cambia.'
  },
  {
    pregunta: '¿Cuál es el único dato de entrada que necesita AlphaFold2 para trabajar?',
    opciones: ['Una fotografía de la proteína al microscopio', 'Un cristal purificado', 'El genoma completo del organismo', 'La secuencia de aminoácidos'],
    correcta: 3,
    explicacion: 'Parte de la secuencia. Esa es justamente la razón de su impacto: no requiere el trabajo experimental previo.'
  },
  {
    pregunta: '¿Por qué es importante que el modelo indique su nivel de confianza?',
    opciones: ['Para saber qué regiones tomar con reserva', 'Para que corra más rápido', 'Para ahorrar memoria', 'Porque lo exige la ley'],
    correcta: 0,
    explicacion: 'Sin ese dato, todas las regiones parecerían igual de confiables. La estimación de confianza permite distinguir qué partes usar y cuáles verificar.'
  },
  {
    pregunta: 'La estructura cuaternaria aparece cuando...',
    opciones: ['La cadena se estira por completo', 'Se forman hélices alfa', 'Varias cadenas ya plegadas se ensamblan', 'La proteína se desnaturaliza'],
    correcta: 2,
    explicacion: 'Es el ensamble de dos o más subunidades ya plegadas en un solo complejo funcional.'
  },
  {
    pregunta: '¿Qué enseña el caso del DSP-1181?',
    opciones: ['Que la IA nunca funciona', 'Que los ensayos clínicos son innecesarios', 'Que solo sirve para cultivos', 'Que acelerar el descubrimiento no garantiza éxito clínico'],
    correcta: 3,
    explicacion: 'Fue descontinuada tras la fase I pese a un perfil de seguridad favorable. Ganar tiempo en el diseño no asegura que el fármaco funcione en pacientes.'
  }
];

// -------------------------------------------------------------
// Fuentes consultadas
// -------------------------------------------------------------
export const FUENTES = [
  {
    texto: 'Qiu X., Li H., Ver Steeg G., Godzik A. (2024). Advances in AI for Protein Structure Prediction: Implications for Cancer Drug Discovery and Development. Biomolecules 14(3), 339.',
    url: 'https://doi.org/10.3390/biom14030339'
  },
  {
    texto: 'The Nobel Prize in Chemistry 2024 — Información divulgativa. NobelPrize.org',
    url: 'https://www.nobelprize.org/prizes/chemistry/2024/popular-information/'
  },
  {
    texto: 'AlphaFold Protein Structure Database. EMBL-EBI',
    url: 'https://alphafold.ebi.ac.uk/'
  },
  {
    texto: 'Jumper J. et al. (2021). Highly accurate protein structure prediction with AlphaFold. Nature 596, 583–589.',
    url: 'https://doi.org/10.1038/s41586-021-03819-2'
  },
  {
    texto: 'Insilico Medicine — Resultados de fase IIa de rentosertib publicados en Nature Medicine (2025).',
    url: 'https://insilico.com/'
  },
  {
    texto: 'Hoja de ruta para integrar IA y biotecnología en el desarrollo de cultivos. Nature (2025).',
    url: 'https://www.nature.com/articles/s41586-025-09122-8'
  }
];
