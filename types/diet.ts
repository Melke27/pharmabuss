// Diet and nutrition-related type definitions

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type DietaryRestriction = 
  | 'low_sodium'
  | 'low_sugar'
  | 'low_carb'
  | 'low_fat'
  | 'high_fiber'
  | 'diabetic_friendly'
  | 'heart_healthy'
  | 'renal_friendly';

export interface Food {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  sugar: number;
  restrictions: DietaryRestriction[];
}

export interface Meal {
  id: string;
  type: MealType;
  name: string;
  foods: MealFood[];
  instructions: string;
  suitableConditions: string[];
  prepTime?: number;
}

export interface MealFood {
  foodId: string;
  quantity: number;
  unit: string;
}

export interface MealPlan {
  id: string;
  userId: string;
  name: string;
  meals: PlannedMeal[];
  startDate: string;
  endDate?: string;
  restrictions: DietaryRestriction[];
}

export interface PlannedMeal {
  mealId: string;
  dayOfWeek: number; // 0-6
  consumed: boolean;
  consumedAt?: string;
}

export interface DrugNutrientInteraction {
  id: string;
  medicationId: string;
  nutrientId: string;
  interaction: string;
  recommendation: string;
  severity: 'avoid' | 'limit' | 'separate' | 'monitor';
}
