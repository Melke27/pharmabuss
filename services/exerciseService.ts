// Exercise service - business logic for exercise recommendations

import { Exercise, NCDType } from '../types';

export interface ExerciseRecommendation {
  condition: NCDType;
  recommended: Exercise[];
  avoided: string[];
  tips: string[];
}

export class ExerciseService {
  /**
   * Get exercise recommendations based on health conditions
   */
  static getRecommendations(conditions: NCDType[]): ExerciseRecommendation[] {
    const recommendations: ExerciseRecommendation[] = [];
    
    const exerciseDatabase = this.getExerciseDatabase();
    
    conditions.forEach((condition) => {
      const recommended = exerciseDatabase.filter((ex) =>
        ex.suitableConditions.includes(condition)
      );
      
      const avoided = this.getAvoidedExercises(condition);
      const tips = this.getExerciseTips(condition);
      
      recommendations.push({
        condition,
        recommended,
        avoided,
        tips,
      });
    });
    
    return recommendations;
  }

  /**
   * Get exercise database
   */
  private static getExerciseDatabase(): Exercise[] {
    return [
      {
        id: 'walking',
        name: 'Walking',
        category: 'cardio',
        intensity: 'moderate',
        duration: 30,
        description: 'Brisk walking at a comfortable pace',
        instructions: [
          'Start with 5-10 minutes',
          'Gradually increase to 30 minutes',
          'Maintain comfortable pace',
          'Wear supportive shoes',
        ],
        suitableConditions: ['hypertension', 'diabetes', 'heart_failure', 'copd'],
        precautions: ['Stop if you feel dizzy or short of breath'],
      },
      {
        id: 'swimming',
        name: 'Swimming',
        category: 'cardio',
        intensity: 'moderate',
        duration: 30,
        description: 'Low-impact full-body exercise',
        instructions: [
          'Start with 15-20 minutes',
          'Use proper breathing technique',
          'Stay within comfort zone',
        ],
        suitableConditions: ['hypertension', 'diabetes', 'heart_failure', 'copd'],
        precautions: ['Avoid if you have open wounds', 'Supervision recommended for heart patients'],
      },
      {
        id: 'cycling',
        name: 'Cycling',
        category: 'cardio',
        intensity: 'moderate',
        duration: 30,
        description: 'Stationary or outdoor cycling',
        instructions: [
          'Adjust seat height properly',
          'Start with low resistance',
          'Gradually increase duration',
        ],
        suitableConditions: ['hypertension', 'diabetes'],
        precautions: ['Avoid if you have balance issues', 'Heart patients should avoid high resistance'],
      },
      {
        id: 'strength-training',
        name: 'Light Strength Training',
        category: 'strength',
        intensity: 'low',
        duration: 20,
        description: 'Resistance exercises with light weights or bands',
        instructions: [
          'Start with no weights or very light weights',
          'Focus on proper form',
          'Breathe regularly',
          'Rest between sets',
        ],
        suitableConditions: ['diabetes', 'hypertension'],
        precautions: ['Avoid holding breath', 'Heart patients should consult doctor first'],
      },
      {
        id: 'yoga',
        name: 'Gentle Yoga',
        category: 'flexibility',
        intensity: 'low',
        duration: 30,
        description: 'Stretching and breathing exercises',
        instructions: [
          'Start with basic poses',
          'Focus on breathing',
          'Move slowly',
          'Listen to your body',
        ],
        suitableConditions: ['hypertension', 'diabetes', 'copd'],
        precautions: ['Avoid inverted poses with hypertension', 'Stop if you feel dizzy'],
      },
      {
        id: 'breathing-exercises',
        name: 'Breathing Exercises',
        category: 'flexibility',
        intensity: 'low',
        duration: 10,
        description: 'Controlled breathing techniques',
        instructions: [
          'Sit comfortably',
          'Breathe in slowly through nose',
          'Breathe out slowly through mouth',
          'Repeat for 5-10 minutes',
        ],
        suitableConditions: ['copd', 'asthma', 'hypertension', 'heart_failure'],
        precautions: ['Stop if you feel lightheaded'],
      },
    ];
  }

  /**
   * Get exercises to avoid for specific conditions
   */
  private static getAvoidedExercises(condition: NCDType): string[] {
    const avoidedExercises: Record<NCDType, string[]> = {
      hypertension: ['Heavy weightlifting', 'High-intensity interval training', 'Isometric exercises'],
      diabetes: ['High-impact activities with foot problems', 'Exercises that cause hypoglycemia risk'],
      heart_failure: ['High-intensity exercises', 'Exercises with arms above head', 'Heavy lifting'],
      copd: ['High-intensity activities', 'Exercises in cold air', 'Swimming in chlorinated pools'],
      asthma: ['Cold weather exercises', 'High-intensity activities', 'Exercises in polluted areas'],
      other: [],
    };
    
    return avoidedExercises[condition] || [];
  }

  /**
   * Get exercise tips for specific conditions
   */
  private static getExerciseTips(condition: NCDType): string[] {
    const tips: Record<NCDType, string[]> = {
      hypertension: [
        'Exercise regularly for at least 30 minutes most days',
        'Monitor blood pressure before and after exercise',
        'Avoid sudden intense efforts',
        'Stay hydrated',
      ],
      diabetes: [
        'Check blood sugar before and after exercise',
        'Carry fast-acting glucose',
        'Exercise at the same time each day',
        'Wear proper footwear to protect feet',
      ],
      heart_failure: [
        'Start slowly and gradually increase intensity',
        'Exercise during cooler parts of the day',
        'Stop if you experience chest pain or shortness of breath',
        'Keep emergency medications nearby',
      ],
      copd: [
        'Use pursed-lip breathing during exercise',
        'Exercise during times when breathing is better',
        'Use bronchodilators before exercise if prescribed',
        'Stay in well-ventilated areas',
      ],
      asthma: [
        'Use inhaler before exercise if prescribed',
        'Warm up slowly before exercise',
        'Avoid exercise in cold or dry air',
        'Cover mouth with scarf in cold weather',
      ],
      other: [
        'Consult your healthcare provider before starting',
        'Start slowly and progress gradually',
        'Listen to your body',
        'Stay consistent',
      ],
    };
    
    return tips[condition] || [];
  }

  /**
   * Create a personalized exercise plan
   */
  static createExercisePlan(conditions: NCDType[], availableDays: number[]): Exercise[] {
    const recommendations = this.getRecommendations(conditions);
    
    // Combine all recommended exercises
    const allExercises = recommendations.flatMap((rec) => rec.recommended);
    
    // Remove duplicates
    const uniqueExercises = Array.from(
      new Map(allExercises.map((ex) => [ex.id, ex])).values()
    );
    
    // Sort by intensity (start with lower intensity)
    const intensityOrder = { low: 1, moderate: 2, high: 3 };
    uniqueExercises.sort((a, b) => intensityOrder[a.intensity] - intensityOrder[b.intensity]);
    
    return uniqueExercises;
  }
}
