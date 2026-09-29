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
let scrollQueued = false;

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
  scrollQueued = false;
}

window.addEventListener('scroll', () => {
  if (scrollQueued) return;
  scrollQueued = true;
  window.requestAnimationFrame(updateScrollState);
}, { passive: true });
window.addEventListener('resize', updateScrollState);
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
