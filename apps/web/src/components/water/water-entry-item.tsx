import { format } from "date-fns";
import type { WaterEntry } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";

interface WaterEntryItemProps {
	entry: WaterEntry;
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
}

export function WaterEntryItem({
	entry,
	onEdit,
	onDelete,
}: WaterEntryItemProps) {
	const formattedTime = format(new Date(entry.timestamp), "HH:mm");
	const isoTimestamp = new Date(entry.timestamp).toISOString();

	return (
		<li>
			<Card className="p-3 flex items-center justify-between hover:bg-accent/50 transition-colors">
				<div className="flex flex-col">
					<span className="font-semibold text-lg">
						{entry.amount}ml
					</span>
					<time
						dateTime={isoTimestamp}
						className="text-sm text-muted-foreground"
					>
						{formattedTime}
					</time>
				</div>
				<div className="flex gap-1">
					<Button
						size="icon"
						variant="ghost"
						onClick={() => onEdit(entry.id)}
						aria-label={`Edit entry of ${entry.amount}ml at ${formattedTime}`}
					>
						<Pencil className="h-4 w-4" />
					</Button>
					<Button
						size="icon"
						variant="ghost"
						onClick={() => onDelete(entry.id)}
						aria-label={`Delete entry of ${entry.amount}ml at ${formattedTime}`}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			</Card>
		</li>
	);
}
