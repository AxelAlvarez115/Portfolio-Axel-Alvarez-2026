(function () {
  const btn    = document.getElementById('heliToggle');
  const visual = document.getElementById('heliVisual');
  if (!btn || !visual) return;

  const STORAGE_KEY = 'heliVisible';

  function setHeli(on) {
    visual.classList.toggle('heli-on', on);
    btn.classList.toggle('heli-on', on);
    localStorage.setItem(STORAGE_KEY, on ? '1' : '0');
  }

  // Démarre désactivé si aucune préférence sauvegardée
  setHeli(localStorage.getItem(STORAGE_KEY) === '1');

  btn.addEventListener('click', () => {
    setHeli(!visual.classList.contains('heli-on'));
  });
})();
