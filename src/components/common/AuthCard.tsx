import type { ReactNode } from 'react'

interface AuthCardProps {
  title: string
  subtitle?: string
  children: ReactNode
}

/** Tarjeta centrada para login y registro */
export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="w-full">
      <div className="rounded-sm border border-border bg-card p-8 shadow-lg">
        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl text-card-foreground">{title}</h1>
          {subtitle && <p className="font-ui mt-2 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}
