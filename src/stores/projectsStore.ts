import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId } from '@/lib/id'
import type { Project } from '@/types'

interface ProjectsStore {
  projects: Project[]
  addProject: (input: Omit<Project, 'id' | 'createdAt'>) => Project
  updateProject: (id: string, patch: Partial<Omit<Project, 'id' | 'createdAt'>>) => void
  deleteProject: (id: string) => void
  getProject: (id: string) => Project | undefined
  projectsForClient: (clientId: string) => Project[]
}

export const useProjectsStore = create<ProjectsStore>()(
  persist(
    (set, get) => ({
      projects: [],
      addProject: (input) => {
        const project: Project = { ...input, id: generateId('pr_'), createdAt: new Date().toISOString() }
        set((s) => ({ projects: [project, ...s.projects] }))
        return project
      },
      updateProject: (id, patch) =>
        set((s) => ({ projects: s.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
      deleteProject: (id) => set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),
      getProject: (id) => get().projects.find((p) => p.id === id),
      projectsForClient: (clientId) => get().projects.filter((p) => p.clientId === clientId),
    }),
    { name: 'proposalforge.projects' },
  ),
)
