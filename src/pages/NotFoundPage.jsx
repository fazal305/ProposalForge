import { Link } from 'react-router-dom'
import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/Button'
export function NotFoundPage() {
  return (
    <EmptyState
      title="Page not found"
      description="The page you're looking for doesn't exist or was moved."
      action={
        <Link to="/">
          <Button variant="primary">Back to dashboard</Button>
        </Link>
      }
    />
  )
}
