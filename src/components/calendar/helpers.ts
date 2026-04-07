import { format, isBefore, startOfDay } from "date-fns";
import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";
import type { Availability, BookedSlot, Slot } from "./types";

export function isPastDate(date: Date): boolean {
	return isBefore(startOfDay(date), startOfDay(new Date()));
}

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
export function formatInAdmin(utc: Date, tz: string) {
	return formatInTimeZone(utc, tz, "h:mm aa");
}

export function detectBrowserTimezone(): string {
	try {
		return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
	} catch {
		return "UTC";
	}
}

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

export function isBooked(date: Date, time: string, booked: BookedSlot[]) {
	const d = format(date, "yyyy-MM-dd");
	return booked.some((s) => s.date === d && s.time === time);
}

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
