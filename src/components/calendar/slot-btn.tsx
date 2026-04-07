import { cn } from "@/lib/utils";
import type { Slot } from "./types";

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
