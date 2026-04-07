import type { Slot } from "./types";

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
