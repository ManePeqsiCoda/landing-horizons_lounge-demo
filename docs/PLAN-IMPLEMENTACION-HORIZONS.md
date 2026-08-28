# Plan de implementación — Correcciones Horizons Lounge Aruba

**Proyecto:** `horizons-lunge-demo`  
**Fuentes:**
- [Documento Maestro Correcciones Prototipos.md](../../docs/Documento%20Maestro%20Correcciones%20Prototipos.md) — §1 HORIZONS, §4 transversales, §5 prioridades
- [AUDITORIA-UX-UI-Horizons-Lounge-Aruba.md](../../docs/AUDITORIA-UX-UI-Horizons-Lounge-Aruba.md) — fuente técnica de verdad

**Fecha del plan:** 28 de agosto de 2026  
**Rama de trabajo propuesta:** `fix/correcciones-cliente` (desde `main`)

> **Fase 2 en curso** (rama `fix/correcciones-cliente`).  
> **Decisiones de aprobación (28 ago 2026):**  
> 1. Plan aprobado.  
> 2. OpenTable **no** se integra: CTAs disparan toast/card demo (`OpenTableNotice`).  
> 3. Sticky Reserve = **ambos**: primario `/reserve`, secundario OpenTable (demo).

---

## 0. Diagnóstico Fase 0 (código vs auditoría)

Se cruzaron §1 / §4 / §5 del Documento Maestro con la Auditoría y se re-inspeccionó `src/` el 28 ago 2026. **Los hallazgos citados siguen vigentes.**

| Petición cliente (Doc Maestro) | Hallazgo técnico (Auditoría + código) | Estado en repo hoy |
|---|---|---|
| **1.1** Scrollytelling día→noche, no “plantillado” | `SectionWrapper.astro` único template; solo `tone='a'\|'b'` cambia overlay; Ritual→Connect son el mismo bloque foto+lockup+footnote | Vigente — 6 secciones idénticas |
| **1.2** Hero “slides” + copy largo | `Hero.astro`: video full-bleed + `SectionFootnote` con 2 párrafos largos | Vigente |
| **1.3** Ritual legibilidad / contraste | Overlay `from-night/55…`; footnote `text-cream/90` + sombra débil; no scrim local por zona | Vigente |
| **1.4** Experience tipografía mayor (senior) | Footnote global `text-sm md:text-base lg:text-lg` en `SectionFootnote.astro` | Vigente |
| **1.5** Tipografía/contraste sitio | `.text-contrast` existe; footnote no lo usa; `.nav-link` sin focus; contraste sobre foto no auditado visualmente | Vigente |
| **1.6** Liquid Gold “todo igual” | `LiquidGold.astro` → mismo `SectionWrapper` | Vigente |
| **1.7** Reserve prioridad + CTAs rotos | `Connect.astro` L19–28: `href="#"` OpenTable/WhatsApp; clase inválida `text-text-night`; footer WhatsApp `wa.me/2971234567` placeholder | Vigente |
| **1.8** Transiciones lentas entre páginas | `Layout.astro` monta `Loader.astro` en **toda** ruta; timer fijo **2000 ms**; sin ViewTransitions; `cinematic.mp4` ≈ 3.9 MB preload en home | Vigente — causa principal = loader 2s global |
| **1.9** Redes / teléfono / legal `#` | `Footer.astro`: IG/FB/TikTok genéricos; `+297 123 4567`; Privacy/Terms/Accessibility → `#` | Vigente — requiere insumo cliente |
| **§4** Guía tipográfica, a11y senior, placeholders | Tokens en `@theme`; sin escala `--text-*` documentada; sin `src/data/contact.ts` unificado | Vigente |

**Fuera de alcance de este repo:** Amsterdam Manor (§2) y Passions (§3) del Documento Maestro.

---

## 1. Storyboard textual — narrativa día → noche (tarea 1.1)

Basado en tokens Sunset existentes (`sunset-yellow`, `sunset-orange`, `sunset-coral`, `ocean`, `night`, `terracotta`, `warm-charcoal`, `cream`, `peach`). **No** un gradiente genérico purple/indigo.

| Sección | Momento del día | Overlay / luz (tokens) | Formato visual (rompe plantilla) | Tributo de marca |
|---|---|---|---|---|
| **THE Ritual** | Pleno día → late afternoon | Luz alta: overlay claro-cálido `sand`/`peach` bajo + `warm-charcoal` suave en tipografía; horizon line sutil (trazo tipo logo) | Foto full-bleed + lockup; footnote más limpia, menos blur denso | Inicio del Sunset Ritual — cielo aún abierto |
| **THE Experience** | Golden hour temprano | Calor entrante: `sunset-yellow`/`sunset-orange` en acentos; overlay `from-night/40 via-sunset-orange/15 to-night/55` | Tipografía cuerpo más grande (senior); posible kicker “golden hour” en Montserrat tracking | Acento amarillo del logo como “sol” tipográfico |
| **CULINARY Art** | Atardecer en mesa | Paleta comida/cálida: `terracotta` + `peach` en panel lateral o franja inferior; overlay asimétrico (más oscuro en lado texto) | **Formato A:** split — imagen dominante + columna narrativa glass/scrim (no solo texto centrado) | Platos = “harvest” bajo sol bajo |
| **LIQUID Gold** | Sol rozando el horizonte | Pico de marca: `sunset-yellow` dominante, `sunset-orange` glow en tipografía/CTA interno; overlay más rico `via-sunset-yellow/20` | **Formato B:** tipografía “cocktail card” o lista de 2–3 firmas en tipografía display + foto de fondo (variedad vs Culinary) | El sol del logo = “liquid gold” en el vaso |
| **SOCIAL Vibe** | Dusk → early night | Enfriamiento: entra `ocean` en overlay (`via-ocean/25`); menos amarillo, más `cream` sobre `night` | **Formato C:** ritmo/event strip — 2–3 momentos (música / crowd / late) en franjas o stack vertical, no un solo footnote | Energía de Eagle Beach de noche |
| **RESERVE Now** | Noche | Fondo `night` denso; CTAs `sunset-yellow` de alto contraste; overlay `from-night/70 via-warm-charcoal/40 to-night/80` | Jerarquía CTA: botón primario grande + secundario; preparar slot sticky (ver tarea 1.7) | Conversión bajo cielo cerrado |

**Transiciones entre secciones:** interpolar un CSS custom property `--ritual-progress` (0→1) vía scroll en el reel (`index.astro` + posible island ligera), mapeando overlays por tramo; crossfade suave de clase `data-phase` en `SectionWrapper`; respetar `prefers-reduced-motion` (fase estática = golden hour medio, sin scrub). Mantener sensación “cómoda y fresca” — sin capas densas ni partículas ruidosas.

---

## 2. Tabla de tareas por prioridad

Orden alineado a **§5 Documento Maestro** (ítems 1–4 Horizons 🔴, luego 🟡, luego 🟢).

### 🔴 P0 — Crítico

| ID | Descripción | Archivo(s) reales | Acción técnica concreta | Criterio de aceptación | Estado |
|---|---|---|---|---|---|
| **P0-1** (Doc **1.1**) | Rediseño scrollytelling día→noche + variedad Culinary / Liquid Gold / Social Vibe | `SectionWrapper.astro`, `SplitTitle.astro`, `SectionFootnote.astro`, `Ritual.astro`, `Experience.astro`, `Culinary.astro`, `LiquidGold.astro`, `SocialVibe.astro`, `Connect.astro`, `index.astro` (reel script), `src/styles/global.css` (`@theme` + utilidades phase), posible `src/components/DayNightProgress.tsx` (island) | Extender `SectionWrapper` con prop `phase: 'day' \| 'golden' \| 'dusk' \| 'night'` (o similar) y overlays tokenizados; layouts distintos para Culinary (split), Liquid Gold (cocktail lockup), Social Vibe (event strip); driver de progreso scroll en reel; `prefers-reduced-motion` → fase fija golden | Cada sección se siente distinta; transición día→noche legible al scrollear; Culinary/Liquid/Social no son “misma plantilla”; sin sensación sobrecargada; reduced-motion OK | **Listo para ejecutar** (storyboard §1; copy de footnote existente se reutiliza salvo síntesesis pedida en otras tareas) |
| **P0-2** (Doc **1.7**) | CTAs Reserve/WhatsApp rotos + jerarquía visual de reserva | `Connect.astro`, `Footer.astro`, `src/data/contact.ts` (**nuevo**), `StickyMenu.tsx` (opcional CTA persistente), `global.css` | Crear `contact.ts` con `OPENTABLE_URL`, `WHATSAPP_URL`, `PHONE`, `EMAIL`, redes, legales — valores `TODO_CLIENTE` / URLs `https://TODO_CLIENTE/...`; conectar `href` de Connect + Footer al mismo módulo; reforzar CTA Connect (tamaño, `focus-visible`, hover, reemplazar `text-text-night` → `text-night` o `text-warm-charcoal`); CTA sticky mínimo “Reserve” hacia `/reserve` o OpenTable env | Ningún CTA de reserva apunta a `#`; un solo origen de verdad de contactos; botón OpenTable legible y focuseable; WhatsApp usa `wa.me/TODO_CLIENTE` hasta dato real | **Parcialmente bloqueada** — URLs finales `TODO_CLIENTE` |
| **P0-3** (Doc **1.5** + §4 tipografía/contraste) | Tipografía cuerpo legible + contraste títulos sobre foto en todo el reel | `global.css` (`@theme` tokens `--text-*` / utilidades), `SectionFootnote.astro`, `SectionWrapper.astro`, `Hero.astro`, `SplitTitle.astro`, `.text-contrast`, páginas `/experiences` si aplica mismo criterio cuerpo | Definir escala mínima cuerpo ≥16–18px desktop; footnote usa `.text-contrast` o scrim más fuerte; auditar overlays por `phase`; focus-visible en `.nav-link` y links footer tocados | Texto cuerpo legible en desktop/móvil; títulos no se pierden en zonas claras de foto; focus visible en nav | **Listo para ejecutar** |
| **P0-4** (Doc **1.8**) | Acelerar “transiciones” entre páginas internas | `Loader.astro`, `Layout.astro`, `Hero.astro` / `index.astro` (preload video) | Loader solo en **primera visita** (sessionStorage) o duración ≤400–600ms en navegación interna; skip inmediato si `prefers-reduced-motion`; no bloquear 2s fijos en `/gallery`, `/menu`, etc.; valorar `preload="metadata"` en video home si no afecta LCP percibido | Home→Gallery/Menu/Experiences/Reserve no espera ~2s de logo; primera carga sigue mostrando ritual de marca; build OK | **Listo para ejecutar** |

### 🟡 P1 — Importante

| ID | Descripción | Archivo(s) reales | Acción técnica concreta | Criterio de aceptación | Estado |
|---|---|---|---|---|---|
| **P1-1** (Doc **1.2**) | Hero: romper sensación “slides” + sintetizar copy | `Hero.astro`, `SectionFootnote.astro` (o slot local) | Mantener video; añadir 1–2 elementos de formato distinto (p.ej. tipografía lockup ya existente + cue reforzado / franja horizon / still poster layer) — **sin** collage de cards; copy footnote → **una frase corta** impacto + tamaño mayor (tokens P0-3) | Primer viewport no parece carrusel de diapositivas; copy corto y legible | **Listo para ejecutar** — wording final de la frase puede validarse con cliente; se propondrá síntesis a partir del copy actual (no inventar claims nuevos) |
| **P1-2** (Doc **1.3**) | Ritual: legibilidad, menos ruido, arranque día | `Ritual.astro`, `SectionWrapper` phase `day` | Aplicar phase day del storyboard; reforzar scrim bajo tipografía; reducir blur/ruido del footnote en esta sección | Texto Ritual legible; sección inicia narrativa día | Cubierto en gran parte por **P0-1**; commit puede ser ajuste fino si queda gap |
| **P1-3** (Doc **1.4** + §4 a11y senior) | Experience: tipografía más grande | `Experience.astro`, `SectionFootnote` / override por prop `size` | Body/footnote de Experience ≥ un paso tipográfico sobre el resto; tracking/leading cómodos | Texto Experience claramente más grande en viewport real | **Listo para ejecutar** |
| **P1-4** (Doc **1.6**) | Liquid Gold formato distinto | `LiquidGold.astro` + posible subcomponente | Implementar Formato B del storyboard | Visualmente distinta a Ritual/Experience | Cubierto por **P0-1** |
| **P1-5** (Doc **1.7** sticky) | Jerarquía Reserve “verse más” | `Connect.astro`, `StickyMenu.tsx` o chip sticky | CTA Reserve más dominante; opcional sticky “RESERVE” en scroll del reel (focus-visible, aria-label) | Bloque reserva es el CTA más visible del final del reel | **Listo para ejecutar** |

### 🟢 P2 — Deseable / insumos cliente

| ID | Descripción | Archivo(s) reales | Acción técnica concreta | Criterio de aceptación | Estado |
|---|---|---|---|---|---|
| **P2-1** (Doc **1.9**) | Redes sociales reales | `src/data/contact.ts`, `Footer.astro` | Sustituir `instagram.com` / `facebook.com` / `tiktok.com` por handles reales | Links a perfiles Horizons | **BLOQUEADA — requiere insumo del cliente** (`TODO_CLIENTE`) |
| **P2-2** (Doc **1.9**) | Teléfono y email reales | `contact.ts`, `Footer.astro`, `reservation.ts` (`RESERVATION_EMAIL`) | Unificar email/tel; hoy `reservations@horizonsaruba.com` y `+297 123 4567` parecen placeholder | Datos confirmados en UI | **BLOQUEADA — requiere insumo del cliente** |
| **P2-3** (Doc **1.9**) | Legal Privacy / Terms / Accessibility | `Footer.astro`, `contact.ts` | `href` a rutas o URLs reales; o páginas stub `/privacy` etc. solo si cliente entrega copy | No apuntan a `#` con copy real | **BLOQUEADA — requiere copy legal del cliente** |
| **P2-4** (Doc **1.9**) | Un solo sistema de reserva (footer Book + Connect + `/reserve`) | `Footer.astro`, `Connect.astro`, `StickyMenu.tsx`, `contact.ts` | Misma destino: preferir `/reserve` interno + OpenTable externo documentado; evitar dos flujos contradictorios | Misma semántica “Book” en footer y Connect | Ejecutable con `TODO_CLIENTE` en OpenTable; flujo interno `/reserve` ya existe |
| **P2-5** (§4 / auditoría §9) | Focus visible residual (MenuHero, etc.) | `MenuHero.tsx`, `global.css`, `Footer.astro` | Añadir `focus-visible:ring-2 focus-visible:ring-sunset-yellow` donde falte al tocar archivos | Teclado muestra foco | **Listo para ejecutar** oportunista |

---

## 3. Deuda técnica aprovechable (Auditoría §11)

Solo si el archivo ya está en el scope de una tarea P0/P1/P2. **No** refactors grandes (unificar todo `.glass-*` / `.reserve-*`, rediseñar `/admin`).

| # Aud. | Ítem | Cuándo aprovecharlo |
|---|---|---|
| 4 | Clase inválida `text-text-night` en `Connect.astro:20` | **P0-2** (obligatorio al tocar Connect) |
| 6 / 14 | `w-100` inválido + `bg-cream/8` en `ReservationForm.tsx:124` | Solo si se toca reserve por unificación CTA/contacto; si no, **diferir** |
| 7 | `#171310` en `CustomSelect.tsx:142` → token `night` / nuevo `sunset-panel` en `@theme` | Idem, solo si se toca reserve |
| 1 / 8 | Logo SVG duplicado (`Loader`, `Footer`, `HorizonsLogo`) | **P0-4** al tocar Loader; **P2** footer si se toca Footer — extraer uso de `HorizonsLogo` o partial compartido |
| 3 | CTA amarillo inconsistente Connect vs EventCard vs reserve | **P0-2** / **P1-5**: alinear Connect con patrón de focus/hover; no reescribir EventCard/admin |
| 9 | Focus `.nav-link` / footer | **P0-3** y **P2-5** |
| 12 | `MenuContent.astro` huérfano (importa `ExpandCards.jsx` inexistente) | **No** en sprint cliente salvo cleanup 1-línea si molesta el build; hoy no está importado en páginas |

**Explícitamente fuera de alcance oportunista:** unificar sistemas de formulario glass/reserve/admin (§11.2), rediseño visual `/admin` (§11.11), lightbox gallery, sitemap 404 (auditoría §12) — nadie los pidió en §1.

---

## 4. Orden de ejecución (Fase 2) y commits

Trabajar en `fix/correcciones-cliente`. Un commit atómico por grupo. Mensajes en español.

### Fase A — 🔴 P0 → checkpoint visual

| Orden | Commit propuesto | Tareas |
|---|---|---|
| A1 | `fix(contact): centraliza CTAs Reserve/WhatsApp con TODO_CLIENTE (1.7)` | P0-2 (+ deuda `text-text-night`) |
| A2 | `fix(type): escala tipográfica y contraste sobre foto (1.5)` | P0-3 |
| A3 | `fix(loader): acelera transición entre páginas (1.8)` | P0-4 (+ logo en Loader si cabe) |
| A4 | `feat(reel): scrollytelling día→noche y formatos por sección (1.1)` | P0-1 (+ P1-2/P1-4 embebidos) |
| A5 | Checkpoint: build + validación visual home reel + Connect | — |

### Fase B — 🟡 P1 → checkpoint

| Orden | Commit propuesto | Tareas |
|---|---|---|
| B1 | `fix(hero): sintetiza copy y rompe sensación slide (1.2)` | P1-1 |
| B2 | `fix(experience): tipografía ampliada para legibilidad (1.4)` | P1-3 |
| B3 | `fix(reserve): refuerza jerarquía CTA y sticky Reserve (1.7)` | P1-5 |
| B4 | Checkpoint visual | — |

### Fase C — 🟢 P2

| Orden | Commit | Tareas |
|---|---|---|
| C1 | `fix(a11y): focus-visible en nav y controles restantes` | P2-5 |
| C2 | `fix(footer): unifica flujo Book hacia contact.ts /reserve (1.9)` | P2-4 |
| C3 | Placeholders redes/tel/legal | P2-1…P2-3 — **solo estructura `TODO_CLIENTE`**, sin inventar datos |

Tras cada bloque: `npm run build` y reportar errores/warnings.

---

## 5. Insumos bloqueados del cliente

Usar literales tipo `TODO_CLIENTE` en código/datos — **nunca** inventar números o handles que parezcan reales.

| Dato | Variable sugerida en `src/data/contact.ts` | Tareas |
|---|---|---|
| URL OpenTable | `OPENTABLE_URL = 'https://TODO_CLIENTE/opentable'` | P0-2, P2-4 |
| WhatsApp (E.164 sin +) | `WHATSAPP_E164 = 'TODO_CLIENTE'` → `https://wa.me/${…}` | P0-2, P2-2 |
| Teléfono display | `PHONE_DISPLAY = 'TODO_CLIENTE'` | P2-2 |
| Email reservas | Confirmar o `TODO_CLIENTE` (hoy `reservations@horizonsaruba.com`) | P2-2 |
| Instagram / Facebook / TikTok | `SOCIAL_*.url` | P2-1 |
| Privacy / Terms / Accessibility | URLs o copy | P2-3 |
| Validación visual día→noche vs pin Pinterest | Referencia §6 Doc Maestro | P0-1 (ajustar tras feedback) |

---

## 6. Componentes compartidos — precaución

Antes de editar, verificar usos:

| Componente | Usado en |
|---|---|
| `SectionWrapper.astro` | Ritual, Experience, Culinary, LiquidGold, SocialVibe, Connect |
| `StickyMenu.tsx` | `index`, `gallery`, `menu`, `experiences`, `reserve` |
| `HorizonsLogo.tsx` | StickyMenu (+ objetivo Loader/Footer) |
| `.glass-*` | No usado por `/reserve` hoy — **no migrar reserve a glass** en este sprint |
| `/admin` | **No tocar** salvo tarea explícita (ninguna en §1) |

---

## 7. Tracking de cierre (actualizar en Fase 2)

| Tarea | Completada | Bloqueada cliente | Diferida |
|---|---|---|---|
| P0-1 Scrollytelling 1.1 | ☑ | ☐ (feedback visual opcional) | ☐ |
| P0-2 CTAs 1.7 | ☑ | ☑ WhatsApp `TODO_CLIENTE`; OpenTable = demo toast | ☐ |
| P0-3 Tipo/contraste 1.5 | ☑ | ☐ | ☐ |
| P0-4 Loader/páginas 1.8 | ☑ | ☐ | ☐ |
| P1-1 Hero 1.2 | ☑ (copy sintetizado en P0-1) | ☐ validar tono | ☐ |
| P1-2 Ritual 1.3 | ☑ (phase day en P0-1) | ☐ | ☐ |
| P1-3 Experience 1.4 | ☑ (footnoteSize lg en P0-3) | ☐ | ☐ |
| P1-4 Liquid Gold 1.6 | ☑ (layout signatures en P0-1) | ☐ | ☐ |
| P1-5 Reserve hierarchy | ☑ (sticky + Connect en P0-2) | ☐ | ☐ |
| P2-1 Redes | ☐ | ☑ | ☐ |
| P2-2 Tel/email | ☐ | ☑ | ☐ |
| P2-3 Legal | ☐ | ☑ | ☐ |
| P2-4 Flujo Book único | ☐ | ☐ OpenTable URL | ☐ |
| P2-5 Focus residual | ☐ | ☐ | ☐ |
| Deuda `w-100` / `#171310` / logo Footer | ☐ | ☐ | ☐ si no se toca archivo |

---

## 8. Decisión pendiente antes de Fase 2

Confirmar:

1. ¿Aprobar este plan tal cual (orden A1→A4, storyboard §1)?
2. ¿OpenTable + WhatsApp pueden quedar en `TODO_CLIENTE` conectados a `contact.ts` para desbloquear P0-2?
3. ¿El sticky CTA de Reserve (P1-5) debe ir a `/reserve` interno, a OpenTable, o ambos (primario/secundario)?

**DETENTE aquí — no ejecutar Fase 2 hasta confirmación.**
