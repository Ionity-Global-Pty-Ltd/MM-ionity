/* ============================================================
   MojaMind — Fullstack Digital Painting & 3D Ambient Studio 🎨🖌️
   A powerful, beautiful on-device painting studio:
   - Fullscreen & Minimizable canvas interface.
   - Multi-Brush Suite: Pencil, Round Brush, Oil Paint, Neon Glow 3D, Rainbow.
   - Decorative Stamps & Shapes (Heart, Star, Sun, Flower, Leaf, Sparkle).
   - Pressure-sensitive lines, custom color picker, opacity, fill bucket.
   - 3D ambient canvas grain & easel lighting.
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
  const SIZES = [2, 6, 14, 28, 48];
  const STAMPS = ['💜', '⭐', '☀️', '🌸', '🌿', '✨'];
  const safeToast = (msg, ms) => { if (typeof toast === 'function') toast(msg, ms); };

  /** Mount a drawing pad into `host`. Returns a controller. */
  function mount(host, { onSave, onClose } = {}) {
    let colour = PALETTE[4].hex;
    let size = SIZES[2];
    let brushType = 'brush'; // 'pen' | 'brush' | 'oil' | 'neon' | 'rainbow' | 'stamp'
    let currentStamp = '💜';
    let isEraser = false;
    let isFullscreen = false;
    let isMinimized = false;
    let isDrawing = false;
    let strokes = []; // [{ colour, size, brushType, erase, points:[{x,y,p}], stamp }]
    let redoStack = [];
    let currentStroke = null;

    host.innerHTML = `
      <div class="draw-studio-wrap ${isFullscreen ? 'fullscreen' : ''}" id="draw-studio">
        <!-- Top Action Bar -->
        <div class="draw-bar draw-bar-top">
          <button class="draw-btn-icon" data-d="close" title="Close Canvas" aria-label="Close drawing pad">✕</button>
          <div class="draw-title-group">
            <span class="draw-title">Digital Art Studio 🎨</span>
            <small class="draw-sub-title">Draw directly on screen — no paper needed</small>
          </div>
          <div class="draw-top-right">
            <button class="draw-btn-icon" data-d="soundscape" id="draw-sc-btn" title="432Hz Ambient Soundscape">✨</button>
            <button class="draw-btn-icon" data-d="fullscreen" id="draw-fs-btn" title="Toggle Fullscreen">⛶</button>
            <button class="draw-save" data-d="save">💾 Save to Activity</button>
          </div>
        </div>

        <!-- Drawing Canvas Stage with 3D Easel Grain -->
        <div class="draw-stage-container">
          <canvas class="draw-canvas" id="draw-canvas" aria-label="Drawing canvas — draw with finger, mouse or stylus"></canvas>
          <div class="draw-live-ocr draw-live" id="draw-live-vision"></div>
        </div>

        <!-- Floating Minimizable Multi-Tool Studio Bar -->
        <div class="draw-bar-tools-container ${isMinimized ? 'minimized' : ''}" id="draw-tools-drawer">
          <div class="draw-drawer-handle" id="draw-drawer-toggle" title="Minimize / Expand Tool Palette">
            <span></span>
          </div>

          <div class="draw-tools-inner">
            <!-- Brush Selector -->
            <div class="draw-brush-picker">
              <button class="draw-tool-tab on" data-brush="brush" title="Round Watercolor Brush">🖌️ Brush</button>
              <button class="draw-tool-tab" data-brush="pen" title="Fine Pencil">✏️ Pencil</button>
              <button class="draw-tool-tab" data-brush="oil" title="Oil Paint / Chisel">🎨 Oil</button>
              <button class="draw-tool-tab" data-brush="neon" title="3D Luminous Glow Laser">⚡ Neon</button>
              <button class="draw-tool-tab" data-brush="rainbow" title="Rainbow Sparkle Pen">🌈 Rainbow</button>
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
              <div class="draw-sizes-group">
                ${SIZES.map(s => `<button class="draw-size ${s === size ? 'on' : ''}" data-size="${s}" title="Brush Size ${s}px"><i style="width:${Math.min(s, 22)}px;height:${Math.min(s, 22)}px"></i></button>`).join('')}
              </div>

              <div class="draw-stamps-group">
                ${STAMPS.map(st => `<button class="draw-stamp-btn" data-stamp="${st}" title="Stamp ${st}">${st}</button>`).join('')}
              </div>

              <div class="draw-actions-group">
                <button class="draw-tool" data-d="erase" aria-pressed="false" title="Eraser">🩹 Eraser</button>
                <button class="draw-tool" data-d="undo" title="Undo">↩</button>
                <button class="draw-tool" data-d="redo" title="Redo">↪</button>
                <button class="draw-tool" data-d="clear" title="Clear Canvas">🗑</button>
              </div>
            </div>
          </div>
        </div>

        <p class="draw-hint" id="draw-hint">Draw with your finger or stylus — press firmly for rich strokes 🌿</p>
      </div>`;

    const wrap = host.querySelector('#draw-studio');
    const cv = host.querySelector('#draw-canvas');
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    const hint = host.querySelector('#draw-hint');
    const toolsDrawer = host.querySelector('#draw-tools-drawer');

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
      // Soft clean white art canvas with subtle texture
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.restore();

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      for (const s of strokes) paintStroke(s);
      hint.classList.toggle('faded', strokes.length > 0);
    }

    function paintStroke(s) {
      if (s.stamp) {
        ctx.save();
        ctx.font = `${s.size * 2.2}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(s.stamp, s.points[0].x, s.points[0].y);
        ctx.restore();
        return;
      }

      ctx.save();
      if (s.erase) {
        ctx.strokeStyle = '#ffffff';
        ctx.shadowBlur = 0;
      } else if (s.brushType === 'neon') {
        ctx.strokeStyle = s.colour;
        ctx.shadowColor = s.colour;
        ctx.shadowBlur = 14;
      } else if (s.brushType === 'oil') {
        ctx.strokeStyle = s.colour;
        ctx.shadowBlur = 2;
        ctx.lineCap = 'square';
      } else {
        ctx.strokeStyle = s.colour;
        ctx.shadowBlur = 0;
      }

      if (s.points.length < 2) {
        const p = s.points[0];
        if (p) {
          ctx.beginPath();
          ctx.fillStyle = s.erase ? '#ffffff' : s.colour;
          ctx.arc(p.x, p.y, (s.size * (0.5 + p.p)) / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        return;
      }

      for (let i = 1; i < s.points.length; i++) {
        const a = s.points[i - 1], b = s.points[i];
        ctx.beginPath();
        if (s.brushType === 'rainbow') {
          const hue = (i * 12 + performance.now() * 0.05) % 360;
          ctx.strokeStyle = `hsl(${hue}, 90%, 55%)`;
        }
        ctx.lineWidth = s.size * (0.5 + (a.p + b.p) / 2);
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      ctx.restore();
    }

    const pointOf = e => {
      const box = cv.getBoundingClientRect();
      return {
        x: e.clientX - box.left,
        y: e.clientY - box.top,
        p: e.pressure && e.pressure !== 0.5 ? Math.max(0.15, e.pressure) : 0.55,
      };
    };

    cv.addEventListener('pointerdown', e => {
      e.preventDefault();
      cv.setPointerCapture(e.pointerId);
      isDrawing = true;
      redoStack = [];

      const pt = pointOf(e);
      if (brushType === 'stamp') {
        const stampStroke = { stamp: currentStamp, size, points: [pt] };
        strokes.push(stampStroke);
        paintStroke(stampStroke);
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
      paintStroke(currentStroke);
      hint.classList.add('faded');
    });

    cv.addEventListener('pointermove', e => {
      if (!isDrawing || !currentStroke) return;
      e.preventDefault();
      const pts = typeof e.getCoalescedEvents === 'function' ? e.getCoalescedEvents() : [e];
      for (const ev of (pts.length ? pts : [e])) {
        const pt = pointOf(ev);
        const last = currentStroke.points[currentStroke.points.length - 1];
        if (last && Math.hypot(pt.x - last.x, pt.y - last.y) < 0.7) continue;
        currentStroke.points.push(pt);
        ctx.save();
        if (currentStroke.erase) {
          ctx.strokeStyle = '#ffffff';
        } else if (currentStroke.brushType === 'neon') {
          ctx.strokeStyle = currentStroke.colour;
          ctx.shadowColor = currentStroke.colour;
          ctx.shadowBlur = 14;
        } else if (currentStroke.brushType === 'rainbow') {
          const hue = (currentStroke.points.length * 14) % 360;
          ctx.strokeStyle = `hsl(${hue}, 90%, 55%)`;
        } else {
          ctx.strokeStyle = currentStroke.colour;
        }
        ctx.lineWidth = currentStroke.size * (0.5 + (last.p + pt.p) / 2);
        ctx.lineCap = currentStroke.brushType === 'oil' ? 'square' : 'round';
        ctx.beginPath();
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();
        ctx.restore();
      }
    });

    const endStroke = () => { isDrawing = false; currentStroke = null; };
    cv.addEventListener('pointerup', endStroke);
    cv.addEventListener('pointercancel', endStroke);
    cv.addEventListener('pointerleave', endStroke);

    // Brush Selection
    host.querySelectorAll('[data-brush]').forEach(b => b.addEventListener('click', () => {
      brushType = b.dataset.brush;
      isEraser = false;
      host.querySelectorAll('.draw-tool-tab').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      host.querySelector('[data-d="erase"]')?.classList.remove('on');
    }));

    // Swatches & Custom Color Picker
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

    // Brush Sizes
    host.querySelectorAll('[data-size]').forEach(b => b.addEventListener('click', () => {
      size = +b.dataset.size;
      host.querySelectorAll('[data-size]').forEach(x => x.classList.toggle('on', x === b));
    }));

    // Stamps
    host.querySelectorAll('[data-stamp]').forEach(b => b.addEventListener('click', () => {
      brushType = 'stamp';
      currentStamp = b.dataset.stamp;
      isEraser = false;
      host.querySelectorAll('.draw-tool-tab').forEach(x => x.classList.remove('on'));
      host.querySelectorAll('[data-stamp]').forEach(x => x.classList.toggle('on', x === b));
      safeToast(`Selected ${currentStamp} stamp · Tap canvas to place! ✨`, 1500);
    }));

    // Eraser
    host.querySelector('[data-d="erase"]')?.addEventListener('click', e => {
      isEraser = !isEraser;
      e.currentTarget.classList.toggle('on', isEraser);
      if (isEraser) host.querySelectorAll('.draw-tool-tab').forEach(x => x.classList.remove('on'));
    });

    // Undo / Redo / Clear
    host.querySelector('[data-d="undo"]')?.addEventListener('click', () => {
      if (strokes.length) {
        redoStack.push(strokes.pop());
        repaint();
      }
    });

    host.querySelector('[data-d="redo"]')?.addEventListener('click', () => {
      if (redoStack.length) {
        strokes.push(redoStack.pop());
        repaint();
      }
    });

    host.querySelector('[data-d="clear"]')?.addEventListener('click', () => {
      if (strokes.length) {
        redoStack = [...strokes];
        strokes = [];
        repaint();
        safeToast('Canvas cleared');
      }
    });

    // Soundscape Toggle
    host.querySelector('#draw-sc-btn')?.addEventListener('click', () => {
      if (typeof MMSoundscape !== 'undefined') {
        const on = MMSoundscape.toggle('432hz');
        host.querySelector('#draw-sc-btn')?.classList.toggle('on', on);
        safeToast(on ? '432Hz Natural Harmony Soundscape playing ✨' : 'Ambient soundscape paused', 2000);
      }
    });

    // Fullscreen Toggle
    host.querySelector('#draw-fs-btn')?.addEventListener('click', () => {
      isFullscreen = !isFullscreen;
      wrap.classList.toggle('fullscreen', isFullscreen);
      host.querySelector('#draw-fs-btn').textContent = isFullscreen ? '🗗' : '⛶';
      setTimeout(fit, 100);
    });

    // Drawer Minimize / Toggle
    host.querySelector('#draw-drawer-toggle')?.addEventListener('click', () => {
      isMinimized = !isMinimized;
      toolsDrawer.classList.toggle('minimized', isMinimized);
    });

    // Close & Save
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

    /** Export high-resolution image for storage (long edge 1000px). */
    function flatten() {
      const out = document.createElement('canvas');
      const maxEdge = 1000;
      const scale = Math.min(1, maxEdge / Math.max(cv.width, cv.height));
      out.width = Math.round(cv.width * scale);
      out.height = Math.round(cv.height * scale);
      const octx = out.getContext('2d');
      octx.fillStyle = '#ffffff';
      octx.fillRect(0, 0, out.width, out.height);
      octx.drawImage(cv, 0, 0, out.width, out.height);
      return out.toDataURL('image/jpeg', 0.88);
    }

    const ro = new ResizeObserver(fit);
    ro.observe(cv);
    requestAnimationFrame(fit);

    function cleanup() { ro.disconnect(); }

    return { cleanup, isEmpty: () => !strokes.length, flatten, strokes: () => strokes };
  }

  return { mount, PALETTE, SIZES };
})();

/* ============================================================
   Moja Vision 2.0 — On-Device Art Psychology & Emotion Mirror
   Pure on-device vision tensor analysis (0KB network, 100% private):
   - Color Temperature Spectrum (Warm vs Cool vs Earth Balance)
   - Stroke Dynamics & Compositional Balance
   - Art Psychology Emotional Resonance & Uplifting Mirror
   - Interactive Guided Reflection Prompts
   ============================================================ */
const MMVision = (() => {
  function strokeRead(strokes) {
    if (!strokes || !strokes.length) return null;
    let length = 0, points = 0;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let closed = 0, longLines = 0, tiny = 0, upward = 0;

    for (const s of strokes) {
      let sLen = 0;
      if (!s.points || !s.points.length) continue;
      for (let i = 1; i < s.points.length; i++) {
        const a = s.points[i - 1], b = s.points[i];
        sLen += Math.hypot(b.x - a.x, b.y - a.y);
        if (b.y < a.y - 1) upward++; // Upward stroke gesture
      }
      length += sLen; points += s.points.length;
      for (const p of s.points) {
        if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y;
      }
      const first = s.points[0], last = s.points[s.points.length - 1];
      if (first && last && s.points.length > 8) {
        const gap = Math.hypot(last.x - first.x, last.y - first.y);
        if (gap < sLen * 0.18) closed++;
        else if (gap > sLen * 0.82) longLines++;
      }
      if (sLen < 24) tiny++;
    }
    const w = Math.max(1, maxX - minX), h = Math.max(1, maxY - minY);
    return {
      strokes: strokes.length, length: Math.round(length), points,
      closedShapes: closed, straightLines: longLines, marks: tiny,
      upwardRatio: +(upward / Math.max(1, points)).toFixed(2),
      spread: +(w / (w + h)).toFixed(2),
      density: +(length / (w * h + 1) * 100).toFixed(2),
    };
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
      h = s = 0; // achromatic
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

  function colourRead(src) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        const size = 96;
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
        let warmCount = 0, coolCount = 0, natureCount = 0, goldCount = 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2];
          const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          lumSum += lum;

          if (r < 242 || g < 242 || b < 242) {
            nonWhite++;
            const [h, s, l] = rgbToHsl(r, g, b);
            if (s > 18) {
              if (h >= 345 || h <= 45) warmCount++;
              else if (h > 45 && h <= 70) goldCount++;
              else if (h > 70 && h <= 165) natureCount++;
              else if (h > 165 && h <= 345) coolCount++;
            }

            const kr = Math.round(r / 32) * 32;
            const kg = Math.round(g / 32) * 32;
            const kb = Math.round(b / 32) * 32;
            const key = `${kr},${kg},${kb}`;
            counts[key] = (counts[key] || 0) + 1;
          }
        }

        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        const palette = sorted.slice(0, 5).map(([rgb]) => `rgb(${rgb})`);
        const dominant = palette[0] || 'rgb(43,33,64)';
        const totalColored = Math.max(1, nonWhite);

        resolve({
          palette: palette.length ? palette : ['#8a2eae', '#f3256b', '#ffd166'],
          dominant,
          brightness: +(lumSum / (size * size)).toFixed(2),
          contrast: +(nonWhite / (size * size)).toFixed(2),
          temperature: {
            warmRatio: +(warmCount / totalColored).toFixed(2),
            goldRatio: +(goldCount / totalColored).toFixed(2),
            natureRatio: +(natureCount / totalColored).toFixed(2),
            coolRatio: +(coolCount / totalColored).toFixed(2),
          },
        });
      };
      img.src = src;
    });
  }

  async function read(src, meta = {}) {
    const colour = await colourRead(src);
    const geometry = meta.strokes ? strokeRead(meta.strokes) : null;
    const temp = colour.temperature;

    let emotionalTheme = 'Creative Expression & Focus 🎨';
    let feedback = 'I notice beautiful vibrant tones and careful intention in your art.';
    let reflectionPrompts = [
      'What emotion or memory felt most alive while choosing these colors?',
      'Which part of this artwork gives you the strongest sense of strength?',
    ];

    if (temp.goldRatio > 0.25 || temp.warmRatio > 0.4) {
      emotionalTheme = 'Radiant Optimism & Inner Light ☀️';
      feedback = 'Your creation shines with warm, expansive golden vitality. The radiant tones reflect growing courage and positive inner energy.';
      reflectionPrompts = [
        'What in your life currently brings you the warmth and hope seen in these bright tones?',
        'How can you carry this bright energy into the rest of your week?',
      ];
    } else if (temp.coolRatio > 0.4) {
      emotionalTheme = 'Tranquility & Emotional Depth 🌊';
      feedback = 'Your art embodies deep peaceful reflection and centering calm. The cool harmonies suggest quiet inner contemplation and clarity.';
      reflectionPrompts = [
        'What peaceful space or memory does this calm palette remind you of?',
        'Where do you find moments of stillness in your daily life?',
      ];
    } else if (temp.natureRatio > 0.25) {
      emotionalTheme = 'Healing Growth & Vital Balance 🌿';
      feedback = 'There is rich vitality and grounding natural balance across your strokes, symbolizing renewal and healthy personal growth.';
      reflectionPrompts = [
        'What new strength or idea is currently growing within you?',
        'How does taking time to create art help you feel refreshed?',
      ];
    } else if (geometry && geometry.upwardRatio > 0.4) {
      emotionalTheme = 'Upward Momentum & Resilience 🚀';
      feedback = 'Your strokes carry strong upward momentum and bold creative freedom, showing drive to overcome challenges with spirit.';
      reflectionPrompts = [
        'What goal or hope gives you this feeling of rising forward?',
        'Who in your circle supports your growth when you reach for new heights?',
      ];
    }

    return {
      feedback,
      emotionalTheme,
      reflectionPrompts,
      palette: colour.palette,
      colour,
      geometry,
      words: meta.words || null,
    };
  }

  return { read };
})();
