// Diet and nutrition service - business logic for meal recommendations

import { Meal, MealPlan, DietaryRestriction, NCDType, DrugNutrientInteraction } from '../types';

export interface DietRecommendation {
  condition: NCDType;
  restrictions: DietaryRestriction[];
  recommendedFoods: string[];
  avoidedFoods: string[];
  tips: string[];
}

export class DietService {
  /**
   * Get diet recommendations based on health conditions
   */
  static getRecommendations(conditions: NCDType[]): DietRecommendation[] {
    const recommendations: DietRecommendation[] = [];
    
    conditions.forEach((condition) => {
      const restrictions = this.getRestrictionsForCondition(condition);
      const recommendedFoods = this.getRecommendedFoods(condition);
      const avoidedFoods = this.getAvoidedFoods(condition);
      const tips = this.getDietTips(condition);
      
      recommendations.push({
        condition,
        restrictions,
        recommendedFoods,
        avoidedFoods,
        tips,
      });
    });
    
    return recommendations;
  }

  /**
   * Get dietary restrictions for a condition
   */
  private static getRestrictionsForCondition(condition: NCDType): DietaryRestriction[] {
    const restrictions: Record<NCDType, DietaryRestriction[]> = {
      hypertension: ['low_sodium', 'heart_healthy'],
      diabetes: ['low_sugar', 'low_carb', 'diabetic_friendly'],
      heart_failure: ['low_sodium', 'low_fat', 'heart_healthy'],
      copd: ['high_fiber'],
      asthma: [],
      other: [],
    };
    
    return restrictions[condition] || [];
  }

  /**
   * Get recommended foods for a condition
   */
  private static getRecommendedFoods(condition: NCDType): string[] {
    const foods: Record<NCDType, string[]> = {
      hypertension: [
        'Fresh fruits and vegetables',
        'Whole grains',
        'Low-fat dairy',
        'Lean proteins',
        'Foods rich in potassium (bananas, oranges)',
      ],
      diabetes: [
        'Non-starchy vegetables',
        'Whole grains',
        'Lean proteins',
        'Healthy fats (avocado, nuts)',
        'Low-glycemic fruits',
      ],
      heart_failure: [
        'Fresh fruits and vegetables',
        'Whole grains',
        'Lean proteins',
        'Low-fat dairy',
        'Foods rich in omega-3 (fish)',
      ],
      copd: [
        'High-protein foods',
        'Fresh fruits and vegetables',
        'Whole grains',
        'Healthy fats',
      ],
      asthma: [
        'Foods rich in vitamin C',
        'Omega-3 rich foods',
        'Fruits and vegetables',
      ],
      other: [
        'Balanced diet',
        'Fresh foods',
        'Whole foods',
      ],
    };
    
    return foods[condition] || [];
  }

  /**
   * Get foods to avoid for a condition
   */
  private static getAvoidedFoods(condition: NCDType): string[] {
    const foods: Record<NCDType, string[]> = {
      hypertension: [
        'High-sodium processed foods',
        'Canned soups',
        'Processed meats',
        'Fast food',
        'Excessive salt',
      ],
      diabetes: [
        'Sugary beverages',
        'White bread and rice',
        'Sweets and desserts',
        'Processed foods',
        'High-sugar fruits',
      ],
      heart_failure: [
        'High-sodium foods',
        'Saturated fats',
        'Trans fats',
        'Excessive alcohol',
        'Processed meats',
      ],
      copd: [
        'Gas-producing foods',
        'Excessive carbonated drinks',
        'Very cold foods',
      ],
      asthma: [
        'Sulfite-containing foods',
        'Food allergens',
        'Processed foods with preservatives',
      ],
      other: [],
    };
    
    return foods[condition] || [];
  }

  /**
   * Get diet tips for a condition
   */
  private static getDietTips(condition: NCDType): string[] {
    const tips: Record<NCDType, string[]> = {
      hypertension: [
        'Limit sodium to less than 2,300mg per day',
        'Increase potassium intake',
        'Reduce alcohol consumption',
        'Maintain healthy weight',
        'Read food labels for sodium content',
      ],
      diabetes: [
        'Monitor carbohydrate intake',
        'Eat regular meals and snacks',
        'Choose foods with low glycemic index',
        'Stay hydrated',
        'Monitor blood sugar regularly',
      ],
      heart_failure: [
        'Limit fluid intake as prescribed',
        'Weigh yourself daily',
        'Reduce sodium intake significantly',
        'Avoid alcohol',
        'Eat smaller, more frequent meals',
      ],
      copd: [
        'Eat smaller, more frequent meals',
        'Choose high-protein foods',
        'Stay hydrated',
        'Avoid gas-producing foods',
        'Rest before eating if short of breath',
      ],
      asthma: [
        'Eat antioxidant-rich foods',
        'Include omega-3 fatty acids',
        'Avoid known food triggers',
        'Maintain healthy weight',
        'Stay hydrated',
      ],
      other: [
        'Eat a balanced diet',
        'Stay hydrated',
        'Listen to your body',
        'Consult healthcare provider',
      ],
    };
    
    return tips[condition] || [];
  }

  /**
   * Get meal database
   */
  static getMealDatabase(): Meal[] {
    return [
      {
        id: 'oatmeal',
        type: 'breakfast',
        name: 'Oatmeal with Berries',
        foods: [
          { foodId: 'oats', quantity: 1, unit: 'cup' },
          { foodId: 'berries', quantity: 0.5, unit: 'cup' },
        ],
        instructions: 'Cook oats with water or milk, top with fresh berries',
        suitableConditions: ['diabetes', 'hypertension', 'heart_failure'],
        prepTime: 10,
      },
      {
        id: 'grilled-chicken-salad',
        type: 'lunch',
        name: 'Grilled Chicken Salad',
        foods: [
          { foodId: 'chicken', quantity: 4, unit: 'oz' },
          { foodId: 'mixed-greens', quantity: 2, unit: 'cups' },
        ],
        instructions: 'Grill chicken breast, serve over mixed greens with light dressing',
        suitableConditions: ['diabetes', 'hypertension', 'heart_failure'],
        prepTime: 20,
      },
      {
        id: 'baked-fish',
        type: 'dinner',
        name: 'Baked Fish with Vegetables',
        foods: [
          { foodId: 'fish', quantity: 6, unit: 'oz' },
          { foodId: 'vegetables', quantity: 1, unit: 'cup' },
        ],
        instructions: 'Bake fish with herbs, serve with steamed vegetables',
        suitableConditions: ['diabetes', 'hypertension', 'heart_failure'],
        prepTime: 25,
      },
      {
        id: 'greek-yogurt',
        type: 'snack',
        name: 'Greek Yogurt with Nuts',
        foods: [
          { foodId: 'yogurt', quantity: 1, unit: 'cup' },
          { foodId: 'nuts', quantity: 1, unit: 'tbsp' },
        ],
        instructions: 'Serve Greek yogurt with a sprinkle of nuts',
        suitableConditions: ['diabetes', 'hypertension'],
        prepTime: 5,
      },
    ];
  }

  /**
   * Get drug-nutrient interactions
   */
  static getDrugNutrientInteractions(): DrugNutrientInteraction[] {
    return [
      {
        id: 'warfarin-vitk',
        medicationId: 'warfarin',
        nutrientId: 'vitamin_k',
        interaction: 'Vitamin K can reduce effectiveness of warfarin',
        recommendation: 'Maintain consistent vitamin K intake, avoid sudden changes',
        severity: 'monitor',
      },
      {
        id: 'ace-inhibitors-potassium',
        medicationId: 'lisinopril',
        nutrientId: 'potassium',
        interaction: 'ACE inhibitors can increase potassium levels',
        recommendation: 'Avoid potassium supplements, limit high-potassium foods',
        severity: 'limit',
      },
      {
        id: 'metformin-alcohol',
        medicationId: 'metformin',
        nutrientId: 'alcohol',
        interaction: 'Alcohol can increase risk of lactic acidosis',
        recommendation: 'Limit or avoid alcohol consumption',
        severity: 'avoid',
      },
      {
        id: 'diuretics-magnesium',
        medicationId: 'furosemide',
        nutrientId: 'magnesium',
        interaction: 'Diuretics can deplete magnesium levels',
        recommendation: 'Ensure adequate magnesium intake through diet',
        severity: 'monitor',
      },
    ];
  }

  /**
   * Create a personalized meal plan
   */
  static createMealPlan(conditions: NCDType[]): MealPlan {
    const recommendations = this.getRecommendations(conditions);
    const allRestrictions = recommendations.flatMap((rec) => rec.restrictions);
    const uniqueRestrictions = Array.from(new Set(allRestrictions));
    
    const meals = this.getMealDatabase().filter((meal) => {
      // Check if meal is suitable for any of the user's conditions
      return meal.suitableConditions.some((condition) => conditions.includes(condition as NCDType));
    });
    
    return {
      id: this.generateId(),
      userId: '', // Will be set when assigned to user
      name: 'Personalized Meal Plan',
      meals: meals.map((meal) => ({
        mealId: meal.id,
        dayOfWeek: -1, // -1 means available any day
        consumed: false,
      })),
      startDate: new Date().toISOString(),
      restrictions: uniqueRestrictions,
    };
  }

  /**
   * Generate a unique ID
   */
  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
