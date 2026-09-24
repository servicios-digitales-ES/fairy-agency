/* ==========================================================================
   Motor genérico del visor de slides, usado por cada sección.
   Construye las slides de contenido (sin botones de acción dentro de ellas)
   y agrega una diapositiva final de cierre con:
     - un botón grande para continuar a la siguiente sección
     - un botón para volver al menú principal
   ========================================================================== */
function initSection(config) {
  const ids = config.ids;
  const track = document.getElementById('sliderTrack');
  const indicator = document.getElementById('pageIndicator');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const progressFill = document.getElementById('progressFill');

  // 1) Slides de contenido original — sin CTA dentro de ellas
  ids.forEach((id, i) => {
    const data = window.SLIDES[id];
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.innerHTML = `
      <div class="card"><div class="card-scroll-area">
        <span class="slide-eyebrow">${config.sectionLabel} · ${i + 1} / ${ids.length}</span>
        <h2 class="slide-title">${data.title}</h2>
        <div class="slide-body">${data.body}</div>
      </div></div>
    `;
    track.appendChild(slide);
  });

  // 2) Diapositiva de cierre / conversión (siempre la última del slider)
  const closing = document.createElement('div');
  closing.className = 'slide';

  // Si hay un enlace directo a la siguiente sección, el CTA es un <a>.
  // Si en vez de eso se define onNextClick (p. ej. para abrir una vista
  // dentro de la misma página, como en el registro), el CTA es un <button>.
  const ctaHtml = config.nextHref
    ? `<a class="btn-final" href="${config.nextHref}" id="sectionCtaBtn">${config.nextLabel}</a>`
    : `<button class="btn-final" id="sectionCtaBtn" type="button">${config.nextLabel}</button>`;

  closing.innerHTML = `
    <div class="card"><div class="card-scroll-area closing-card">
      <span class="slide-eyebrow">${config.sectionLabel} · Completado</span>
      <h2 class="slide-title">${config.closingTitle}</h2>
      <div class="slide-body">${config.closingText}</div>
      <div class="cta-wrapper">
        ${ctaHtml}
        <a class="btn-menu" href="${config.menuHref || 'index.html'}">☰ Volver al menú principal</a>
      </div>
    </div></div>
  `;
  track.appendChild(closing);

  if (!config.nextHref && typeof config.onNextClick === 'function') {
    closing.querySelector('#sectionCtaBtn').addEventListener('click', config.onNextClick);
  }

  // 3) Navegación entre slides (incluye la de cierre en el conteo total)
  const cards = () => document.querySelectorAll('.card-scroll-area');
  let currentIndex = 0;
  const total = ids.length + 1;

  function update() {
    track.style.transform = `translateX(-${currentIndex * 100}vw)`;
    indicator.textContent = `${currentIndex + 1} / ${total}`;
    progressFill.style.width = `${((currentIndex + 1) / total) * 100}%`;

    prevBtn.classList.toggle('is-hidden', currentIndex === 0);
    nextBtn.classList.toggle('is-hidden', currentIndex === total - 1);

    const currentCard = cards()[currentIndex];
    if (currentCard) currentCard.scrollTo({ top: 0, behavior: 'instant' });
  }

  nextBtn.addEventListener('click', () => {
    if (currentIndex < total - 1) { currentIndex++; update(); }
  });
  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) { currentIndex--; update(); }
  });

  update();
}
