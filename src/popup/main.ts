import { mountSettingsUi } from '@/lib/mountSettingsUi';
import './App.css';
import './index.css';

const root = document.getElementById('root');
if (root) {
  const shell = document.createElement('div');
  shell.className = 'popup-app';
  root.appendChild(shell);
  mountSettingsUi(shell);
}
