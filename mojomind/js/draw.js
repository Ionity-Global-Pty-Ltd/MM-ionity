/* ============================================================
   MojaMind — Digital Painting, Airbrush & 3D Ambient Studio 🎨🖌️
   A powerful, responsive on-device painting studio:
   - Fullscreen & Minimizable canvas interface.
   - Multi-Brush Suite:
     • Smooth Brush (Acrylic / Watercolor with Bezier smoothing)
     • True Airbrush (Particle mist with Gaussian dispersal & hold-to-spray)
     • Pencil (Granular graphite sketch grain with paper friction)
     • Oil Paint (3D Impasto viscous multi-bristle stroke)
     • Neon (Ultra-vibrant dual-layer glowing laser beam)
     • Rainbow (Chromatic hue flow with sparkle glints)
   - 🔤 Add Text: Custom typography, handwriting, serif, 8-bit & custom colors.
   - 🖼️ Photo & Resilience Stickers: Load device photos or stamp vector stickers.
   - Decorative Stamps: 💜, ⭐, ☀️, 🌸, 🌿, ✨, 🦋, 🐝.
   - Pressure sensitivity, custom hex palette, undo/redo history stack.
   - On-device Moja Vision colour and composition analysis.
   
   © IONITY Global (Pty) Ltd · Solutionist: Johan Wilhelm van Antwerp
   Antwerp Designs · www.ionity.co.za
   ============================================================ */
'use strict';

const MMDraw = (() => {
  const PALETTE = [
    { name: 'SHOUT green',  hex: '#00a651' },
    { name: 'SHOUT orange', hex: '#f58220' },
    { name: 'SHOUT red',    hex: '#ed1c24' },
    { name: 'SHOUT blue',   hex: '#2e3192' },
    { name: 'magenta',      hex: '#f3256b' },
    { name: 'purple',       hex: '#8a2eae' },
    { name: 'Hope gold',    hex: '#ffd700' },
    { name: 'sunshine',     hex: '#ffd166' },
    { name: 'leaf',         hex: '#34c759' },
    { name: 'sky',          hex: '#3f6ad8' },
    { name: 'earth',        hex: '#8b5a2b' },
    { name: 'ink',          hex: '#2b2140' },
    { name: 'white',        hex: '#ffffff' },
  ];
  const SIZES = [3, 8, 16, 32, 54];
  const STAMPS = ['💜', '⭐', '☀️', '🌸', '🌿', '✨', '🦋', '🐝'];
  const RESILIENCE_STICKERS = [
    '🦋', '🐝', '🌻', '🌸', '🌺', '🌈',
    '☀️', '⭐', '💜', '🕊️', '🌿', '🎨',
    '🕯️', '💎', '🚀', '🐱', '🐶', '🦄',
    '💖', '🌊', '🧘', '🛡️', '🍀', '🌟'
  ];
  const FONTS = [
    { id: 'poppins', name: 'Modern Sans', css: "'Poppins', sans-serif" },
    { id: 'hand',    name: '✍️ Cursive',  css: "'Caveat', 'Brush Script MT', cursive, sans-serif" },
    { id: 'serif',   name: 'Classic Serif', css: "'Georgia', 'Times New Roman', serif" },
    { id: 'impact',  name: '💥 Bold Impact', css: "'Impact', 'Arial Black', sans-serif" },
    { id: 'mono',    name: '👾 8-Bit Retro', css: "'Courier New', monospace" },
  ];

  const safeToast = (msg, ms) => { if (typeof toast === 'function') toast(msg, ms); };

  /** Mount a drawing pad into `host`. Returns a controller. */
  function mount(host, { onSave, onClose } = {}) {
    let colour = PALETTE[4].hex;
    let size = SIZES[2];
    let brushType = 'brush'; // 'brush' | 'airbrush' | 'pen' | 'oil' | 'neon' | 'rainbow' | 'stamp'
    let currentStamp = '💜';
    let isEraser = false;
    let isFullscreen = false;
    let isMinimized = false;
    let isDrawing = false;
    let airbrushTimer = null;
    let lastPoint = null;
    let strokes = []; // history stack of strokes, text, and image stamps
    let redoStack = [];
    let currentStroke = null;

    // Active interactive placement state (for Text & Photo Stickers)
    let placementItem = null; // { type: 'text'|'image', content, ... }

    host.innerHTML = `
      <div class="draw-studio-wrap ${isFullscreen ? 'fullscreen' : ''}" id="draw-studio">
        <!-- Top Action Bar -->
        <div class="draw-bar draw-bar-top">
          <button class="draw-btn-icon" data-d="close" title="Close Canvas" aria-label="Close drawing pad">✕</button>
          <div class="draw-title-group">
            <span class="draw-title">Digital Art Studio 🎨</span>
            <small class="draw-sub-title">Multi-Brush · Airbrush · Typography · Photo Stickers</small>
          </div>
          <div class="draw-top-right">
            <button class="draw-btn-icon" data-d="soundscape" id="draw-sc-btn" title="432Hz Ambient Soundscape">✨</button>
            <button class="draw-btn-icon" data-d="fullscreen" id="draw-fs-btn" title="Toggle Fullscreen">⛶</button>
            <button class="draw-btn-icon" data-d="download" id="draw-dl-btn" title="Save a copy to your device">⬇️</button>
            <button class="draw-save" data-d="save">💾 Save to Activity</button>
          </div>
        </div>

        <!-- Drawing Canvas Stage with 3D Easel Grain -->
        <div class="draw-stage-container" id="draw-stage">
          <canvas class="draw-canvas" id="draw-canvas" aria-label="Drawing canvas — draw with finger, mouse or stylus"></canvas>
          <div class="draw-placement-overlay hidden" id="draw-placement-box">
            <div class="placement-content" id="placement-preview"></div>
            <div class="placement-controls">
              <button class="btn btn-sm btn-ghost" id="placement-cancel">✕ Cancel</button>
              <button class="btn btn-sm btn-primary" id="placement-apply" style="background:#00a651">✓ Stamp Here</button>
            </div>
          </div>
          <div class="draw-live-ocr draw-live" id="draw-live-vision"></div>
        </div>

        <!-- Floating Minimizable Multi-Tool Studio Bar -->
        <div class="draw-bar-tools-container ${isMinimized ? 'minimized' : ''}" id="draw-tools-drawer">
          <div class="draw-drawer-handle" id="draw-drawer-toggle" title="Minimize / Expand Tool Palette">
            <span></span>
          </div>

          <div class="draw-tools-inner">
            <!-- Brush & Feature Selector -->
            <div class="draw-brush-picker">
              <button class="draw-tool-tab on" data-brush="brush" title="Smooth Acrylic &amp; Watercolor">🖌️ Brush</button>
              <button class="draw-tool-tab" data-brush="airbrush" title="Soft Particle Spray Mist Airbrush">💨 Airbrush</button>
              <button class="draw-tool-tab" data-brush="pen" title="Fine Graphite Pencil &amp; Sketch">✏️ Pencil</button>
              <button class="draw-tool-tab" data-brush="oil" title="3D Viscous Impasto Oil Paint">🎨 Oil</button>
              <button class="draw-tool-tab" data-brush="neon" title="3D Luminous Glowing Laser">⚡ Neon</button>
              <button class="draw-tool-tab" data-brush="rainbow" title="Rainbow Chromatic Trail">🌈 Rainbow</button>
              <button class="draw-tool-tab draw-feat-tab" id="draw-add-text-btn" title="Add Custom Typography">🔤 Add Text</button>
              <button class="draw-tool-tab draw-feat-tab" id="draw-add-sticker-btn" title="Add Photo or Themed Sticker">🖼️ Stickers</button>
            </div>

            <!-- Color Palette & Custom Picker -->
            <div class="draw-swatches-row">
              <div class="draw-swatches" role="group" aria-label="Colours">
                ${PALETTE.map(c => `<button class="draw-swatch ${c.hex === colour ? 'on' : ''}" data-colour="${c.hex}" style="--c:${c.hex}" title="${c.name}"></button>`).join('')}
              </div>
              <label class="draw-custom-color" title="Pick Any Custom Colour">
                <span>🎨</span>
                <input type="color" id="draw-custom-picker" value="${colour}" />
              </label>
            </div>

            <!-- Size Presets, Eraser, Stamps & Undo/Redo -->
            <div class="draw-tools-bottom-row">
              <div class="draw-sizes-group" title="Brush Size / Line Width">
                ${SIZES.map(s => `<button class="draw-size ${s === size ? 'on' : ''}" data-size="${s}" title="Size ${s}px"><i style="width:${Math.min(s, 22)}px;height:${Math.min(s, 22)}px"></i></button>`).join('')}
              </div>

              <div class="draw-stamps-group" title="Resilience Quick Stamps">
                ${STAMPS.map(st => `<button class="draw-stamp-btn" data-stamp="${st}" title="Stamp ${st}">${st}</button>`).join('')}
              </div>

              <div class="draw-actions-group">
                <button class="draw-tool" data-d="erase" aria-pressed="false" title="Eraser">🩹 Eraser</button>
                <button class="draw-tool" data-d="undo" title="Undo (Ctrl+Z)">↩</button>
                <button class="draw-tool" data-d="redo" title="Redo (Ctrl+Y)">↪</button>
                <button class="draw-tool" data-d="clear" title="Clear Canvas">🗑</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Hidden File Input for Device Photo Upload -->
        <input type="file" id="draw-photo-input" accept="image/*" style="display:none" />

        <p class="draw-hint" id="draw-hint">Draw with finger or stylus · Hold down for rich airbrush spray mist 🌿</p>
      </div>`;

    const wrap = host.querySelector('#draw-studio');
    const stage = host.querySelector('#draw-stage');
    const cv = host.querySelector('#draw-canvas');
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    const hint = host.querySelector('#draw-hint');
    const toolsDrawer = host.querySelector('#draw-tools-drawer');
    const placementBox = host.querySelector('#draw-placement-box');
    const placementPreview = host.querySelector('#placement-preview');
    const photoInput = host.querySelector('#draw-photo-input');

    function fit() {
      const box = cv.getBoundingClientRect();
      const dpr = Math.min(3, globalThis.devicePixelRatio || 1);
      cv.width = Math.round(box.width * dpr);
      cv.height = Math.round(box.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      repaint();
    }

    function repaint() {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      // Soft clean white art canvas with smooth backdrop
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.restore();

      for (const s of strokes) {
        paintItem(s);
      }
      hint.classList.toggle('faded', strokes.length > 0);
    }

    /* ── Render Any History Item (Stroke, Text, Image, Stamp) ─ */
    function paintItem(item) {
      if (item.type === 'text') {
        ctx.save();
        ctx.font = `${item.bold ? 'bold ' : ''}${item.fontSize || 28}px ${item.font || "'Poppins', sans-serif"}`;
        ctx.fillStyle = item.colour || '#2b2140';
        ctx.textAlign = item.align || 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.18)';
        ctx.shadowBlur = 4;
        ctx.fillText(item.text, item.x, item.y);
        ctx.restore();
        return;
      }

      if (item.type === 'image') {
        if (item.imgObj && item.imgObj.complete) {
          ctx.save();
          ctx.translate(item.x, item.y);
          if (item.rotation) ctx.rotate(item.rotation);
          ctx.drawImage(item.imgObj, -item.width / 2, -item.height / 2, item.width, item.height);
          ctx.restore();
        }
        return;
      }

      if (item.stamp) {
        ctx.save();
        ctx.font = `${item.size * 2.4}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.22)';
        ctx.shadowBlur = 6;
        ctx.fillText(item.stamp, item.points[0].x, item.points[0].y);
        ctx.restore();
        return;
      }

      // Airbrush Spray Mist Rendering
      if (item.brushType === 'airbrush' && !item.erase) {
        ctx.save();
        ctx.fillStyle = item.colour;
        for (let i = 0; i < item.points.length; i++) {
          const pt = item.points[i];
          const radius = Math.max(8, item.size * (1.1 + (pt.p || 0.5) * 0.9));
          const particles = Math.min(48, Math.max(16, Math.round(radius * 1.6)));
          for (let d = 0; d < particles; d++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.pow(Math.random(), 1.7) * radius;
            const px = pt.x + Math.cos(angle) * dist;
            const py = pt.y + Math.sin(angle) * dist;
            const dotSize = Math.random() * 1.8 + 0.5;
            const alpha = Math.max(0.03, (1 - dist / radius) * 0.22);
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(px, py, dotSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
        return;
      }

      // Pencil Fine Graphite Rendering
      if (item.brushType === 'pen' && !item.erase) {
        ctx.save();
        ctx.strokeStyle = item.colour;
        for (let i = 1; i < item.points.length; i++) {
          const a = item.points[i - 1], b = item.points[i];
          const width = Math.max(1.2, item.size * 0.35 * (0.6 + (a.p + b.p) / 2));
          // 3 micro strands for graphite texture
          for (let j = -1; j <= 1; j++) {
            ctx.globalAlpha = 0.55 + Math.random() * 0.35;
            ctx.lineWidth = width * (0.8 + Math.random() * 0.4);
            ctx.beginPath();
            const jitter = j * (width * 0.4);
            ctx.moveTo(a.x + jitter, a.y + jitter);
            ctx.lineTo(b.x + jitter, b.y + jitter);
            ctx.stroke();
          }
        }
        ctx.restore();
        return;
      }

      // Oil Paint Impasto Rendering
      if (item.brushType === 'oil' && !item.erase) {
        ctx.save();
        ctx.lineCap = 'square';
        for (let i = 1; i < item.points.length; i++) {
          const a = item.points[i - 1], b = item.points[i];
          const baseW = item.size * (0.7 + (a.p + b.p) / 2);
          const bristleCount = Math.max(4, Math.round(baseW / 4));
          for (let br = 0; br < bristleCount; br++) {
            const offset = (br - bristleCount / 2) * (baseW / bristleCount);
            const dx = b.x - a.x, dy = b.y - a.y;
            const len = Math.hypot(dx, dy) || 1;
            const nx = -dy / len, ny = dx / len;
            ctx.lineWidth = Math.max(1.8, baseW / bristleCount);
            ctx.strokeStyle = br % 2 === 0 ? item.colour : shadeColor(item.colour, (br % 4 - 2) * 12);
            ctx.globalAlpha = 0.88;
            ctx.beginPath();
            ctx.moveTo(a.x + nx * offset, a.y + ny * offset);
            ctx.lineTo(b.x + nx * offset, b.y + ny * offset);
            ctx.stroke();
          }
        }
        ctx.restore();
        return;
      }

      // Neon 3D Glow Laser Rendering
      if (item.brushType === 'neon' && !item.erase) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        // Pass 1: Neon Glow Halo
        ctx.shadowColor = item.colour;
        ctx.shadowBlur = Math.max(14, item.size * 1.5);
        ctx.strokeStyle = item.colour;
        ctx.globalAlpha = 0.85;
        for (let i = 1; i < item.points.length; i++) {
          const a = item.points[i - 1], b = item.points[i];
          ctx.lineWidth = item.size * (0.8 + (a.p + b.p) / 2);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        // Pass 2: Ultra-Bright White Specular Core
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#ffffff';
        ctx.strokeStyle = '#ffffff';
        ctx.globalAlpha = 0.95;
        for (let i = 1; i < item.points.length; i++) {
          const a = item.points[i - 1], b = item.points[i];
          ctx.lineWidth = Math.max(1.8, item.size * 0.32 * (0.6 + (a.p + b.p) / 2));
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        ctx.restore();
        return;
      }

      // Standard Smooth Brush & Rainbow
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (item.erase) {
        ctx.strokeStyle = '#ffffff';
        ctx.shadowBlur = 0;
      } else {
        ctx.strokeStyle = item.colour;
        ctx.shadowColor = item.colour;
        ctx.shadowBlur = item.brushType === 'brush' ? 2 : 0;
      }

      if (item.points.length < 2) {
        const p = item.points[0];
        if (p) {
          ctx.beginPath();
          ctx.fillStyle = item.erase ? '#ffffff' : item.colour;
          ctx.arc(p.x, p.y, (item.size * (0.5 + (p.p || 0.5))) / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        return;
      }

      for (let i = 1; i < item.points.length; i++) {
        const a = item.points[i - 1], b = item.points[i];
        ctx.beginPath();
        if (item.brushType === 'rainbow') {
          const hue = (i * 12 + (a.x + a.y) * 0.4) % 360;
          ctx.strokeStyle = `hsl(${hue}, 95%, 56%)`;
        }
        ctx.lineWidth = item.size * (0.5 + (a.p + b.p) / 2);
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      ctx.restore();
    }

    function shadeColor(color, percent) {
      let num = parseInt(color.replace('#', ''), 16);
      if (isNaN(num)) return color;
      let amt = Math.round(2.55 * percent);
      let R = (num >> 16) + amt;
      let B = ((num >> 8) & 0x00FF) + amt;
      let G = (num & 0x0000FF) + amt;
      return '#' + (0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 + (G < 255 ? (G < 1 ? 0 : G) : 255)).toString(16).slice(1);
    }

    const pointOf = e => {
      const box = cv.getBoundingClientRect();
      return {
        x: e.clientX - box.left,
        y: e.clientY - box.top,
        p: e.pressure && e.pressure !== 0.5 ? Math.max(0.15, e.pressure) : 0.55,
      };
    };

    /* ── Airbrush Continuous Spray Deposit ────────────────────── */
    function sprayAirbrushAt(pt, s) {
      ctx.save();
      ctx.fillStyle = s.colour;
      const radius = Math.max(8, s.size * (1.1 + (pt.p || 0.5) * 0.9));
      const particles = Math.min(32, Math.max(12, Math.round(radius * 1.2)));
      for (let d = 0; d < particles; d++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.pow(Math.random(), 1.7) * radius;
        const px = pt.x + Math.cos(angle) * dist;
        const py = pt.y + Math.sin(angle) * dist;
        const dotSize = Math.random() * 1.8 + 0.5;
        const alpha = Math.max(0.03, (1 - dist / radius) * 0.2);
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(px, py, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    cv.addEventListener('pointerdown', e => {
      e.preventDefault();
      cv.setPointerCapture(e.pointerId);
      isDrawing = true;
      redoStack = [];

      const pt = pointOf(e);
      lastPoint = pt;

      if (brushType === 'stamp') {
        const stampStroke = { stamp: currentStamp, size, points: [pt] };
        strokes.push(stampStroke);
        paintItem(stampStroke);
        isDrawing = false;
        hint.classList.add('faded');
        return;
      }

      currentStroke = {
        colour,
        size,
        brushType,
        erase: isEraser,
        points: [pt],
      };
      strokes.push(currentStroke);
      paintItem(currentStroke);
      hint.classList.add('faded');

      // If Airbrush is active, start continuous spray timer for rich shading
      if (brushType === 'airbrush' && !isEraser) {
        clearInterval(airbrushTimer);
        airbrushTimer = setInterval(() => {
          if (isDrawing && lastPoint && currentStroke) {
            currentStroke.points.push({ ...lastPoint, p: lastPoint.p });
            sprayAirbrushAt(lastPoint, currentStroke);
          }
        }, 38);
      }
    });

    cv.addEventListener('pointermove', e => {
      if (!isDrawing || !currentStroke) return;
      e.preventDefault();
      const pts = typeof e.getCoalescedEvents === 'function' ? e.getCoalescedEvents() : [e];
      for (const ev of (pts.length ? pts : [e])) {
        const pt = pointOf(ev);
        lastPoint = pt;
        const last = currentStroke.points[currentStroke.points.length - 1];
        if (last && Math.hypot(pt.x - last.x, pt.y - last.y) < 0.8) continue;
        currentStroke.points.push(pt);

        // Perform real-time incremental rendering
        if (currentStroke.brushType === 'airbrush' && !currentStroke.erase) {
          sprayAirbrushAt(pt, currentStroke);
        } else {
          // Render segment immediately
          const segItem = {
            ...currentStroke,
            points: [last, pt],
          };
          paintItem(segItem);
        }
      }
    });

    const endStroke = () => {
      isDrawing = false;
      currentStroke = null;
      lastPoint = null;
      clearInterval(airbrushTimer);
      airbrushTimer = null;
    };
    cv.addEventListener('pointerup', endStroke);
    cv.addEventListener('pointercancel', endStroke);
    cv.addEventListener('pointerleave', endStroke);

    /* ── Brush Selection ─────────────────────────────────────── */
    host.querySelectorAll('[data-brush]').forEach(b => b.addEventListener('click', () => {
      brushType = b.dataset.brush;
      isEraser = false;
      host.querySelectorAll('.draw-tool-tab').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      host.querySelector('[data-d="erase"]')?.classList.remove('on');
      safeToast(`Selected ${b.textContent.trim()} 🎨`, 1200);
    }));

    /* ── Swatches & Custom Color Picker ──────────────────────── */
    host.querySelectorAll('[data-colour]').forEach(b => b.addEventListener('click', () => {
      colour = b.dataset.colour;
      isEraser = false;
      if (brushType === 'stamp') brushType = 'brush';
      host.querySelectorAll('[data-colour]').forEach(x => x.classList.toggle('on', x === b));
      host.querySelector('[data-d="erase"]')?.classList.remove('on');
    }));

    host.querySelector('#draw-custom-picker')?.addEventListener('input', e => {
      colour = e.target.value;
      isEraser = false;
      if (brushType === 'stamp') brushType = 'brush';
      host.querySelectorAll('[data-colour]').forEach(x => x.classList.remove('on'));
    });

    /* ── Brush Sizes ─────────────────────────────────────────── */
    host.querySelectorAll('[data-size]').forEach(b => b.addEventListener('click', () => {
      size = +b.dataset.size;
      host.querySelectorAll('[data-size]').forEach(x => x.classList.toggle('on', x === b));
    }));

    /* ── Stamps ──────────────────────────────────────────────── */
    host.querySelectorAll('[data-stamp]').forEach(b => b.addEventListener('click', () => {
      brushType = 'stamp';
      currentStamp = b.dataset.stamp;
      isEraser = false;
      host.querySelectorAll('.draw-tool-tab').forEach(x => x.classList.remove('on'));
      host.querySelectorAll('[data-stamp]').forEach(x => x.classList.toggle('on', x === b));
      safeToast(`Selected ${currentStamp} stamp · Tap canvas to place! ✨`, 1500);
    }));

    /* ── Eraser ──────────────────────────────────────────────── */
    host.querySelector('[data-d="erase"]')?.addEventListener('click', e => {
      isEraser = !isEraser;
      e.currentTarget.classList.toggle('on', isEraser);
      if (isEraser) host.querySelectorAll('.draw-tool-tab').forEach(x => x.classList.remove('on'));
      safeToast(isEraser ? 'Eraser active 🩹' : 'Brush active', 1000);
    });

    /* ── Undo / Redo / Clear ─────────────────────────────────── */
    const undoAction = () => {
      if (strokes.length) {
        redoStack.push(strokes.pop());
        repaint();
      }
    };
    const redoAction = () => {
      if (redoStack.length) {
        strokes.push(redoStack.pop());
        repaint();
      }
    };
    host.querySelector('[data-d="undo"]')?.addEventListener('click', undoAction);
    host.querySelector('[data-d="redo"]')?.addEventListener('click', redoAction);

    host.querySelector('[data-d="clear"]')?.addEventListener('click', () => {
      if (strokes.length) {
        redoStack = [...strokes];
        strokes = [];
        repaint();
        safeToast('Canvas cleared');
      }
    });

    // Keyboard Shortcuts (Ctrl+Z, Ctrl+Y)
    const onKey = e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undoAction(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) { e.preventDefault(); redoAction(); }
    };
    window.addEventListener('keydown', onKey);

    /* ── 🔤 Add Text Tool Feature ────────────────────────────── */
    host.querySelector('#draw-add-text-btn')?.addEventListener('click', () => {
      showTextModal();
    });

    function showTextModal() {
      const modalWrap = document.createElement('div');
      modalWrap.className = 'draw-submodal-wrap';
      modalWrap.innerHTML = `
        <div class="draw-submodal-card">
          <div class="draw-submodal-head">
            <h3>🔤 Add Text to Canvas</h3>
            <button class="draw-btn-icon submodal-close">✕</button>
          </div>
          <div class="draw-submodal-body">
            <label style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.85)">Your Words / Message:</label>
            <input type="text" id="text-input-field" class="submodal-input" placeholder="e.g. My Inner Strength 🌟" value="Strength &amp; Hope 🌟" maxlength="60" />

            <label style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.85);margin-top:10px">Typography Style:</label>
            <div class="submodal-font-grid">
              ${FONTS.map((f, i) => `
                <button class="submodal-font-chip ${i === 0 ? 'on' : ''}" data-font="${f.css}">
                  <span style="font-family:${f.css}">${f.name}</span>
                </button>
              `).join('')}
            </div>

            <div style="display:flex;gap:12px;align-items:center;margin-top:12px">
              <div style="flex:1">
                <label style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.85)">Font Size:</label>
                <input type="range" id="text-size-slider" min="18" max="64" value="32" style="width:100%;margin-top:4px" />
              </div>
              <div>
                <label style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.85)">Color:</label>
                <div style="display:flex;align-items:center;gap:6px;margin-top:4px">
                  <input type="color" id="text-color-picker" value="${colour}" style="width:36px;height:36px;border-radius:8px;border:none;cursor:pointer" />
                </div>
              </div>
            </div>

            <div class="text-preview-box">
              <span id="text-live-preview" style="font-family:'Poppins', sans-serif;font-size:32px;color:${colour}">Strength &amp; Hope 🌟</span>
            </div>
          </div>
          <div class="draw-submodal-foot">
            <button class="btn btn-ghost submodal-close" style="flex:1">Cancel</button>
            <button class="btn btn-primary" id="text-submit-btn" style="flex:1.5;background:linear-gradient(135deg,#3366ff,#8a2eae)">Place on Canvas ✍️</button>
          </div>
        </div>
      `;
      document.body.appendChild(modalWrap);

      const txtField = modalWrap.querySelector('#text-input-field');
      const fontChips = modalWrap.querySelectorAll('.submodal-font-chip');
      const sizeSlider = modalWrap.querySelector('#text-size-slider');
      const colorPick = modalWrap.querySelector('#text-color-picker');
      const livePrev = modalWrap.querySelector('#text-live-preview');

      let selectedFont = FONTS[0].css;

      function updatePrev() {
        livePrev.textContent = txtField.value || 'Sample Text';
        livePrev.style.fontFamily = selectedFont;
        livePrev.style.fontSize = `${sizeSlider.value}px`;
        livePrev.style.color = colorPick.value;
      }

      txtField.addEventListener('input', updatePrev);
      sizeSlider.addEventListener('input', updatePrev);
      colorPick.addEventListener('input', updatePrev);

      fontChips.forEach(ch => ch.addEventListener('click', () => {
        fontChips.forEach(c => c.classList.remove('on'));
        ch.classList.add('on');
        selectedFont = ch.dataset.font;
        updatePrev();
      }));

      modalWrap.querySelectorAll('.submodal-close').forEach(b => b.addEventListener('click', () => modalWrap.remove()));

      modalWrap.querySelector('#text-submit-btn').addEventListener('click', () => {
        const textVal = txtField.value.trim();
        if (!textVal) return safeToast('Please enter your text message ✍️');
        const textItem = {
          type: 'text',
          text: textVal,
          font: selectedFont,
          fontSize: parseInt(sizeSlider.value, 10),
          colour: colorPick.value,
          x: cv.width / (2 * (globalThis.devicePixelRatio || 1)),
          y: cv.height / (2 * (globalThis.devicePixelRatio || 1)),
        };
        modalWrap.remove();
        startPlacement(textItem);
      });
    }

    /* ── 🖼️ Stickers & Photo Stickers Feature ─────────────────── */
    host.querySelector('#draw-add-sticker-btn')?.addEventListener('click', () => {
      showStickerModal();
    });

    function showStickerModal() {
      const modalWrap = document.createElement('div');
      modalWrap.className = 'draw-submodal-wrap';
      modalWrap.innerHTML = `
        <div class="draw-submodal-card">
          <div class="draw-submodal-head">
            <h3>🖼️ Stickers &amp; Photo Stamps</h3>
            <button class="draw-btn-icon submodal-close">✕</button>
          </div>
          <div class="draw-submodal-body">
            <!-- Photo Upload Hero -->
            <div class="photo-upload-hero" id="photo-upload-trigger">
              <div style="font-size:36px;margin-bottom:6px">📷</div>
              <b>Add Photo from Camera or Files</b>
              <p style="font-size:11.5px;color:rgba(255,255,255,0.75);margin:4px 0 0">Select a memory or snapshot to stamp and decorate on your canvas</p>
            </div>

            <label style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.85);margin-top:14px;display:block">Or Choose a Resilience Sticker:</label>
            <div class="stickers-grid">
              ${RESILIENCE_STICKERS.map(s => `<button class="sticker-chip" data-stk="${s}">${s}</button>`).join('')}
            </div>
          </div>
          <div class="draw-submodal-foot">
            <button class="btn btn-ghost submodal-close" style="width:100%">Cancel</button>
          </div>
        </div>
      `;
      document.body.appendChild(modalWrap);

      modalWrap.querySelectorAll('.submodal-close').forEach(b => b.addEventListener('click', () => modalWrap.remove()));

      // Photo Upload Action
      modalWrap.querySelector('#photo-upload-trigger').addEventListener('click', () => {
        photoInput.click();
      });

      photoInput.onchange = e => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = evt => {
          const imgObj = new Image();
          imgObj.onload = () => {
            modalWrap.remove();
            const aspect = imgObj.width / imgObj.height;
            const targetW = Math.min(220, cv.width / (globalThis.devicePixelRatio || 1) * 0.6);
            const targetH = targetW / aspect;
            const imgItem = {
              type: 'image',
              imgObj,
              src: evt.target.result,
              x: cv.width / (2 * (globalThis.devicePixelRatio || 1)),
              y: cv.height / (2 * (globalThis.devicePixelRatio || 1)),
              width: targetW,
              height: targetH,
            };
            startPlacement(imgItem);
          };
          imgObj.src = evt.target.result;
        };
        reader.readAsDataURL(file);
      };

      // Resilience Sticker Click
      modalWrap.querySelectorAll('.sticker-chip').forEach(sc => sc.addEventListener('click', () => {
        const stk = sc.dataset.stk;
        modalWrap.remove();
        const textItem = {
          type: 'text',
          text: stk,
          font: 'sans-serif',
          fontSize: 64,
          colour: '#ffffff',
          x: cv.width / (2 * (globalThis.devicePixelRatio || 1)),
          y: cv.height / (2 * (globalThis.devicePixelRatio || 1)),
        };
        startPlacement(textItem);
      }));
    }

    /* ── Interactive Canvas Placement Mode ───────────────────── */
    function startPlacement(item) {
      placementItem = item;
      placementBox.classList.remove('hidden');

      if (item.type === 'text') {
        placementPreview.innerHTML = `
          <div style="font-family:${item.font};font-size:${item.fontSize}px;color:${item.colour};text-align:center;pointer-events:none;user-select:none;text-shadow:0 2px 8px rgba(0,0,0,0.4)">
            ${esc(item.text)}
          </div>
        `;
      } else if (item.type === 'image') {
        placementPreview.innerHTML = `
          <img src="${item.src}" style="width:${item.width}px;height:${item.height}px;border-radius:12px;object-fit:cover;box-shadow:0 8px 24px rgba(0,0,0,0.45);pointer-events:none;user-select:none;border:2px solid #3366ff" alt="Photo Sticker" />
        `;
      }

      updatePlacementPosition();
      safeToast('Drag or touch anywhere on the canvas to place your item ✨', 2400);
    }

    function updatePlacementPosition() {
      if (!placementItem) return;
      placementBox.style.left = `${placementItem.x}px`;
      placementBox.style.top = `${placementItem.y}px`;
    }

    // Drag to position on placement stage
    let isDraggingPlacement = false;
    let dragOffset = { x: 0, y: 0 };

    placementBox.addEventListener('pointerdown', e => {
      e.stopPropagation();
      isDraggingPlacement = true;
      const rect = placementBox.getBoundingClientRect();
      dragOffset.x = e.clientX - rect.left - rect.width / 2;
      dragOffset.y = e.clientY - rect.top - rect.height / 2;
      placementBox.setPointerCapture(e.pointerId);
    });

    placementBox.addEventListener('pointermove', e => {
      if (!isDraggingPlacement || !placementItem) return;
      const stageRect = stage.getBoundingClientRect();
      placementItem.x = e.clientX - stageRect.left - dragOffset.x;
      placementItem.y = e.clientY - stageRect.top - dragOffset.y;
      updatePlacementPosition();
    });

    const stopPlacementDrag = () => { isDraggingPlacement = false; };
    placementBox.addEventListener('pointerup', stopPlacementDrag);
    placementBox.addEventListener('pointercancel', stopPlacementDrag);

    // Apply / Stamp item permanently into history
    host.querySelector('#placement-apply')?.addEventListener('click', e => {
      e.stopPropagation();
      if (!placementItem) return;
      strokes.push(placementItem);
      redoStack = [];
      placementBox.classList.add('hidden');
      placementItem = null;
      repaint();
      safeToast('Stamped onto your artwork! 🌟', 1500);
    });

    host.querySelector('#placement-cancel')?.addEventListener('click', e => {
      e.stopPropagation();
      placementBox.classList.add('hidden');
      placementItem = null;
    });

    /* ── Soundscape Toggle ───────────────────────────────────── */
    host.querySelector('#draw-sc-btn')?.addEventListener('click', () => {
      if (typeof MMSoundscape !== 'undefined') {
        const on = MMSoundscape.toggle('432hz');
        host.querySelector('#draw-sc-btn')?.classList.toggle('on', on);
        safeToast(on ? '432Hz Natural Harmony Soundscape playing ✨' : 'Ambient soundscape paused', 2000);
      }
    });

    /* ── Fullscreen Toggle ───────────────────────────────────── */
    host.querySelector('#draw-fs-btn')?.addEventListener('click', () => {
      isFullscreen = !isFullscreen;
      wrap.classList.toggle('fullscreen', isFullscreen);
      host.querySelector('#draw-fs-btn').textContent = isFullscreen ? '🗗' : '⛶';
      setTimeout(fit, 100);
    });

    /* ── Drawer Minimize / Toggle ────────────────────────────── */
    host.querySelector('#draw-drawer-toggle')?.addEventListener('click', () => {
      isMinimized = !isMinimized;
      toolsDrawer.classList.toggle('minimized', isMinimized);
    });

    /* ── Close & Save ────────────────────────────────────────── */
    host.querySelector('[data-d="close"]')?.addEventListener('click', () => {
      cleanup();
      onClose && onClose();
    });

    host.querySelector('[data-d="save"]')?.addEventListener('click', async () => {
      if (!strokes.length) return onSave && onSave(null, { empty: true });
      const dataUrl = flatten();
      const vision = await MMVision.read(dataUrl, { strokes });
      onSave && onSave(dataUrl, { vision, strokeCount: strokes.length });
    });

    /* ── Save a copy to the device (full-resolution PNG download) ──
       Works independently of the encrypted vault, so a participant
       always keeps an accessible copy of their artwork even if
       on-device storage is full. */
    host.querySelector('[data-d="download"]')?.addEventListener('click', () => {
      if (!strokes.length) { safeToast('Make a mark or two first 🖍'); return; }
      try {
        const url = flatten({ maxEdge: 2000, mime: 'image/png' });
        const a = document.createElement('a');
        a.href = url;
        a.download = `mojamind-artwork-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        safeToast('Artwork saved to your device 📥✨');
      } catch (e) {
        safeToast('Could not save to device — try again');
      }
    });

    /** Export a flattened image. Defaults: long edge 1000px, JPEG 0.88
        (compact for vault storage). Pass {maxEdge, mime, quality} to
        override — e.g. a full-resolution PNG for device download. */
    function flatten({ maxEdge = 1000, mime = 'image/jpeg', quality = 0.88 } = {}) {
      const out = document.createElement('canvas');
      const scale = Math.min(1, maxEdge / Math.max(cv.width, cv.height));
      out.width = Math.round(cv.width * scale);
      out.height = Math.round(cv.height * scale);
      const octx = out.getContext('2d');
      octx.fillStyle = '#ffffff';
      octx.fillRect(0, 0, out.width, out.height);
      octx.drawImage(cv, 0, 0, out.width, out.height);
      return mime === 'image/png' ? out.toDataURL('image/png') : out.toDataURL(mime, quality);
    }

    const ro = new ResizeObserver(fit);
    ro.observe(cv);
    requestAnimationFrame(fit);

    function cleanup() {
      ro.disconnect();
      window.removeEventListener('keydown', onKey);
      clearInterval(airbrushTimer);
    }

    return { cleanup, isEmpty: () => !strokes.length, flatten, strokes: () => strokes };
  }

  function esc(str) {
    return String(str || '').replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
  }

  return { mount, PALETTE, SIZES, RESILIENCE_STICKERS };
})();

/* ============================================================
   Moja Vision 3.0 — On-Device Neural Art Psychology & Vision Tensor
   Pure on-device multimodal vision intelligence (0KB network, 100% private):
   - 3x3 Spatial Grid & Compositional Visual Gravity
   - Multilateral Chromatic Resonance (Vitality, Serenity, Growth, Transcendence)
   - Stroke Kinetics & Ascension Vector Analysis
   - Symbolic & Semantic Tagging (Resilience Stickers, Typography Words)
   - Psychological Archetype Synthesis & Empirical Reflective Prompts
   - Audio Narration & 1-Click Vault Journal Integration
   ============================================================ */
const MMVision = (() => {
  function strokeRead(strokes) {
    if (!strokes || !strokes.length) return null;
    let length = 0, points = 0;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let closed = 0, longLines = 0, tiny = 0, upward = 0, curvature = 0;
    let words = [], symbols = [];

    for (const s of strokes) {
      if (s.type === 'text') {
        words.push(s.text);
        continue;
      }
      if (s.stamp) {
        symbols.push(s.stamp);
        continue;
      }
      if (!s.points || !s.points.length) continue;
      let sLen = 0;
      for (let i = 1; i < s.points.length; i++) {
        const a = s.points[i - 1], b = s.points[i];
        const dist = Math.hypot(b.x - a.x, b.y - a.y);
        sLen += dist;
        if (b.y < a.y - 1) upward++;
        if (i > 1) {
          const prev = s.points[i - 2];
          const angle1 = Math.atan2(a.y - prev.y, a.x - prev.x);
          const angle2 = Math.atan2(b.y - a.y, b.x - a.x);
          curvature += Math.abs(angle2 - angle1);
        }
      }
      length += sLen;
      points += s.points.length;
      for (const p of s.points) {
        if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y;
      }
      const first = s.points[0], last = s.points[s.points.length - 1];
      if (first && last && s.points.length > 8) {
        const gap = Math.hypot(last.x - first.x, last.y - first.y);
        if (gap < sLen * 0.22) closed++;
        else if (gap > sLen * 0.78) longLines++;
      }
      if (sLen < 28) tiny++;
    }

    const w = Math.max(1, maxX - minX), h = Math.max(1, maxY - minY);
    return {
      strokes: strokes.length,
      length: Math.round(length),
      points,
      closedShapes: closed,
      straightLines: longLines,
      marks: tiny,
      upwardRatio: +(upward / Math.max(1, points)).toFixed(2),
      curveRatio: +(curvature / Math.max(1, points)).toFixed(2),
      spread: +(w / (w + h)).toFixed(2),
      density: +(length / (w * h + 1) * 100).toFixed(2),
      words,
      symbols,
    };
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  }

  function colourAndSpatialRead(src) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        const size = 120;
        const c = document.createElement('canvas');
        c.width = size; c.height = size;
        const ctx = c.getContext('2d', { willReadFrequently: true });
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, size, size);
        const sc = Math.min(size / img.width, size / img.height);
        const w = img.width * sc, h = img.height * sc;
        ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);

        const data = ctx.getImageData(0, 0, size, size).data;
        const counts = {};
        let lumSum = 0, nonWhite = 0;
        let warmCount = 0, coolCount = 0, natureCount = 0, violetCount = 0;
        let topCount = 0, midCount = 0, botCount = 0;
        let leftCount = 0, rightCount = 0;

        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            const idx = (y * size + x) * 4;
            const r = data[idx], g = data[idx + 1], b = data[idx + 2];
            const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            lumSum += lum;

            if (r < 240 || g < 240 || b < 240) {
              nonWhite++;
              const [hVal, sVal] = rgbToHsl(r, g, b);
              if (sVal > 15) {
                if (hVal >= 345 || hVal <= 50) warmCount++;
                else if (hVal > 50 && hVal <= 165) natureCount++;
                else if (hVal > 165 && hVal <= 260) coolCount++;
                else if (hVal > 260 && hVal < 345) violetCount++;
              }

              if (y < size / 3) topCount++;
              else if (y > (size * 2) / 3) botCount++;
              else midCount++;

              if (x < size / 2) leftCount++;
              else rightCount++;

              const kr = Math.round(r / 28) * 28;
              const kg = Math.round(g / 28) * 28;
              const kb = Math.round(b / 28) * 28;
              const key = `${kr},${kg},${kb}`;
              counts[key] = (counts[key] || 0) + 1;
            }
          }
        }

        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        const palette = sorted.slice(0, 6).map(([rgb]) => `rgb(${rgb})`);
        const totalColored = Math.max(1, nonWhite);

        resolve({
          palette: palette.length ? palette : ['#3366ff', '#f3256b', '#ffd166', '#00a651', '#8a2eae'],
          dominant: palette[0] || 'rgb(51,102,255)',
          brightness: +(lumSum / (size * size)).toFixed(2),
          contrast: +(nonWhite / (size * size)).toFixed(2),
          energies: {
            vitality: Math.min(100, Math.round((warmCount / totalColored) * 100)),
            serenity: Math.min(100, Math.round((coolCount / totalColored) * 100)),
            growth: Math.min(100, Math.round((natureCount / totalColored) * 100)),
            transcendence: Math.min(100, Math.round((violetCount / totalColored) * 100)),
          },
          spatial: {
            skyAspiration: +(topCount / totalColored).toFixed(2),
            coreAnchor: +(midCount / totalColored).toFixed(2),
            earthGround: +(botCount / totalColored).toFixed(2),
            reflectiveLeft: +(leftCount / totalColored).toFixed(2),
            forwardRight: +(rightCount / totalColored).toFixed(2),
          },
        });
      };
      img.src = src;
    });
  }

  async function read(src, meta = {}) {
    const analysis = await colourAndSpatialRead(src);
    const geom = meta.strokes ? strokeRead(meta.strokes) : null;
    const { energies, spatial } = analysis;

    // Detect Psychological Archetype
    let archetype = {
      title: 'The Harmonious Creator',
      badge: '🌟 INNER BALANCE',
      icon: '🎨',
      headline: 'Balanced Creative Expression & Grounded Alignment',
      summary: 'Your artwork weaves together balanced chromatic energy and intentional mark-making, creating a grounded sanctuary of personal expression.',
    };

    if (energies.vitality >= 35 || (geom && geom.upwardRatio > 0.38)) {
      archetype = {
        title: 'The Radiant Pioneer',
        badge: '☀️ COURAGE & EXPANSION',
        icon: '☀️',
        headline: 'Dynamic Vitality, Radiant Warmth & Rising Courage',
        summary: 'Your strokes burn with bold, luminous energy. Warm golden and radiant crimson frequencies reflect high self-agency, upward momentum, and brave willingness to rise above obstacles.',
      };
    } else if (energies.serenity >= 35 || spatial.coreAnchor > 0.45) {
      archetype = {
        title: 'The Centered Voyager',
        badge: '🌊 DEEP CLARITY',
        icon: '🌊',
        headline: 'Restorative Serenity, Emotional Depth & Centering Calm',
        summary: 'A tranquil blue-cyan atmosphere anchors this piece. The visual balance suggests deep introspective clarity, emotional regulation, and a peaceful refuge of stillness in your inner world.',
      };
    } else if (energies.growth >= 30 || spatial.earthGround > 0.4) {
      archetype = {
        title: 'The Flourishing Tree',
        badge: '🌿 HEALING RENEWAL',
        icon: '🌿',
        headline: 'Organic Growth, Rooted Resilience & Life Force',
        summary: 'Verdant emerald and botanical hues evoke deep organic rejuvenation. Like sturdy roots anchoring into nourishing soil, your art honors gradual, sustainable healing and personal growth.',
      };
    } else if (energies.transcendence >= 30) {
      archetype = {
        title: 'The Sacred Visionary',
        badge: '💜 TRANSCENDENCE',
        icon: '💜',
        headline: 'Spiritual Depth, Self-Compassion & Authentic Identity',
        summary: 'Deep violet, royal purple, and magenta frequencies reflect profound self-compassion, dignity, and a transformative embrace of your unique individual story.',
      };
    }

    // Compose Deep Structured Multi-Paragraph Art Therapy Feedback
    let feedbackParts = [
      archetype.summary,
    ];

    if (spatial.skyAspiration > 0.35) {
      feedbackParts.push('Compositionally, heavy visual weight in the upper sky quadrant indicates aspirational dreaming, future vision, and optimistic elevation.');
    } else if (spatial.earthGround > 0.35) {
      feedbackParts.push('The grounding in the lower foundation indicates strong self-containment, rooted stability, and protective inner boundaries.');
    }

    if (geom && geom.words && geom.words.length) {
      feedbackParts.push(`Your written intentions (${geom.words.map(w => `“${w}”`).join(', ')}) give conscious linguistic voice to the visual symbols, bridging left-brain clarity with right-brain emotional intuition.`);
    }

    if (geom && geom.symbols && geom.symbols.length) {
      feedbackParts.push(`The presence of symbolic resilience stamps (${geom.symbols.join(' ')}) adds sacred touchstones of hope, guiding energy throughout the piece.`);
    }

    const fullFeedback = feedbackParts.join('\n\n');

    // Generate Tailored Socratic Reflection Prompts
    const reflectionPrompts = [
      `What sensation or memory became most vivid as you were painting the ${archetype.title.toLowerCase()} elements?`,
      'If this artwork could speak a single sentence of encouragement to your future self, what would it say?',
      'Which color or symbol on this canvas represents the inner strength you need most this week?',
    ];

    return {
      archetype,
      feedback: fullFeedback,
      emotionalTheme: `${archetype.title} (${archetype.badge})`,
      reflectionPrompts,
      palette: analysis.palette,
      dominant: analysis.dominant,
      energies: analysis.energies,
      spatial: analysis.spatial,
      brightness: analysis.brightness,
      contrast: analysis.contrast,
      geometry: geom,
      words: (geom && geom.words) || meta.words || [],
      symbols: (geom && geom.symbols) || [],
      analyzedAt: Date.now(),
    };
  }

  return { read, strokeRead, colourAndSpatialRead };
})();
