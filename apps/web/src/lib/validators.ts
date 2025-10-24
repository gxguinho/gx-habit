import { VALIDATION } from "./constants";
import type { Result, WaterEntry } from "@/types";

export function validateAmount(amount: unknown): Result<number> {
	if (typeof amount !== "number") {
		return { success: false, error: "Amount must be a number" };
	}

	if (!Number.isFinite(amount)) {
		return { success: false, error: "Amount must be finite" };
	}

	if (amount < VALIDATION.MIN_AMOUNT_ML) {
		return {
			success: false,
			error: `Amount must be at least ${VALIDATION.MIN_AMOUNT_ML}ml`,
		};
	}

	if (amount > VALIDATION.MAX_AMOUNT_ML) {
		return {
			success: false,
			error: `Amount cannot exceed ${VALIDATION.MAX_AMOUNT_ML}ml`,
		};
	}

	return { success: true, data: amount };
}

export function validateGoal(goalMl: unknown): Result<number> {
	if (typeof goalMl !== "number") {
		return { success: false, error: "Goal must be a number" };
	}

	if (!Number.isFinite(goalMl)) {
		return { success: false, error: "Goal must be finite" };
	}

	if (goalMl < VALIDATION.MIN_GOAL_ML) {
		return {
			success: false,
			error: `Goal must be at least ${VALIDATION.MIN_GOAL_ML}ml`,
		};
	}

	if (goalMl > VALIDATION.MAX_GOAL_ML) {
		return {
			success: false,
			error: `Goal cannot exceed ${VALIDATION.MAX_GOAL_ML}ml`,
		};
	}

	return { success: true, data: goalMl };
}

export function validateTimestamp(timestamp: unknown): Result<number> {
	if (typeof timestamp !== "number") {
		return { success: false, error: "Timestamp must be a number" };
	}

	if (!Number.isFinite(timestamp)) {
		return { success: false, error: "Timestamp must be finite" };
	}

	const now = Date.now();
	const maxPast = now - 24 * 60 * 60 * 1000; // 24h atrás
	const maxFuture = now + 60 * 1000; // 1min no futuro

	if (timestamp < maxPast) {
		return { success: false, error: "Timestamp too far in the past" };
	}

	if (timestamp > maxFuture) {
		return { success: false, error: "Timestamp cannot be in the future" };
	}

	return { success: true, data: timestamp };
}

export function validateQuickAdds(values: unknown): Result<number[]> {
	if (!Array.isArray(values)) {
		return { success: false, error: "QuickAdds must be an array" };
	}

	if (values.length < 1 || values.length > 5) {
		return { success: false, error: "QuickAdds must have 1-5 values" };
	}

	const validatedValues: number[] = [];
	for (const value of values) {
		const validation = validateAmount(value);
		if (!validation.success) {
			return validation;
		}
		validatedValues.push(validation.data);
	}

	// Verificar duplicatas
	const uniqueValues = new Set(validatedValues);
	if (uniqueValues.size !== validatedValues.length) {
		return { success: false, error: "QuickAdds cannot have duplicates" };
	}

	return { success: true, data: validatedValues };
}

export function validateWaterEntry(entry: unknown): Result<WaterEntry> {
	if (typeof entry !== "object" || entry === null) {
		return { success: false, error: "Entry must be an object" };
	}

	const e = entry as Record<string, unknown>;

	// Validar id
	if (typeof e.id !== "string" || e.id.trim() === "") {
		return { success: false, error: "Entry must have a valid ID" };
	}

	// Validar amount
	const amountValidation = validateAmount(e.amount);
	if (!amountValidation.success) {
		return amountValidation;
	}

	// Validar timestamp
	const timestampValidation = validateTimestamp(e.timestamp);
	if (!timestampValidation.success) {
		return timestampValidation;
	}

	// Validar createdAt
	if (typeof e.createdAt !== "number" || !Number.isFinite(e.createdAt)) {
		return { success: false, error: "CreatedAt must be a valid timestamp" };
	}

	return {
		success: true,
		data: {
			id: e.id,
			amount: amountValidation.data,
			timestamp: timestampValidation.data,
			createdAt: e.createdAt,
			updatedAt: e.updatedAt as number | undefined,
		},
	};
}
