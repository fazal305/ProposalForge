import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId } from '@/lib/id'
import { buildDefaultSoftwareTemplate, DEFAULT_THEME } from '@/data/defaultTemplate'
export const useTemplatesStore = create()(
  persist(
    (set, get) => ({
      templates: [],
      ensureSeeded: () => {
        if (get().templates.length > 0) return
        const id = generateId('tpl_')
        const template = {
          id,
          name: 'Software Development Proposal',
          description: 'The default master template — reusable static sections plus dynamic project fields.',
          theme: DEFAULT_THEME,
          isDefault: true,
          sections: buildDefaultSoftwareTemplate(id),
        }
        set({
          templates: [template],
        })
      },
      addTemplate: (name, description) => {
        const id = generateId('tpl_')
        const template = {
          id,
          name,
          description: description ?? null,
          theme: DEFAULT_THEME,
          isDefault: false,
          sections: [],
        }
        set((s) => ({
          templates: [template, ...s.templates],
        }))
        return template
      },
      duplicateTemplate: (id) => {
        const source = get().templates.find((t) => t.id === id)
        if (!source) return undefined
        const newId = generateId('tpl_')
        const copy = {
          ...source,
          id: newId,
          name: `${source.name} (Copy)`,
          isDefault: false,
          sections: source.sections.map((s) => ({
            ...s,
            id: generateId('sec_'),
            templateId: newId,
          })),
        }
        set((s) => ({
          templates: [copy, ...s.templates],
        }))
        return copy
      },
      deleteTemplate: (id) =>
        set((s) => ({
          templates: s.templates.filter((t) => t.id !== id),
        })),
      updateTemplateMeta: (id, patch) =>
        set((s) => ({
          templates: s.templates.map((t) =>
            t.id === id
              ? {
                  ...t,
                  ...patch,
                }
              : t,
          ),
        })),
      getTemplate: (id) => get().templates.find((t) => t.id === id),
      addSection: (templateId, section) =>
        set((s) => ({
          templates: s.templates.map((t) =>
            t.id === templateId
              ? {
                  ...t,
                  sections: [
                    ...t.sections,
                    {
                      ...section,
                      id: generateId('sec_'),
                      templateId,
                      orderIndex: t.sections.length,
                    },
                  ],
                }
              : t,
          ),
        })),
      updateSection: (templateId, sectionId, patch) =>
        set((s) => ({
          templates: s.templates.map((t) =>
            t.id === templateId
              ? {
                  ...t,
                  sections: t.sections.map((sec) =>
                    sec.id === sectionId
                      ? {
                          ...sec,
                          ...patch,
                        }
                      : sec,
                  ),
                }
              : t,
          ),
        })),
      deleteSection: (templateId, sectionId) =>
        set((s) => ({
          templates: s.templates.map((t) =>
            t.id === templateId
              ? {
                  ...t,
                  sections: t.sections.filter((sec) => sec.id !== sectionId),
                }
              : t,
          ),
        })),
      duplicateSection: (templateId, sectionId) =>
        set((s) => ({
          templates: s.templates.map((t) => {
            if (t.id !== templateId) return t
            const original = t.sections.find((sec) => sec.id === sectionId)
            if (!original) return t
            const copy = {
              ...original,
              id: generateId('sec_'),
              title: `${original.title} (Copy)`,
              orderIndex: t.sections.length,
            }
            return {
              ...t,
              sections: [...t.sections, copy],
            }
          }),
        })),
      reorderSections: (templateId, orderedSectionIds) =>
        set((s) => ({
          templates: s.templates.map((t) => {
            if (t.id !== templateId) return t
            const byId = new Map(t.sections.map((sec) => [sec.id, sec]))
            const reordered = orderedSectionIds
              .map((id, index) => {
                const sec = byId.get(id)
                return sec
                  ? {
                      ...sec,
                      orderIndex: index,
                    }
                  : undefined
              })
              .filter((s) => Boolean(s))
            return {
              ...t,
              sections: reordered,
            }
          }),
        })),
    }),
    {
      name: 'proposalforge.templates',
    },
  ),
)
