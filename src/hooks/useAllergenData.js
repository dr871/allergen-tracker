import { useState, useEffect, useRef, useCallback } from 'react';
import { ALLERGENS } from '../constants/allergens.js';
import { loadData, saveData } from '../utils/storage.js';

function initState() {
  const s = loadData();
  const frequencies = {}, logs = {};
  ALLERGENS.forEach(a => {
    frequencies[a.id] = s?.frequencies?.[a.id] ?? a.defaultDays;
    logs[a.id] = s?.logs?.[a.id] ?? [];
  });
  return { frequencies, logs, foods: s?.foods ?? [] };
}

function mergeServerData(serverData) {
  const merged = { frequencies: {}, logs: {}, foods: serverData.foods || [] };
  ALLERGENS.forEach(a => {
    merged.frequencies[a.id] = serverData.frequencies[a.id] ?? a.defaultDays;
    merged.logs[a.id] = serverData.logs?.[a.id] || [];
  });
  return merged;
}

export function useAllergenData() {
  const [data, setData] = useState(initState);
  const [loading, setLoading] = useState(true);
  const saveTimer = useRef(null);
  const serverLoaded = useRef(false);

  const fetchData = useCallback(() => {
    return fetch('/api/data')
      .then(res => res.ok ? res.json() : null)
      .then(serverData => {
        if (serverData && serverData.frequencies) {
          setData(mergeServerData(serverData));
        }
      })
      .catch(err => console.warn('Failed to load from server', err));
  }, []);

  useEffect(() => {
    fetchData().finally(() => { serverLoaded.current = true; setLoading(false); });
  }, [fetchData]);

  useEffect(() => {
    if (!serverLoaded.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveData(data), 800);
    return () => clearTimeout(saveTimer.current);
  }, [data]);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return [data, setData, loading, refresh];
}
