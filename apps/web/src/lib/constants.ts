export const PERFORMANCE_CONFIG = {
	LAZY_LOAD_THRESHOLD: 50, // Entries para ativar virtual scroll
	DEBOUNCE_INPUT_MS: 300, // Debounce de inputs
	TOAST_DURATION_MS: 2000, // Auto-dismiss de toasts
	ANIMATION_DURATION_MS: 300, // Duração de animações CSS
	CACHE_TTL_MS: 24 * 60 * 60 * 1000, // 24h de cache
} as const;

export const VALIDATION = {
	MIN_AMOUNT_ML: 1,
	MAX_AMOUNT_ML: 5000,
	MIN_GOAL_ML: 500,
	MAX_GOAL_ML: 5000,
	GOAL_STEP_ML: 250,
} as const;

export const DEFAULTS = {
	DAILY_GOAL_ML: 2500,
	QUICK_ADDS_ML: [250, 500, 1000],
} as const;
