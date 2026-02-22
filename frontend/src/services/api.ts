import axios from 'axios'

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: { 'Content-Type': 'application/json' },
})

export interface Categoria {
  id: number
  nombre: string
  fecha_creacion: string
}

export interface Gasto {
  id: number
  descripcion: string
  monto: string
  fecha_gasto: string
  categoria: number
  categoria_nombre: string
  fecha_creacion: string
  fecha_actualizacion: string
}

export interface CategoriasResponse {
  count: number
  next: string | null
  previous: string | null
  results: Categoria[]
}

export interface GastosResponse {
  count: number
  next: string | null
  previous: string | null
  results: Gasto[]
}

export interface GastoPayload {
  descripcion: string
  monto: number
  fecha_gasto: string
  categoria: number
}

// Categorias
export const getCategorias = () => API.get<CategoriasResponse>('/categorias/')
export const createCategoria = (nombre: string) => API.post<Categoria>('/categorias/', { nombre })

// Gastos
export const getGastos = (params?: Record<string, string | number>) =>
  API.get<GastosResponse>('/gastos/', { params })
export const createGasto = (data: GastoPayload) => API.post<Gasto>('/gastos/', data)
export const updateGasto = (id: number, data: GastoPayload) => API.put<Gasto>(`/gastos/${id}/`, data)
export const deleteGasto = (id: number) => API.delete(`/gastos/${id}/`)
export const getTotalGastos = () => API.get<{ total: string }>('/gastos/total/')