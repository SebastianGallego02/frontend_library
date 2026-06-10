import { useState, useMemo } from 'react'
import { Search, CalendarClock, UserMinus, History, ShieldAlert } from 'lucide-react'
import type { Sanction } from '../types/Sanction'

// Mock Data que emula la respuesta del servidor C#
const INITIAL_MOCK_SANCTIONS: Sanction[] = [
  { id: 1, userId: '550e8400-e29b-41d4-a716-446655440000', userName: 'Sebastián García', startDate: '2024-03-01T10:00:00Z', endDate: '2024-04-01T10:00:00Z', isActive: true },
  { id: 2, userId: '6ba7b810-9dad-11d1-80b4-00c04fd430c8', userName: 'Ana Martínez', startDate: '2024-02-15T08:30:00Z', endDate: '2024-03-15T08:30:00Z', isActive: true },
  { id: 3, userId: 'ad6bd0c2-550a-4648-936d-1678127397b9', userName: 'Carlos Ruiz', startDate: '2023-12-01T12:00:00Z', endDate: '2024-01-01T12:00:00Z', isActive: false },
  { id: 4, userId: '550e8400-e29b-41d4-a716-446655440000', userName: 'Sebastián García', startDate: '2023-10-10T09:00:00Z', endDate: '2023-11-10T09:00:00Z', isActive: false },
  { id: 5, userId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', userName: 'Laura Torres', startDate: '2024-03-05T15:45:00Z', endDate: '2024-04-05T15:45:00Z', isActive: true },
]

export default function AdminSanctions() {
  // El estado de los datos simulados vive aquí
  const [sanctions, setSanctions] = useState<Sanction[]>(INITIAL_MOCK_SANCTIONS)
  const [activeTab, setActiveTab] = useState<'actives' | 'history'>('actives')
  const [searchQuery, setSearchQuery] = useState('')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Helper para formatear fechas a español humano
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  // Lógica de filtrado: Pestaña + Buscador por UserId
  const filteredSanctions = useMemo(() => {
    return sanctions.filter(s => {
      const matchesTab = activeTab === 'actives' ? s.isActive : !s.isActive
      const matchesSearch = s.userId.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesTab && matchesSearch
    })
  }, [sanctions, activeTab, searchQuery])

  // ACCIÓN: Remover Sanción (Simula actualizar IsActive a false y EndDate a hoy)
  const handleRemoveSanction = (id: number) => {
    setSanctions(prev => prev.map(s => 
      s.id === id 
        ? { ...s, isActive: false, endDate: new Date().toISOString() } 
        : s
    ))
    showFeedback('Sanción levantada correctamente.')
  }

  // ACCIÓN: Extender Sanción (Simula añadir 1 mes a la fecha actual de finalización)
  const handleExtendSanction = (id: number) => {
    setSanctions(prev => prev.map(s => {
      if (s.id === id) {
        const currentEnd = new Date(s.endDate)
        currentEnd.setMonth(currentEnd.getMonth() + 1)
        return { ...s, endDate: currentEnd.toISOString() }
      }
      return s
    }))
    showFeedback('Se ha extendido el periodo de la sanción por 30 días.')
  }

  const showFeedback = (msg: string) => {
    setSuccessMessage(msg)
    setTimeout(() => setSuccessMessage(null), 3000)
  }

  return (
    <section className="p-4 md:p-6 lg:p-8">
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <ShieldAlert className="h-8 w-8 text-primary" />
          <h1 className="font-display text-3xl tracking-wide text-foreground">Gestión de Sanciones</h1>
        </div>
        <p className="font-ui mt-2 text-sm text-muted-foreground">
          Administra las restricciones de usuarios por devoluciones tardías o comportamiento.
        </p>
      </header>

      {/* Feedback Visual */}
      {successMessage && (
        <div className="mb-4 animate-in fade-in slide-in-from-top-2 rounded-sm border border-green-300 bg-green-50 p-4 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {/* Filtros y Tabs */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('actives')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'actives' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Sanciones Activas
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'history' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Historial
          </button>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por User GUID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="font-ui w-full rounded-sm border border-border bg-card py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Tabla de Resultados */}
      <div className="overflow-x-auto rounded-sm border border-border bg-card shadow-sm">
        <table className="font-ui w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-border bg-sidebar">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">ID</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Usuario / GUID</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Inicio</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Fin (Vencimiento)</th>
              <th className="px-4 py-3 font-medium text-muted-foreground text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredSanctions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground italic">
                  No se encontraron sanciones en esta sección.
                </td>
              </tr>
            ) : (
              filteredSanctions.map((sanction) => (
                <tr key={sanction.id} className="border-b border-border last:border-b-0 hover:bg-sidebar/30 transition-colors">
                  <td className="px-4 py-4 text-muted-foreground font-mono">#{sanction.id}</td>
                  <td className="px-4 py-4">
                    <div className="font-medium text-foreground">{sanction.userName}</div>
                    <div className="text-[10px] font-mono text-muted-foreground uppercase">{sanction.userId}</div>
                  </td>
                  <td className="px-4 py-4 text-card-foreground">
                    {formatDate(sanction.startDate)}
                  </td>
                  <td className="px-4 py-4 font-medium text-card-foreground">
                    <div className="flex flex-col">
                      {formatDate(sanction.endDate)}
                      {sanction.isActive && (
                        <span className="text-[10px] text-orange-600 uppercase tracking-tighter">Sanción Vigente</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {sanction.isActive ? (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleExtendSanction(sanction.id)}
                          className="group flex items-center gap-1.5 rounded-sm border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
                          title="Extender 1 mes"
                        >
                          <CalendarClock className="h-3.5 w-3.5" />
                          Extender
                        </button>
                        <button
                          onClick={() => handleRemoveSanction(sanction.id)}
                          className="flex items-center gap-1.5 rounded-sm border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
                          title="Remover ahora"
                        >
                          <UserMinus className="h-3.5 w-3.5" />
                          Remover
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <span className="flex items-center gap-1 text-muted-foreground text-xs bg-muted/50 px-2 py-1 rounded-full">
                          <History className="h-3 w-3" />
                          Archivado
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Resumen Informativo */}
      <footer className="mt-6 flex gap-4 text-[11px] text-muted-foreground uppercase tracking-widest">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-orange-500"></span>
          Activas: {sanctions.filter(s => s.isActive).length}
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-muted-foreground"></span>
          Historial: {sanctions.filter(s => !s.isActive).length}
        </div>
      </footer>
    </section>
  )
}