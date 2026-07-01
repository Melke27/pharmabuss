// Consultation service - business logic for pharmacist consultations

import { Consultation, Message, Pharmacist, ConsultationType, ConsultationStatus } from '../types';

export class ConsultationService {
  /**
   * Create a new consultation
   */
  static createConsultation(
    patientId: string,
    pharmacistId: string,
    type: ConsultationType,
    subject?: string,
    scheduledDate?: string
  ): Consultation {
    return {
      id: this.generateId(),
      patientId,
      pharmacistId,
      type,
      status: 'pending',
      subject,
      scheduledDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    };
  }

  /**
   * Add a message to a consultation
   */
  static addMessage(
    consultation: Consultation,
    senderId: string,
    senderType: 'patient' | 'pharmacist',
    content: string
  ): Consultation {
    const message: Message = {
      id: this.generateId(),
      consultationId: consultation.id,
      senderId,
      senderType,
      type: 'text',
      content,
      timestamp: new Date().toISOString(),
      read: senderType === 'pharmacist', // Messages from pharmacist are auto-read
    };

    return {
      ...consultation,
      messages: [...consultation.messages, message],
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Mark messages as read
   */
  static markMessagesAsRead(consultation: Consultation, userId: string): Consultation {
    const updatedMessages = consultation.messages.map((msg) =>
      msg.senderId !== userId ? { ...msg, read: true } : msg
    );

    return {
      ...consultation,
      messages: updatedMessages,
    };
  }

  /**
   * Update consultation status
   */
  static updateStatus(
    consultation: Consultation,
    status: ConsultationStatus
  ): Consultation {
    return {
      ...consultation,
      status,
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Get available pharmacists
   */
  static getAvailablePharmacists(): Pharmacist[] {
    // In production, this would call an API
    return [
      {
        id: 'pharm-1',
        name: 'Dr. Abebe Kebede',
        licenseNumber: 'ETH-PHARM-001',
        specialization: 'Clinical Pharmacy',
        rating: 4.8,
        available: true,
      },
      {
        id: 'pharm-2',
        name: 'Dr. Almaz Haile',
        licenseNumber: 'ETH-PHARM-002',
        specialization: 'Pharmacotherapy',
        rating: 4.7,
        available: true,
      },
      {
        id: 'pharm-3',
        name: 'Dr. Dawit Tadesse',
        licenseNumber: 'ETH-PHARM-003',
        specialization: 'Medication Safety',
        rating: 4.9,
        available: false,
      },
    ];
  }

  /**
   * Get estimated wait time for consultation
   */
  static getEstimatedWaitTime(type: ConsultationType): number {
    // Return estimated wait time in minutes
    const waitTimes: Record<ConsultationType, number> = {
      chat: 30, // 30 minutes for chat
      video: 60, // 1 hour for video
      audio: 45, // 45 minutes for audio
    };
    
    return waitTimes[type] || 30;
  }

  /**
   * Check if consultation can be escalated to emergency
   */
  static shouldEscalateToEmergency(messages: Message[]): boolean {
    const emergencyKeywords = [
      'suicide',
      'kill myself',
      'emergency',
      'chest pain',
      'severe',
      'cannot breathe',
      'heart attack',
      'stroke',
    ];

    return messages.some((msg) =>
      emergencyKeywords.some((keyword) =>
        msg.content.toLowerCase().includes(keyword)
      )
    );
  }

  /**
   * Get consultation history for a patient
   */
  static getConsultationHistory(patientId: string): Consultation[] {
    // In production, this would query a database
    return [];
  }

  /**
   * Generate a unique ID
   */
  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Validate consultation request
   */
  static validateConsultationRequest(
    type: ConsultationType,
    subject?: string
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (type === 'video' && !subject) {
      errors.push('Subject is required for video consultations');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get consultation type display name
   */
  static getConsultationTypeName(type: ConsultationType): string {
    const names: Record<ConsultationType, string> = {
      chat: 'Chat',
      video: 'Video Call',
      audio: 'Audio Call',
    };
    
    return names[type] || type;
  }

  /**
   * Get consultation status display name
   */
  static getConsultationStatusName(status: ConsultationStatus): string {
    const names: Record<ConsultationStatus, string> = {
      pending: 'Pending',
      active: 'Active',
      completed: 'Completed',
      cancelled: 'Cancelled',
    };
    
    return names[status] || status;
  }
}
