import {
  addDays,
  format,
  isBefore,
  isSameDay,
  isToday,
  startOfWeek,
} from "date-fns";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  formatInAdmin,
  formatInViewer,
  generateTimeSlots,
  getAvailForDate,
  isBooked,
  isPastDate,
  slotToUtc,
} from "./helpers";
import type { Availability, BookedSlot } from "./types";

export function WeekView({
  current,
  selectedDate,
  availability,
  bookedSlots,
  slotDuration,
  adminTZ,
  viewerTZ,
  onDateSelect,
  onSlotSelect,
}: {
  current: Date;
  selectedDate?: Date;
  availability: Availability[];
  bookedSlots: BookedSlot[];
  slotDuration: number;
  adminTZ: string;
  viewerTZ: string;
  onDateSelect: (d: Date) => void;
  onSlotSelect: (d: Date, t: string) => void;
}) {
  const weekStart = startOfWeek(current, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const allAdminTimes = useMemo(() => {
    const set = new Set<string>();
    weekDays.forEach((day) => {
      const avail = getAvailForDate(day, availability, adminTZ);
      if (avail)
        generateTimeSlots(avail.startTime, avail.endTime, slotDuration).forEach(
          (t) => set.add(t),
        );
    });
    return Array.from(set).sort();
  }, [weekDays, availability, slotDuration, adminTZ]);

  return (
    <div className="overflow-x-auto no-scrollbar">
      <div className="min-w-[600px]">
        <div
          className="grid border-b"
          style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}
        >
          <div className="py-2 px-2 text-xs justify-center flex flex-col text-muted-foreground items-center gap-0.5 font-medium">
            {adminTZ !== viewerTZ ? (
              <>
                <span className="block">Your TZ</span>
                <span className="block opacity-60">Host TZ</span>
              </>
            ) : (
              ""
            )}
          </div>
          {weekDays.map((day) => {
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isPast = isPastDate(day);
            return (
              <button
                key={day.toISOString()}
                disabled={isPast}
                onClick={() => !isPast && onDateSelect(day)}
                className={cn(
                  "py-3 flex flex-col items-center gap-0.5 transition-colors",
                  isPast ? "opacity-40 cursor-not-allowed" : "hover:bg-accent",
                  !isPast && isSelected && "bg-primary/5",
                )}
              >
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {format(day, "EEE")}
                </span>
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold",
                    isToday(day) && "bg-primary text-primary-foreground",
                    !isPast &&
                      isSelected &&
                      !isToday(day) &&
                      "ring-2 ring-primary text-primary",
                  )}
                >
                  {format(day, "d")}
                </span>
              </button>
            );
          })}
        </div>
        <ScrollArea className="h-[420px]">
          {allAdminTimes.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
              No availability this week
            </div>
          ) : (
            allAdminTimes.map((adminTime) => {
              const repUtc = slotToUtc(weekDays[1], adminTime, adminTZ);
              return (
                <div
                  key={adminTime}
                  className="grid border-b last:border-b-0 hover:bg-muted/20 transition-colors"
                  style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}
                >
                  <div className="py-2 px-2 text-right pr-3 leading-none pt-2">
                    <span className="text-[10px] text-foreground font-mono block">
                      {formatInViewer(repUtc, viewerTZ)}
                    </span>
                    {adminTZ !== viewerTZ && (
                      <span className="text-[9px] text-muted-foreground font-mono block mt-0.5">
                        {formatInAdmin(repUtc, adminTZ)}
                      </span>
                    )}
                  </div>
                  {weekDays.map((day) => {
                    const avail = getAvailForDate(day, availability, adminTZ);
                    const exists = avail
                      ? generateTimeSlots(
                          avail.startTime,
                          avail.endTime,
                          slotDuration,
                        ).includes(adminTime)
                      : false;
                    const booked = isBooked(day, adminTime, bookedSlots);
                    const isPast =
                      isPastDate(day) || isBefore(new Date(day), new Date());
                    if (!exists)
                      return (
                        <div
                          key={day.toISOString()}
                          className="border-l py-1.5 px-1"
                        />
                      );
                    return (
                      <div
                        key={day.toISOString()}
                        className="border-l py-1 px-1"
                      >
                        <button
                          disabled={booked || isPast}
                          onClick={() => {
                            onDateSelect(day);
                            onSlotSelect(day, adminTime);
                          }}
                          className={cn(
                            "w-full rounded px-1 py-1.5 text-[10px] font-medium transition-all duration-150",
                            isPast
                              ? "bg-muted/50 text-muted-foreground cursor-not-allowed opacity-40"
                              : booked
                                ? "bg-rose-100 text-rose-400 dark:bg-rose-950/40 cursor-not-allowed line-through"
                                : "bg-emerald-50 text-emerald-700 hover:bg-primary hover:text-primary-foreground dark:bg-emerald-950/30 dark:text-emerald-400 active:scale-95",
                          )}
                        >
                          {isPast ? "Past" : booked ? "Booked" : "Open"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
