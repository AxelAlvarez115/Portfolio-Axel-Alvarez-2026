(function () {
  const modal     = document.getElementById('cvModal');
  const frame     = document.getElementById('cvFrame');
  const openBtn   = document.getElementById('cvModalOpen');
  const closeBtn  = document.getElementById('cvModalClose');
  const closeBtn2 = document.getElementById('cvModalCloseBtn');
  const backdrop  = document.getElementById('cvModalBackdrop');
  if (!modal || !frame || !openBtn) return;

  const PDF = 'assets/documents/CV – Axel Alvarez Dev.pdf';

  function open() {
    if (!frame.src || frame.src === window.location.href) frame.src = PDF;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('cv-modal-open');
    if (closeBtn) setTimeout(() => closeBtn.focus(), 60);
  }

  function close() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cv-modal-open');
    openBtn.focus();
  }

  openBtn.addEventListener('click', open);
  if (closeBtn)  closeBtn.addEventListener('click', close);
  if (closeBtn2) closeBtn2.addEventListener('click', close);
  if (backdrop)  backdrop.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      e.preventDefault();
      close();
    }
  });
})();
