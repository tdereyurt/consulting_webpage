const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());

const focusButtons = document.querySelectorAll<HTMLButtonElement>('.focus-option');
const focusResults = document.querySelectorAll<HTMLElement>('.focus-result');

focusButtons.forEach((button) => {
  button.addEventListener('click', () => {
    focusButtons.forEach((option) => {
      const selected = option === button;
      option.classList.toggle('is-selected', selected);
      option.setAttribute('aria-pressed', String(selected));
    });
    focusResults.forEach((result) => {
      result.hidden = result.dataset.result !== button.dataset.focus;
    });
  });
});

const header = document.getElementById('site-header');
const progressBar = document.getElementById('reading-progress-bar');
const navLinks = document.querySelectorAll<HTMLAnchorElement>('.desktop-nav a[href^="#"]');
const sectionIds = ['leistungen', 'arbeitsweise', 'ueber-mich'];
const sections = sectionIds.map((id) => document.getElementById(id)).filter((section): section is HTMLElement => section !== null);
const cinematic = document.querySelector<HTMLElement>('.cinematic-sequence');
const cinematicCount = document.getElementById('cinematic-step-count');
const cinematicName = document.getElementById('cinematic-step-name');
const cinematicHeadline = document.getElementById('cinematic-headline-main');
const cinematicAccent = document.getElementById('cinematic-headline-accent');
const cinematicDescription = document.getElementById('cinematic-description');
const cinematicSteps = document.querySelectorAll<HTMLElement>('[data-cinematic-step]');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let scrollQueued = false;
let activeCinematicStep = 2;

const cinematicStory = [
  {
    name: 'SIGNALE ERKENNEN',
    headline: 'Einzelne Signale',
    accent: 'sichtbar machen.',
    description: 'Daten, Prozesse und Anwendungen zeigen unterschiedliche Ausschnitte. Zuerst machen wir die Ausgangslage sichtbar.',
  },
  {
    name: 'ZUSAMMENHÄNGE VERBINDEN',
    headline: 'Zusammenhänge',
    accent: 'erkennen und ordnen.',
    description: 'Wir bringen die Signale in Beziehung. So zeigen sich Abhängigkeiten, Lücken und mögliche Hebel für Verbesserungen.',
  },
  {
    name: 'RICHTUNG FESTLEGEN',
    headline: 'Aus Signalen wird',
    accent: 'eine klare Richtung.',
    description: 'Aus dem Gesamtbild lässt sich ein nächster Schritt ableiten, der Nutzen und Umsetzbarkeit verbindet.',
  },
] as const;

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}

function setCinematicStep(index: number) {
  if (!cinematic || index === activeCinematicStep) return;
  const story = cinematicStory[index];
  if (!story) return;

  if (cinematicCount) cinematicCount.textContent = `0${index + 1} / 03`;
  if (cinematicName) cinematicName.textContent = story.name;
  if (cinematicHeadline) cinematicHeadline.textContent = story.headline;
  if (cinematicAccent) cinematicAccent.textContent = story.accent;
  if (cinematicDescription) cinematicDescription.textContent = story.description;
  cinematicSteps.forEach((step, position) => {
    step.classList.toggle('is-current', position === index);
    step.classList.toggle('is-complete', position < index);
    if (position === index) step.setAttribute('aria-current', 'step');
    else step.removeAttribute('aria-current');
  });
  activeCinematicStep = index;
}

function updateCinematicState() {
  if (!cinematic) return;
  if (motionPreference.matches) {
    ['--lens-scale', '--lens-shift', '--lens-turn', '--network-opacity']
      .forEach((property) => cinematic.style.removeProperty(property));
    setCinematicStep(2);
    return;
  }

  const travel = Math.max(1, cinematic.offsetHeight - window.innerHeight);
  const progress = clamp(-cinematic.getBoundingClientRect().top / travel);
  const zoomProgress = clamp(progress / .65);
  const eased = zoomProgress * zoomProgress * (3 - 2 * zoomProgress);
  const networkOpacity = clamp((progress - .22) / .3);
  const shift = window.innerWidth < 850 ? 0 : Math.min(window.innerWidth * .22, 285) * eased;

  cinematic.style.setProperty('--lens-scale', String(3.15 - 2.29 * eased));
  cinematic.style.setProperty('--lens-shift', `${shift}px`);
  cinematic.style.setProperty('--lens-turn', `${-16 * (1 - eased)}deg`);
  cinematic.style.setProperty('--network-opacity', String(networkOpacity));
  setCinematicStep(progress < .32 ? 0 : progress < .66 ? 1 : 2);
}

function updateScrollState() {
  const scrollableHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  if (progressBar) progressBar.style.transform = `scaleX(${Math.min(1, window.scrollY / scrollableHeight)})`;
  header?.classList.toggle('is-scrolled', window.scrollY > 32);

  const activeSection = sections.filter((section) => section.getBoundingClientRect().top <= window.innerHeight * 0.38).at(-1);
  navLinks.forEach((link) => {
    const current = activeSection !== undefined && link.hash === `#${activeSection.id}`;
    link.classList.toggle('is-current', current);
    if (current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  updateCinematicState();
  scrollQueued = false;
}

window.addEventListener('scroll', () => {
  if (scrollQueued) return;
  scrollQueued = true;
  window.requestAnimationFrame(updateScrollState);
}, { passive: true });
window.addEventListener('resize', updateScrollState);
motionPreference.addEventListener('change', updateScrollState);
updateScrollState();

const form = document.getElementById('contact-form') as HTMLFormElement;
const prepared = document.getElementById('prepared-message') as HTMLDivElement;
const preparedText = document.getElementById('prepared-text') as HTMLTextAreaElement;
const copyStatus = document.getElementById('copy-status') as HTMLParagraphElement;

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const name = String(data.get('name') ?? '').trim();
  const email = String(data.get('email') ?? '').trim();
  const message = String(data.get('message') ?? '').trim();
  preparedText.value = `Anfrage an Tayfun Dereyurt\n\nName: ${name}\nE-Mail: ${email}\n\nAnliegen:\n${message}`;
  prepared.hidden = false;
  copyStatus.textContent = '';
  preparedText.focus();
  prepared.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'nearest',
  });
});

document.getElementById('copy-message')?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(preparedText.value);
    copyStatus.textContent = 'Text kopiert. Sobald eine Kontaktadresse ergänzt ist, können Sie die Anfrage dorthin senden.';
  } catch {
    preparedText.select();
    copyStatus.textContent = 'Der Text ist markiert. Kopieren Sie ihn mit Strg+C oder ⌘+C.';
  }
});

document.querySelectorAll<HTMLButtonElement>('[data-dialog]').forEach((button) => {
  button.addEventListener('click', () => {
    const dialog = document.getElementById(button.dataset.dialog ?? '') as HTMLDialogElement | null;
    dialog?.showModal();
  });
});

document.querySelectorAll<HTMLDialogElement>('.legal-dialog').forEach((dialog) => {
  dialog.querySelector<HTMLButtonElement>('.dialog-close')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
});

document.querySelectorAll<HTMLAnchorElement>('.mobile-nav nav a').forEach((link) => {
  link.addEventListener('click', () => {
    const menu = link.closest('details');
    if (menu) menu.open = false;
  });
});

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const targets = document.querySelectorAll<HTMLElement>('.challenge, .service-card, .step, .example-card');
  targets.forEach((target) => target.classList.add('reveal'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px 40px 0px' });
  targets.forEach((target) => observer.observe(target));
}
