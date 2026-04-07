export interface Availability {
	day: string; // 'monday' etc. — wall-clock day in adminTimeZone
	startTime: string; // 'HH:mm'        — in adminTimeZone
	endTime: string; // 'HH:mm'        — in adminTimeZone
	enabled: boolean;
}

export interface BookedSlot {
	date: string; // 'yyyy-MM-dd' — in adminTimeZone
	time: string; // 'HH:mm'     — in adminTimeZone
}

export interface CalendarSchedulerProps {
	availability: Availability[];
	bookedSlots?: BookedSlot[];
	selectedDate?: Date;
	onDateSelect: (date: Date) => void;
	onSlotSelect: (date: Date, time: string) => void;
	/** The timezone the admin's availability is defined in */
	adminTimeZone?: string;
	/** Initial viewer timezone; auto-detected from browser if omitted */
	defaultViewerTimeZone?: string;
	slotDuration: number;
}

export type ViewType = "month" | "week" | "day" | "agenda";

export type Slot = {
	adminTime: string;
	utc: Date;
	displayTime: string; // in viewerTZ
	adminDisplayTime: string; // in adminTZ
	booked: boolean;
};
