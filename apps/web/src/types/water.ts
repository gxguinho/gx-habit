/**
 * Representa um registro individual de consumo de água
 */
export interface WaterEntry {
  id: string; // UUID v4
  amount: number; // Quantidade em ml
  timestamp: number; // Unix timestamp (Date.now())
  userId?: string; // Opcional, para sincronização futura
  synced?: boolean; // Flag de sincronização com backend
  createdAt: number; // Timestamp de criação
  updatedAt?: number; // Timestamp de última atualização
}

/**
 * Meta diária de consumo de água
 */
export interface DailyGoal {
  id: string; // 'daily-goal' (singleton)
  goalMl: number; // Meta em ml (default: 2500)
  userId?: string; // Opcional
  updatedAt: number; // Timestamp de última atualização
}

/**
 * Configurações de quick adds
 */
export interface QuickAddSettings {
  id: string; // 'quick-adds' (singleton)
  values: number[]; // Array de valores em ml [250, 500, 1000]
  userId?: string;
  updatedAt: number;
}

/**
 * Estatísticas agregadas (calculadas, não persistidas)
 */
export interface DailyStats {
  date: string; // ISO date string 'YYYY-MM-DD'
  totalMl: number; // Total consumido no dia
  goalMl: number; // Meta do dia
  percentage: number; // (totalMl / goalMl) * 100
  entriesCount: number; // Número de lançamentos
  goalAchieved: boolean; // totalMl >= goalMl
}

/**
 * Filtros para buscar entries
 */
export interface WaterEntryFilters {
  startDate?: number; // Timestamp início
  endDate?: number; // Timestamp fim
  limit?: number; // Limitar resultados
  offset?: number; // Paginação
}

/**
 * Resultado de operações CRUD
 */
export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };
