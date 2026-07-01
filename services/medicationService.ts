// Medication service - business logic for medication management

import { Medication, DrugInteraction, InteractionSeverity } from '../types';

// Sample drug interaction database (in production, this would be an API call)
const drugInteractionDatabase: Record<string, DrugInteraction[]> = {
  // Warfarin interactions
  'warfarin': [
    {
      id: 'warf-aspirin',
      medication1Id: 'warfarin',
      medication2Id: 'aspirin',
      severity: 'major',
      description: 'Increased risk of bleeding',
      recommendation: 'Monitor INR closely. Consider alternative therapy.',
      references: ['Clinical Pharmacology, 2024'],
    },
    {
      id: 'warf-nsaid',
      medication1Id: 'warfarin',
      medication2Id: 'ibuprofen',
      severity: 'contraindicated',
      description: 'Significantly increased risk of gastrointestinal bleeding',
      recommendation: 'Avoid concurrent use. Use acetaminophen for pain.',
      references: ['Drug Interaction Checker, 2024'],
    },
  ],
  // ACE inhibitors
  'lisinopril': [
    {
      id: 'lis-k',
      medication1Id: 'lisinopril',
      medication2Id: 'potassium',
      severity: 'major',
      description: 'Risk of hyperkalemia',
      recommendation: 'Monitor potassium levels regularly.',
      references: ['Hypertension Guidelines, 2024'],
    },
  ],
  // Metformin
  'metformin': [
    {
      id: 'met-contrast',
      medication1Id: 'metformin',
      medication2Id: 'contrast_dye',
      severity: 'major',
      description: 'Risk of lactic acidosis',
      recommendation: 'Discontinue metformin 48 hours before contrast procedure.',
      references: ['Diabetes Care Guidelines, 2024'],
    },
  ],
};

export class MedicationService {
  /**
   * Check for drug-drug interactions between medications
   */
  static checkInteractions(medications: Medication[]): DrugInteraction[] {
    const interactions: DrugInteraction[] = [];
    
    for (let i = 0; i < medications.length; i++) {
      for (let j = i + 1; j < medications.length; j++) {
        const med1 = medications[i];
        const med2 = medications[j];
        
        // Normalize medication names for lookup
        const med1Key = med1.name.toLowerCase().replace(/\s+/g, '_');
        const med2Key = med2.name.toLowerCase().replace(/\s+/g, '_');
        
        // Check interactions in both directions
        const interactions1 = drugInteractionDatabase[med1Key] || [];
        const interactions2 = drugInteractionDatabase[med2Key] || [];
        
        const foundInteractions = [
          ...interactions1.filter(
            (int) => int.medication2Id.toLowerCase().replace(/\s+/g, '_') === med2Key
          ),
          ...interactions2.filter(
            (int) => int.medication2Id.toLowerCase().replace(/\s+/g, '_') === med1Key
          ),
        ];
        
        interactions.push(...foundInteractions);
      }
    }
    
    return interactions;
  }

  /**
   * Get interaction severity color for UI
   */
  static getSeverityColor(severity: InteractionSeverity): string {
    switch (severity) {
      case 'contraindicated':
        return '#DC2626'; // Red
      case 'major':
        return '#F97316'; // Orange
      case 'moderate':
        return '#EAB308'; // Yellow
      case 'minor':
        return '#22C55E'; // Green
      default:
        return '#6B7280'; // Gray
    }
  }

  /**
   * Calculate refill date based on dosage and current stock
   */
  static calculateRefillDate(medication: Medication): Date | null {
    if (!medication.currentStock || medication.currentStock <= 0) {
      return null;
    }
    
    const dosesPerDay = this.getDosesPerDay(medication.frequency);
    const daysRemaining = Math.floor(medication.currentStock / dosesPerDay);
    
    const refillDate = new Date();
    refillDate.setDate(refillDate.getDate() + daysRemaining);
    
    return refillDate;
  }

  /**
   * Convert frequency string to number of doses per day
   */
  static getDosesPerDay(frequency: string): number {
    const frequencyMap: Record<string, number> = {
      once_daily: 1,
      twice_daily: 2,
      three_times_daily: 3,
      four_times_daily: 4,
      every_8_hours: 3,
      every_12_hours: 2,
      every_24_hours: 1,
      as_needed: 0,
      weekly: 1 / 7,
      monthly: 1 / 30,
    };
    
    return frequencyMap[frequency] || 1;
  }

  /**
   * Validate medication data
   */
  static validateMedication(medication: Partial<Medication>): string[] {
    const errors: string[] = [];
    
    if (!medication.name || medication.name.trim() === '') {
      errors.push('Medication name is required');
    }
    
    if (!medication.dosage || medication.dosage <= 0) {
      errors.push('Dosage must be greater than 0');
    }
    
    if (!medication.frequency) {
      errors.push('Frequency is required');
    }
    
    if (!medication.startDate) {
      errors.push('Start date is required');
    }
    
    return errors;
  }

  /**
   * Get medication instructions in simplified language
   */
  static getSimplifiedInstructions(medication: Medication): string {
    const frequencyInstructions: Record<string, string> = {
      once_daily: 'Take once daily',
      twice_daily: 'Take twice daily (morning and evening)',
      three_times_daily: 'Take three times daily',
      four_times_daily: 'Take four times daily',
      every_8_hours: 'Take every 8 hours',
      every_12_hours: 'Take every 12 hours',
      every_24_hours: 'Take once every 24 hours',
      as_needed: 'Take as needed',
      weekly: 'Take once weekly',
      monthly: 'Take once monthly',
    };
    
    const baseInstruction = frequencyInstructions[medication.frequency] || 'Take as prescribed';
    const dosageText = `${medication.dosage} ${medication.unit}`;
    
    return `${dosageText} - ${baseInstruction}. ${medication.instructions || ''}`;
  }
}
