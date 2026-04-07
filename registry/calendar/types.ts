/**
 * Calendar Scheduler Types
 *
 * This module defines the core data structures used throughout the calendar system.
 * The calendar supports multi-timezone scheduling where an admin defines their availability
 * in their own timezone, and viewers see times converted to their local timezone.
 */

/**
 * Represents a recurring availability window for a specific day of the week.
 * All times are in the admin's timezone.
 *
 * @example
 * {
 *   day: 'monday',
 *   startTime: '09:00',
 *   endTime: '17:00',
 *   enabled: true
 * }
 */
export interface Availability {
  /** Day of the week in lowercase (e.g., 'monday', 'tuesday'). Evaluated in adminTimeZone. */
  day: string;
  /** Start time in 'HH:mm' 24-hour format, interpreted in adminTimeZone. */
  startTime: string;
  /** End time in 'HH:mm' 24-hour format, interpreted in adminTimeZone. */
  endTime: string;
  /** Whether this availability window is currently active. */
  enabled: boolean;
}

/**
 * Represents a specific time slot that has already been booked.
 * Both date and time are stored in the admin's timezone.
 *
 * @example
 * {
 *   date: '2024-03-15',
 *   time: '14:00'
 * }
 */
export interface BookedSlot {
  /** Date in 'yyyy-MM-dd' format, in adminTimeZone. */
  date: string;
  /** Time in 'HH:mm' format, in adminTimeZone. */
  time: string;
}

/**
 * Props interface for the main CalendarScheduler component.
 *
 * @example
 * <CalendarScheduler
 *   availability={[{ day: 'monday', startTime: '09:00', endTime: '17:00', enabled: true }]}
 *   bookedSlots={[{ date: '2024-03-15', time: '10:00' }]}
 *   slotDuration={30}
 *   adminTimeZone="America/New_York"
 *   onDateSelect={(date) => console.log('Selected:', date)}
 *   onSlotSelect={(date, time) => console.log('Booked:', date, time)}
 * />
 */
export interface CalendarSchedulerProps {
  /** Array of weekly availability windows defined in adminTimeZone. */
  availability: Availability[];
  /** List of already-booked time slots. Defaults to empty array. */
  bookedSlots?: BookedSlot[];
  /** Initially selected date. Defaults to today if not provided. */
  selectedDate?: Date;
  /** Callback fired when a date is selected in any view. */
  onDateSelect: (date: Date) => void;
  /** Callback fired when a time slot is selected for booking. */
  onSlotSelect: (date: Date, time: string) => void;
  /** The IANA timezone identifier the admin's availability is defined in. Defaults to "UTC". */
  adminTimeZone?: string;
  /** Initial viewer timezone. Auto-detected from browser if omitted. */
  defaultViewerTimeZone?: string;
  /** Duration of each booking slot in minutes (e.g., 15, 30, 60). */
  slotDuration: number;
}

/** The four calendar view modes available to users. */
export type ViewType = "month" | "week" | "day" | "agenda";

/**
 * Represents a single time slot with times pre-converted for display.
 * This object caches both admin-time and viewer-time representations
 * to avoid repeated timezone calculations during rendering.
 */
export type Slot = {
  /** The original time in admin timezone ('HH:mm' format). */
  adminTime: string;
  /** The slot time converted to UTC as a Date object. */
  utc: Date;
  /** The display time formatted in the viewer's timezone (e.g., '2:00 PM'). */
  displayTime: string;
  /** The display time formatted in the admin's timezone (e.g., '11:00 AM'). */
  adminDisplayTime: string;
  /** Whether this slot has already been booked. */
  booked: boolean;
};
