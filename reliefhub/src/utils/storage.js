import { initialRequests, initialResources } from '../data/seedData';

const STORAGE_KEY = 'RELIEFHUB_DATA_V4';

export function loadInitialData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        requests: initialRequests,
        resources: initialResources
      };
    }

    const parsed = JSON.parse(raw);
    if (
      Array.isArray(parsed?.requests) &&
      Array.isArray(parsed?.resources) &&
      parsed.requests.length > 0
    ) {
      return parsed;
    }

    return {
      requests: initialRequests,
      resources: initialResources
    };
  } catch (error) {
    console.warn('ReliefHub: Failed to load from localStorage. Falling back to seed fixtures.', error);
    return {
      requests: initialRequests,
      resources: initialResources
    };
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('ReliefHub: Error writing to localStorage', error);
  }
}

export function resetData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('RELIEFHUB_DATA_V1');
    localStorage.removeItem('RELIEFHUB_DATA_V2');
    localStorage.removeItem('RELIEFHUB_DATA_V3');
    localStorage.removeItem('RELIEFHUB_USER');
  } catch (error) {
    console.error('ReliefHub: Error clearing localStorage', error);
  }
  return {
    requests: initialRequests,
    resources: initialResources
  };
}
