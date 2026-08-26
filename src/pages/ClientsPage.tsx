import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PageHeader } from '@/components/PageHeader'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { EmptyState } from '@/components/EmptyState'
import { Field, Input, Textarea } from '@/components/FormField'
import { useClientsStore } from '@/stores/clientsStore'
import { clientSchema, type ClientFormValues } from '@/schemas/client'

function AddClientForm({ onDone }: { onDone: () => void }) {
  const addClient = useClientsStore((s) => s.addClient)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormValues>({ resolver: zodResolver(clientSchema) })

  const onSubmit = (values: ClientFormValues) => {
    addClient({
      name: values.name,
      company: values.company || null,
      email: values.email || null,
      phone: values.phone || null,
      address: values.address || null,
      notes: values.notes || null,
    })
    onDone()
  }

  return (
    <Card className="p-[var(--spacing-lg)] mb-[var(--spacing-lg)]">
      <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-[var(--spacing-md)]">
        <Field label="Name" error={errors.name?.message}>
          <Input {...register('name')} autoFocus />
        </Field>
        <Field label="Company">
          <Input {...register('company')} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <Input type="email" {...register('email')} />
        </Field>
        <Field label="Phone">
          <Input {...register('phone')} />
        </Field>
        <Field label="Address" hint="Optional">
          <Input {...register('address')} />
        </Field>
        <Field label="Notes" hint="Optional">
          <Textarea {...register('notes')} rows={2} />
        </Field>
        <div className="sm:col-span-2 flex justify-end gap-[var(--spacing-xs)]">
          <Button type="button" variant="ghost" onClick={onDone}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            Add Client
          </Button>
        </div>
      </form>
    </Card>
  )
}

export function ClientsPage() {
  const clients = useClientsStore((s) => s.clients)
  const [showForm, setShowForm] = useState(false)

  return (
    <div>
      <PageHeader
        title="Clients"
        description="Everyone you've sent or plan to send a proposal to."
        actions={
          !showForm && (
            <Button variant="primary" onClick={() => setShowForm(true)}>
              Add Client
            </Button>
          )
        }
      />

      {showForm && <AddClientForm onDone={() => setShowForm(false)} />}

      {clients.length === 0 && !showForm ? (
        <Card>
          <EmptyState
            title="No clients yet"
            description="Add your first client to start building a project and proposal for them."
            action={
              <Button variant="primary" onClick={() => setShowForm(true)}>
                Add Client
              </Button>
            }
          />
        </Card>
      ) : (
        <Card>
          <ul className="divide-y divide-[var(--color-border)]">
            {clients.map((client) => (
              <li key={client.id}>
                <Link
                  to={`/clients/${client.id}`}
                  className="flex items-center justify-between gap-[var(--spacing-md)] px-[var(--spacing-lg)] py-[var(--spacing-sm)] hover:bg-[var(--color-background)] transition-colors duration-[var(--duration-fast)]"
                >
                  <div className="min-w-0">
                    <p className="text-[var(--text-sm)] font-medium text-[var(--color-text)]">{client.name}</p>
                    <p className="text-[var(--text-xs)] text-[var(--color-text-muted)] truncate">
                      {client.company || client.email || 'No company on file'}
                    </p>
                  </div>
                  {client.email && <span className="text-[var(--text-sm)] text-[var(--color-text-muted)] shrink-0">{client.email}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
