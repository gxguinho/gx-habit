import type { DBSchema, IDBPDatabase } from "idb";
import { openDB } from "idb";
import type { DailyGoal, QuickAddSettings, WaterEntry } from "@/types/water";
import { DB_NAME, DB_STORES, DB_VERSION } from "@/types/storage";

interface WaterTrackerDB extends DBSchema {
	[DB_STORES.ENTRIES]: {
		key: string;
		value: WaterEntry;
		indexes: {
			timestamp: number;
			userId: string;
		};
	};
	[DB_STORES.SETTINGS]: {
		key: string;
		value: DailyGoal | QuickAddSettings;
	};
}

let dbInstance: IDBPDatabase<WaterTrackerDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<WaterTrackerDB>> {
	if (dbInstance) {
		return dbInstance;
	}

	dbInstance = await openDB<WaterTrackerDB>(DB_NAME, DB_VERSION, {
		upgrade(db) {
			// Criar object store de entries
			if (!db.objectStoreNames.contains(DB_STORES.ENTRIES)) {
				const entryStore = db.createObjectStore(DB_STORES.ENTRIES, {
					keyPath: "id",
				});
				entryStore.createIndex("timestamp", "timestamp");
				entryStore.createIndex("userId", "userId");
			}

			// Criar object store de settings
			if (!db.objectStoreNames.contains(DB_STORES.SETTINGS)) {
				db.createObjectStore(DB_STORES.SETTINGS, { keyPath: "id" });
			}
		},
	});

	return dbInstance;
}

// Helper para fechar DB (cleanup)
export async function closeDB(): Promise<void> {
	if (dbInstance) {
		dbInstance.close();
		dbInstance = null;
	}
}
