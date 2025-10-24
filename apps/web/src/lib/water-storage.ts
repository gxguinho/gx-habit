import { getDB } from "./db";
import { DB_STORES } from "@/types/storage";
import {
	validateAmount,
	validateGoal,
	validateQuickAdds,
	validateWaterEntry,
} from "./validators";
import type {
	DailyGoal,
	QuickAddSettings,
	Result,
	StorageAdapter,
	WaterEntry,
	WaterEntryFilters,
} from "@/types";

// Default values
const DEFAULT_GOAL: DailyGoal = {
	id: "daily-goal",
	goalMl: 2500,
	updatedAt: Date.now(),
};

const DEFAULT_QUICK_ADDS: QuickAddSettings = {
	id: "quick-adds",
	values: [250, 500, 1000],
	updatedAt: Date.now(),
};

export const waterStorage: StorageAdapter = {
	// --- Entries ---
	async addEntry(entry: WaterEntry): Promise<Result<WaterEntry>> {
		// Validar entry completa
		const validation = validateWaterEntry(entry);
		if (!validation.success) {
			return validation;
		}

		try {
			const db = await getDB();
			await db.add(DB_STORES.ENTRIES, validation.data);
			return { success: true, data: validation.data };
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Failed to add entry",
			};
		}
	},

	async getEntries(
		filters?: WaterEntryFilters,
	): Promise<Result<WaterEntry[]>> {
		try {
			const db = await getDB();
			let entries = await db.getAll(DB_STORES.ENTRIES);

			// Aplicar filtros
			if (filters?.startDate) {
				entries = entries.filter((e) => e.timestamp >= filters.startDate!);
			}
			if (filters?.endDate) {
				entries = entries.filter((e) => e.timestamp <= filters.endDate!);
			}

			// Ordenar por timestamp DESC (mais recente primeiro)
			entries.sort((a, b) => b.timestamp - a.timestamp);

			// Paginação
			if (
				filters?.offset !== undefined ||
				filters?.limit !== undefined
			) {
				const start = filters.offset ?? 0;
				const end = filters.limit ? start + filters.limit : undefined;
				entries = entries.slice(start, end);
			}

			return { success: true, data: entries };
		} catch (error) {
			return {
				success: false,
				error:
					error instanceof Error ? error.message : "Failed to get entries",
			};
		}
	},

	async updateEntry(id: string, amount: number): Promise<Result<WaterEntry>> {
		// Validar amount
		const amountValidation = validateAmount(amount);
		if (!amountValidation.success) {
			return amountValidation;
		}

		try {
			const db = await getDB();
			const entry = await db.get(DB_STORES.ENTRIES, id);

			if (!entry) {
				return { success: false, error: "Entry not found" };
			}

			const updatedEntry: WaterEntry = {
				...entry,
				amount: amountValidation.data,
				updatedAt: Date.now(),
			};

			await db.put(DB_STORES.ENTRIES, updatedEntry);
			return { success: true, data: updatedEntry };
		} catch (error) {
			return {
				success: false,
				error:
					error instanceof Error ? error.message : "Failed to update entry",
			};
		}
	},

	async deleteEntry(id: string): Promise<Result<void>> {
		try {
			const db = await getDB();
			await db.delete(DB_STORES.ENTRIES, id);
			return { success: true, data: undefined };
		} catch (error) {
			return {
				success: false,
				error:
					error instanceof Error ? error.message : "Failed to delete entry",
			};
		}
	},

	// --- Settings ---
	async getGoal(): Promise<Result<DailyGoal>> {
		try {
			const db = await getDB();
			const goal = await db.get(DB_STORES.SETTINGS, "daily-goal");
			return { success: true, data: goal ?? DEFAULT_GOAL };
		} catch (error) {
			return { success: false, error: "Failed to get goal" };
		}
	},

	async setGoal(goalMl: number): Promise<Result<DailyGoal>> {
		// Validar goal
		const validation = validateGoal(goalMl);
		if (!validation.success) {
			return validation;
		}

		try {
			const db = await getDB();
			const goal: DailyGoal = {
				id: "daily-goal",
				goalMl: validation.data,
				updatedAt: Date.now(),
			};
			await db.put(DB_STORES.SETTINGS, goal);
			return { success: true, data: goal };
		} catch (error) {
			return { success: false, error: "Failed to set goal" };
		}
	},

	async getQuickAdds(): Promise<Result<QuickAddSettings>> {
		try {
			const db = await getDB();
			const quickAdds = await db.get(DB_STORES.SETTINGS, "quick-adds");
			return { success: true, data: quickAdds ?? DEFAULT_QUICK_ADDS };
		} catch (error) {
			return { success: false, error: "Failed to get quick adds" };
		}
	},

	async setQuickAdds(values: number[]): Promise<Result<QuickAddSettings>> {
		// Validar quickAdds
		const validation = validateQuickAdds(values);
		if (!validation.success) {
			return validation;
		}

		try {
			const db = await getDB();
			const quickAdds: QuickAddSettings = {
				id: "quick-adds",
				values: validation.data,
				updatedAt: Date.now(),
			};
			await db.put(DB_STORES.SETTINGS, quickAdds);
			return { success: true, data: quickAdds };
		} catch (error) {
			return { success: false, error: "Failed to set quick adds" };
		}
	},

	// --- Utility ---
	async clearAll(): Promise<Result<void>> {
		try {
			const db = await getDB();
			await db.clear(DB_STORES.ENTRIES);
			await db.clear(DB_STORES.SETTINGS);
			return { success: true, data: undefined };
		} catch (error) {
			return { success: false, error: "Failed to clear storage" };
		}
	},
};
