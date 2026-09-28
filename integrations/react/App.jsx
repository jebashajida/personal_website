import { useEffect, useRef } from 'react';
import { mountPortfolio } from './portfolio/site.js';

/**
 * Optional adapter for an existing Vite/React project.
 * Copy the main project's src directory to YOUR-REACT-PROJECT/src/portfolio.
 * Copy this file, main.jsx and index.css into YOUR-REACT-PROJECT/src.
 * Copy the contents of public/ into YOUR-REACT-PROJECT/public.
 * The cleanup return value supports React StrictMode mount/unmount cycles.
 */
export default function App() {
  const root = useRef(null);
  useEffect(() => mountPortfolio(root.current, {
    // Vite serves public assets at BASE_URL, not under a /public URL.
    publicBase: import.meta.env.BASE_URL,
  }), []);
  return <div ref={root} />;
}
