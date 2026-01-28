// Offline storage utilities for PWA functionality

const STORAGE_KEYS = {
  PROJECTS: 'pm_projects',
  TASKS: 'pm_tasks',
  USER: 'pm_user',
  LAST_SYNC: 'pm_last_sync'
} as const;

export interface OfflineData {
  projects: any[];
  tasks: any[];
  user: any;
  lastSync: string;
}

// Save data to localStorage for offline access
export function saveOfflineData(key: keyof typeof STORAGE_KEYS, data: any): void {
  try {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save offline data:', error);
  }
}

// Get data from localStorage
export function getOfflineData<T>(key: keyof typeof STORAGE_KEYS): T | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS[key]);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.warn('Failed to get offline data:', error);
    return null;
  }
}

// Clear all offline data
export function clearOfflineData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}

// Check if we're online
export function isOnline(): boolean {
  return navigator.onLine;
}

// Sync data when coming back online
export function setupSyncListeners(): void {
  window.addEventListener('online', () => {
    console.log('Back online - triggering sync');
    // Trigger sync with server
    syncWithServer();
  });

  window.addEventListener('offline', () => {
    console.log('Gone offline - using cached data');
  });
}

// Simulate server sync (would be actual API calls in real app)
async function syncWithServer(): Promise<void> {
  try {
    // Get offline changes
    const offlineProjects = getOfflineData('PROJECTS');
    const offlineTasks = getOfflineData('TASKS');
    
    // Here you would send changes to server
    console.log('Syncing with server...', { offlineProjects, offlineTasks });
    
    // Update last sync timestamp
    saveOfflineData('LAST_SYNC', new Date().toISOString());
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

// Estimate storage usage
export function getStorageUsage(): { used: number; available: number; percentage: number } {
  let used = 0;
  
  Object.values(STORAGE_KEYS).forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      used += data.length;
    }
  });
  
  // Rough estimate of localStorage limit (usually 5-10MB)
  const available = 5 * 1024 * 1024; // 5MB in bytes
  const percentage = (used / available) * 100;
  
  return { used, available, percentage };
}
