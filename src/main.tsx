import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ensureSupabaseConnected } from '@/integrations/supabase/ensureConnection';

createRoot(document.getElementById("root")!).render(<App />);

// Fire-and-forget connectivity check; does not block UI render
(async () => {
  try {
    const isConnected = await ensureSupabaseConnected({ timeoutMs: 5000 });
    if (!isConnected) {
      // Silent failure - no console logging in production
      // In development, you could add: console.warn('[Supabase] Connectivity check failed.');
    }
  } catch (err) {
    // Silent error handling - no console logging in production
    // In development, you could add: console.warn('[Supabase] Connectivity check error:', err);
  }
})();
