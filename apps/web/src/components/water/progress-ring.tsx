interface ProgressRingProps {
	current: number; // ml consumidos
	goal: number; // meta diária em ml
	size?: number; // tamanho do anel (default: 200px)
	strokeWidth?: number; // espessura do anel (default: 12px)
}

export function ProgressRing({
	current,
	goal,
	size = 200,
	strokeWidth = 12,
}: ProgressRingProps) {
	const percentage = Math.min((current / goal) * 100, 100);
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (percentage / 100) * circumference;

	const ariaLabel = `Water intake progress: ${current} milliliters consumed, ${percentage.toFixed(0)}% of ${goal} milliliter daily goal`;

	// Determinar cor baseado no progresso
	const getStrokeColor = () => {
		if (percentage < 50) return "hsl(var(--destructive))";
		if (percentage < 80) return "hsl(48 96% 53%)"; // yellow
		if (percentage < 100) return "hsl(142 76% 36%)"; // green
		return "hsl(221 83% 53%)"; // blue (achievement)
	};

	return (
		<div className="relative flex items-center justify-center">
			<svg
				width={size}
				height={size}
				role="img"
				aria-label={ariaLabel}
				className="transform -rotate-90"
			>
				<title>Daily Water Intake Progress</title>
				{/* Background circle */}
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					stroke="hsl(var(--border))"
					strokeWidth={strokeWidth}
				/>
				{/* Progress circle */}
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					stroke={getStrokeColor()}
					strokeWidth={strokeWidth}
					strokeDasharray={circumference}
					strokeDashoffset={offset}
					strokeLinecap="round"
					className="transition-all duration-300 motion-reduce:transition-none"
				/>
			</svg>
			{/* Center text */}
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				<span className="text-4xl font-bold">
					{percentage.toFixed(0)}%
				</span>
				<span className="text-sm text-muted-foreground">
					{current}ml / {goal}ml
				</span>
			</div>
		</div>
	);
}
