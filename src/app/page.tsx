"use client";

import { format } from "date-fns";
import { useState } from "react";
import { CalendarScheduler } from "@/components/calendar/calendar";
import type { Availability, BookedSlot } from "@/components/calendar/types";

const availability: Availability[] = [
  { day: "monday", startTime: "09:00", endTime: "17:00", enabled: true },
  { day: "tuesday", startTime: "09:00", endTime: "17:00", enabled: true },
  { day: "wednesday", startTime: "10:00", endTime: "15:00", enabled: true },
  { day: "thursday", startTime: "09:00", endTime: "17:00", enabled: true },
  { day: "friday", startTime: "09:00", endTime: "12:00", enabled: true },
  { day: "saturday", startTime: "10:00", endTime: "14:00", enabled: false },
  { day: "sunday", startTime: "00:00", endTime: "00:00", enabled: false },
];

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [lastBooked, setLastBooked] = useState<{
    date: Date;
    time: string;
  } | null>(null);

  const bookedSlots: BookedSlot[] = [
    {
      date: format(new Date(), "yyyy-MM-dd"),
      time: "10:00",
    },
    {
      date: format(new Date(), "yyyy-MM-dd"),
      time: "14:30",
    },
  ];

  const handleSlotSelect = (date: Date, time: string) => {
    setLastBooked({ date, time });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-xl font-semibold mb-1.5">CalendarScheduler</h1>
        <p className="text-sm text-muted-foreground">
          Multi-view scheduler with timezone support. Month, week, day, and
          agenda views with automatic timezone conversion.
        </p>
      </div>

      <CalendarScheduler
        availability={availability}
        bookedSlots={bookedSlots}
        selectedDate={selectedDate}
        slotDuration={30}
        adminTimeZone="America/New_York"
        onDateSelect={setSelectedDate}
        onSlotSelect={handleSlotSelect}
      />

      {lastBooked && (
        <div className="mt-4 text-xs font-mono text-muted-foreground">
          Selected: {lastBooked.date.toLocaleDateString()} at {lastBooked.time}
        </div>
      )}

      <div className="mt-12 pt-8 border-t space-y-8">
        <section>
          <h2 className="text-sm font-medium mb-3">Usage</h2>
          <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
            {`<CalendarScheduler
  availability={[
    { day: "monday", startTime: "09:00", endTime: "17:00", enabled: true },
  ]}
  bookedSlots={[{ date: "2024-03-15", time: "10:00" }]}
  slotDuration={30}
  adminTimeZone="America/New_York"
  onDateSelect={(date) => setSelectedDate(date)}
  onSlotSelect={(date, time) => handleBooking(date, time)}
/>`}
          </pre>
        </section>

        <section>
          <h2 className="text-sm font-medium mb-3">Props</h2>
          <div className="text-xs space-y-1 font-mono">
            <div className="flex gap-4 py-1.5 border-b border-dashed">
              <span className="w-48 shrink-0">availability</span>
              <span className="text-muted-foreground w-36 shrink-0">
                Availability[]
              </span>
              <span>Weekly availability schedule</span>
            </div>
            <div className="flex gap-4 py-1.5 border-b border-dashed">
              <span className="w-48 shrink-0">bookedSlots?</span>
              <span className="text-muted-foreground w-36 shrink-0">
                BookedSlot[]
              </span>
              <span>Already booked slots</span>
            </div>
            <div className="flex gap-4 py-1.5 border-b border-dashed">
              <span className="w-48 shrink-0">slotDuration</span>
              <span className="text-muted-foreground w-36 shrink-0">
                number
              </span>
              <span>Slot length in minutes</span>
            </div>
            <div className="flex gap-4 py-1.5 border-b border-dashed">
              <span className="w-48 shrink-0">adminTimeZone?</span>
              <span className="text-muted-foreground w-36 shrink-0">
                string
              </span>
              <span>IANA timezone (default: &quot;UTC&quot;)</span>
            </div>
            <div className="flex gap-4 py-1.5 border-b border-dashed">
              <span className="w-48 shrink-0">onSlotSelect</span>
              <span className="text-muted-foreground w-36 shrink-0">
                (date, time) =&gt; void
              </span>
              <span>Called when a slot is clicked</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
