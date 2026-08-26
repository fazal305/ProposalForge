import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { ensureDemoDataSeeded } from '@/lib/seed'
import { DashboardPage } from '@/pages/DashboardPage'
import { ClientsPage } from '@/pages/ClientsPage'
import { ClientDetailPage } from '@/pages/ClientDetailPage'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { ProjectDetailPage } from '@/pages/ProjectDetailPage'
import { TemplatesPage } from '@/pages/TemplatesPage'
import { TemplateEditorPage } from '@/pages/TemplateEditorPage'
import { ProposalsPage } from '@/pages/ProposalsPage'
import { NewProposalPage } from '@/pages/NewProposalPage'
import { ProposalBuilderPage } from '@/pages/ProposalBuilderPage'
import { ProposalPreviewPage } from '@/pages/ProposalPreviewPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { PublicProposalPage } from '@/pages/PublicProposalPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
export default function App() {
  useEffect(() => {
    ensureDemoDataSeeded()
  }, [])
  return (
    <Routes>
      <Route path="/proposal/:token" element={<PublicProposalPage />} />

      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/clients/:id" element={<ClientDetailPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/templates/:id" element={<TemplateEditorPage />} />
        <Route path="/proposals" element={<ProposalsPage />} />
        <Route path="/proposals/new" element={<NewProposalPage />} />
        <Route path="/proposals/:id/edit" element={<ProposalBuilderPage />} />
        <Route path="/proposals/:id/preview" element={<ProposalPreviewPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
