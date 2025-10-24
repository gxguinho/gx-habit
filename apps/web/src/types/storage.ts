import type {
	DailyGoal,
	QuickAddSettings,
	Result,
	WaterEntry,
	WaterEntryFilters,
} from "./water";

/**
 * Schema do IndexedDB
 */
export interface WaterTrackerDB {
	entries: WaterEntry;
	settings: DailyGoal | QuickAddSettings;
}

/**
 * Nomes dos object stores
 */
export const DB_STORES = {
	ENTRIES: "entries",
	SETTINGS: "settings",
} as const;

/**
 * Nome do database
 */
export const DB_NAME = "gx-habit-water-tracker";
export const DB_VERSION = 1;

/**
 * Storage adapter interface (para permitir swap entre IndexedDB/LocalStorage)
 */
export interface StorageAdapter {
	// Entries
	addEntry(entry: WaterEntry): Promise<Result<WaterEntry>>;
	getEntries(filters?: WaterEntryFilters): Promise<Result<WaterEntry[]>>;
	updateEntry(id: string, amount: number): Promise<Result<WaterEntry>>;
	deleteEntry(id: string): Promise<Result<void>>;

	// Settings
	getGoal(): Promise<Result<DailyGoal>>;
	setGoal(goalMl: number): Promise<Result<DailyGoal>>;

	getQuickAdds(): Promise<Result<QuickAddSettings>>;
	setQuickAdds(values: number[]): Promise<Result<QuickAddSettings>>;

	// Utility
	clearAll(): Promise<Result<void>>;
}
