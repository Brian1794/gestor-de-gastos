import { useState, useEffect } from 'react'
import { getCategorias, createCategoria, type Categoria, type GastoPayload } from '../services/api'

interface Props {
  onSubmit: (data: GastoPayload) => void
  initialData?: GastoPayload & { id?: number }
  onCancel: () => void
}

export default function GastoForm({ onSubmit, initialData, onCancel }: Props) {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [descripcion, setDescripcion] = useState(initialData?.descripcion || '')
  const [monto, setMonto] = useState(initialData?.monto?.toString() || '')
  const [fechaGasto, setFechaGasto] = useState(
    initialData?.fecha_gasto ? initialData.fecha_gasto.slice(0, 16) : ''
  )
  const [categoriaId, setCategoriaId] = useState<number | ''>(initialData?.categoria || '')
  const [nuevaCategoria, setNuevaCategoria] = useState('')
  const [showNuevaCat, setShowNuevaCat] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getCategorias().then(r => setCategorias(r.data.results))
  }, [])

  const handleAddCategoria = async () => {
    if (!nuevaCategoria.trim()) return
    try {
      const res = await createCategoria(nuevaCategoria.trim())
      setCategorias(prev => [...prev, res.data])
      setCategoriaId(res.data.id)
      setNuevaCategoria('')
      setShowNuevaCat(false)
    } catch {
      setError('Error al crear categoría')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!descripcion.trim()) return setError('La descripción es obligatoria')
    if (!monto || parseFloat(monto) <= 0) return setError('El monto debe ser mayor que cero')
    if (!fechaGasto) return setError('La fecha es obligatoria')
    if (!categoriaId) return setError('Selecciona una categoría')
    setLoading(true)
    try {
      await onSubmit({
        descripcion: descripcion.trim(),
        monto: parseFloat(monto),
        fecha_gasto: new Date(fechaGasto).toISOString(),
        categoria: categoriaId as number,
      })
    } catch (err: any) {
      setError(err?.response?.data?.non_field_errors?.[0] || 'Error al guardar el gasto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0f1117] border border-[#2a2d3a] rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-6 font-mono tracking-tight">
          {initialData?.id ? '✏️ Editar Gasto' : '➕ Nuevo Gasto'}
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1 font-mono uppercase tracking-wider">Descripción</label>
            <input
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              placeholder="Ej: Almuerzo restaurante"
              className="w-full bg-[#1a1d2e] border border-[#2a2d3a] rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1 font-mono uppercase tracking-wider">Monto</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={monto}
              onChange={e => setMonto(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[#1a1d2e] border border-[#2a2d3a] rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1 font-mono uppercase tracking-wider">Fecha y Hora</label>
            <input
              type="datetime-local"
              value={fechaGasto}
              onChange={e => setFechaGasto(e.target.value)}
              placeholder="Seleccionar fecha y hora"
              className="w-full bg-[#1a1d2e] border border-[#2a2d3a] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition text-sm"
            />
          </div>

          <div>
            <label htmlFor="categoria" className="block text-xs text-gray-400 mb-1 font-mono uppercase tracking-wider">Categoría</label>
            <select
              id="categoria"
              value={categoriaId}
              onChange={e => setCategoriaId(Number(e.target.value))}
              className="w-full bg-[#1a1d2e] border border-[#2a2d3a] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition text-sm"
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowNuevaCat(!showNuevaCat)}
              className="mt-1 text-xs text-indigo-400 hover:text-indigo-300 transition"
            >
              + Crear nueva categoría
            </button>
            {showNuevaCat && (
              <div className="flex gap-2 mt-2">
                <input
                  value={nuevaCategoria}
                  onChange={e => setNuevaCategoria(e.target.value)}
                  placeholder="Nombre de categoría"
                  className="flex-1 bg-[#1a1d2e] border border-[#2a2d3a] rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddCategoria}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm transition"
                >
                  Agregar
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 border border-[#2a2d3a] text-gray-400 hover:text-white hover:border-gray-500 rounded-lg transition text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg transition text-sm font-semibold"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}