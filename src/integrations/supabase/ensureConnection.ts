import { supabase } from './client';

let hasCheckedConnection = false;

export type EnsureConnectionOptions = {
  timeoutMs?: number;
};

/**
 * Attempts a lightweight query to verify Supabase reachability.
 * Returns true on success, false on failure.
 * Memoizes a successful check to avoid repeated pings.
 */
export async function ensureSupabaseConnected(options: EnsureConnectionOptions = {}): Promise<boolean> {
  if (hasCheckedConnection) {
    return true;
  }

  const { timeoutMs = 5000 } = options;

  const ping = async () => {
    const { error } = await supabase
      .from('technical_questions')
      .select('id', { head: true, count: 'exact' })
      .limit(1);

    if (error) {
      return false;
    }

    return true;
  };

  const result = await Promise.race<Promise<boolean>>([
    ping(),
    new Promise<boolean>((resolve) => setTimeout(() => resolve(false), timeoutMs)),
  ]);

  if (result) {
    hasCheckedConnection = true;
  }

  return result;
}


