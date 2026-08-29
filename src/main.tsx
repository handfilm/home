import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary.tsx';

const rootElement = document.getElementById('root');

if (rootElement) {
  (window as unknown as { __appMounted: boolean }).__appMounted = true;
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
} else {
  console.error("Fatal: Root element '#root' was not found in the DOM.");
}

