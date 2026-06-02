import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-screen gap-4">
      <h3 className="text-2xl font-bold">Welcome to TanStack Auth Starter</h3>
      <Button>Shadcn Button Works!</Button>
    </div>
  )
}
