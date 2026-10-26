# Peptides v2 — Análisis e investigación (SOLO investigación)

> **Estado: borrador de diseño v2, 2026-10-25. Alcance corregido por Roger: lo que los usuarios hacen en Peptides es SOLO análisis e investigación; nunca producen, diseñan ni generan péptidos.**
> Baseline: v0.1 (6 péptidos curados, 1 estructura real 3D, literatura Europe PMC, asistente en modo evidencia/modelo).
> Corrección de Roger (2026-10-25): **menos texto, mejor UX/UI. No es un producto: sin auth, sin cuentas, sin billing. Solo rate limiting agresivo para IA: 10 req/min.**
> Nota sobre "scream Arquitecture": lo interpreté como arquitectura del sistema. Si quisiste decir otra cosa (screens, stream, schema), dímelo y lo ajusto.

## 0. Reglas que mandan en v2 (antes que cualquier feature)

1. **No es un producto.** Sin auth, sin cuentas, sin onboarding, sin paywall, sin precios. Uso anónimo directo.
2. **Menos texto, más herramienta.** La UI muestra datos como visuales, chips y tarjetas; el texto largo no vive en la pantalla principal. Detalle y metodología solo bajo tap ("ver más"), nunca por defecto.
3. **Touch-first en el teléfono.** ≥44px por objetivo, todo táctil, sin depender de hover ni teclado.
4. **Nunca inventar datos.** Campo sin fuente = `null` visible como "sin dato", nunca un valor inventado. Estructura experimental y predicción nunca se confunden (ver §4).
5. **Sin consejo médico.** Exploración/educación solamente: sin dosis, sin recomendaciones de uso, sin afirmaciones de eficacia sin evidencia citada.
6. **Los usuarios solo analizan e investigan, nunca producen péptidos.** No hay generador, diseñador, optimizador de novo ni instrucciones de síntesis en la app. Toda feature que huela a "crear un péptido" queda fuera de alcance, aunque la IA la pueda hacer en teoría.

## 1. UX/UI: Sentient UI y principios Polygrow, aplicados a péptidos

Fuente: `polygrow/docs/ux_ui_patterns.md` (Sentient UI = interfaz que responde al contexto, no texto libre del LLM).

| Principio | Cómo se aplica en Peptides v2 (concreto) |
|---|---|
| **Sentient UI — zero-click** | Al abrir un péptido ya carga su 3D + sus datos clave (chips: longitud, masa, tier de estructura, confianza). Nada de elegir representación antes de ver algo. |
| **Sentient UI — ambient info** | Confianza (pLDDT), tier de estructura (experimental / predicha / sin estructura) y función, visibles como insignias sin entrar a otra pantalla. |
| **Sentient UI — contextual suggestions** | Al pie del 3D: chips táctiles de "similares", "preguntas sugeridas" y "comparar". Se toca, no se escribe, para preguntar. |
| **Sentient UI — undo everywhere** | Selección de comparados, filtros y vista 3D reversibles con un tap; nada irreversible. |
| **Pure UI** | Paleta platino ya definida, una sola familia de acento, máximo 4 tamaños de texto por pantalla, espacio en blanco como feature. Complejidad progresiva: primera vista = 3 acciones (buscar, ver 3D, preguntar); medir, PAE y superposición solo aparecen al pedirlas. |
| **Conversational Architecture** | La IA responde con **tarjetas, no párrafos**: tarjeta estructura, tarjeta evidencia, tarjeta similares, tarjeta "qué NO se sabe". El rastro de investigación (fuentes, pasos) queda colapsado, expandible. |
| **Density Modes** | Modo Focus: un péptido, 3D a pantalla completa. Modo Explorer: rejilla densa con filtros. Un interruptor, no dos apps. |
| **Elastic UI** | Movimiento solo para aclarar (transiciones de vista, zoom al residuo). Nada decorativo, nada que parpadee. `prefers-reduced-motion` respetado. |
| **Radical Transparency (bajo demanda)** | Cada respuesta IA tiene "por qué" expandible (fuentes + pasos). Visible si se pide, invisible si no. |
| **Invisible Complexity** | El usuario nunca ve "UniProt", "mmCIF" o "pLDDT" como jerga obligatoria: ve "estructura", "confianza alta/baja", "fuente". Los IDs técnicos quedan en el detalle. |

**Presupuesto de texto por pantalla (regla v2):** título + chips + etiquetas de una línea. Cualquier explicación larga va a docs, no a la UI. Esto responde directamente a tu crítica de v0.1 (mucho texto, poca funcionalidad).

## 2. Pantallas (4, no más)

1. **Explorer:** rejilla de péptidos + filtros táctiles (función, longitud, organismo, tier de estructura). Sin párrafos: tarjeta = nombre, secuencia corta, chips.
2. **Peptide Studio (la pantalla principal):** 3D grande + secuencia enlazada + chips de datos + preguntas sugeridas. Todo lo demás, bajo tap.
3. **Compare Lab:** 2–4 péptidos, tabla visual + 3D lado a lado. Sin texto comparativo redactado: diferencias como chips y valores.
4. **Research:** pregunta (chip o texto) → respuesta en tarjetas + fuentes táctiles + rastro colapsado. Sin chat infinito de párrafos.

## 3. Interacción 3D: de 1 estructura empaquetada a cientos bajo demanda

v0.1 empaquetaba solo melitina (26 Cα). Eso no escala. v2:

- **Visor:** Mol* (BinaryCIF, rápido incluso en móvil) como visor principal para estructuras reales y predichas; R3F queda solo si hace falta un esquema, no para estructuras completas.
- **Carga bajo demanda:** una estructura a la vez, nunca cientos a la vez. Prefetch del vecino, caché en navegador y proxy en servidor (evita CORS y respeta límites de las APIs).
- **Interacciones (todas táctiles):** tocar un residuo en la secuencia lo ilumina en el 3D y viceversa; modos de color (cadena, confianza pLDDT, hidrofobicidad, carga); enfocar residuo; medir distancia entre dos residuos; superficie/cartoon/bolas-y-varillas; girar/zoom con gestos; superponer dos péptidos (con RMSD calculado, no inventado); exportar captura.
- **Rendimiento:** BinaryCIF + nivel de detalle según tamaño; estructuras grandes se simplifican a cartoon por defecto.

## 4. Datos: cientos de péptidos, con procedencia por campo

### 4.1 Fuentes públicas investigadas

| Fuente | Para qué | Acceso verificado |
|---|---|---|
| UniProt REST | Secuencias, función, organismo, acceso a cientos: búsqueda con filtros (`length`, `reviewed:true`, taxonomía). Base: `rest.uniprot.org/uniprotkb/search` | API pública, formatos JSON/FASTA/TSV |
| AlphaFold DB | Estructuras predichas por accession UniProt: coordenadas PDB/mmCIF, confianza por residuo, PAE. Endpoint: `alphafold.ebi.ac.uk/api/prediction/{accession}`; archivos `AF-{id}-F1-model_v4.pdb/.cif`, `-predicted_aligned_error_v4.json` | API pública + descarga bulk por FTP (`ftp.ebi.ac.uk/pub/databases/alphafold`) |
| RCSB PDB | Estructuras experimentales (prioridad sobre predichas). Búsqueda por texto/atributos y por accession UniProt; incluye modelos computacionales (CSM) como categoría separada | Search/Data API pública |
| PubChem PUG REST | Propiedades químicas, sinónimos, CID (ya usado en v0.1) | API pública |
| Europe PMC | Literatura en vivo (ya usado en v0.1) | API pública |
| ChEMBL | Bioactividad (IC50 y similares) y targets. Base: `ebi.ac.uk/chembl/api/data` (`/activity`, `/target`, `/molecule`) | API pública |
| DBAASP v3 | Péptidos antimicrobianos: >15.700 entradas con secuencia, modificaciones, actividad, toxicidad y >3.200 modelos MD; API REST propia | API pública (documentada en su paper v3) |
| SATPdb | Semilla curada: 19.192 péptidos terapéuticos (2–50 aa) de 22 bases; 644 con estructura PDB y 13.444 predichas con PEPstrMOD | Dataset estático, no API viva: candidato a semilla, verificar licencia/actualización antes de usar |

### 4.2 El límite honesto de AlphaFold (importante)

AlphaFold DB está indexado por accession UniProt y es, en esencia, un catálogo de proteínas. Eso tiene tres consecuencias para péptidos cortos:

1. Muchos péptidos terapéuticos sintéticos, cíclicos, con D-aminoácidos o modificaciones no tienen entrada AlphaFold: **no se les puede inventar una estructura**.
2. Muchas entradas UniProt cortas son precursores o fragmentos, no el péptido maduro (ej. insulina: precursor ≠ péptido activo).
3. Por tanto v2 trabaja con **tres tiers de estructura, siempre etiquetados en la UI**:
   - **A — Experimental (PDB):** método, resolución, cadena. Máxima prioridad.
   - **B — Predicha (AlphaFold):** con color por pLDDT (>90 muy alta, 70–90 confiable, 50–70 baja, <50 muy baja/desorden probable) y etiqueta "PREDICHA" permanente.
   - **C — Sin estructura:** solo secuencia + datos. Se muestra el hueco explícitamente, nunca un placeholder que parezca estructura.
- Para el tier C, queda **por investigar** (no afirmado): PEPstrMOD (el usado por SATPdb) o ESMFold como generador de predicciones propias. Decisión pendiente tuya: aceptar huecos o investigar un generador.

### 4.3 Ingesta (pipeline, no manual)

Semillas: los 6 de v0.1 + categorías terapéuticas + DBAASP + UniProt revisados de 2–100 aa. Pasos: deduplicar por secuencia + modificaciones → validar cada campo contra su fuente → guardar procedencia por campo (fuente + ID + fecha) → lotes incrementales (50 → 200 → 500), nunca un volcado de miles sin curar. Caché en servidor para no golpear las APIs en cada visita.

## 5. IA con research web (un solo orquestador, estilo Reverse Lab)

Prestado de Reverse Lab: la investigación es un objeto trazable (objetivo → plan → herramientas → evidencia → síntesis), con `evidence_id` por afirmación, y un golden set de evaluación. Prestado de Polygrow: fronteras por contrato — la UI no orquesta, el motor de IA sí; la UI solo consume señales estructuradas.

**Flujo de una pregunta sobre un péptido:**

```
Pregunta (chip o texto)
  → Plan determinista (pasos fijos, no improvisados)
  → Herramientas, en orden: registro del péptido → estructura (resumen calculado)
    → literatura (Europe PMC) → bioactividad (ChEMBL) → búsqueda web general
  → Síntesis en tarjetas, cada afirmación con su fuente clicable
  → "Qué NO se sabe" explícito + preguntas sugeridas siguientes
```

- **Modos (como v0.1, ampliados):** modo evidencia ($0, determinista, sin modelo) y modo modelo (AI Gateway, cuando haya key). La búsqueda web solo ocurre en modo modelo o bajo petición explícita, para no gastar llamadas.
- **Preguntas tipo que debe responder:** ¿qué hace?, ¿contra qué actúa?, ¿qué evidencia hay (in vitro / animal / humano, con fuente)?, ¿señales de toxicidad?, ¿qué tan confiable es su estructura?, ¿péptidos similares?
- **Prohibido (reglas de evidencia, estilo Reverse Lab):** cita que no resuelve = fallo; afirmación sin fuente = se marca "sin evidencia", no se redacta como hecho; dosis y recomendaciones médicas = fuera de alcance, siempre.
- **Evaluación (antes de confiar):** golden set de ~20 preguntas con respuesta conocida y fuentes esperadas; se mide precisión de afirmaciones y que ninguna cita sea fabricada. Sin golden set, no se declara que "la IA investiga bien".

## 6. Arquitectura del sistema (diagrama)

```
┌─────────────────────────────────────────────────────────────┐
│ UI (Next.js, sin auth)                                      │
│  Explorer · Peptide Studio (3D Mol*) · Compare Lab · Research│
│  Salida: tarjetas y señales estructuradas, NO párrafos      │
└──────────────────────┬──────────────────────────────────────┘
                       │ contratos REST tipados (Zod)
┌──────────────────────▼──────────────────────────────────────┐
│ Capa de dominio (servicios, dueños por contrato)            │
│  Peptide Registry · Structure Service · Evidence Service   │
│  Analysis Service (cálculos: masa, carga, hidrofobicidad)   │
│  Research Orchestrator (un solo orquestador, plan fijo)     │
│  Rate Limiter (ver §7) · Cache                              │
└──────────────────────┬──────────────────────────────────────┘
                       │ adaptadores, uno por fuente
┌──────────────────────▼──────────────────────────────────────┐
│ Adaptadores externos (ninguno es dueño de la UI)            │
│  UniProt · AlphaFold DB · RCSB PDB · PubChem · Europe PMC  │
│  ChEMBL · DBAASP · Web Search (solo en research)            │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│ Snapshot validado + caché (primero ficheros, luego DB)     │
│  Cada campo: valor + fuente + ID + fecha de obtención       │
│  Evaluaciones: golden set (afirmaciones, citas, estabilidad)│
└─────────────────────────────────────────────────────────────┘
```

Reglas de frontera (Polygrow): la UI no llama a UniProt/AlphaFold directamente; todo pasa por los servicios con contrato. Si un feature cruza fronteras, primero se define su dueño. El sistema debe seguir entendiéndose por humanos y por agentes (código que revela qué hace, no capas especulativas).

## 7. Rate limiting agresivo para IA (sin auth)

Tu regla: **10 peticiones de IA por minuto**. Diseño propuesto (a validar al construir, no construido):

- **Ámbito:** toda petición a `/api/assistant` (modo evidencia y modo modelo, para que la regla sea simple y no se rodee cambiando de modo). Literatura y estructuras van por caché de servidor y no cuentan aquí.
- **Identidad sin auth:** IP del cliente (cabeceras de Vercel) como clave del bucket. Sin cuentas, sin cookies de sesión, sin registro.
- **Algoritmo:** token bucket por IP: capacidad 10, recarga 1 cada 6 segundos. Al agotar: HTTP 429 + `Retry-After` + contador visible en la UI ("te quedan X preguntas este minuto", con cuenta atrás). Nada de mensajes técnicos.
- **Límite honesto:** en serverless, un bucket solo en memoria por instancia no se comparte entre instancias y se puede rodear. Para que el límite sea real hace falta un contador compartido en servidor (p. ej. KV/Redis del lado del servidor, sin que el usuario vea nada de eso). Decisión al construir: KV compartido (recomendado) vs. bucket en memoria aproximado (barato, trampeable).
- **Trade-off conocido:** IPs compartidas (NAT, redes con muchos usuarios detrás de una misma IP) comparten bucket y pueden agotarlo entre varios. Es el precio de no tener auth; se acepta conscientemente, y se documenta en la UI ("límite por red, no por persona").
- **Anti-abuso adicional (sin auth):** caché de respuestas idénticas (misma pregunta + mismo péptido = misma respuesta servida sin gastar modelo), y preguntas sugeridas precalculadas en modo evidencia.

## 8. Riesgos y preguntas abiertas (para ti, no resueltas aquí)

1. **Semilla:** ¿cientos curados a mano por categoría (recomendado) o miles ruidosos de UniProt/DBAASP? La curación manda sobre el volumen.
2. **Tier C:** ¿aceptamos péptidos sin estructura, o investigamos PEPstrMOD/ESMFold antes de construir?
3. **Búsqueda web:** ¿qué proveedor (el que ya uses en otros proyectos, u otro)? Afecta costo y calidad del research.
4. **Key de IA:** sigue pendiente tu aclaración de "api de Vercel" (¿key de AI Gateway o quitar las rutas /api?). Sin key, el modo modelo no existe y todo es modo evidencia.
5. **"Scream Architecture":** confirmar si era arquitectura del sistema (asumido aquí) o screens/stream/schema.
6. **Almacenamiento:** ¿snapshot en ficheros (como Reverse Lab, $0) al inicio y DB después, o DB desde el día uno?

## 9. Camino por fases (investigación → construcción, solo con tu orden)

- **R1 (investigación):** medir cobertura AlphaFold/PDB real sobre una muestra de 50 péptidos candidatos (cuántos caen en A, B, C). Sin esto, "cientos en 3D" es una promesa sin base.
- **R2 (investigación):** golden set de ~20 preguntas con respuestas y fuentes esperadas.
- **R3 (spike local, no producción):** una sola pantalla Mol* con un péptido real + un péptido predicho, para validar tacto y rendimiento en tu teléfono.
- **Construcción:** solo cuando R1–R3 estén validados y tú lo ordenes. Nada de este documento es código.

## Fuentes consultadas

- AlphaFold DB: API por accession UniProt y archivos PDB/mmCIF/PAE; bulk por FTP.
- UniProt REST: `rest.uniprot.org/uniprotkb/search` con filtros de longitud, revisión y taxonomía.
- ChEMBL REST: `ebi.ac.uk/chembl/api/data` (activity, target, molecule).
- DBAASP v3: >15.700 péptidos, API REST, >3.200 modelos MD.
- SATPdb: 19.192 péptidos terapéuticos (2–50 aa), 644 PDB + 13.444 PEPstrMOD.
- Mol*: visor web con BinaryCIF, usado por RCSB/PDBe para estructuras grandes en navegador y móvil.
- Polygrow: `docs/architecture.md` (fronteras y contratos) y `docs/ux_ui_patterns.md` (Sentient UI y resto de principios).
- Reverse Lab: investigación trazable, evidence store con `evidence_id`, golden set y stubs honestos.
