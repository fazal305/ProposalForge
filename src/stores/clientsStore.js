import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId } from '@/lib/id'
export const useClientsStore = create()(
  persist(
    (set, get) => ({
      clients: [],
      addClient: (input) => {
        const client = {
          ...input,
          id: generateId('cl_'),
          createdAt: new Date().toISOString(),
        }
        set((s) => ({
          clients: [client, ...s.clients],
        }))
        return client
      },
      updateClient: (id, patch) =>
        set((s) => ({
          clients: s.clients.map((c) =>
            c.id === id
              ? {
                  ...c,
                  ...patch,
                }
              : c,
          ),
        })),
      deleteClient: (id) =>
        set((s) => ({
          clients: s.clients.filter((c) => c.id !== id),
        })),
      getClient: (id) => get().clients.find((c) => c.id === id),
    }),
    {
      name: 'proposalforge.clients',
    },
  ),
)
