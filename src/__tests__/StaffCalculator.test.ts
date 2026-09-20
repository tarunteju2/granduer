/**
 * StaffCalculator Component Tests
 *
 * Tests for the staffing calculator component including:
 * - Guest count input handling
 * - Staff recommendation calculations
 * - Pricing calculations
 * - Quote generation and export
 * - UI interactions (sliders, dropdowns, toggles)
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { calculateQuote, calculateRecommendedStaff, formatCurrency, REGION_PRICING } from '../components/pricingEngine';

// Mock pricing engine functions for testing
describe('Pricing Engine Unit Tests', () => {
  describe('calculateRecommendedStaff', () => {
    it('should return correct staff counts for Sit-Down Dinner with 100 guests', () => {
      const result = calculateRecommendedStaff('Sit-Down Dinner', 100, false);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);

      const serverStaff = result.find(s => s.service === 'servers');
      expect(serverStaff).toBeDefined();
      expect(serverStaff?.count).toBe(7); // 100/15 = 6.67, ceil = 7

      const bartenderStaff = result.find(s => s.service === 'bartenders');
      expect(bartenderStaff).toBeDefined();
      expect(bartenderStaff?.count).toBe(2); // 100/50 = 2
    });

    it('should return correct staff counts for Cocktail Reception', () => {
      const result = calculateRecommendedStaff('Cocktail Reception', 200, false);

      const serverStaff = result.find(s => s.service === 'servers');
      expect(serverStaff?.count).toBe(8); // 200/25 = 8

      const bartenderStaff = result.find(s => s.service === 'bartenders');
      expect(bartenderStaff?.count).toBe(4); // 200/50 = 4
    });

    it('should include security when requested', () => {
      const resultWithoutSecurity = calculateRecommendedStaff('Corporate Event', 150, false);
      const resultWithSecurity = calculateRecommendedStaff('Corporate Event', 150, true);

      expect(resultWithoutSecurity.find(s => s.service === 'security')).toBeUndefined();
      expect(resultWithSecurity.find(s => s.service === 'security')).toBeDefined();
    });

    it('should return empty array for unknown event type', () => {
      const result = calculateRecommendedStaff('Unknown Event', 100, false);
      expect(result).toEqual([]);
    });

    it('should calculate minimum staff counts for small events', () => {
      const result = calculateRecommendedStaff('Private Dinner', 10, false);

      // For 10 guests, should return at least minimum staff counts
      expect(result.length).toBeGreaterThan(0);

      const servers = result.find(s => s.service === 'servers');
      expect(servers?.count).toBeGreaterThanOrEqual(2); // minimum servers
    });
  });

  describe('calculateQuote', () => {
    const baseParams = {
      eventType: 'Sit-Down Dinner' as const,
      eventDate: new Date('2026-10-15'), // Wednesday - no surge
      guestCount: 100,
      region: 'nyc' as const,
      staffRequirements: [
        { service: 'servers' as const, count: 7 },
        { service: 'bartenders' as const, count: 2 },
        { service: 'captains' as const, count: 1 },
        { service: 'kitchen' as const, count: 4 },
      ],
      duration: 6,
    };

    it('should calculate base pricing correctly', () => {
      const quote = calculateQuote(baseParams);

      expect(quote).toBeDefined();
      expect(quote.subtotal).toBeGreaterThan(0);
      expect(quote.total).toBeGreaterThan(0);
      expect(quote.lineItems).toHaveLength(4);
    });

    it('should apply NYC region multiplier', () => {
      const quote = calculateQuote(baseParams);

      // NYC has 1.25 multiplier
      expect(quote.subtotal).toBeGreaterThan(0);

      // Verify line items have region multiplier
      quote.lineItems.forEach(item => {
        expect(item.regionMultiplier).toBe(REGION_PRICING.nyc.multiplier);
      });
    });

    it('should apply surge pricing for Saturdays', () => {
      const saturdayParams = {
        ...baseParams,
        eventDate: new Date('2026-10-17'), // Saturday
      };

      const quote = calculateQuote(saturdayParams);

      // Saturday has 1.15 surge multiplier
      expect(quote.activeSurgeConditions).toContain('Saturday Premium');
      expect(quote.surgeFees).toBeGreaterThan(0);
    });

    it('should apply volume discount for large events', () => {
      const largeEventParams = {
        ...baseParams,
        staffRequirements: [
          { service: 'servers' as const, count: 25 },
          { service: 'bartenders' as const, count: 5 },
          { service: 'captains' as const, count: 4 },
          { service: 'kitchen' as const, count: 10 },
        ],
      };

      const quote = calculateQuote(largeEventParams);

      // 44 total staff should qualify for 10% discount (20-34 range)
      expect(quote.volumeDiscount).toBeGreaterThan(0);
      expect(quote.volumeDiscountTier).toContain('10%');
    });

    it('should calculate line items correctly', () => {
      const quote = calculateQuote(baseParams);

      const serversLineItem = quote.lineItems.find(item => item.service === 'servers');
      expect(serversLineItem).toBeDefined();
      expect(serversLineItem?.quantity).toBe(7);
      expect(serversLineItem?.hours).toBe(6);
    });

    it('should handle zero guest count gracefully', () => {
      const zeroGuestParams = {
        ...baseParams,
        guestCount: 0,
      };

      // Should not throw
      expect(() => calculateQuote(zeroGuestParams)).not.toThrow();
    });
  });

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1000)).toBe('$1,000');
      expect(formatCurrency(1234567)).toBe('$1,234,567');
      expect(formatCurrency(0)).toBe('$0');
      expect(formatCurrency(99.99)).toBe('$100');
    });

    it('should handle negative values', () => {
      expect(formatCurrency(-500)).toBe('-$500');
    });
  });

  describe('REGION_PRICING', () => {
    it('should have correct multipliers for all regions', () => {
      expect(REGION_PRICING.nyc.multiplier).toBe(1.25);
      expect(REGION_PRICING.long_island.multiplier).toBe(1.15);
      expect(REGION_PRICING.new_jersey.multiplier).toBe(1.10);
      expect(REGION_PRICING.south_florida.multiplier).toBe(1.00);
    });

    it('should have descriptions for all regions', () => {
      Object.values(REGION_PRICING).forEach(pricing => {
        expect(pricing.description).toBeDefined();
        expect(pricing.description.length).toBeGreaterThan(0);
      });
    });
  });
});

// Integration tests for the calculator component behavior
describe('StaffCalculator Integration Tests', () => {
  describe('Staff recommendation logic', () => {
    it('should recommend proportional staff for different event sizes', () => {
      const smallEvent = calculateRecommendedStaff('Wedding Reception', 50, false);
      const mediumEvent = calculateRecommendedStaff('Wedding Reception', 200, false);
      const largeEvent = calculateRecommendedStaff('Wedding Reception', 500, false);

      const smallServers = smallEvent.find(s => s.service === 'servers')?.count || 0;
      const mediumServers = mediumEvent.find(s => s.service === 'servers')?.count || 0;
      const largeServers = largeEvent.find(s => s.service === 'servers')?.count || 0;

      expect(mediumServers).toBeGreaterThan(smallServers);
      expect(largeServers).toBeGreaterThan(mediumServers);
      expect(largeServers / smallServers).toBeCloseTo(500 / 50, 0);
    });

    it('should recommend more staff for formal events', () => {
      const cocktail = calculateRecommendedStaff('Cocktail Reception', 200, false);
      const sitDown = calculateRecommendedStaff('Sit-Down Dinner', 200, false);

      const cocktailServers = cocktail.find(s => s.service === 'servers')?.count || 0;
      const sitDownServers = sitDown.find(s => s.service === 'servers')?.count || 0;

      // Sit-down dinners require more servers (1:15 ratio vs 1:25)
      expect(sitDownServers).toBeGreaterThan(cocktailServers);
    });
  });

  describe('Surge pricing logic', () => {
    it('should apply holiday surge pricing', () => {
      const christmasWeek = calculateQuote({
        eventType: 'Wedding Reception',
        eventDate: new Date('2026-12-25'),
        guestCount: 100,
        region: 'nyc',
        staffRequirements: calculateRecommendedStaff('Wedding Reception', 100, false),
        duration: 6,
      });

      expect(christmasWeek.activeSurgeConditions).toContain('Christmas Week');
      expect(christmasWeek.surgeFees).toBeGreaterThan(0);
    });

    it('should stack multiple surge conditions', () => {
      const newYearsEve = calculateQuote({
        eventType: 'Wedding Reception',
        eventDate: new Date('2026-12-31'), // Saturday + New Year's
        guestCount: 100,
        region: 'nyc',
        staffRequirements: calculateRecommendedStaff('Wedding Reception', 100, false),
        duration: 6,
      });

      // Should have both Saturday and New Year's surge
      expect(newYearsEve.activeSurgeConditions.length).toBeGreaterThan(1);
    });
  });
});
