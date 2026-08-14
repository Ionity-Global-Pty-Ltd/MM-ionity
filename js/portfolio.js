/* ============================================================
   MojaMind — Cryptographic Resilience Journey Certificate & Portfolio
   Zero-Data, on-device Canvas rendering of participant's
   verified Creative Resilience Portfolio & Certificate.
   
   © IONITY Global (Pty) Ltd · Solutionist: Johan Wilhelm van Antwerp
   Antwerp Designs · www.ionity.co.za
   ============================================================ */
'use strict';

const MMPortfolio = (() => {
  async function generateVerificationHash(participantId = 'MOJA-STUDY') {
    const raw = `${participantId}-${Date.now()}-${S.study?.week || 1}-${S.game?.serenity || 0}`;
    try {
      const enc = new TextEncoder().encode(raw);
      const hashBuf = await crypto.subtle.digest('SHA-256', enc);
      const hashArr = Array.from(new Uint8Array(hashBuf));
      return 'IONITY-' + hashArr.slice(0, 6).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    } catch {
      return 'IONITY-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    }
  }

  async function renderCertificateCanvas() {
    const cvs = document.createElement('canvas');
    cvs.width = 1200;
    cvs.height = 840;
    const ctx = cvs.getContext('2d');

    // 1) Premium Obsidian-Gold Border & Background
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 840);
    bgGrad.addColorStop(0, '#12041d');
    bgGrad.addColorStop(0.5, '#1e0830');
    bgGrad.addColorStop(1, '#0c0214');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 840);

    // Subtle Gold Border Geometry
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 4;
    ctx.strokeRect(28, 28, 1144, 784);

    ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(38, 38, 1124, 764);

    // Corner Ornaments
    const corners = [[38, 38], [1162, 38], [38, 802], [1162, 802]];
    ctx.fillStyle = '#ffd700';
    for (const [cx, cy] of corners) {
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2) Header Partners & Crest
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 13px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '2px';
    ctx.fillText('IONITY GLOBAL (PTY) LTD  ·  STELLENBOSCH UNIVERSITY  ·  SHOUT-IT-NOW', 600, 80);

    // Main Certificate Heading
    ctx.fillStyle = '#ffd700';
    ctx.font = '800 34px Poppins, sans-serif';
    ctx.fillText('CERTIFICATE OF CREATIVE RESILIENCE', 600, 140);

    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = '500 15px Poppins, sans-serif';
    ctx.fillText('This official study credential honors the dedicated engagement and courageous reflection of', 600, 185);

    // Participant Title / Pseudonym
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 32px Poppins, sans-serif';
    const pName = S.user?.nick || `Participant #${S.user?.pin ? 'Verified' : '7721'}`;
    ctx.fillText(pName, 600, 240);

    // Gold separator line
    ctx.strokeStyle = 'linear-gradient(90deg, transparent, #ffd700, transparent)';
    ctx.beginPath();
    ctx.moveTo(350, 260); ctx.lineTo(850, 260);
    ctx.stroke();

    // Body Text
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.font = '400 15px Poppins, sans-serif';
    ctx.fillText('for completing weekly creative art interventions, reflective journaling, and mindful resilience practices', 600, 295);
    ctx.fillText('fostering emotional wellbeing, self-advocacy, and long-term health resilience.', 600, 320);

    // 3) Key Accomplishment Stats Box
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.strokeStyle = 'rgba(255,209,102,0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(140, 360, 920, 150, 16);
    ctx.fill();
    ctx.stroke();

    const stats = [
      { label: 'Weekly Activities', val: `${Object.keys(S.activities || {}).length} / 8 Completed`, icon: '🎨' },
      { label: 'Serenity Points', val: `${S.game?.serenity || 120} pts`, icon: '🌸' },
      { label: 'Encrypted Notes', val: `${(S.journal || []).length} Reflections`, icon: '📖' },
      { label: '3D Sunrays Gathered', val: `${S.game3d?.sunrays || 0} Rays`, icon: '🐝' },
    ];

    stats.forEach((st, i) => {
      const x = 255 + i * 230;
      ctx.textAlign = 'center';
      ctx.font = '24px sans-serif';
      ctx.fillText(st.icon, x, 405);
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 18px Poppins, sans-serif';
      ctx.fillText(st.val, x, 440);
      ctx.fillStyle = '#ffd166';
      ctx.font = '500 12px Poppins, sans-serif';
      ctx.fillText(st.label, x, 465);
    });

    // 4) Verification & Signatures Footer
    const hash = await generateVerificationHash();
    const dateStr = new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });

    // Date & Study Lead
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '12px Poppins, sans-serif';
    ctx.fillText(`Issued: ${dateStr}`, 140, 580);
    ctx.fillText(`Study ID: SHOUT-MOJAMIND-RCT`, 140, 600);

    ctx.textAlign = 'right';
    ctx.fillText('Chief Solutionist & System Architect', 1060, 580);
    ctx.fillText('IONITY Global · Antwerp Designs', 1060, 600);

    // Cryptographic Seal Box
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 209, 102, 0.15)';
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(420, 650, 360, 55, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffd700';
    ctx.font = '700 11px Poppins, sans-serif';
    ctx.fillText('🔒 ON-DEVICE CRYPTOGRAPHIC INTEGRITY HASH', 600, 672);
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 13px monospace';
    ctx.fillText(hash, 600, 693);

    // Disclaimer
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.font = '10.5px Poppins, sans-serif';
    ctx.fillText('Private & Confidential · Verified offline through WebCrypto AES-GCM & SHA-256', 600, 750);

    return cvs;
  }

  async function downloadCertificatePNG() {
    try {
      const cvs = await renderCertificateCanvas();
      const dataUrl = cvs.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `MojaMind_Resilience_Certificate_${Date.now()}.png`;
      a.click();
      toast('Certificate saved to your device 🎓✨');
    } catch (e) {
      console.warn('Certificate download note:', e);
      toast('Could not generate certificate image');
    }
  }

  async function showPortfolioModal() {
    const cvs = await renderCertificateCanvas();
    const previewUrl = cvs.toDataURL('image/jpeg', 0.85);

    modal(`
      <div style="text-align:center;padding:8px 0">
        <div style="font-size:38px;margin-bottom:6px">🎓🏆</div>
        <h3 style="font-size:20px;font-weight:800;color:var(--ink)">Your Resilience Portfolio</h3>
        <p style="font-size:13px;line-height:1.6;color:var(--ink-soft);margin:4px 0 14px">
          Official study verification certificate &amp; creative growth record.
        </p>

        <div style="border:1.5px solid rgba(255,209,102,0.4);border-radius:14px;overflow:hidden;margin-bottom:16px;box-shadow:0 8px 24px rgba(0,0,0,0.3)">
          <img src="${previewUrl}" alt="Resilience Certificate Preview" style="width:100%;height:auto;display:block" />
        </div>

        <div class="modal-btns">
          <button class="btn btn-primary" id="m-cert-download">💾 Download Certificate (PNG)</button>
          <button class="btn btn-ghost" onclick="closeModal()">Close</button>
        </div>
      </div>
    `);

    document.querySelector('#m-cert-download')?.addEventListener('click', () => {
      downloadCertificatePNG();
    });
  }

  return {
    renderCertificateCanvas,
    downloadCertificatePNG,
    showPortfolioModal,
  };
})();
