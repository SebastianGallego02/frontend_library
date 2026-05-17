import type { InputHTMLAttributes } from 'react'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

/** Campo de formulario reutilizable */
export default function FormField({ label, error, id, className = '', ...props }: FormFieldProps) {
  const inputId = id ?? props.name

  return (
    <div className="space-y-1">
      <label htmlFor={inputId} className="font-ui block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={inputId}
        className={`font-ui w-full rounded-sm border border-border bg-background px-3 py-2 text-foreground shadow-sm transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-primary">{error}</p>}
    </div>
  )
}
