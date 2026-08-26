import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Field, Input, Textarea } from '@/components/FormField'
import { useSettingsStore } from '@/stores/settingsStore'
import { generateInitialsLogo } from '@/lib/generateLogo'
import { LEGAL_REVIEW_NOTE } from '@/data/defaultTerms'

export function SettingsPage() {
  const { profile, updateProfile, terms, updateTerm, proposalNumberPrefix, nextProposalNumber } = useSettingsStore()
  const setState = useSettingsStore.setState
  const [savedFlash, setSavedFlash] = useState(false)

  const flash = () => {
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 1200)
  }

  return (
    <div>
      <PageHeader title="Settings" description="Your reusable profile and business defaults — edit once, applied everywhere." />

      <div className="grid lg:grid-cols-2 gap-[var(--spacing-lg)]">
        <Card className="p-[var(--spacing-lg)] space-y-[var(--spacing-md)]">
          <h2 className="text-[var(--text-sm)] font-semibold text-[var(--color-text)]">About the Developer</h2>

          <div className="flex items-center gap-[var(--spacing-md)]">
            {profile.logoDataUrl ? (
              <img src={profile.logoDataUrl} alt="" className="h-16 w-16 rounded-[var(--radius-md)]" />
            ) : (
              <div className="h-16 w-16 rounded-[var(--radius-md)] bg-[var(--color-border)]" />
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                updateProfile({ logoDataUrl: generateInitialsLogo(profile.businessName || profile.name, '#1f4d3d', '#b98a4e') })
                flash()
              }}
            >
              Generate Logo
            </Button>
          </div>

          <Field label="Name">
            <Input value={profile.name} onChange={(e) => updateProfile({ name: e.target.value })} />
          </Field>
          <Field label="Business Name" hint="Leave blank if you operate under your own name">
            <Input value={profile.businessName ?? ''} onChange={(e) => updateProfile({ businessName: e.target.value || null })} />
          </Field>
          <Field label="Title">
            <Input value={profile.title} onChange={(e) => updateProfile({ title: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-[var(--spacing-sm)]">
            <Field label="Email">
              <Input type="email" value={profile.email} onChange={(e) => updateProfile({ email: e.target.value })} />
            </Field>
            <Field label="Phone">
              <Input value={profile.phone} onChange={(e) => updateProfile({ phone: e.target.value })} />
            </Field>
          </div>
          <Field label="Location">
            <Input value={profile.location} onChange={(e) => updateProfile({ location: e.target.value })} />
          </Field>
          <div className="grid grid-cols-3 gap-[var(--spacing-sm)]">
            <Field label="Portfolio">
              <Input value={profile.portfolioUrl} onChange={(e) => updateProfile({ portfolioUrl: e.target.value })} />
            </Field>
            <Field label="GitHub">
              <Input value={profile.githubUrl} onChange={(e) => updateProfile({ githubUrl: e.target.value })} />
            </Field>
            <Field label="LinkedIn">
              <Input value={profile.linkedinUrl} onChange={(e) => updateProfile({ linkedinUrl: e.target.value })} />
            </Field>
          </div>
          <Field label="Bio">
            <Textarea value={profile.bio} onChange={(e) => updateProfile({ bio: e.target.value })} rows={3} />
          </Field>
          <Field label="Skills" hint="Comma-separated">
            <Input
              value={profile.skills.join(', ')}
              onChange={(e) => updateProfile({ skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
            />
          </Field>
        </Card>

        <div className="space-y-[var(--spacing-lg)]">
          <Card className="p-[var(--spacing-lg)] space-y-[var(--spacing-md)]">
            <h2 className="text-[var(--text-sm)] font-semibold text-[var(--color-text)]">Pricing Defaults</h2>
            <div className="grid grid-cols-2 gap-[var(--spacing-sm)]">
              <Field label="Currency">
                <Input value={profile.currency} onChange={(e) => updateProfile({ currency: e.target.value.toUpperCase() })} />
              </Field>
              <Field label="Hourly Rate">
                <Input type="number" step="0.01" value={profile.hourlyRate} onChange={(e) => updateProfile({ hourlyRate: Number(e.target.value) })} />
              </Field>
            </div>
            <Field label="Default Pricing Mode">
              <select
                value={profile.defaultPricingMode}
                onChange={(e) => updateProfile({ defaultPricingMode: e.target.value as 'HOURLY' | 'FIXED' })}
                className="w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-[var(--text-sm)]"
              >
                <option value="HOURLY">Hourly</option>
                <option value="FIXED">Fixed project price</option>
              </select>
            </Field>
          </Card>

          <Card className="p-[var(--spacing-lg)] space-y-[var(--spacing-sm)]">
            <h2 className="text-[var(--text-sm)] font-semibold text-[var(--color-text)]">Proposal Numbering</h2>
            <div className="grid grid-cols-2 gap-[var(--spacing-sm)]">
              <Field label="Prefix">
                <Input value={proposalNumberPrefix} onChange={(e) => setState({ proposalNumberPrefix: e.target.value })} />
              </Field>
              <Field label="Next Number">
                <Input
                  type="number"
                  value={nextProposalNumber}
                  onChange={(e) => setState({ nextProposalNumber: Number(e.target.value) })}
                />
              </Field>
            </div>
            <p className="text-[var(--text-xs)] text-[var(--color-text-subtle)]">
              Next proposal will be numbered {proposalNumberPrefix}
              {nextProposalNumber}.
            </p>
          </Card>
        </div>
      </div>

      <Card className="p-[var(--spacing-lg)] mt-[var(--spacing-lg)]">
        <h2 className="text-[var(--text-sm)] font-semibold text-[var(--color-text)] mb-[var(--spacing-2xs)]">Terms Library</h2>
        <p className="text-[var(--text-xs)] text-[var(--color-text-subtle)] mb-[var(--spacing-md)]">{LEGAL_REVIEW_NOTE}</p>
        <div className="grid md:grid-cols-2 gap-[var(--spacing-md)]">
          {terms.map((term) => (
            <Field key={term.key} label={term.title}>
              <Textarea value={term.contentMd} onChange={(e) => updateTerm(term.key, e.target.value)} rows={4} />
            </Field>
          ))}
        </div>
      </Card>

      {savedFlash && <p className="text-[var(--text-xs)] text-[var(--color-success)] mt-[var(--spacing-sm)]">Saved</p>}
    </div>
  )
}
