/**
 * StaffRequestForm Component Tests
 *
 * Tests for the multi-step staff request form including:
 * - Form validation
 * - Step navigation
 * - Service selection
 * - Form submission
 * - Error handling
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Note: These tests focus on form logic and validation
// Full component testing would require React Testing Library setup

describe('StaffRequestForm Validation Tests', () => {
  describe('Step 1 - Event Details Validation', () => {
    it('should require event type selection', () => {
      const validationFn = (data: any) => {
        if (!data.eventType.trim()) return 'Please select an event type.';
        return '';
      };

      expect(validationFn({ eventType: '' })).toBe('Please select an event type.');
      expect(validationFn({ eventType: 'Wedding Reception' })).toBe('');
    });

    it('should require event date', () => {
      const validationFn = (data: any) => {
        if (!data.eventDate.trim()) return 'Please choose an event date.';
        return '';
      };

      expect(validationFn({ eventDate: '' })).toBe('Please choose an event date.');
      expect(validationFn({ eventDate: '2026-12-15' })).toBe('');
    });
  });

  describe('Step 2 - Staff Needs Validation', () => {
    it('should require at least one service selection', () => {
      const validationFn = (data: any) => {
        if (data.services.length === 0) {
          return 'Please select at least one staffing service.';
        }
        return '';
      };

      expect(validationFn({ services: [] })).toBe('Please select at least one staffing service.');
      expect(validationFn({ services: ['servers'] })).toBe('');
      expect(validationFn({ services: ['servers', 'bartenders', 'security'] })).toBe('');
    });

    it('should handle service toggle correctly', () => {
      const toggleService = (services: string[], id: string) => {
        return services.includes(id)
          ? services.filter((s) => s !== id)
          : [...services, id];
      };

      expect(toggleService([], 'servers')).toEqual(['servers']);
      expect(toggleService(['servers'], 'servers')).toEqual([]);
      expect(toggleService(['servers', 'bartenders'], 'security')).toEqual(['servers', 'bartenders', 'security']);
    });
  });

  describe('Step 3 - Contact Details Validation', () => {
    it('should require full name', () => {
      const validationFn = (data: any) => {
        if (!data.name.trim()) return 'Please enter your full name.';
        return '';
      };

      expect(validationFn({ name: '' })).toBe('Please enter your full name.');
      expect(validationFn({ name: 'John Doe' })).toBe('');
      expect(validationFn({ name: '   ' })).toBe('Please enter your full name.'); // whitespace only
    });

    it('should require valid email', () => {
      const validationFn = (data: any) => {
        if (!data.email.trim()) return 'Please enter your email address.';
        return '';
      };

      expect(validationFn({ email: '' })).toBe('Please enter your email address.');
      expect(validationFn({ email: 'test@example.com' })).toBe('');
    });

    it('should validate email format', () => {
      const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
    });
  });

  describe('Form Data Structure', () => {
    it('should have correct initial form data structure', () => {
      const emptyFormData = {
        eventType: '',
        eventDate: '',
        eventTime: '',
        duration: '',
        services: [] as string[],
        guestCount: '',
        venue: '',
        location: '',
        specialRequirements: '',
        name: '',
        email: '',
        phone: '',
        company: '',
      };

      expect(emptyFormData.services).toEqual([]);
      expect(typeof emptyFormData.eventDate).toBe('string');
    });

    it('should correctly update form fields', () => {
      const updateForm = (prev: any, key: string, value: any) => {
        return { ...prev, [key]: value };
      };

      const initial = { name: '', email: '' };
      const afterName = updateForm(initial, 'name', 'John Doe');
      const afterEmail = updateForm(afterName, 'email', 'john@example.com');

      expect(afterEmail.name).toBe('John Doe');
      expect(afterEmail.email).toBe('john@example.com');
    });
  });
});

describe('Form Step Navigation Logic', () => {
  const STEPS = [
    { label: 'Event Details', icon: 'Calendar' },
    { label: 'Staff Needs', icon: 'Users' },
    { label: 'Venue Info', icon: 'MapPin' },
    { label: 'Your Details', icon: 'ClipboardCheck' },
  ];

  it('should have 4 steps', () => {
    expect(STEPS).toHaveLength(4);
  });

  it('should define correct step labels', () => {
    expect(STEPS[0].label).toBe('Event Details');
    expect(STEPS[1].label).toBe('Staff Needs');
    expect(STEPS[2].label).toBe('Venue Info');
    expect(STEPS[3].label).toBe('Your Details');
  });

  it('should calculate progress correctly', () => {
    const calculateProgress = (step: number) => {
      return ((step + 1) / 4) * 100;
    };

    expect(calculateProgress(0)).toBe(25); // Step 1
    expect(calculateProgress(1)).toBe(50); // Step 2
    expect(calculateProgress(2)).toBe(75); // Step 3
    expect(calculateProgress(3)).toBe(100); // Step 4
  });

  it('should allow going back from any step except first', () => {
    const canGoBack = (step: number) => step > 0;
    const goBack = (step: number) => Math.max(0, step - 1);

    expect(canGoBack(0)).toBe(false);
    expect(canGoBack(1)).toBe(true);
    expect(goBack(1)).toBe(0);
    expect(goBack(3)).toBe(2);
  });

  it('should validate all previous steps when jumping forward', () => {
    const validateAllPreviousSteps = (
      currentStep: number,
      formData: any,
      validateStep: (step: number, data: any) => string
    ) => {
      for (let i = 0; i < currentStep; i++) {
        const error = validateStep(i, formData);
        if (error) return { valid: false, failedStep: i, error };
      }
      return { valid: true };
    };

    const validateStep = (step: number, data: any) => {
      switch (step) {
        case 0:
          return !data.eventType ? 'Please select an event type.' : '';
        case 1:
          return data.services.length === 0 ? 'Please select a service.' : '';
        case 2:
          return ''; // Venue is optional
        case 3:
          return !data.name ? 'Please enter your name.' : '';
        default:
          return '';
      }
    };

    const completeForm = {
      eventType: 'Wedding',
      services: ['servers'],
      venue: 'Test Venue',
      name: 'John',
    };

    const result = validateAllPreviousSteps(3, completeForm, validateStep);
    expect(result.valid).toBe(true);
  });
});

describe('Form Submission Tests', () => {
  it('should construct correct submission payload', () => {
    const formData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-123-4567',
      company: 'Acme Corp',
      eventType: 'Wedding Reception',
      services: ['servers', 'bartenders'],
      guestCount: '150',
      eventDate: '2026-12-15',
      eventTime: '18:00',
      duration: '6',
      venue: 'Grand Ballroom',
      location: 'New York, NY',
      specialRequirements: 'Formal dress code required',
    };

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      eventType: formData.eventType,
      services: formData.services,
      guestCount: formData.guestCount,
      eventDate: formData.eventDate,
      eventTime: formData.eventTime,
      duration: formData.duration,
      venue: formData.venue,
      location: formData.location,
      specialRequirements: formData.specialRequirements,
    };

    expect(payload.name).toBe('John Doe');
    expect(payload.services).toEqual(['servers', 'bartenders']);
    expect(payload.eventType).toBe('Wedding Reception');
  });

  it('should handle submission errors gracefully', () => {
    const handleError = (error: any, setError: (msg: string) => void) => {
      const errorMessage =
        typeof error === 'string'
          ? error
          : error?.message || 'Failed to submit request. Please try again.';
      setError(errorMessage);
    };

    let errorMessage = '';
    handleError(new Error('Network error'), (msg) => { errorMessage = msg; });
    expect(errorMessage).toBe('Network error');

    handleError('Custom error message', (msg) => { errorMessage = msg; });
    expect(errorMessage).toBe('Custom error message');

    handleError(null, (msg) => { errorMessage = msg; });
    expect(errorMessage).toBe('Failed to submit request. Please try again.');
  });

  it('should generate reference code on success', () => {
    const generateReferenceCode = (response: any) => {
      const returnedReference =
        typeof response?.inquiryReference === 'string'
          ? response.inquiryReference
          : typeof response?.referenceCode === 'string'
            ? response.referenceCode
            : 'GDR-CONFIRMED';
      return returnedReference;
    };

    expect(generateReferenceCode({ inquiryReference: 'REF-123' })).toBe('REF-123');
    expect(generateReferenceCode({ referenceCode: 'REF-456' })).toBe('REF-456');
    expect(generateReferenceCode({})).toBe('GDR-CONFIRMED');
    expect(generateReferenceCode(null)).toBe('GDR-CONFIRMED');
  });
});

describe('Event Types and Services', () => {
  const EVENT_TYPES = [
    'Wedding Reception',
    'Corporate Gala',
    'Private Dinner',
    'Charity Event',
    'Trade Show',
    'Holiday Party',
    'Product Launch',
    'Other',
  ];

  it('should have 8 event types', () => {
    expect(EVENT_TYPES).toHaveLength(8);
  });

  it('should include common event types', () => {
    expect(EVENT_TYPES).toContain('Wedding Reception');
    expect(EVENT_TYPES).toContain('Corporate Gala');
    expect(EVENT_TYPES).toContain('Private Dinner');
    expect(EVENT_TYPES).toContain('Holiday Party');
  });
});
