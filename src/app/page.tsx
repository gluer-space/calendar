"use client";

import { useState } from "react";
import { CalendarScheduler } from "@/components/calendar/calendar";
import type { Availability, BookedSlot } from "@/components/calendar/types";

/**
 * Example page demonstrating how to use the CalendarScheduler component.
 *
 * The CalendarScheduler is a multi-view scheduling component that supports:
 * - Month, Week, Day, and Agenda views
 * - Multi-timezone support (admin and viewer can be in different timezones)
 * - Availability management (set weekly recurring availability)
 * - Booked slot tracking
 *
 * Basic usage:
 * 1. Define availability as an array of weekly schedules
 * 2. Optionally provide already-booked slots
 * 3. Set the slot duration (in minutes)
 * 4. Set the admin timezone (the timezone your availability is defined in)
 * 5. Handle the onSlotSelect callback to process bookings
 */

export default function Home() {
  // Track selected date and booked slot for display purposes
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [lastBooked, setLastBooked] = useState<{
    date: Date;
    time: string;
  } | null>(null);

  /**
   * Define your weekly availability.
   * Each entry represents a recurring availability window for a specific day.
   * Times are in 24-hour format and interpreted in the adminTimeZone.
   */
  const availability: Availability[] = [
    { day: "monday", startTime: "09:00", endTime: "17:00", enabled: true },
    { day: "tuesday", startTime: "09:00", endTime: "17:00", enabled: true },
    { day: "wednesday", startTime: "10:00", endTime: "15:00", enabled: true },
    { day: "thursday", startTime: "09:00", endTime: "17:00", enabled: true },
    { day: "friday", startTime: "09:00", endTime: "12:00", enabled: true },
    { day: "saturday", startTime: "10:00", endTime: "14:00", enabled: false }, // Disabled
    { day: "sunday", startTime: "00:00", endTime: "00:00", enabled: false }, // Unavailable
  ];

  /**
   * List of already-booked time slots.
   * In a real app, this would come from your database.
   * Dates and times are in the admin's timezone.
   */
  const bookedSlots: BookedSlot[] = [
    // Example: tomorrow at 10:00 AM is already booked
    {
      date: "2024-03-15",
      time: "10:00",
    },
    {
      date: "2024-03-15",
      time: "14:30",
    },
  ];

  /**
   * Handler for when a time slot is selected.
   * In a real app, you would make an API call to book the slot.
   */
  const handleSlotSelect = (date: Date, time: string) => {
    console.log("Slot selected:", { date, time });
    setLastBooked({ date, time });
    // Example API call:
    // await fetch('/api/book', {
    //   method: 'POST',
    //   body: JSON.stringify({ date, time }),
    // });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Book a Meeting</h1>
          <p className="text-muted-foreground">
            Select a date and time that works for you. All times are shown in
            your local timezone.
          </p>
        </div>

        {/* Calendar Component */}
        <CalendarScheduler
          availability={availability}
          bookedSlots={bookedSlots}
          selectedDate={selectedDate}
          slotDuration={30} // 30-minute slots
          adminTimeZone="America/New_York" // Host is in Eastern Time
          onDateSelect={setSelectedDate}
          onSlotSelect={handleSlotSelect}
        />

        {/* Example of what happens when a slot is selected */}
        {lastBooked && (
          <div className="p-4 border rounded-lg bg-muted/20">
            <h2 className="font-semibold mb-2">Last Selected Slot:</h2>
            <pre className="text-sm font-mono">
              {JSON.stringify(
                {
                  date: lastBooked.date.toLocaleDateString(),
                  time: lastBooked.time,
                },
                null,
                2,
              )}
            </pre>
          </div>
        )}

        {/* Usage documentation */}
        <div className="p-6 border rounded-lg space-y-4 bg-card">
          <h2 className="text-xl font-semibold">
            How to Use CalendarScheduler
          </h2>

          <div className="space-y-3">
            <h3 className="font-medium">1. Basic Usage</h3>
            <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
              {`<CalendarScheduler
  availability={[
    { day: 'monday', startTime: '09:00', endTime: '17:00', enabled: true }
  ]}
  slotDuration={30}
  onDateSelect={(date) => console.log(date)}
  onSlotSelect={(date, time) => console.log(date, time)}
/>`}
            </pre>

            <h3 className="font-medium">2. With Timezone Support</h3>
            <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
              {`<CalendarScheduler
  availability={availability}
  slotDuration={30}
  adminTimeZone="America/Los_Angeles"
  defaultViewerTimeZone="Europe/London"
  onSlotSelect={handleBooking}
/>`}
            </pre>

            <h3 className="font-medium">3. With Booked Slots</h3>
            <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
              {`<CalendarScheduler
  availability={availability}
  bookedSlots={[
    { date: '2024-03-15', time: '10:00' },
    { date: '2024-03-15', time: '14:00' }
  ]}
  slotDuration={60}
  onSlotSelect={handleBooking}
/>`}
            </pre>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Props</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Prop</th>
                  <th className="text-left py-2 font-medium">Type</th>
                  <th className="text-left py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs">
                <tr className="border-b">
                  <td className="py-2">availability</td>
                  <td className="py-2">Availability[]</td>
                  <td className="py-2 font-sans">
                    Weekly availability schedule
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">bookedSlots</td>
                  <td className="py-2">BookedSlot[]</td>
                  <td className="py-2 font-sans">Already booked time slots</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">slotDuration</td>
                  <td className="py-2">number</td>
                  <td className="py-2 font-sans">Slot length in minutes</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">adminTimeZone</td>
                  <td className="py-2">string</td>
                  <td className="py-2 font-sans">
                    IANA timezone for availability
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">onSlotSelect</td>
                  <td className="py-2">(date, time) =&gt; void</td>
                  <td className="py-2 font-sans">
                    Callback when slot is clicked
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
