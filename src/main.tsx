import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n';
import './index.css';
import App from './App';

// The font stylesheet is preloaded in index.html (keep both URLs identical).
// Attaching it here keeps it off the critical rendering path without an inline
// onload handler, which the Content-Security-Policy would otherwise have to allow.
// Amiri and Tajawal only cover Arabic (unicode-range): FR/EN visitors never download them.
const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Montserrat:wght@300;400;500;600&family=Tajawal:wght@300;400;500&display=swap';
const fonts = document.createElement('link');
fonts.rel = 'stylesheet';
fonts.href = FONTS_HREF;
document.head.appendChild(fonts);

const root = document.getElementById('root');
if (!root) throw new Error('#root element missing from index.html');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
