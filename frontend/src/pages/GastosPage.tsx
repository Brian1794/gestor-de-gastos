import { useState, useEffect, useCallback } from 'react'
import {
  getGastos, createGasto, updateGasto, deleteGasto, getTotalGastos,
  getCategorias,
  type Gasto, type Categoria, type GastoPayload
} from '../services/api'
import GastoForm from '../components/GastoForm'

type SortField = 'fecha_gasto' | 'monto' | 'descripcion' | 'categoria__nombre'

export default function GastosPage() {
  const [gastos, setGastos] = useState<Gasto[]>([])
  const [total, setTotal] = useState('0')
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [sortField, setSortField] = useState<SortField>('fecha_gasto')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [showForm, setShowForm] = useState(false)
  const [editingGasto, setEditingGasto] = useState<Gasto | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchGastos = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string | number> = {
        page,
        ordering: `${sortDir === 'desc' ? '-' : ''}${sortField}`,
      }
      if (search) params.search = search
      if (filterCat) params.categoria = filterCat

      const [gastosRes, totalRes] = await Promise.all([
        getGastos(params),
        getTotalGastos(),
      ])
      setGastos(gastosRes.data.results)
      setCount(gastosRes.data.count)
      setTotalPages(Math.ceil(gastosRes.data.count / 10))
      setTotal(totalRes.data.total || '0')
    } finally {
      setLoading(false)
    }
  }, [page, sortField, sortDir, search, filterCat])

  useEffect(() => { fetchGastos() }, [fetchGastos])
  useEffect(() => { getCategorias().then(r => setCategorias(r.data.results)) }, [])

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
    setPage(1)
  }

  const handleCreate = async (data: GastoPayload) => {
    await createGasto(data)
    setShowForm(false)
    setPage(1)
    fetchGastos()
  }

  const handleUpdate = async (data: GastoPayload) => {
    if (!editingGasto) return
    await updateGasto(editingGasto.id, data)
    setEditingGasto(null)
    fetchGastos()
  }

  const handleDelete = async (id: number) => {
    await deleteGasto(id)
    setDeleteId(null)
    fetchGastos()
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="text-gray-600 ml-1">↕</span>
    return <span className="text-indigo-400 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  const formatMonto = (m: string) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(parseFloat(m))

  const formatFecha = (f: string) =>
    new Date(f).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })

  return (
    <div className="min-h-screen bg-[#080a0f] text-white font-mono">
      {/* Header */}
      <div className="border-b border-[#1e2130] bg-[#0a0c14]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              💸 <span className="text-indigo-400">Gestor</span> de Gastos
            </h1>
            <p className="text-gray-500 text-xs mt-0.5">{count} registros encontrados</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-indigo-900/30"
          >
            + Nuevo Gasto
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-5">
        {/* Total Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1 bg-gradient-to-br from-indigo-900/40 to-purple-900/20 border border-indigo-500/20 rounded-2xl p-5">
            <p className="text-xs text-indigo-300 uppercase tracking-widest mb-1">Total Gastos</p>
            <p className="text-3xl font-bold text-white">{formatMonto(total)}</p>
          </div>
          {/* Filters */}
          <div className="md:col-span-2 bg-[#0f1117] border border-[#1e2130] rounded-2xl p-5 flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">Buscar</label>
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                placeholder="Buscar descripción..."
                className="w-full bg-[#1a1d2e] border border-[#2a2d3a] rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">Categoría</label>
              <select
                aria-label="Filtrar por categoría"
                value={filterCat}
                onChange={e => { setFilterCat(e.target.value); setPage(1) }}
                className="w-full bg-[#1a1d2e] border border-[#2a2d3a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition text-sm"
              >
                <option value="">Todas</option>
                {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            {(search || filterCat) && (
              <button
                onClick={() => { setSearch(''); setFilterCat(''); setPage(1) }}
                className="px-4 py-2 border border-[#2a2d3a] text-gray-400 hover:text-white rounded-lg text-sm transition"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#0f1117] border border-[#1e2130] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e2130] bg-[#0a0c14]">
                  {[
                    { label: 'Descripción', field: 'descripcion' as SortField },
                    { label: 'Monto', field: 'monto' as SortField },
                    { label: 'Fecha y Hora', field: 'fecha_gasto' as SortField },
                    { label: 'Categoría', field: 'categoria__nombre' as SortField },
                  ].map(col => (
                    <th
                      key={col.field}
                      onClick={() => handleSort(col.field)}
                      className="px-5 py-3.5 text-left text-xs uppercase tracking-widest text-gray-500 cursor-pointer hover:text-indigo-400 transition select-none"
                    >
                      {col.label}<SortIcon field={col.field} />
                    </th>
                  ))}
                  <th className="px-5 py-3.5 text-right text-xs uppercase tracking-widest text-gray-500">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-gray-600">
                      <div className="inline-block w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2" />
                      <p>Cargando...</p>
                    </td>
                  </tr>
                ) : gastos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-gray-600">
                      No hay gastos registrados
                    </td>
                  </tr>
                ) : (
                  gastos.map((g, i) => (
                    <tr
                      key={g.id}
                      className={`border-b border-[#1a1d2a] hover:bg-[#1a1d2e] transition ${i % 2 === 0 ? '' : 'bg-[#0d0f19]'}`}
                    >
                      <td className="px-5 py-4 text-white">{g.descripcion}</td>
                      <td className="px-5 py-4 text-emerald-400 font-semibold">{formatMonto(g.monto)}</td>
                      <td className="px-5 py-4 text-gray-400">{g.fecha_gasto ? formatFecha(g.fecha_gasto) : '—'}</td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 bg-indigo-900/30 border border-indigo-500/20 text-indigo-300 rounded-full text-xs">
                          {g.categoria_nombre}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right space-x-2">
                        <button
                          onClick={() => setEditingGasto(g)}
                          className="px-3 py-1.5 text-xs border border-[#2a2d3a] text-gray-400 hover:text-white hover:border-indigo-500 rounded-lg transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setDeleteId(g.id)}
                          className="px-3 py-1.5 text-xs border border-[#2a2d3a] text-gray-400 hover:text-red-400 hover:border-red-500/50 rounded-lg transition"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-5 py-4 border-t border-[#1e2130] flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Página {page} de {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1.5 text-xs border border-[#2a2d3a] text-gray-400 hover:text-white disabled:opacity-30 rounded-lg transition"
                >
                  ← Anterior
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1.5 text-xs border border-[#2a2d3a] text-gray-400 hover:text-white disabled:opacity-30 rounded-lg transition"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Crear */}
      {showForm && (
        <GastoForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Modal Editar */}
      {editingGasto && (
        <GastoForm
          onSubmit={handleUpdate}
          onCancel={() => setEditingGasto(null)}
          initialData={{
            id: editingGasto.id,
            descripcion: editingGasto.descripcion,
            monto: parseFloat(editingGasto.monto),
            fecha_gasto: editingGasto.fecha_gasto,
            categoria: editingGasto.categoria,
          }}
        />
      )}

      {/* Modal Confirmar Eliminar */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f1117] border border-[#2a2d3a] rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
            <p className="text-4xl mb-4">🗑️</p>
            <h3 className="text-lg font-bold text-white mb-2">¿Eliminar gasto?</h3>
            <p className="text-gray-500 text-sm mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 border border-[#2a2d3a] text-gray-400 hover:text-white rounded-lg transition text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg transition text-sm font-semibold"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}