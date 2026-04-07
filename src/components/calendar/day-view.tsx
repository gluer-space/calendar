import { format, isBefore } from "date-fns";
import { Calendar1, Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getAvailForDate, getSlotsForDate, isPastDate } from "./helpers";
import { SlotTip } from "./tooltip";
import type { Availability, BookedSlot } from "./types";

export function DayView({
  current,
  availability,
  bookedSlots,
  slotDuration,
  adminTZ,
  viewerTZ,
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
  const avail = getAvailForDate(current, availability, adminTZ);
  const slots = getSlotsForDate(
    current,
    availability,
    bookedSlots,
    slotDuration,
    adminTZ,
    viewerTZ,
  );
  const bookedCount = slots.filter((s) => s.booked).length;
  const isPast = isPastDate(current);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="md:text-lg text-base font-medium">
            {format(current, "EEEE")}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground">
            {format(current, "MMMM d, yyyy")}
          </p>
        </div>
        {isPast ? (
          <Badge variant="outline" className="text-muted-foreground">
            Past date
          </Badge>
        ) : avail ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {/*<Clock className="h-3.5 w-3.5" />*/}
            {/*<span>*/}
            {/*{formatInViewer(
                slotToUtc(current, avail.startTime, adminTZ),
                viewerTZ,
              )}
              {" – "}
              {formatInViewer(
                slotToUtc(current, avail.endTime, adminTZ),
                viewerTZ,
              )}*/}
            {/*{adminTZ !== viewerTZ && (
                <span className="ml-1 text-[10px]">(your time)</span>
              )}*/}
            {/*</span>*/}
            {bookedCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {bookedCount} booked
              </Badge>
            )}
          </div>
        ) : (
          <Badge variant="outline" className="text-muted-foreground">
            Unavailable
          </Badge>
        )}
      </div>

      {isPast ? (
        <div className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground border-2 border-dashed rounded-xl">
          <Calendar className="h-8 w-8 opacity-30" />
          <p className="text-sm">This date is in the past</p>
        </div>
      ) : slots.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground border-2 border-dashed rounded-xl">
          <Calendar1 className="h-8 w-8 opacity-30" />
          <p className="text-sm">No available slots for this day</p>
        </div>
      ) : (
        <ScrollArea className="h-[360px] pr-2">
          <div className="space-y-2">
            {slots.map((slot) => {
              const isPast = isBefore(new Date(slot.utc), new Date());

              return (
                <TooltipProvider key={slot.adminTime} delayDuration={80}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        disabled={slot.booked || isPast}
                        onClick={() => onSlotSelect(current, slot.adminTime)}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-150",
                          slot.booked
                            ? "bg-muted/50 border-border text-muted-foreground cursor-not-allowed"
                            : "bg-background border-border hover:border-primary hover:bg-primary/5 hover:text-primary active:scale-[0.99]",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Clock className={"size-4"} />
                          <div className="text-left">
                            {isPast && (
                              <span className="block text-[10px] text-muted-foreground">
                                Past
                              </span>
                            )}
                            <span className="block">{slot.displayTime}</span>
                            {adminTZ !== viewerTZ && (
                              <span className="block text-[10px] text-muted-foreground">
                                {slot.adminDisplayTime} (host)
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <SlotTip
                        slot={slot}
                        adminTZ={adminTZ}
                        viewerTZ={viewerTZ}
                      />
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
