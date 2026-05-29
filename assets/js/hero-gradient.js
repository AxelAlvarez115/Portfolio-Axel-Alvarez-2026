/* ---------- mouse-tracked hero gradient ---------- */
(function() {
  const hero = document.getElementById('hero');
  const bg   = document.getElementById('heroBg');
  if (!hero || !bg) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // En mode mouvement réduit : gradient statique, aucune animation/rAF.
  if (reduceMotion) {
    bg.style.setProperty('--mx', '50%');
    bg.style.setProperty('--my', '40%');
  } else {
    let targetX = 50, targetY = 40, curX = 50, curY = 40;
    let raf = 0, lastMove = 0, lastFrame = 0, t = 0;
    let lastMx = '', lastMy = '';
    let intersecting = true, pageHidden = document.hidden;

    // L'animation ne tourne que si le hero est à l'écran ET l'onglet visible.
    const active = () => intersecting && !pageHidden;

    // Rect du hero mis en cache : recalculé sur resize/scroll, pas à chaque
    // mousemove (évite un layout read par événement souris).
    let rect = hero.getBoundingClientRect();
    const readRect = () => { rect = hero.getBoundingClientRect(); };
    addEventListener('resize', readRect, { passive: true });
    addEventListener('scroll', readRect, { passive: true });

    const IDLE_AFTER  = 1500;        // ms d'inactivité avant la dérive auto
    const IDLE_FRAME  = 1000 / 30;   // dérive throttlée à ~30 fps (moitié des re-flous)

    function loop(now) {
      // La rAF ne se relance que tant que l'animation est active.
      raf = active() ? requestAnimationFrame(loop) : 0;

      const idle = (now - lastMove) > IDLE_AFTER;
      if (idle) {
        // Throttle : limite les re-rasterisations du fond flou quand on ne
        // bouge pas la souris.
        if (now - lastFrame < IDLE_FRAME) return;
        t += 0.125;
        targetX = 50 + Math.sin(t * 0.05) * 18;
        targetY = 40 + Math.cos(t * 0.04) * 12;
      }
      lastFrame = now;

      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;

      // N'écrit (et ne re-floute) que si la valeur arrondie a réellement bougé.
      const mx = curX.toFixed(2) + '%';
      const my = curY.toFixed(2) + '%';
      if (mx !== lastMx) { bg.style.setProperty('--mx', mx); lastMx = mx; }
      if (my !== lastMy) { bg.style.setProperty('--my', my); lastMy = my; }
    }

    function start() {
      if (!raf && active()) raf = requestAnimationFrame(loop);
    }

    function stop() {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
    }

    hero.addEventListener('mousemove', (e) => {
      targetX = ((e.clientX - rect.left) / rect.width)  * 100;
      targetY = ((e.clientY - rect.top)  / rect.height) * 100;
      lastMove = performance.now();
      start();
    });

    hero.addEventListener('mouseleave', () => {
      targetX = 50; targetY = 40;
    });

    // Ne fait tourner l'animation que lorsque le hero est à l'écran.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        intersecting = entries[0].isIntersecting;
        if (active()) start(); else stop();
      }, { threshold: 0 }).observe(hero);
    }

    // Met l'animation en pause quand l'onglet passe en arrière-plan.
    document.addEventListener('visibilitychange', () => {
      pageHidden = document.hidden;
      if (active()) start(); else stop();
    });

    start();
  }

  // Scroll-cue → next section
  const scrollCue = hero.querySelector('.scroll-cue');
  if (scrollCue) {
    scrollCue.addEventListener('click', () => {
      const next = hero.nextElementSibling;
      if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
})();
