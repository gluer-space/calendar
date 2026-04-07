/**
 * SlotBtn - Time Slot Button Component
 *
 * A compact button used in the month view side panel to display a single time slot.
 * Shows the time in viewer's timezone and optionally the host's timezone.
 * Handles past and booked states with appropriate styling.
 *
 * @example
 * <SlotBtn
 *   slot={{ adminTime: "14:00", utc: new Date(), displayTime: "2:00 PM", adminDisplayTime: "11:00 AM", booked: false }}
 *   date={new Date()}
 *   adminTZ="America/New_York"
 *   viewerTZ="America/Los_Angeles"
 *   onSlotSelect={(date, time) => handleBooking(date, time)}
 * />
 */

import { cn } from "@/lib/utils";
import type { Slot } from "./types";

/**
 * Renders a clickable time slot button.
 * Disabled and hidden if the slot is in the past or already booked.
 */
export function SlotBtn({
  slot,
  date,
  adminTZ,
  viewerTZ,
  onSlotSelect,
}: {
  slot: Slot;
  date: Date;
  adminTZ: string;
  viewerTZ: string;
  onSlotSelect: (d: Date, t: string) => void;
}) {
  const isPast = slot.booked || new Date(slot.utc) <= new Date();
  return (
    <button
      onClick={() => !isPast && onSlotSelect(date, slot.adminTime)}
      className={cn(
        "disabled:hidden cursor-pointer rounded-md px-2 py-2 text-xs font-medium transition-all duration-150 border text-left",
        slot.booked
          ? "bg-muted text-muted-foreground border-transparent cursor-not-allowed line-through opacity-50"
          : "bg-background border-border hover:border-primary hover:bg-primary/5 hover:text-primary active:scale-95",
      )}
    >
      {isPast && (
        <span className="block mb-1 text-[9px] text-muted-foreground leading-tight mt-0.5">
          Past
        </span>
      )}
      <span className="block">{slot.displayTime}</span>
      {adminTZ !== viewerTZ && (
        <span className="block text-[9px] text-muted-foreground leading-tight mt-0.5">
          {slot.adminDisplayTime} host
        </span>
      )}
    </button>
  );
}
