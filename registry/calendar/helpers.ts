/**
 * Calendar Helper Utilities
 *
 * This module provides timezone-aware date/time utilities for the calendar system.
 * All functions handle the conversion between admin timezone, viewer timezone, and UTC.
 *
 * Key concepts:
 * - adminTZ: The timezone the scheduler/admin operates in
 * - viewerTZ: The timezone of the person viewing the calendar
 * - UTC: Used as the intermediate format for accurate timezone conversion
 */

import { format, isBefore, startOfDay } from "date-fns";
import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";
import type { Availability, BookedSlot, Slot } from "./types";

/**
 * Checks if a date is in the past (before today at midnight).
 * Used to disable selection of past dates in the calendar.
 *
 * @param date - The date to check
 * @returns true if the date is before today
 */
export function isPastDate(date: Date): boolean {
  return isBefore(startOfDay(date), startOfDay(new Date()));
}

/**
 * Generates an array of time slots between start and end times.
 *
 * @example
 * generateTimeSlots("09:00", "11:00", 30)
 * // Returns: ["09:00", "09:30", "10:00", "10:30"]
 *
 * @param start - Start time in "HH:mm" format
 * @param end - End time in "HH:mm" format
 * @param dur - Duration of each slot in minutes
 * @returns Array of time strings in "HH:mm" format
 */
export function generateTimeSlots(
  start: string,
  end: string,
  dur: number,
): string[] {
  const slots: string[] = [];
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let cur = sh * 60 + sm;
  const endMin = eh * 60 + em;
  while (cur + dur <= endMin) {
    slots.push(
      `${String(Math.floor(cur / 60)).padStart(2, "0")}:${String(cur % 60).padStart(2, "0")}`,
    );
    cur += dur;
  }
  return slots;
}

/**
 * Converts a calendar date + time string combination to a UTC Date object.
 * This is the primary conversion function from admin timezone to UTC.
 *
 * @param calDate - The calendar date
 * @param slotTime - The time string in "HH:mm" format (in adminTZ)
 * @param adminTZ - The admin's IANA timezone
 * @returns UTC Date object
 */
export function slotToUtc(
  calDate: Date,
  slotTime: string,
  adminTZ: string,
): Date {
  return fromZonedTime(
    `${format(calDate, "yyyy-MM-dd")}T${slotTime}:00`,
    adminTZ,
  );
}

/**
 * Formats a UTC Date as a time string in the viewer's timezone.
 * Includes fallback handling for invalid dates or missing timezone.
 *
 * @param utc - UTC Date object
 * @param tz - Viewer's IANA timezone (falls back to UTC if invalid)
 * @returns Formatted time string (e.g., "2:30 PM")
 */
export function formatInViewer(utc: Date, tz: string) {
  try {
    if (!utc || isNaN(new Date(utc).getTime())) {
      return "";
    }

    if (!tz || typeof tz !== "string") {
      return formatInTimeZone(utc, "UTC", "h:mm aa");
    }

    return formatInTimeZone(utc, tz, "h:mm aa");
  } catch {
    return formatInTimeZone(utc, "UTC", "h:mm aa");
  }
}

/**
 * Formats a UTC Date as a time string in the admin's timezone.
 * Used to show the host's local time when timezones differ.
 *
 * @param utc - UTC Date object
 * @param tz - Admin's IANA timezone
 * @returns Formatted time string (e.g., "11:00 AM")
 */
export function formatInAdmin(utc: Date, tz: string) {
  return formatInTimeZone(utc, tz, "h:mm aa");
}

/**
 * Detects the browser's local timezone using the Intl API.
 * Falls back to "UTC" if detection fails.
 *
 * @returns IANA timezone string (e.g., "America/New_York")
 */
export function detectBrowserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

/**
 * Finds the availability schedule for a specific date.
 * Converts the date to the admin's timezone to determine the correct day of week.
 *
 * @param date - The calendar date to check
 * @param availability - Array of weekly availability schedules
 * @param adminTZ - Admin's IANA timezone
 * @returns The matching Availability object, or null if none found
 */
export function getAvailForDate(
  date: Date,
  availability: Availability[],
  adminTZ: string,
) {
  // Get the weekday name as it appears in adminTZ at noon on that date
  const noon = fromZonedTime(`${format(date, "yyyy-MM-dd")}T12:00:00`, adminTZ);
  const dayName = formatInTimeZone(noon, adminTZ, "EEEE").toLowerCase();
  return (
    availability.find((a) => a.day.toLowerCase() === dayName && a.enabled) ??
    null
  );
}

/**
 * Checks if a specific date/time slot is already booked.
 *
 * @param date - The calendar date
 * @param time - Time in "HH:mm" format (in adminTZ)
 * @param booked - Array of booked slots
 * @returns true if the slot is already booked
 */
export function isBooked(date: Date, time: string, booked: BookedSlot[]) {
  const d = format(date, "yyyy-MM-dd");
  return booked.some((s) => s.date === d && s.time === time);
}

/**
 * Generates the complete list of available time slots for a given date.
 * This is the main function that combines all helper logic:
 * 1. Finds the availability schedule for the date
 * 2. Generates time slots based on start/end times
 * 3. Converts each slot to UTC and formats for both timezones
 * 4. Marks booked slots
 *
 * @param date - The calendar date
 * @param availability - Weekly availability schedules
 * @param bookedSlots - Already booked time slots
 * @param duration - Slot duration in minutes
 * @param adminTZ - Admin's IANA timezone
 * @param viewerTZ - Viewer's IANA timezone
 * @returns Array of Slot objects ready for rendering
 */
export function getSlotsForDate(
  date: Date,
  availability: Availability[],
  bookedSlots: BookedSlot[],
  duration: number,
  adminTZ: string,
  viewerTZ: string,
): Slot[] {
  const avail = getAvailForDate(date, availability, adminTZ);
  if (!avail) return [];
  return generateTimeSlots(avail.startTime, avail.endTime, duration).map(
    (adminTime) => {
      const utc = slotToUtc(date, adminTime, adminTZ);
      return {
        adminTime,
        utc,
        displayTime: formatInViewer(utc, viewerTZ),
        adminDisplayTime: formatInAdmin(utc, adminTZ),
        booked: isBooked(date, adminTime, bookedSlots),
      };
    },
  );
}
