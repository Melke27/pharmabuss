// Drug-Drug Interaction (DDI) service

import { DrugInteraction, InteractionSeverity, Medication } from '../types';

export interface DDIResult {
  hasInteractions: boolean;
  interactions: DrugInteraction[];
  severity: 'safe' | 'caution' | 'danger';
  summary: string;
}

export class DDIService {
  /**
   * Comprehensive DDI check for a list of medications
   */
  static checkDDI(medications: Medication[]): DDIResult {
    if (medications.length < 2) {
      return {
        hasInteractions: false,
        interactions: [],
        severity: 'safe',
        summary: 'No interactions to check with single medication',
      };
    }

    const interactions = this.findInteractions(medications);
    
    if (interactions.length === 0) {
      return {
        hasInteractions: false,
        interactions: [],
        severity: 'safe',
        summary: 'No known drug interactions detected',
      };
    }

    const severity = this.determineOverallSeverity(interactions);
    const summary = this.generateSummary(interactions);

    return {
      hasInteractions: true,
      interactions,
      severity,
      summary,
    };
  }

  /**
   * Find all interactions between medications
   */
  private static findInteractions(medications: Medication[]): DrugInteraction[] {
    // This is a simplified implementation
    // In production, this would call a comprehensive DDI database API
    const interactions: DrugInteraction[] = [];
    
    // Common high-risk interactions to check
    const commonInteractions = this.getCommonInteractions();
    
    for (let i = 0; i < medications.length; i++) {
      for (let j = i + 1; j < medications.length; j++) {
        const med1 = medications[i];
        const med2 = medications[j];
        
        const found = commonInteractions.filter(
          (int) =>
            (int.medication1Id.toLowerCase().includes(med1.name.toLowerCase()) &&
              int.medication2Id.toLowerCase().includes(med2.name.toLowerCase())) ||
            (int.medication1Id.toLowerCase().includes(med2.name.toLowerCase()) &&
              int.medication2Id.toLowerCase().includes(med1.name.toLowerCase()))
        );
        
        interactions.push(...found);
      }
    }
    
    return interactions;
  }

  /**
   * Get common drug interactions database
   */
  private static getCommonInteractions(): DrugInteraction[] {
    return [
      {
        id: 'warfarin-aspirin',
        medication1Id: 'warfarin',
        medication2Id: 'aspirin',
        severity: 'major',
        description: 'Increased risk of bleeding',
        recommendation: 'Monitor INR closely. Consider alternative therapy.',
      },
      {
        id: 'ace-inhibitor-potassium',
        medication1Id: 'lisinopril',
        medication2Id: 'potassium',
        severity: 'major',
        description: 'Risk of hyperkalemia (high potassium)',
        recommendation: 'Monitor potassium levels regularly.',
      },
      {
        id: 'metformin-contrast',
        medication1Id: 'metformin',
        medication2Id: 'contrast',
        severity: 'major',
        description: 'Risk of lactic acidosis with contrast dye',
        recommendation: 'Discontinue metformin 48 hours before contrast procedures.',
      },
      {
        id: 'ssri-maoi',
        medication1Id: 'ssri',
        medication2Id: 'maoi',
        severity: 'contraindicated',
        description: 'Serotonin syndrome risk',
        recommendation: 'Do not combine. Wait 14 days after stopping MAOI before starting SSRI.',
      },
      {
        id: 'beta-blocker-asthma',
        medication1Id: 'propranolol',
        medication2Id: 'asthma',
        severity: 'major',
        description: 'May trigger asthma attacks',
        recommendation: 'Use cardioselective beta-blockers instead.',
      },
    ];
  }

  /**
   * Determine overall severity from list of interactions
   */
  private static determineOverallSeverity(interactions: DrugInteraction[]): 'safe' | 'caution' | 'danger' {
    const hasContraindicated = interactions.some((int) => int.severity === 'contraindicated');
    const hasMajor = interactions.some((int) => int.severity === 'major');
    
    if (hasContraindicated) {
      return 'danger';
    }
    
    if (hasMajor) {
      return 'caution';
    }
    
    return 'caution';
  }

  /**
   * Generate a human-readable summary of interactions
   */
  private static generateSummary(interactions: DrugInteraction[]): string {
    const count = interactions.length;
    const contraindicated = interactions.filter((int) => int.severity === 'contraindicated').length;
    const major = interactions.filter((int) => int.severity === 'major').length;
    const moderate = interactions.filter((int) => int.severity === 'moderate').length;
    const minor = interactions.filter((int) => int.severity === 'minor').length;
    
    let summary = `Found ${count} potential interaction${count > 1 ? 's' : ''}: `;
    
    if (contraindicated > 0) {
      summary += `${contraindicated} contraindicated, `;
    }
    if (major > 0) {
      summary += `${major} major, `;
    }
    if (moderate > 0) {
      summary += `${moderate} moderate, `;
    }
    if (minor > 0) {
      summary += `${minor} minor, `;
    }
    
    return summary.replace(/, $/, '.');
  }

  /**
   * Get severity priority for sorting
   */
  static getSeverityPriority(severity: InteractionSeverity): number {
    const priority: Record<InteractionSeverity, number> = {
      contraindicated: 4,
      major: 3,
      moderate: 2,
      minor: 1,
    };
    
    return priority[severity] || 0;
  }

  /**
   * Sort interactions by severity
   */
  static sortInteractionsBySeverity(interactions: DrugInteraction[]): DrugInteraction[] {
    return interactions.sort(
      (a, b) => this.getSeverityPriority(b.severity) - this.getSeverityPriority(a.severity)
    );
  }
}
