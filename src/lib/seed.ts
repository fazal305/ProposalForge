import { useClientsStore } from '@/stores/clientsStore'
import { useProjectsStore } from '@/stores/projectsStore'
import { useTemplatesStore } from '@/stores/templatesStore'

/**
 * Seeds clearly-labeled demo data on first run so the app isn't an empty shell.
 * Demo records use recognizably fake companies per the brief — never data that
 * could be mistaken for the developer's real business or a real client.
 */
export function ensureDemoDataSeeded() {
  useTemplatesStore.getState().ensureSeeded()

  const clientsStore = useClientsStore.getState()
  if (clientsStore.clients.length > 0) return

  const demoClient = clientsStore.addClient({
    name: 'Jordan Blake',
    company: 'Demo Construction Ltd.',
    email: 'jordan@demo-construction.example',
    phone: '+1 (555) 010-2934',
    address: '48 Example Ave, Springfield',
    notes: 'DEMO DATA — safe to delete. Illustrates the client → project → proposal flow.',
  })

  useProjectsStore.getState().addProject({
    clientId: demoClient.id,
    name: 'Company Website Rebuild',
    description: 'A rebuild of the company marketing site with a lead-capture form and CMS-driven blog.',
    problemStatement: 'The current site is slow, not mobile-friendly, and hard to update without a developer.',
    proposedSolution: 'A fast, responsive site built on a modern stack with a simple CMS the team can update themselves.',
    category: 'Web Development',
    techStack: ['React', 'Tailwind CSS', 'Headless CMS'],
    estimatedTimeline: '6-8 weeks',
    budget: 8000,
    status: 'ACTIVE',
    notes: 'DEMO DATA — safe to delete.',
  })
}
