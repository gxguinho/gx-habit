import type { WaterEntry } from "@/types";
import { WaterEntryItem } from "./water-entry-item";
import { format, isToday, isYesterday, startOfWeek } from "date-fns";

interface WaterEntryListProps {
	entries: WaterEntry[];
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
}

export function WaterEntryList({
	entries,
	onEdit,
	onDelete,
}: WaterEntryListProps) {
	if (entries.length === 0) {
		return (
			<div className="text-center py-12 space-y-4">
				<div className="mx-auto w-24 h-24 text-muted-foreground flex items-center justify-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-full h-full"
					>
						<title>Water glass icon</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z"
						/>
					</svg>
				</div>
				<h3 className="text-lg font-medium">
					Start tracking your water intake
				</h3>
				<p className="text-sm text-muted-foreground">
					Add your first entry using the buttons above
				</p>
			</div>
		);
	}

	// Agrupar entries por dia
	const groupedEntries = entries.reduce(
		(groups, entry) => {
			const date = new Date(entry.timestamp);
			let label: string;

			if (isToday(date)) {
				label = "Today";
			} else if (isYesterday(date)) {
				label = "Yesterday";
			} else if (date >= startOfWeek(new Date())) {
				label = format(date, "EEEE"); // Monday, Tuesday, etc
			} else {
				label = format(date, "MMM dd"); // Jan 15, etc
			}

			if (!groups[label]) {
				groups[label] = [];
			}
			groups[label].push(entry);
			return groups;
		},
		{} as Record<string, WaterEntry[]>,
	);

	return (
		<section aria-label="Water intake history" className="space-y-4">
			<h2 className="sr-only">Intake History</h2>
			{Object.entries(groupedEntries).map(([label, groupEntries]) => (
				<div key={label} className="space-y-2">
					<h3 className="text-sm font-medium text-muted-foreground px-1">
						{label}
					</h3>
					<ul className="space-y-2">
						{groupEntries.map((entry) => (
							<WaterEntryItem
								key={entry.id}
								entry={entry}
								onEdit={onEdit}
								onDelete={onDelete}
							/>
						))}
					</ul>
				</div>
			))}
		</section>
	);
}
