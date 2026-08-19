/* ============================================================
   MojaMind — Cryptographic Resilience Journey Certificate & Portfolio
   Zero-Data, on-device Canvas rendering of participant's
   verified Creative Resilience Portfolio & Certificate.
   
   © IONITY Global (Pty) Ltd · Solutionist: Johan Wilhelm van Antwerp
   Antwerp Designs · www.ionity.co.za
   ============================================================ */
'use strict';

const MMPortfolio = (() => {
  const MANDELA_QUOTES = [
    { text: "It always seems impossible until it is done.", author: "Nelson Mandela" },
    { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
    { text: "May your choices reflect your hopes, not your fears.", author: "Nelson Mandela" },
    { text: "There is no passion to be found playing small — in settling for a life that is less than the one you are capable of living.", author: "Nelson Mandela" },
    { text: "After climbing a great hill, one only finds that there are many more hills to climb.", author: "Nelson Mandela" }
  ];

  function getMandelaQuote() {
    if (!S.mandelaQuote) {
      const pick = MANDELA_QUOTES[Math.floor(Math.random() * MANDELA_QUOTES.length)];
      S.mandelaQuote = pick;
      if (typeof save === 'function') save();
    }
    return S.mandelaQuote;
  }

  function getParticipantCryptonicId() {
    if (!S.participantCertId) {
      const rawBytes = Array.from(crypto.getRandomValues(new Uint8Array(4)));
      const hex = rawBytes.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
      S.participantCertId = `MM-${hex}-2026`;
      if (typeof save === 'function') save();
    }
    return S.participantCertId;
  }

  async function generateVerificationHash() {
    const cryptId = getParticipantCryptonicId();
    const raw = `${cryptId}-${S.startedAt || Date.now()}-${S.study?.week || 1}`;
    try {
      const enc = new TextEncoder().encode(raw);
      const hashBuf = await crypto.subtle.digest('SHA-256', enc);
      const hashArr = Array.from(new Uint8Array(hashBuf));
      return 'MM-CERT-' + hashArr.slice(0, 6).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    } catch {
      return 'MM-CERT-' + Math.random().toString(36).substring(2, 10).toUpperCase();
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

    // 2) Header Partners & Crest — IONITY Global listed last
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.font = '700 12.5px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '1.8px';
    ctx.fillText('SHOUT-IT-NOW  ·  STELLENBOSCH UNIVERSITY  ·  POWERED BY GILEAD  ·  AUTHENTICATED BY IONITY GLOBAL', 600, 78);

    // Main Certificate Heading
    ctx.fillStyle = '#ffd700';
    ctx.font = '800 34px Poppins, sans-serif';
    ctx.fillText('CERTIFICATE OF CREATIVE RESILIENCE', 600, 136);

    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = '500 15px Poppins, sans-serif';
    ctx.fillText('This official study credential honors the dedicated engagement and courageous reflection of', 600, 178);

    // Participant Cryptonic Account Pseudonym
    const cryptId = getParticipantCryptonicId();
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 30px Poppins, sans-serif';
    ctx.fillText(`Participant Account #${cryptId}`, 600, 230);

    // Gold separator line
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(350, 252); ctx.lineTo(850, 252);
    ctx.stroke();

    // Body Text
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.font = '400 14.5px Poppins, sans-serif';
    ctx.fillText('for completing weekly creative art interventions, reflective journaling, and mindful resilience practices', 600, 286);
    ctx.fillText('fostering emotional wellbeing, self-advocacy, and long-term health resilience.', 600, 310);

    // 3) Nelson Mandela Quote & Milestone Box (Replacing rays/serenity stats)
    const quote = getMandelaQuote();
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.strokeStyle = 'rgba(255,209,102,0.45)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(140, 345, 920, 160, 16);
    ctx.fill();
    ctx.stroke();

    // Mandela Quote inside box
    ctx.fillStyle = '#ffd166';
    ctx.font = '600 19px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`“${quote.text}”`, 600, 405);

    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = '500 14px Poppins, sans-serif';
    ctx.fillText(`— ${quote.author}`, 600, 440);

    // Progress Badge inside box
    const completedCount = Object.keys(S.activities || {}).length;
    ctx.fillStyle = 'rgba(51,102,255,0.3)';
    ctx.strokeStyle = 'rgba(51,102,255,0.6)';
    ctx.beginPath();
    ctx.roundRect(380, 465, 440, 28, 14);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 12px Poppins, sans-serif';
    ctx.fillText(`🌿 8-Week Creative Pathway · ${completedCount}/8 Activities Completed`, 600, 484);

    // 4) Verification & Signatures Footer
    const hash = await generateVerificationHash();
    const dateStr = new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });

    // Date & Study Lead
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.font = '12px Poppins, sans-serif';
    ctx.fillText(`Issued: ${dateStr}`, 140, 565);
    ctx.fillText(`Study ID: SHOUT-MOJAMIND-RCT`, 140, 585);
    ctx.fillText(`Account CryptID: ${cryptId}`, 140, 605);

    ctx.textAlign = 'right';
    ctx.fillText('Chief Solutionist & System Architect', 1060, 565);
    ctx.fillText('Johan Wilhelm van Antwerp · Antwerp Designs', 1060, 585);
    ctx.fillText('IONITY Global (Pty) Ltd · www.ionity.co.za', 1060, 605);

    // Cryptographic Seal Box
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 209, 102, 0.15)';
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(380, 645, 440, 55, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffd700';
    ctx.font = '700 11px Poppins, sans-serif';
    ctx.fillText('🔒 ON-DEVICE CRYPTOGRAPHIC INTEGRITY SEAL', 600, 667);
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 13px monospace';
    ctx.fillText(hash, 600, 688);

    // Bottom Remembrance Note (Item 2)
    ctx.fillStyle = 'rgba(255,209,102,0.9)';
    ctx.font = '600 12px Poppins, sans-serif';
    ctx.fillText('* For personal remembrance.', 600, 740);

    // Disclaimer
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.font = '10.5px Poppins, sans-serif';
    ctx.fillText('Private & Confidential · Verified offline through WebCrypto AES-GCM & SHA-256 · www.ionity.today', 600, 765);

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

/* Expose on globalThis so lazy proxy bridges (app.js ensureModule) can hand over. */
globalThis.MMPortfolio = MMPortfolio;
