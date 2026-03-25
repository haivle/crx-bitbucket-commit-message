import {
  COMMIT_MESSAGE_OPTIONS,
  DEFAULT_MERGE_FORMATTER_SETTINGS,
  loadMergeFormatterSettings,
  saveMergeFormatterSettings,
  type DefaultCommitMessageMode,
  type MergeFormatterSettings,
} from '@/lib/mergeFormatterSettings';
import '@/components/Settings.css';

function appendCheckboxRow(
  ul: HTMLUListElement,
  getSettings: () => MergeFormatterSettings,
  key: 'mergeCommits' | 'squashCommits' | 'rebaseCommits',
  title: string,
  hint: string,
  persist: (next: MergeFormatterSettings) => void,
): void {
  const li = document.createElement('li');
  const label = document.createElement('label');
  label.className = 'settings-row';

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = getSettings()[key];
  input.addEventListener('change', () => {
    const next = { ...getSettings(), [key]: input.checked } as MergeFormatterSettings;
    persist(next);
  });

  const span = document.createElement('span');
  const strong = document.createElement('strong');
  strong.textContent = title;
  const hintEl = document.createElement('span');
  hintEl.className = 'settings-hint';
  hintEl.textContent = hint;

  span.appendChild(strong);
  span.appendChild(hintEl);
  label.appendChild(input);
  label.appendChild(span);
  li.appendChild(label);
  ul.appendChild(li);
}

/** Vanilla settings UI (no React; avoids innerHTML in extension bundles for AMO). */
export function mountSettingsUi(root: HTMLElement): void {
  const loading = document.createElement('p');
  loading.className = 'settings-loading';
  loading.textContent = 'Loading settings…';
  root.appendChild(loading);

  void loadMergeFormatterSettings().then((loaded) => {
    let settings: MergeFormatterSettings = { ...DEFAULT_MERGE_FORMATTER_SETTINGS, ...loaded };
    const getSettings = () => settings;

    const persist = (next: MergeFormatterSettings) => {
      settings = next;
      void saveMergeFormatterSettings(settings);
    };

    root.replaceChildren();

    const shell = document.createElement('div');
    shell.className = 'settings-root';

    const h1 = document.createElement('h1');
    h1.className = 'settings-page-title';
    h1.textContent = 'Merge message formatter';
    shell.appendChild(h1);

    const sec1 = document.createElement('section');
    sec1.className = 'settings-section';
    sec1.setAttribute('aria-labelledby', 'merge-strategy-heading');

    const h2a = document.createElement('h2');
    h2a.id = 'merge-strategy-heading';
    h2a.className = 'settings-section-title';
    h2a.textContent = 'Merge strategy';
    sec1.appendChild(h2a);

    const pa = document.createElement('p');
    pa.className = 'settings-section-desc';
    pa.textContent =
      'Enable the formatter only for the strategies you use. Bitbucket must show that strategy in the merge dialog.';
    sec1.appendChild(pa);

    const ul = document.createElement('ul');
    ul.className = 'settings-list';
    appendCheckboxRow(ul, getSettings, 'mergeCommits', 'Merge commits', '"Merge commit"', persist);
    appendCheckboxRow(
      ul,
      getSettings,
      'squashCommits',
      'Squash commits',
      '"Squash", "Squash, fast-forward"',
      persist,
    );
    appendCheckboxRow(
      ul,
      getSettings,
      'rebaseCommits',
      'Rebase commits',
      '"Rebase, merge", "Rebase, fast-forward"',
      persist,
    );
    sec1.appendChild(ul);
    shell.appendChild(sec1);

    const sec2 = document.createElement('section');
    sec2.className = 'settings-section';
    sec2.setAttribute('aria-labelledby', 'commit-message-heading');

    const h2b = document.createElement('h2');
    h2b.id = 'commit-message-heading';
    h2b.className = 'settings-section-title';
    h2b.textContent = 'Commit message';
    sec2.appendChild(h2b);

    const pb = document.createElement('p');
    pb.className = 'settings-section-desc';
    pb.textContent = 'How to change the default merge commit message when an enabled strategy is active.';
    sec2.appendChild(pb);

    const field = document.createElement('div');
    field.className = 'settings-commit-field';

    const select = document.createElement('select');
    select.id = 'commit-message-mode';
    select.className = 'settings-select';
    for (const opt of COMMIT_MESSAGE_OPTIONS) {
      const o = document.createElement('option');
      o.value = opt.value;
      o.textContent = opt.label;
      select.appendChild(o);
    }
    select.value = settings.commitMessage;
    select.addEventListener('change', () => {
      persist({
        ...getSettings(),
        commitMessage: select.value as DefaultCommitMessageMode,
      });
    });

    field.appendChild(select);
    sec2.appendChild(field);
    shell.appendChild(sec2);

    root.appendChild(shell);
  });
}
