/**
 * TimezoneSelector - Timezone Selection Dropdown
 *
 * A dropdown selector that lets users choose their timezone.
 * Timezones are grouped by region (Americas, Europe, Asia & Pacific, etc.)
 * with sticky region headers for easy navigation.
 *
 * @example
 * <TimezoneSelect
 *   value="America/New_York"
 *   onChange={(tz) => setViewerTimezone(tz)}
 *   label="Your timezone"
 * />
 */

import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TIMEZONE_GROUPS } from "./timezones";

/**
 * Renders a timezone selector with grouped options.
 */
export function TimezoneSelect({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (tz: string) => void;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1 bg-muted pl-3 rounded-xl w-full md:w-fit">
      <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      {/*<span className="text-xs text-muted-foreground hidden lg:block whitespace-nowrap">
        {label}:
      </span>*/}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-7 text-xs md:w-[180px] w-full border-0 bg-muted! focus:ring-0 focus:ring-offset-0">
          <SelectValue>{value}</SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-72">
          {TIMEZONE_GROUPS.map((group) => (
            <div key={group.region}>
              <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/40 sticky top-0">
                {group.region}
              </div>
              {group.zones.map((z) => (
                <SelectItem key={z.value} value={z.value} className="text-xs">
                  {z.value}
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
