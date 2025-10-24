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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { WaterEntry } from "@/types";
import { VALIDATION } from "@/lib/constants";

interface EntryEditDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	entry: WaterEntry | null;
	onSave: (id: string, newAmount: number) => Promise<void>;
	onDelete: (id: string) => Promise<void>;
}

export function EntryEditDialog({
	open,
	onOpenChange,
	entry,
	onSave,
	onDelete,
}: EntryEditDialogProps) {
	const [amount, setAmount] = useState(entry?.amount.toString() ?? "");
	const [error, setError] = useState("");
	const [isSaving, setIsSaving] = useState(false);

	// Atualizar amount quando entry mudar
	useState(() => {
		setAmount(entry?.amount.toString() ?? "");
		setError("");
	});

	const handleSave = async () => {
		if (!entry) return;

		const newAmount = Number.parseInt(amount, 10);

		// Validação
		if (Number.isNaN(newAmount)) {
			setError("Please enter a valid number");
			return;
		}

		if (newAmount < VALIDATION.MIN_AMOUNT_ML) {
			setError(`Minimum amount is ${VALIDATION.MIN_AMOUNT_ML}ml`);
			return;
		}

		if (newAmount > VALIDATION.MAX_AMOUNT_ML) {
			setError(`Maximum amount is ${VALIDATION.MAX_AMOUNT_ML}ml`);
			return;
		}

		setIsSaving(true);
		try {
			await onSave(entry.id, newAmount);
			onOpenChange(false);
		} catch (err) {
			setError("Failed to update entry. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	const handleDelete = async () => {
		if (!entry) return;

		setIsSaving(true);
		try {
			await onDelete(entry.id);
			onOpenChange(false);
		} catch (err) {
			setError("Failed to delete entry. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Water Entry</DialogTitle>
					<DialogDescription>
						Modify the amount of water consumed
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="edit-amount">Amount (ml)</Label>
						<Input
							id="edit-amount"
							type="number"
							value={amount}
							onChange={(e) => {
								setAmount(e.target.value);
								setError("");
							}}
							min={VALIDATION.MIN_AMOUNT_ML}
							max={VALIDATION.MAX_AMOUNT_ML}
							aria-describedby={error ? "edit-amount-error" : undefined}
							autoFocus
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleSave();
								}
							}}
						/>
						{error && (
							<p
								id="edit-amount-error"
								className="text-sm text-destructive"
								role="alert"
							>
								{error}
							</p>
						)}
					</div>
				</div>
				<DialogFooter className="flex-col sm:flex-row gap-2">
					<Button
						variant="destructive"
						onClick={handleDelete}
						disabled={isSaving}
						className="sm:mr-auto"
					>
						Delete Entry
					</Button>
					<div className="flex gap-2 w-full sm:w-auto">
						<Button
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isSaving}
							className="flex-1 sm:flex-none"
						>
							Cancel
						</Button>
						<Button
							onClick={handleSave}
							disabled={isSaving || !amount}
							className="flex-1 sm:flex-none"
						>
							{isSaving ? "Saving..." : "Save"}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
