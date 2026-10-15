"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "./api-client";

type State<T> = { key: string | null; data: T | null; error: string | null };

/**
 * Minimal data hook: fetches when `path`/`query` change and on `reload()`.
 * Keeps the previous data visible while a refetch is in flight. Pass `null` to skip.
 */
export function useApi<T>(path: string | null, query?: Record<string, string | number | undefined>) {
  const [tick, setTick] = useState(0);
  const [state, setState] = useState<State<T>>({ key: null, data: null, error: null });
  const key = path ? `${path}${JSON.stringify(query ?? {})}#${tick}` : null;

  useEffect(() => {
    if (!key || !path) return;
    let cancelled = false;
    api<T>(path, { query })
      .then((data) => {
        if (!cancelled) setState({ key, data, error: null });
      })
      .catch((e: Error) => {
        if (!cancelled) setState((s) => ({ key, data: s.data, error: e.message }));
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` captures path, query and tick
  }, [key]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  const setData = useCallback((data: T) => setState((s) => ({ ...s, data })), []);

  return { data: state.data, error: state.error, loading: key !== null && state.key !== key, reload, setData };
}
