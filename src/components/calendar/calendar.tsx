"use client";

import {
  addDays,
  addMonths,
  addWeeks,
  endOfWeek,
  format,
  isBefore,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { ChevronLeft, ChevronRight, Globe } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AgendaView } from "./agenda-view";
import { DayView } from "./day-view";
import { detectBrowserTimezone } from "./helpers";
import { MonthView } from "./month-view";
import { TimezoneSelect } from "./timezone-selector";
import { ALL_TIMEZONES } from "./timezones";
import type { CalendarSchedulerProps, ViewType } from "./types";
import { ViewSwitcher } from "./view-switcher";
import { WeekView } from "./week-view";

export function CalendarScheduler({
  availability,
  bookedSlots = [],
  selectedDate,
  onDateSelect,
  onSlotSelect,
  adminTimeZone = "UTC",
  defaultViewerTimeZone,
  slotDuration,
}: CalendarSchedulerProps) {
  const [view, setView] = useState<ViewType>("month");
  const [current, setCurrent] = useState<Date>(selectedDate ?? new Date());
  const [vTz, setVtZ] = useState(
    defaultViewerTimeZone ?? detectBrowserTimezone(),
  );
  const [viewerTZ, setViewerTZ] = useState<string>(vTz);
  function handleZoneChange(tz: string) {
    setViewerTZ(tz);
    setVtZ(tz);
  }

  function navigate(dir: 1 | -1) {
    if (view === "month")
      setCurrent((c) => (dir === 1 ? addMonths(c, 1) : subMonths(c, 1)));
    if (view === "week")
      setCurrent((c) => (dir === 1 ? addWeeks(c, 1) : subWeeks(c, 1)));
    if (view === "day")
      setCurrent((c) => (dir === 1 ? addDays(c, 1) : subDays(c, 1)));
    if (view === "agenda")
      setCurrent((c) => (dir === 1 ? addMonths(c, 1) : subMonths(c, 1)));
  }

  function getTitle() {
    if (view === "month") return format(current, "MMMM yyyy");
    if (view === "week") {
      const ws = startOfWeek(current, { weekStartsOn: 0 });
      const we = endOfWeek(current, { weekStartsOn: 0 });
      return `${format(ws, "MMM d")} – ${format(we, "MMM d, yyyy")}`;
    }
    if (view === "day") return format(current, "EEEE, MMMM d, yyyy");
    return `Agenda – ${format(current, "MMMM yyyy")}`;
  }

  const adminLabel =
    ALL_TIMEZONES.find((z) => z.value === adminTimeZone)?.label ??
    adminTimeZone;
  const viewerLabel =
    ALL_TIMEZONES.find((z) => z.value === viewerTZ)?.label ?? viewerTZ;

  const sharedProps = {
    current,
    availability,
    bookedSlots,
    slotDuration,
    adminTZ: adminTimeZone,
    viewerTZ: vTz,
    onDateSelect: (d: Date) => {
      setCurrent(d);
      onDateSelect(d);
    },
    onSlotSelect,
  };

  return (
    <div className="flex flex-col rounded-2xl border overflow-scroll no-scrollbar bg-background w-full">
      <div className="flex items-center justify-between gap-3 px-4 overflow-scroll no-scrollbar py-3 border-b bg-muted/30 flex-wrap gap-y-2">
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="h-7 w-7"
            onClick={() => navigate(-1)}
            disabled={
              view === "month" &&
              isBefore(
                startOfMonth(subMonths(current, 1)),
                startOfMonth(new Date()),
              )
            }
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs font-semibold px-2"
          >
            {getTitle()}
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-7 w-7"
            onClick={() => navigate(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          {/*<Button
            onClick={() => setCurrent(new Date())}
            variant="ghost"
            size="sm"
            className="h-7 text-xs font-semibold px-2"
          >
            Today
          </Button>*/}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <TimezoneSelect
            value={vTz}
            onChange={handleZoneChange}
            label="Your timezone"
          />
          <ViewSwitcher view={view} onChange={setView} />
        </div>
      </div>

      {/*<div className="sm:hidden px-4 pt-2 pb-0">
        <p className="text-sm font-semibold text-foreground">{getTitle()}</p>
      </div>*/}

      {/*{adminTimeZone !== viewerTZ && (
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50/70 dark:bg-blue-950/20 border-b text-xs text-blue-700 dark:text-blue-300">
          <Globe className="h-3.5 w-3.5 shrink-0" />
          <span>
            Times shown in <strong>{viewerLabel}</strong>. Host is in{" "}
            <strong>{adminLabel}</strong>. Hover any slot to see both times.
          </span>
        </div>
      )}*/}

      <div className="flex-1">
        {view === "month" && (
          <MonthView {...sharedProps} selectedDate={current} />
        )}
        {view === "week" && (
          <WeekView {...sharedProps} selectedDate={selectedDate} />
        )}
        {view === "day" && <DayView {...sharedProps} />}
        {view === "agenda" && <AgendaView {...sharedProps} />}
      </div>

      <div className="flex items-center gap-4 px-4 py-2 border-t bg-muted/20 w-full text-[10px] text-muted-foreground flex-wrap">
        {/*<span className="flex items-center gap-1.5">
					<span className="h-2 w-2 rounded-sm bg-emerald-400/70" /> Available
				</span>
				<span className="flex items-center gap-1.5">
					<span className="h-2 w-2 rounded-sm bg-rose-400/70" /> Booked
				</span>
				<span className="flex items-center gap-1.5">
					<span className="h-2 w-2 bg-primary/70 rounded-full" /> Today
				</span>*/}
        <span className="flex items-center gap-3">
          <span>{slotDuration}min slots</span>
          {adminTimeZone !== viewerTZ && (
            <span className="flex items-center gap-1">
              <Globe className="h-3 w-3" /> Host: {adminLabel}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

export default CalendarScheduler;
