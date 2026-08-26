import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId } from '@/lib/id'
export const useProjectsStore = create()(
  persist(
    (set, get) => ({
      projects: [],
      addProject: (input) => {
        const project = {
          ...input,
          id: generateId('pr_'),
          createdAt: new Date().toISOString(),
        }
        set((s) => ({
          projects: [project, ...s.projects],
        }))
        return project
      },
      updateProject: (id, patch) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...patch,
                }
              : p,
          ),
        })),
      deleteProject: (id) =>
        set((s) => ({
          projects: s.projects.filter((p) => p.id !== id),
        })),
      getProject: (id) => get().projects.find((p) => p.id === id),
      projectsForClient: (clientId) => get().projects.filter((p) => p.clientId === clientId),
    }),
    {
      name: 'proposalforge.projects',
    },
  ),
)
