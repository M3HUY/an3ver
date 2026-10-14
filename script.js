// 💕 Love website engine — everything personal lives in config.js
(function () {
    'use strict';
    const C = window.CONFIG || {};
    const M = C.messages || {};
    const $ = (id) => document.getElementById(id);
    const name = (C.partnerName || 'My Love').trim();
    const me = (C.yourName || '').trim();
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- fill content from config ---------- */
    document.title = `For ${name} 💕`;
    $('introSmall').textContent = (C.intro && C.intro.small) || '';
    $('introTap').textContent = (C.intro && C.intro.button) || 'Tap to open 💌';
    $('introName').textContent = name;
    $('heroName').textContent = name;
    $('subtitle').textContent = M.subtitle || '';
    $('photoCaption').textContent = C.photoCaption || '';
    $('letterTitle').textContent = M.letterTitle || `To ${name}`;
    $('reasonsTitle').textContent = C.reasonsTitle || 'Reasons I Love You';
    $('memoryLateNight').textContent = (C.memories || {}).lateNight || '';
    $('memoryFirstMeeting').textContent = (C.memories || {}).firstMeeting || '';
    $('memoryCare').textContent = (C.memories || {}).care || '';
    const fin = C.finale || {};
    $('finaleBtn').textContent = fin.button || 'One last surprise… 💝';
    $('finaleBig').textContent = fin.big || 'I love you';
    $('finaleQ').textContent = fin.question || '';
    $('yesBtn').textContent = fin.yes || 'Yes 💖';

    const letterParts = [
        `${name}, ${M.loveNote || ''}`,
        M.specialMessage || '',
        M.specialMessage2 || ''
    ];
    const sig = [M.signature, me].filter(Boolean).join('\n');
    $('signature').textContent = me ? `${M.signature || ''} — ${me}` : (M.signature || '');
    void sig;

    // photo (graceful placeholder if the file is missing)
    if (C.photo) {
        const img = $('photo');
        img.onload = () => { img.hidden = false; $('photoEmpty').hidden = true; };
        img.onerror = () => { img.hidden = true; $('photoEmpty').hidden = false; };
        img.src = C.photo;
    }

    // days counter
    if (C.startDate) {
        const start = new Date(C.startDate + 'T00:00:00');
        if (!isNaN(start)) {
            const d = Math.max(0, Math.floor((Date.now() - start) / 86400000));
            $('daysNum').textContent = d.toLocaleString();
            $('daysSmall').textContent = `and I'd choose you every one of them`;
            $('days').hidden = false;
        }
    }

    // reasons
    const reasonsEl = $('reasons');
    (C.reasons || []).forEach((txt) => {
        const el = document.createElement('div');
        el.className = 'reason';
        el.innerHTML = '<div class="reason-in"><div class="front">💖</div><div class="back"></div></div>';
        el.querySelector('.back').textContent = txt;
        el.addEventListener('click', (e) => {
            el.classList.toggle('flip');
            if (el.classList.contains('flip')) burst(e.clientX, e.clientY, 10);
        });
        reasonsEl.appendChild(el);
    });

    /* ---------- canvases: starry sky + hearts / fireworks ---------- */
    const sky = $('sky'), fx = $('fx');
    const sctx = sky.getContext('2d'), fctx = fx.getContext('2d');
    let W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);
    let stars = [];
    function resize() {
        W = window.innerWidth; H = window.innerHeight;
        [sky, fx].forEach((c) => { c.width = W * DPR; c.height = H * DPR; });
        sctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        fctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        stars = Array.from({ length: Math.round(W * H / 6000) }, () => ({
            x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.4 + .3,
            p: Math.random() * Math.PI * 2, s: Math.random() * .02 + .005
        }));
    }
    window.addEventListener('resize', resize);
    resize();

    const parts = [];          // floating hearts, sparks
    const GLYPHS = ['❤️', '💖', '💕', '💗', '✨'];
    function floatHeart(o) {
        o = (o && o.fast) ? o : {};
        parts.push({
            t: 'g', g: GLYPHS[(Math.random() * GLYPHS.length) | 0],
            x: Math.random() * W, y: H + 20,
            vx: (Math.random() - .5) * (o.fast ? 1.4 : .4),
            vy: o.fast ? -(Math.random() * 2.2 + 1.6) : -(Math.random() * 1 + .6),
            size: o.fast ? Math.random() * 26 + 16 : Math.random() * 18 + 12,
            life: 1, decay: (o.fast ? .0006 : .0014) + Math.random() * .001, wob: Math.random() * 6
        });
    }
    function burst(x, y, n) {
        n = reduce ? Math.min(n, 4) : n;
        for (let i = 0; i < n; i++) {
            const a = Math.random() * Math.PI * 2, s = Math.random() * 5 + 2;
            parts.push({ t: 'g', g: GLYPHS[(Math.random() * 4) | 0], x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 2,
                size: Math.random() * 16 + 12, life: 1, decay: .016, grav: .12 });
        }
    }
    function firework(x, y) {
        const hue = 320 + Math.random() * 50, n = reduce ? 10 : 46;
        for (let i = 0; i < n; i++) {
            // heart-shaped burst
            const t = (i / n) * Math.PI * 2;
            const hx = 16 * Math.pow(Math.sin(t), 3);
            const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
            parts.push({ t: 'p', x, y, vx: hx * .32, vy: hy * .32, life: 1, decay: .010 + Math.random() * .006,
                grav: .02, color: `hsl(${hue + Math.random() * 30},100%,${65 + Math.random() * 20}%)`, size: 2.4 });
        }
    }
    let floatOn = false, tick = 0;
    function frame() {
        // sky
        sctx.clearRect(0, 0, W, H);
        for (const s of stars) {
            s.p += s.s;
            sctx.globalAlpha = .35 + .65 * Math.abs(Math.sin(s.p));
            sctx.fillStyle = '#fff';
            sctx.beginPath(); sctx.arc(s.x, s.y, s.r, 0, 7); sctx.fill();
        }
        // fx
        fctx.clearRect(0, 0, W, H);
        tick++;
        if (floatOn && !reduce && tick % 28 === 0) floatHeart();
        for (let i = parts.length - 1; i >= 0; i--) {
            const p = parts[i];
            p.x += p.vx + (p.wob !== undefined ? Math.sin(tick / 30 + p.wob) * .5 : 0);
            p.y += p.vy; if (p.grav) p.vy += p.grav;
            p.life -= p.decay;
            if (p.life <= 0 || p.y < -40) { parts.splice(i, 1); continue; }
            fctx.globalAlpha = Math.min(1, p.life * 1.4);
            if (p.t === 'g') {
                fctx.font = `${p.size}px serif`; fctx.textAlign = 'center';
                fctx.fillText(p.g, p.x, p.y);
            } else {
                fctx.fillStyle = p.color;
                fctx.beginPath(); fctx.arc(p.x, p.y, p.size, 0, 7); fctx.fill();
            }
        }
        fctx.globalAlpha = 1;
        requestAnimationFrame(frame);
    }
    frame();
    window.LOVE = { burst, floatHeart, setFloat: (v) => { floatOn = v; } };

    /* ---------- music ---------- */
    const audio = $('bgMusic'), mbtn = $('musicToggle');
    const sources = [C.music, ...(C.musicFallbacks || [])].filter(Boolean);
    let srcIdx = 0;
    function loadSrc() { if (srcIdx < sources.length) { audio.src = sources[srcIdx]; audio.load(); } }
    audio.addEventListener('error', () => { srcIdx++; if (srcIdx < sources.length) { loadSrc(); audio.play().catch(() => {}); } });
    audio.volume = 0;
    loadSrc();
    function fadeIn() {
        let v = 0; const iv = setInterval(() => { v = Math.min(.85, v + .03); audio.volume = v; if (v >= .85) clearInterval(iv); }, 120);
    }
    function setBtn() { mbtn.classList.toggle('playing', !audio.paused); mbtn.classList.toggle('muted', audio.paused); }
    mbtn.addEventListener('click', () => { if (audio.paused) { audio.play().catch(() => {}); if (audio.volume < .1) audio.volume = .85; } else audio.pause(); setBtn(); });
    audio.addEventListener('play', setBtn); audio.addEventListener('pause', setBtn);

    /* ---------- intro → story ---------- */
    const env = $('envelope');
    let opened = false;
    async function openEnvelope() {
        if (opened) return; opened = true;
        audio.play().then(fadeIn).catch(() => {});      // user gesture → music starts
        mbtn.hidden = false;
        env.classList.add('open');
        const r = env.getBoundingClientRect();
        burst(r.left + r.width / 2, r.top + r.height / 2, 28);
        await sleep(1700);
        $('intro').classList.add('gone');
        document.body.classList.remove('locked');
        $('story').classList.add('show');
        $('story').removeAttribute('aria-hidden');
        floatOn = true;
        for (let i = 0; i < 6; i++) setTimeout(floatHeart, i * 300);
        setTimeout(() => $('subtitle') && burst(W / 2, H / 2.4, 24), 1500);
    }
    env.addEventListener('click', openEnvelope);
    $('introTap').addEventListener('click', openEnvelope);

    /* ---------- reveal on scroll + typewriter ---------- */
    async function typeInto(el, text, speed) {
        el.classList.add('typing');
        if (reduce) { el.textContent = text; el.classList.remove('typing'); return; }
        el.textContent = '';
        for (const ch of text) { el.textContent += ch; await sleep(ch === ',' || ch === '.' ? speed * 8 : speed); }
        el.classList.remove('typing');
    }
    let typed = false;
    async function runLetter() {
        if (typed) return; typed = true;
        const els = [$('p1'), $('p2'), $('p3')];
        for (let i = 0; i < els.length; i++) { if (letterParts[i]) { await typeInto(els[i], letterParts[i], 28); await sleep(400); } }
        $('signature').classList.add('show');
        const r = $('signature').getBoundingClientRect();
        burst(r.left + r.width / 2, r.top, 18);
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (!e.isIntersecting) return;
            e.target.classList.add('in');
            if (e.target.id === 'letter') runLetter();
        });
    }, { threshold: .25 });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

    /* ---------- interactions ---------- */
    $('polaroid').addEventListener('click', (e) => burst(e.clientX, e.clientY, 22));

    document.querySelectorAll('.memory-card').forEach((card) => {
        card.addEventListener('click', (e) => {
            burst(e.clientX, e.clientY, 18);
            const m = (C.memoryMessages || {})[card.dataset.memory];
            if (m) card.querySelector('p').textContent = m;
        });
    });

    let kisses = 0;
    $('kissButton').addEventListener('click', (e) => {
        kisses++; $('kissCount').textContent = kisses;
        const r = e.currentTarget.getBoundingClientRect();
        burst(r.left + r.width / 2, r.top, 8);
        const km = (C.kissMessages || {})[kisses];
        if (km) { $('kissMsg').textContent = km; burst(W / 2, H / 2, 40); }
    });

    /* ---------- the FINAL surprise ---------- */
    let finaleRunning = false;
    $('finaleBtn').addEventListener('click', async () => {
        if (finaleRunning) return; finaleRunning = true;
        const f = $('finale'); f.classList.add('show'); f.removeAttribute('aria-hidden');
        document.body.classList.add('locked', 'finale-on');
        const box = $('finaleLines'); box.innerHTML = '';
        await sleep(1200);
        for (const line of (fin.lines || [])) {
            const p = document.createElement('p'); p.textContent = line; box.appendChild(p);
            await sleep(60); p.classList.add('on'); await sleep(1900);
        }
        $('finaleBig').classList.add('on');
        await sleep(2600);
        $('finaleQ').classList.add('on');
        await sleep(900);
        $('yesBtn').classList.add('on');
    });
    $('yesBtn').addEventListener('click', (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        burst(r.left + r.width / 2, r.top, 60);
        $('yesBtn').style.display = 'none';
        const rep = $('finaleReply'); rep.textContent = fin.yesReply || 'I love you 💕'; rep.classList.add('on');
        floatOn = true;
        if (window.FinaleShow) window.FinaleShow.start();     // 🎆🎈💕 see finale-show.js
    });
})();
