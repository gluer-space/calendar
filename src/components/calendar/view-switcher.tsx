import { Calendar, LayoutGrid, List, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ViewType } from "./types";

export function ViewSwitcher({
	view,
	onChange,
}: {
	view: ViewType;
	onChange: (v: ViewType) => void;
}) {
	const views: { key: ViewType; icon: React.ReactNode; label: string }[] = [
		{
			key: "month",
			icon: <LayoutGrid className="h-3.5 w-3.5" />,
			label: "Month",
		},
		{ key: "week", icon: <Calendar className="h-3.5 w-3.5" />, label: "Week" },
		{ key: "day", icon: <Sun className="h-3.5 w-3.5" />, label: "Day" },
		{ key: "agenda", icon: <List className="h-3.5 w-3.5" />, label: "Agenda" },
	];
	return (
		<div className="flex items-center gap-0.5 bg-muted rounded-lg p-0.5">
			{views.map((v) => (
				<button
					key={v.key}
					onClick={() => onChange(v.key)}
					className={cn(
						"flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150",
						view === v.key
							? "bg-background text-foreground shadow-sm"
							: "text-muted-foreground hover:text-foreground",
					)}
				>
					{v.icon}
					<span className="hidden sm:flex">{v.label}</span>
				</button>
			))}
		</div>
	);
}
