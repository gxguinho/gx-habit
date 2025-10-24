import { useState } from "react";
import { toast } from "sonner";
import { useWaterTracker } from "@/hooks/use-water-tracker";
import { ProgressRing } from "./progress-ring";
import { QuickAddButtons } from "./quick-add-buttons";
import { WaterEntryList } from "./water-entry-list";
import { GoalSettingsDialog } from "./goal-settings-dialog";
import { EntryEditDialog } from "./entry-edit-dialog";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import type { WaterEntry } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export function WaterTracker() {
	const {
		entries,
		goal,
		quickAdds,
		stats,
		isLoading,
		addEntry,
		updateEntry,
		deleteEntry,
		updateGoal,
	} = useWaterTracker();

	const [goalDialogOpen, setGoalDialogOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [entryToEdit, setEntryToEdit] = useState<WaterEntry | null>(null);

	const handleAddEntry = async (amount: number) => {
		try {
			await addEntry(amount);
			toast.success(`Added ${amount}ml`, {
				description: `Total: ${stats.totalMl + amount}ml (${Math.min(((stats.totalMl + amount) / stats.goalMl) * 100, 100).toFixed(0)}%)`,
			});
		} catch (error) {
			toast.error("Failed to add water", {
				description:
					error instanceof Error ? error.message : "Please try again",
			});
		}
	};

	const handleEditEntry = (id: string) => {
		const entry = entries.find((e) => e.id === id);
		if (entry) {
			setEntryToEdit(entry);
			setEditDialogOpen(true);
		}
	};

	const handleSaveEntry = async (id: string, newAmount: number) => {
		try {
			await updateEntry(id, newAmount);
			toast.success("Entry updated");
		} catch (error) {
			toast.error("Failed to update entry", {
				description:
					error instanceof Error ? error.message : "Please try again",
			});
		}
	};

	const handleDeleteEntry = async (id: string) => {
		try {
			await deleteEntry(id);
			toast.success("Entry deleted");
		} catch (error) {
			toast.error("Failed to delete entry", {
				description:
					error instanceof Error ? error.message : "Please try again",
			});
		}
	};

	const handleUpdateGoal = async (newGoal: number) => {
		try {
			await updateGoal(newGoal);
			toast.success("Goal updated", {
				description: `New daily goal: ${newGoal}ml`,
			});
		} catch (error) {
			toast.error("Failed to update goal", {
				description:
					error instanceof Error ? error.message : "Please try again",
			});
		}
	};

	if (isLoading) {
		return (
			<div className="container max-w-2xl mx-auto p-4 space-y-6">
				<div className="flex items-center justify-center">
					<Skeleton className="w-[200px] h-[200px] rounded-full" />
				</div>
				<Skeleton className="h-32 w-full" />
				<Skeleton className="h-64 w-full" />
			</div>
		);
	}

	return (
		<main
			role="main"
			className="container max-w-2xl mx-auto p-4 space-y-6"
		>
			<h1 className="sr-only">Water Intake Tracker</h1>

			{/* Header com botão de settings */}
			<div className="flex justify-end">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => setGoalDialogOpen(true)}
					aria-label="Open settings"
				>
					<Settings className="h-5 w-5" />
				</Button>
			</div>

			{/* Progress Ring */}
			<div className="flex justify-center">
				<ProgressRing current={stats.totalMl} goal={stats.goalMl} />
			</div>

			{/* Stats Summary */}
			<div
				className="text-center space-y-1"
				role="status"
				aria-live="polite"
			>
				<p className="text-2xl font-bold">
					{stats.totalMl}ml / {stats.goalMl}ml
				</p>
				<p className="text-muted-foreground">
					{stats.goalAchieved
						? "🎉 Goal achieved!"
						: `${(stats.goalMl - stats.totalMl).toFixed(0)}ml to go`}
				</p>
			</div>

			{/* Quick Add Buttons */}
			<QuickAddButtons onAdd={handleAddEntry} quickAdds={quickAdds} />

			{/* Entry List */}
			<WaterEntryList
				entries={entries}
				onEdit={handleEditEntry}
				onDelete={handleDeleteEntry}
			/>

			{/* Dialogs */}
			<GoalSettingsDialog
				open={goalDialogOpen}
				onOpenChange={setGoalDialogOpen}
				currentGoal={goal.goalMl}
				onSave={handleUpdateGoal}
			/>

			<EntryEditDialog
				open={editDialogOpen}
				onOpenChange={setEditDialogOpen}
				entry={entryToEdit}
				onSave={handleSaveEntry}
				onDelete={handleDeleteEntry}
			/>
		</main>
	);
}
