import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { installDiagnosticsLogger } from './lib/diagnostics';

import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/mobile.css';

installDiagnosticsLogger();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
