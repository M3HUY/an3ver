// 🎆🎈💕 GRAND FINALE — runs after she taps "Yes, forever"
//  • real rocket fireworks (hearts, rings, peonies, golden willows) with glowing trails
//  • balloons that float up (tap one to pop it into sparkles)
//  • a storm of flying hearts
//  • sweet words that pop up in the sky
//  Edit the words in config.js → finale.popWords / finale.endLine
(function () {
    'use strict';
    const $ = (id) => document.getElementById(id);
    const F = (window.CONFIG && window.CONFIG.finale) || {};
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const rand = (a, b) => a + Math.random() * (b - a);
    const pick = (arr) => arr[(Math.random() * arr.length) | 0];

    const cv = $('fw'), layer = $('balloons');
    if (!cv || !layer) return;
    const ctx = cv.getContext('2d');

    /* ---------- sizing ---------- */
    let W = 0, H = 0, DPR = 1, K = 1;
    function resize() {
        DPR = Math.min(window.devicePixelRatio || 1, 2);
        W = window.innerWidth; H = window.innerHeight;
        cv.width = W * DPR; cv.height = H * DPR;
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        K = Math.max(.55, Math.min(1.3, Math.min(W, H) / 800));   // explosion scale
    }
    window.addEventListener('resize', resize);
    resize();
    const small = () => W < 600;
    const density = () => (reduce ? .35 : small() ? .65 : 1);

    /* ---------- soft synthesized sound (only if the music is playing) ---------- */
    let ac = null, lastBoom = 0;
    function audioCtx() {
        if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ac = null; } }
        if (ac && ac.state === 'suspended') ac.resume().catch(() => {});
        return ac;
    }
    function hit(dur, f0, f1, vol, type) {
        const m = $('bgMusic'); if (!m || m.paused) return;
        const a = audioCtx(); if (!a) return;
        const len = Math.floor(a.sampleRate * dur);
        const buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
        const src = a.createBufferSource(); src.buffer = buf;
        const flt = a.createBiquadFilter(); flt.type = type;
        flt.frequency.setValueAtTime(f0, a.currentTime);
        flt.frequency.exponentialRampToValueAtTime(f1, a.currentTime + dur);
        const g = a.createGain(); g.gain.value = vol;
        src.connect(flt); flt.connect(g); g.connect(a.destination); src.start();
    }
    function boom(s) {
        const t = performance.now(); if (t - lastBoom < 140) return; lastBoom = t;
        hit(.7, 520, 60, .2 * s, 'lowpass');
        setTimeout(() => hit(.5, 5000, 1500, .04 * s, 'highpass'), 70);
    }
    const popSound = () => hit(.12, 3200, 800, .14, 'bandpass');

    /* ---------- fireworks engine ---------- */
    const HUES = [335, 345, 350, 320, 42, 'w', 285, 8];     // pinks, reds, gold, white, lilac
    const rockets = [], sparks = [], flashes = [];
    let running = false, last = 0, activeShow = false;

    function spark(x, y, vx, vy, col, o) {
        if (sparks.length > (small() ? 900 : 1800)) return;
        sparks.push(Object.assign({
            x, y, px: x, py: y, vx, vy, h: col[0], s: col[1], l: col[2],
            life: 1, decay: .014, grav: .045, fr: .972, size: 2.1, tw: false
        }, o));
    }
    const colorOf = (hue) => hue === 'w' ? [0, 0, 96] : [hue + rand(-14, 14), 100, rand(62, 80)];

    function launch(x, ty, type, hue, big) {
        const g = .11, dist = H + 10 - ty;
        rockets.push({ x, y: H + 10, vx: rand(-.35, .35), vy: -Math.sqrt(2 * g * dist), g, type, hue, big: !!big });
        ensureLoop();
    }

    function explode(x, y, type, hue, big) {
        const n = density(), bk = big ? 1.3 : 1;
        flashes.push({ x, y, r: (big ? 260 : 160) * K, life: 1, hue });
        boom(big ? 1 : .6);
        if (type === 'heart') {
            const cnt = Math.round(96 * n);
            for (let i = 0; i < cnt; i++) {
                const t = (i / cnt) * Math.PI * 2;
                const hx = 16 * Math.pow(Math.sin(t), 3);
                const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                spark(x, y, hx * .27 * K * bk, hy * .27 * K * bk - .3, colorOf(hue), { grav: .012, decay: .011 + rand(0, .003), size: 2.5 });
            }
            const inner = Math.round(52 * n);                    // little white-gold heart inside
            for (let i = 0; i < inner; i++) {
                const t = (i / inner) * Math.PI * 2;
                const hx = 16 * Math.pow(Math.sin(t), 3);
                const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                spark(x, y, hx * .14 * K * bk, hy * .14 * K * bk - .2, colorOf(i % 2 ? 'w' : 44), { grav: .01, decay: .012, size: 2 });
            }
        } else if (type === 'ring') {
            const cnt = Math.round(64 * n), tilt = rand(.3, 1), rot = rand(0, Math.PI);
            for (let i = 0; i < cnt; i++) {
                const a = (i / cnt) * Math.PI * 2;
                const ex = Math.cos(a) * 5.2 * K * bk, ey = Math.sin(a) * 5.2 * K * bk * tilt;
                spark(x, y, ex * Math.cos(rot) - ey * Math.sin(rot), ex * Math.sin(rot) + ey * Math.cos(rot), colorOf(hue), { grav: .02, decay: .013 });
            }
            const core = Math.round(26 * n);
            for (let i = 0; i < core; i++) { const a = rand(0, 7), sp = rand(.4, 1.8) * K; spark(x, y, Math.cos(a) * sp, Math.sin(a) * sp, colorOf('w'), { decay: .02, size: 1.6 }); }
        } else if (type === 'willow') {
            const cnt = Math.round(80 * n);
            for (let i = 0; i < cnt; i++) {
                const a = rand(0, 7), sp = rand(1.4, 5.2) * K * bk;
                spark(x, y, Math.cos(a) * sp, Math.sin(a) * sp, [rand(36, 48), 100, rand(68, 82)], { grav: .06, fr: .985, decay: rand(.006, .009), size: 1.8, tw: true });
            }
        } else {                                                  // peony
            const cnt = Math.round(110 * n);
            for (let i = 0; i < cnt; i++) {
                const a = rand(0, 7), sp = 4.8 * K * bk * (.72 + Math.random() * .28);
                spark(x, y, Math.cos(a) * sp, Math.sin(a) * sp, colorOf(hue), { tw: Math.random() < .35 });
            }
        }
    }
    function miniBurst(x, y) {                                    // for popped balloons
        const hue = pick(HUES), cnt = Math.round(22 * density());
        for (let i = 0; i < cnt; i++) { const a = rand(0, 7), sp = rand(1.2, 3.6) * K; spark(x, y, Math.cos(a) * sp, Math.sin(a) * sp, colorOf(hue), { decay: .022, size: 1.9 }); }
        ensureLoop();
    }

    function ensureLoop() { if (!running) { running = true; last = performance.now(); requestAnimationFrame(loop); } }
    function loop(now) {
        const dt = Math.min(2.5, (now - last) / 16.667 || 1); last = now;
        ctx.globalCompositeOperation = 'destination-out';          // fade old frame → glowing trails
        ctx.fillStyle = `rgba(0,0,0,${Math.min(.55, .2 * dt)})`;
        ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineCap = 'round';

        for (let i = flashes.length - 1; i >= 0; i--) {            // soft explosion glow
            const f = flashes[i];
            f.life -= .05 * dt;
            if (f.life <= 0) { flashes.splice(i, 1); continue; }
            const col = f.hue === 'w' ? '255,255,255' : `${255},${Math.round(120 + 60 * Math.random())},${Math.round(170 + 40 * Math.random())}`;
            const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
            g.addColorStop(0, `rgba(${col},${.32 * f.life})`);
            g.addColorStop(1, `rgba(${col},0)`);
            ctx.fillStyle = g; ctx.fillRect(f.x - f.r, f.y - f.r, f.r * 2, f.r * 2);
        }

        for (let i = rockets.length - 1; i >= 0; i--) {            // rising rockets
            const r = rockets[i];
            r.vy += r.g * dt; r.x += r.vx * dt; r.y += r.vy * dt;
            if (Math.random() < .9) spark(r.x, r.y, rand(-.25, .25), rand(.3, 1), [42, 100, 80], { life: .55, decay: .06, grav: 0, fr: .9, size: 1.7 });
            ctx.fillStyle = 'rgba(255,240,210,.95)'; ctx.beginPath(); ctx.arc(r.x, r.y, 2.2, 0, 7); ctx.fill();
            if (r.vy > -.7) { rockets.splice(i, 1); explode(r.x, r.y, r.type, r.hue, r.big); }
        }

        for (let i = sparks.length - 1; i >= 0; i--) {             // sparks
            const p = sparks[i];
            p.px = p.x; p.py = p.y;
            const fr = Math.pow(p.fr, dt);
            p.vx *= fr; p.vy = p.vy * fr + p.grav * dt;
            p.x += p.vx * dt; p.y += p.vy * dt;
            p.life -= p.decay * dt;
            if (p.life <= 0) { sparks[i] = sparks[sparks.length - 1]; sparks.pop(); continue; }
            let a = Math.min(1, p.life * 1.3); if (p.tw) a *= .5 + Math.random() * .5;
            ctx.strokeStyle = `hsla(${p.h | 0},${p.s}%,${p.l}%,${a.toFixed(2)})`;
            ctx.lineWidth = p.size * (.45 + .55 * p.life);
            ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y); ctx.stroke();
        }

        ctx.globalCompositeOperation = 'source-over';
        if (rockets.length || sparks.length || flashes.length || activeShow) requestAnimationFrame(loop);
        else { running = false; ctx.clearRect(0, 0, W, H); }
    }

    /* ---------- balloons ---------- */
    const BCOL = ['#ff4d85', '#ff7aa8', '#ff2d5f', '#ffb3c9', '#c77dff', '#ffd27a', '#ff9ec0', '#f8f0ff'];
    function balloonSVG(c, heart) {
        const shine = '<ellipse cx="19" cy="21" rx="5.5" ry="9.5" fill="#fff" opacity=".38" transform="rotate(-25 19 21)"/>';
        if (heart) {
            const d = 'M30 62 C6 42 0 26 7 15 C14 4 28 7 30 19 C32 7 46 4 53 15 C60 26 54 42 30 62Z';
            return `<svg viewBox="0 0 60 110"><path d="M30 70 C25 82 35 94 29 108" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1"/>` +
                `<path d="M30 61 L25 70 L35 70Z" fill="${c}"/><path d="${d}" fill="${c}"/><path d="${d}" fill="url(#bShade)"/>${shine}</svg>`;
        }
        return `<svg viewBox="0 0 60 110"><path d="M30 74 C25 86 35 96 29 108" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1"/>` +
            `<path d="M30 65 L25 74 L35 74Z" fill="${c}"/><ellipse cx="30" cy="34" rx="26" ry="32" fill="${c}"/>` +
            `<ellipse cx="30" cy="34" rx="26" ry="32" fill="url(#bShade)"/>${shine}</svg>`;
    }
    function spawnBalloon() {
        const el = document.createElement('div');
        el.className = 'balloon';
        el.innerHTML = `<div class="sway">${balloonSVG(pick(BCOL), Math.random() < .45)}</div>`;
        el.style.left = rand(1, 90) + '%';
        el.style.width = (small() ? rand(46, 76) : rand(56, 96)) + 'px';
        el.style.animationDuration = rand(9, 16) + 's';
        const sw = el.firstChild;
        sw.style.animationDuration = rand(2.4, 4.2) + 's';
        sw.style.animationDelay = (-rand(0, 3)) + 's';
        sw.style.setProperty('--sx', rand(10, 28) + 'px');
        el.addEventListener('animationend', (e) => { if (e.target === el) el.remove(); });
        el.addEventListener('pointerdown', popBalloon);
        layer.appendChild(el);
    }
    function popBalloon(e) {
        const el = e.currentTarget, r = el.getBoundingClientRect();
        const x = r.left + r.width / 2, y = r.top + r.height * .35;
        el.remove(); popSound(); miniBurst(x, y);
        if (window.LOVE) window.LOVE.burst(x, y, 12);
    }
    async function balloonWave(id, count) {
        count = Math.round(count * (reduce ? .4 : small() ? .75 : 1));
        for (let i = 0; i < count && id === showId; i++) { spawnBalloon(); await sleep(rand(120, 380)); }
    }
    function clearLayer() { layer.querySelectorAll('.balloon,.pop-word').forEach((n) => n.remove()); }

    /* ---------- flying hearts + pop-up words ---------- */
    async function heartStorm(id, count) {
        const L = window.LOVE; if (!L) return;
        L.setFloat(true);
        for (let i = 0; i < count && id === showId; i++) { L.floatHeart({ fast: true }); await sleep(reduce ? 220 : 90); }
    }
    const WORDS = ['forever 💕', 'my everything', 'you & me', 'always you', 'my home', 'I choose you', 'mine, always 💞', 'my favorite person'];
    function addWord(t) {
        const el = document.createElement('div');
        el.className = 'pop-word'; el.textContent = t;
        el.style.left = rand(14, 86) + '%';
        el.style.top = (Math.random() < .5 ? rand(7, 22) : rand(78, 92)) + '%';
        layer.appendChild(el);
        setTimeout(() => el.remove(), 3500);
    }
    async function wordPops(id) {
        const words = (F.popWords && F.popWords.length) ? F.popWords : WORDS;
        await sleep(1200);
        for (let i = 0; i < 14 && id === showId; i++) { addWord(words[i % words.length]); await sleep(rand(1100, 1900)); }
    }

    /* ---------- the show ---------- */
    let showId = 0;
    function shot(big) {
        const type = pick(['heart', 'heart', 'peony', 'peony', 'ring', 'willow']);
        launch(rand(.12, .88) * W, rand(.14, .5) * H, type, pick(HUES), big);
    }
    async function grandFinale(id) {
        const n = small() ? 8 : 14;
        for (let i = 0; i < n && id === showId; i++) {             // a fan of rockets across the sky
            launch(W * (.08 + .84 * i / (n - 1)), rand(.15, .42) * H, pick(['peony', 'ring', 'heart', 'willow']), pick(HUES));
            await sleep(150);
        }
        await sleep(1000); if (id !== showId) return;
        launch(W * .5, H * .3, 'heart', 340, true);                // the biggest heart, center stage
        launch(W * .22, H * .26, 'peony', 42, true);
        launch(W * .78, H * .26, 'peony', 42, true);
        balloonWave(id, 18);
        heartStorm(id, 40);
        await sleep(1600);
    }
    async function start() {
        const id = ++showId;
        audioCtx();                                                // created inside the tap → sound allowed
        activeShow = true; clearLayer();
        $('replayBtn').classList.remove('on'); $('finaleEnd').classList.remove('on');
        ensureLoop();

        launch(W / 2, H * .3, 'heart', 340, true);                 // opening: one giant heart
        balloonWave(id, 14);
        heartStorm(id, 60);
        wordPops(id);
        await sleep(1500);

        for (let i = 0; i < 9 && id === showId; i++) {             // build-up
            shot(); if (i === 4) balloonWave(id, 10);
            await sleep(rand(450, 800));
        }
        for (let i = 0; i < 10 && id === showId; i++) {            // faster
            shot(); if (i % 2) shot();
            await sleep(rand(280, 500));
        }
        if (id !== showId) return;
        await grandFinale(id);
        if (id !== showId) return;

        $('finaleEnd').textContent = F.endLine || '';
        $('finaleEnd').classList.add('on');
        $('replayBtn').classList.add('on');

        for (let i = 0; i < 36 && id === showId; i++) {            // afterglow, gentle
            shot(); if (i % 5 === 0) { balloonWave(id, 4); heartStorm(id, 10); }
            await sleep(rand(1600, 2600));
        }
        if (id === showId) activeShow = false;
    }

    $('replayBtn').addEventListener('click', () => start());
    window.FinaleShow = { start };
})();
