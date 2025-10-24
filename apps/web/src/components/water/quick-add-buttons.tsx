import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VALIDATION } from "@/lib/constants";

interface QuickAddButtonsProps {
	onAdd: (amount: number) => Promise<void>;
	quickAdds?: number[]; // Valores configuráveis [250, 500, 1000]
	disabled?: boolean;
}

export function QuickAddButtons({
	onAdd,
	quickAdds = [250, 500, 1000],
	disabled = false,
}: QuickAddButtonsProps) {
	const [customDialogOpen, setCustomDialogOpen] = useState(false);
	const [customAmount, setCustomAmount] = useState("");
	const [error, setError] = useState("");
	const [isAdding, setIsAdding] = useState(false);

	const handleQuickAdd = async (amount: number) => {
		if (disabled || isAdding) return;

		setIsAdding(true);
		try {
			await onAdd(amount);
		} catch (err) {
			console.error("Failed to add water:", err);
		} finally {
			setIsAdding(false);
		}
	};

	const handleCustomAdd = async () => {
		const amount = Number.parseInt(customAmount, 10);

		// Validação
		if (Number.isNaN(amount)) {
			setError("Please enter a valid number");
			return;
		}

		if (amount < VALIDATION.MIN_AMOUNT_ML) {
			setError(`Minimum amount is ${VALIDATION.MIN_AMOUNT_ML}ml`);
			return;
		}

		if (amount > VALIDATION.MAX_AMOUNT_ML) {
			setError(`Maximum amount is ${VALIDATION.MAX_AMOUNT_ML}ml`);
			return;
		}

		setIsAdding(true);
		try {
			await onAdd(amount);
			setCustomDialogOpen(false);
			setCustomAmount("");
			setError("");
		} catch (err) {
			setError("Failed to add water. Please try again.");
		} finally {
			setIsAdding(false);
		}
	};

	return (
		<>
			<div className="space-y-3">
				<div className="grid grid-cols-3 gap-2">
					{quickAdds.map((amount) => (
						<Button
							key={amount}
							size="lg"
							variant={amount === 500 ? "default" : "outline"}
							onClick={() => handleQuickAdd(amount)}
							disabled={disabled || isAdding}
							aria-label={`Add ${amount} milliliters`}
							className="h-16 text-lg font-semibold"
						>
							{amount}ml
						</Button>
					))}
				</div>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => setCustomDialogOpen(true)}
					disabled={disabled || isAdding}
					className="w-full"
					aria-label="Add custom amount"
				>
					Custom amount...
				</Button>
			</div>

			<Dialog open={customDialogOpen} onOpenChange={setCustomDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Custom Amount</DialogTitle>
						<DialogDescription>
							Enter the amount of water you consumed in milliliters
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="custom-amount">Amount (ml)</Label>
							<Input
								id="custom-amount"
								type="number"
								placeholder="e.g., 750"
								value={customAmount}
								onChange={(e) => {
									setCustomAmount(e.target.value);
									setError("");
								}}
								min={VALIDATION.MIN_AMOUNT_ML}
								max={VALIDATION.MAX_AMOUNT_ML}
								aria-describedby={error ? "amount-error" : undefined}
								autoFocus
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										handleCustomAdd();
									}
								}}
							/>
							{error && (
								<p
									id="amount-error"
									className="text-sm text-destructive"
									role="alert"
								>
									{error}
								</p>
							)}
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => {
								setCustomDialogOpen(false);
								setCustomAmount("");
								setError("");
							}}
							disabled={isAdding}
						>
							Cancel
						</Button>
						<Button
							onClick={handleCustomAdd}
							disabled={isAdding || !customAmount}
						>
							{isAdding ? "Adding..." : "Add Water"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
