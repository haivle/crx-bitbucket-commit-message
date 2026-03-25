const HOST_ID = 'bitbucket-merge-commit-toast';
const SVG_NS = 'http://www.w3.org/2000/svg';

/** Sonner-style success palette (light / dark). */
const TOAST_CSS = `
  .wrap {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 2147483647;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    pointer-events: none;
    --toast-radius: 8px;
    --toast-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    --success-bg: hsl(143, 85%, 96%);
    --success-border: hsl(145, 92%, 87%);
    --success-text: hsl(140, 100%, 27%);
    --success-icon: hsl(140, 100%, 27%);
  }
  @media (prefers-color-scheme: dark) {
    .wrap {
      --toast-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
      --success-bg: hsl(150, 100%, 6%);
      --success-border: hsl(147, 100%, 12%);
      --success-text: hsl(150, 86%, 65%);
      --success-icon: hsl(150, 86%, 65%);
    }
  }
  .toast {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px;
    border-radius: var(--toast-radius);
    border: 1px solid var(--success-border);
    background: var(--success-bg);
    color: var(--success-text);
    font-size: 13px;
    font-weight: 500;
    line-height: 1.5;
    box-shadow: var(--toast-shadow);
    max-width: min(356px, calc(100vw - 48px));
    animation: bbcm-toast-in 0.35s cubic-bezier(0.21, 1.02, 0.73, 1);
  }
  .toast-icon {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    color: var(--success-icon);
  }
  .toast-icon svg {
    display: block;
    width: 100%;
    height: 100%;
  }
  .toast-title {
    flex: 1;
    min-width: 0;
  }
  @keyframes bbcm-toast-in {
    from {
      opacity: 0;
      transform: translateY(calc(8px + 100%)) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  @keyframes bbcm-toast-out {
    from {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    to {
      opacity: 0;
      transform: translateY(8px) scale(0.96);
    }
  }
  @keyframes bbcm-toast-out-reduced {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  .toast.toast--out {
    animation: bbcm-toast-out 0.2s ease forwards;
  }
  @media (prefers-reduced-motion: reduce) {
    .toast:not(.toast--out) {
      animation: none;
    }
    .toast.toast--out {
      animation: bbcm-toast-out-reduced 0.15s ease forwards;
    }
  }
`;

const VISIBLE_MS = 4000;
const FADE_OUT_FALLBACK_MS = 280;

let hideTimer: ReturnType<typeof setTimeout> | null = null;

function createSonnerStyleSuccessIcon(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.setAttribute('fill', 'currentColor');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute(
    'fill-rule',
    'evenodd',
  );
  path.setAttribute(
    'd',
    'M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z',
  );
  path.setAttribute('clip-rule', 'evenodd');
  svg.appendChild(path);
  return svg;
}

/** Non-HTML toast for Bitbucket pages (no innerHTML; AMO-safe). */
export function showContentToast(message: string): void {
  let host = document.getElementById(HOST_ID);
  if (!host) {
    host = document.createElement('div');
    host.id = HOST_ID;
    document.body.appendChild(host);
    const shadow = host.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = TOAST_CSS;
    shadow.appendChild(style);
    const wrap = document.createElement('div');
    wrap.className = 'wrap';
    wrap.setAttribute('role', 'status');
    wrap.setAttribute('aria-live', 'polite');
    shadow.appendChild(wrap);
  }

  const wrap = host.shadowRoot!.querySelector('.wrap')!;
  wrap.replaceChildren();

  const toast = document.createElement('div');
  toast.className = 'toast';

  const iconWrap = document.createElement('div');
  iconWrap.className = 'toast-icon';
  iconWrap.appendChild(createSonnerStyleSuccessIcon());

  const title = document.createElement('div');
  title.className = 'toast-title';
  title.textContent = message;

  toast.appendChild(iconWrap);
  toast.appendChild(title);
  wrap.appendChild(toast);

  if (hideTimer !== null) clearTimeout(hideTimer);

  hideTimer = setTimeout(() => {
    hideTimer = null;
    if (!wrap.contains(toast)) return;

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      toast.removeEventListener('animationend', onAnimationEnd);
      if (wrap.contains(toast)) wrap.removeChild(toast);
    };

    const onAnimationEnd = (e: AnimationEvent) => {
      if (!e.animationName.startsWith('bbcm-toast-out')) return;
      finish();
    };

    toast.addEventListener('animationend', onAnimationEnd);
    toast.classList.add('toast--out');

    window.setTimeout(finish, FADE_OUT_FALLBACK_MS);
  }, VISIBLE_MS);
}
