import { create } from 'zustand'

export type SyncState = 'idle' | 'saving' | 'saved' | 'offline'

interface SyncStore {
  state: SyncState
  isOnline: boolean
  lastSavedAt: number | null
  setSaving: () => void
  setSaved: () => void
  setOnline: (online: boolean) => void
}

/**
 * Tracks the subtle autosave/offline indicator shown in the proposal builder header.
 * Real browser online/offline events drive `isOnline`; `state` reflects the last
 * local-write outcome, not a server round-trip (there is no live backend yet).
 */
export const useSyncStore = create<SyncStore>((set) => ({
  state: 'idle',
  isOnline: typeof navigator === 'undefined' ? true : navigator.onLine,
  lastSavedAt: null,
  setSaving: () => set({ state: 'saving' }),
  setSaved: () => set({ state: 'saved', lastSavedAt: Date.now() }),
  setOnline: (online) => set({ isOnline: online, state: online ? 'idle' : 'offline' }),
}))

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => useSyncStore.getState().setOnline(true))
  window.addEventListener('offline', () => useSyncStore.getState().setOnline(false))
}
