import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { VALIDATION } from "@/lib/constants";

interface GoalSettingsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	currentGoal: number;
	onSave: (newGoal: number) => Promise<void>;
}

export function GoalSettingsDialog({
	open,
	onOpenChange,
	currentGoal,
	onSave,
}: GoalSettingsDialogProps) {
	const [goal, setGoal] = useState(currentGoal);
	const [isSaving, setIsSaving] = useState(false);

	const handleSave = async () => {
		setIsSaving(true);
		try {
			await onSave(goal);
			onOpenChange(false);
		} catch (err) {
			console.error("Failed to save goal:", err);
		} finally {
			setIsSaving(false);
		}
	};

	const handleCancel = () => {
		setGoal(currentGoal); // Reset to current goal
		onOpenChange(false);
	};

	// Atualizar goal local quando currentGoal mudar
	useState(() => {
		setGoal(currentGoal);
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Set Daily Goal</DialogTitle>
					<DialogDescription>
						Adjust your daily water intake goal
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-6 py-4">
					<div className="text-center">
						<span className="text-5xl font-bold">{goal}ml</span>
					</div>
					<div className="space-y-4">
						<Slider
							min={VALIDATION.MIN_GOAL_ML}
							max={VALIDATION.MAX_GOAL_ML}
							step={VALIDATION.GOAL_STEP_ML}
							value={[goal]}
							onValueChange={(values) => setGoal(values[0])}
							aria-label="Daily water intake goal"
						/>
						<div className="flex justify-between text-xs text-muted-foreground">
							<span>{VALIDATION.MIN_GOAL_ML}ml</span>
							<span>{VALIDATION.MAX_GOAL_ML}ml</span>
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={handleCancel}
						disabled={isSaving}
					>
						Cancel
					</Button>
					<Button onClick={handleSave} disabled={isSaving}>
						{isSaving ? "Saving..." : "Save Goal"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
