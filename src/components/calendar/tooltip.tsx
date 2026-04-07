/**
 * SlotTip - Tooltip Content for Time Slots
 *
 * A tooltip component shown when hovering over a time slot.
 * Displays the slot status (available/booked) and times in both
 * the viewer's and host's timezones.
 *
 * Used by DayView, AgendaView, and other components that show
 * individual time slots.
 *
 * @example
 * <Tooltip>
 *   <TooltipTrigger asChild>
 *     <button>2:00 PM</button>
 *   </TooltipTrigger>
 *   <TooltipContent>
 *     <SlotTip
 *       slot={slot}
 *       adminTZ="America/New_York"
 *       viewerTZ="America/Los_Angeles"
 *     />
 *   </TooltipContent>
 * </Tooltip>
 */

import type { Slot } from "./types";

/**
 * Renders tooltip content showing both viewer and host times for a slot.
 */
export function SlotTip({
  slot,
  adminTZ,
  viewerTZ,
}: {
  slot: Slot;
  adminTZ: string;
  viewerTZ: string;
}) {
  return (
    <div className="text-xs space-y-1 min-w-[140px]">
      {slot.booked ? (
        <p className="font-medium text-rose-400">Already booked</p>
      ) : (
        <p className="font-medium">Book this slot</p>
      )}
      <p className="text-muted-foreground">
        Your time:{" "}
        <span className="text-background font-semibold">
          {slot.displayTime}
        </span>
      </p>
      {adminTZ !== viewerTZ && (
        <p className="text-muted-foreground">
          Host time:{" "}
          <span className="text-background font-semibold">
            {slot.adminDisplayTime}
          </span>
        </p>
      )}
    </div>
  );
}
