import { addDays, format, isBefore, isToday, startOfDay } from "date-fns";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getAvailForDate, getSlotsForDate } from "./helpers";
import { SlotTip } from "./tooltip";
import type { Availability, BookedSlot } from "./types";

export function AgendaView({
  current,
  availability,
  bookedSlots,
  slotDuration,
  adminTZ,
  viewerTZ,
  onDateSelect,
  onSlotSelect,
}: {
  current: Date;
  availability: Availability[];
  bookedSlots: BookedSlot[];
  slotDuration: number;
  adminTZ: string;
  viewerTZ: string;
  onDateSelect: (d: Date) => void;
  onSlotSelect: (d: Date, t: string) => void;
}) {
  const start = isBefore(startOfDay(current), startOfDay(new Date()))
    ? new Date()
    : current;
  const activeDays = Array.from({ length: 30 }, (_, i) =>
    addDays(start, i),
  ).filter((d) => getAvailForDate(d, availability, adminTZ));

  return (
    <ScrollArea className="h-[520px]">
      <div className="p-4 space-y-6">
        {activeDays.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground">
            <Calendar className="h-8 w-8 opacity-30" />
            <p className="text-sm">
              No upcoming availability in the next 30 days
            </p>
          </div>
        )}
        {activeDays.map((day) => {
          const slots = getSlotsForDate(
            day,
            availability,
            bookedSlots,
            slotDuration,
            adminTZ,
            viewerTZ,
          );
          const available = slots.filter((s) => !s.booked);
          return (
            <div key={day.toISOString()} className="flex gap-4">
              <div
                className="flex flex-col items-center w-14 shrink-0 cursor-pointer"
                onClick={() => onDateSelect(day)}
              >
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {format(day, "EEE")}
                </span>
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold mt-0.5",
                    isToday(day)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent",
                  )}
                >
                  {format(day, "d")}
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5">
                  {format(day, "MMM")}
                </span>
              </div>
              <div className="flex-1 pt-1">
                <div className="flex flex-wrap gap-2">
                  {available.length === 0 ? (
                    <span className="text-xs text-muted-foreground italic">
                      All slots booked
                    </span>
                  ) : (
                    available.map((slot) => {
                      const isPast = isBefore(new Date(slot.utc), new Date());
                      return (
                        <TooltipProvider
                          key={slot.adminTime}
                          delayDuration={80}
                        >
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => {
                                  onDateSelect(day);
                                  onSlotSelect(day, slot.adminTime);
                                }}
                                disabled={isPast}
                                className="rounded-lg border border-border bg-background hover:border-primary hover:bg-primary/5 hover:text-primary px-3 py-1.5 text-xs font-medium transition-all duration-150 active:scale-95 text-left"
                              >
                                {isPast && (
                                  <span className="block text-[9px] text-muted-foreground">
                                    Past
                                  </span>
                                )}
                                <span className="block">
                                  {slot.displayTime}
                                </span>
                                {adminTZ !== viewerTZ && (
                                  <span className="block text-[9px] text-muted-foreground">
                                    {slot.adminDisplayTime} host
                                  </span>
                                )}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <SlotTip
                                slot={slot}
                                adminTZ={adminTZ}
                                viewerTZ={viewerTZ}
                              />
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })
                  )}
                </div>
                {slots.some((s) => s.booked) && (
                  <p className="text-[10px] text-muted-foreground mt-1.5">
                    {slots.filter((s) => s.booked).length} slot
                    {slots.filter((s) => s.booked).length !== 1 ? "s" : ""}{" "}
                    already booked
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
