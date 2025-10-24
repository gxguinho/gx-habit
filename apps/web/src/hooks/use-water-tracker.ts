import { useCallback, useEffect, useState } from "react";
import { startOfDay, endOfDay } from "date-fns";
import { waterStorage } from "@/lib/water-storage";
import { DEFAULTS } from "@/lib/constants";
import type { WaterEntry, DailyGoal } from "@/types";

export function useWaterTracker() {
	const [entries, setEntries] = useState<WaterEntry[]>([]);
	const [goal, setGoal] = useState<DailyGoal>({
		id: "daily-goal",
		goalMl: DEFAULTS.DAILY_GOAL_ML,
		updatedAt: Date.now(),
	});
	const [isLoading, setIsLoading] = useState(true);
	const [quickAdds, setQuickAdds] = useState<number[]>(
		DEFAULTS.QUICK_ADDS_ML,
	);

	// Carregar dados iniciais
	useEffect(() => {
		const loadData = async () => {
			setIsLoading(true);

			// Carregar entries do dia atual
			const today = new Date();
			const startTimestamp = startOfDay(today).getTime();
			const endTimestamp = endOfDay(today).getTime();

			const entriesResult = await waterStorage.getEntries({
				startDate: startTimestamp,
				endDate: endTimestamp,
			});

			if (entriesResult.success) {
				setEntries(entriesResult.data);
			}

			// Carregar meta diária
			const goalResult = await waterStorage.getGoal();
			if (goalResult.success) {
				setGoal(goalResult.data);
			}

			// Carregar quick adds
			const quickAddsResult = await waterStorage.getQuickAdds();
			if (quickAddsResult.success) {
				setQuickAdds(quickAddsResult.data.values);
			}

			setIsLoading(false);
		};

		loadData();
	}, []);

	// Adicionar entry
	const addEntry = useCallback(
		async (amount: number) => {
			const newEntry: WaterEntry = {
				id: crypto.randomUUID(),
				amount,
				timestamp: Date.now(),
				createdAt: Date.now(),
			};

			// Optimistic update
			setEntries((prev) => [newEntry, ...prev]);

			const result = await waterStorage.addEntry(newEntry);

			if (!result.success) {
				// Rollback on error
				setEntries((prev) => prev.filter((e) => e.id !== newEntry.id));
				throw new Error(result.error);
			}

			return result.data;
		},
		[],
	);

	// Atualizar entry
	const updateEntry = useCallback(async (id: string, amount: number) => {
		// Optimistic update
		setEntries((prev) =>
			prev.map((e) =>
				e.id === id ? { ...e, amount, updatedAt: Date.now() } : e,
			),
		);

		const result = await waterStorage.updateEntry(id, amount);

		if (!result.success) {
			// Reload entries on error
			const entriesResult = await waterStorage.getEntries({
				startDate: startOfDay(new Date()).getTime(),
				endDate: endOfDay(new Date()).getTime(),
			});
			if (entriesResult.success) {
				setEntries(entriesResult.data);
			}
			throw new Error(result.error);
		}

		return result.data;
	}, []);

	// Deletar entry
	const deleteEntry = useCallback(async (id: string) => {
		// Optimistic update
		setEntries((prev) => prev.filter((e) => e.id !== id));

		const result = await waterStorage.deleteEntry(id);

		if (!result.success) {
			// Reload entries on error
			const entriesResult = await waterStorage.getEntries({
				startDate: startOfDay(new Date()).getTime(),
				endDate: endOfDay(new Date()).getTime(),
			});
			if (entriesResult.success) {
				setEntries(entriesResult.data);
			}
			throw new Error(result.error);
		}
	}, []);

	// Atualizar meta
	const updateGoal = useCallback(async (goalMl: number) => {
		// Optimistic update
		setGoal((prev) => ({ ...prev, goalMl, updatedAt: Date.now() }));

		const result = await waterStorage.setGoal(goalMl);

		if (!result.success) {
			// Reload goal on error
			const goalResult = await waterStorage.getGoal();
			if (goalResult.success) {
				setGoal(goalResult.data);
			}
			throw new Error(result.error);
		}

		return result.data;
	}, []);

	// Calcular estatísticas
	const stats = {
		totalMl: entries.reduce((sum, entry) => sum + entry.amount, 0),
		goalMl: goal.goalMl,
		percentage: Math.min(
			(entries.reduce((sum, entry) => sum + entry.amount, 0) /
				goal.goalMl) *
				100,
			100,
		),
		entriesCount: entries.length,
		goalAchieved:
			entries.reduce((sum, entry) => sum + entry.amount, 0) >= goal.goalMl,
	};

	return {
		entries,
		goal,
		quickAdds,
		stats,
		isLoading,
		addEntry,
		updateEntry,
		deleteEntry,
		updateGoal,
	};
}
