import * as React from "react";
import {
  addDays,
  addMonths,
  format,
  getDate,
  getDaysInMonth,
  isSameDay,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
  subDays,
} from "date-fns";
import { ChevronLeft, ChevronRight, Edit2, Plus, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Day {
  date: Date;
  isToday: boolean;
  isSelected: boolean;
}

interface GlassCalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

const ScrollbarHide = () => (
  <style>{`
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  `}</style>
);

export const GlassCalendar = React.forwardRef<HTMLDivElement, GlassCalendarProps>(
  ({ className, selectedDate: propSelectedDate, onDateSelect, ...props }, ref) => {
    const initialDate = propSelectedDate ?? new Date();
    const [currentMonth, setCurrentMonth] = React.useState(initialDate);
    const [selectedDate, setSelectedDate] = React.useState(initialDate);
    const [viewMode, setViewMode] = React.useState<"weekly" | "monthly">("weekly");

    React.useEffect(() => {
      if (!propSelectedDate || isSameDay(propSelectedDate, selectedDate)) return;
      setSelectedDate(propSelectedDate);
      setCurrentMonth(propSelectedDate);
    }, [propSelectedDate, selectedDate]);

    const visibleDays = React.useMemo<Day[]>(() => {
      const start = viewMode === "weekly"
        ? startOfWeek(currentMonth, { weekStartsOn: 0 })
        : startOfMonth(currentMonth);
      const totalDays = viewMode === "weekly"
        ? 7
        : getDaysInMonth(currentMonth);

      return Array.from({ length: totalDays }, (_, index) => {
        const date = viewMode === "weekly"
          ? addDays(start, index)
          : new Date(start.getFullYear(), start.getMonth(), index + 1);
        return {
          date,
          isToday: isToday(date),
          isSelected: isSameDay(date, selectedDate),
        };
      });
    }, [currentMonth, selectedDate, viewMode]);

    const visibleRangeLabel = viewMode === "weekly"
      ? `${format(visibleDays[0]?.date ?? selectedDate, "MMM d")} – ${format(visibleDays[6]?.date ?? selectedDate, "MMM d")}`
      : format(currentMonth, "MMMM yyyy");

    const selectDate = (date: Date) => {
      setSelectedDate(date);
      setCurrentMonth(date);
      onDateSelect?.(date);
    };

    const handlePrevious = () => {
      if (viewMode === "weekly") {
        selectDate(subDays(selectedDate, 7));
        return;
      }
      setCurrentMonth(subMonths(currentMonth, 1));
    };

    const handleNext = () => {
      if (viewMode === "weekly") {
        selectDate(addDays(selectedDate, 7));
        return;
      }
      setCurrentMonth(addMonths(currentMonth, 1));
    };

    const handleViewModeChange = (mode: "weekly" | "monthly") => {
      setViewMode(mode);
      // Both views remain anchored to the date currently used by the calculator.
      setCurrentMonth(selectedDate);
    };

    const handleDateClick = (date: Date) => {
      selectDate(date);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "w-full max-w-[360px] overflow-hidden rounded-3xl p-5 shadow-2xl",
          "border border-white/10 bg-[#151b1d]/85 backdrop-blur-xl",
          "font-sans text-white",
          className,
        )}
        {...props}
      >
        <ScrollbarHide />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 rounded-lg bg-black/20 p-1">
            <button
              type="button"
              onClick={() => handleViewModeChange("weekly")}
              aria-pressed={viewMode === "weekly"}
              className={cn(
                "rounded-md px-4 py-1 text-xs font-semibold transition-colors",
                viewMode === "weekly"
                  ? "bg-[#f5f1e9] font-bold text-[#101416] shadow-md"
                  : "text-white/60 hover:text-white",
              )}
            >
              Weekly
            </button>
            <button
              type="button"
              onClick={() => handleViewModeChange("monthly")}
              aria-pressed={viewMode === "monthly"}
              className={cn(
                "rounded-md px-4 py-1 text-xs font-semibold transition-colors",
                viewMode === "monthly"
                  ? "bg-[#f5f1e9] font-bold text-[#101416] shadow-md"
                  : "text-white/60 hover:text-white",
              )}
            >
              Monthly
            </button>
          </div>
          <button type="button" aria-label="Calendar settings" className="rounded-full p-2 text-white/70 transition-colors hover:bg-black/20 hover:text-white">
            <Settings className="h-5 w-5" />
          </button>
        </div>

        <div className="my-6 flex items-center justify-between">
          <motion.p
            key={`${viewMode}-${format(currentMonth, "yyyy-MM-dd")}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-4xl font-bold tracking-tight"
          >
            {visibleRangeLabel}
          </motion.p>
          <div className="flex items-center space-x-2">
            <button type="button" aria-label={viewMode === "weekly" ? "Previous week" : "Previous month"} onClick={handlePrevious} className="rounded-full p-1 text-white/70 transition-colors hover:bg-black/20 hover:text-white">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" aria-label={viewMode === "weekly" ? "Next week" : "Next month"} onClick={handleNext} className="rounded-full p-1 text-white/70 transition-colors hover:bg-black/20 hover:text-white">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="-mx-5 overflow-x-auto px-5 scrollbar-hide">
          <div className="flex space-x-4">
            {visibleDays.map((day) => (
              <div key={format(day.date, "yyyy-MM-dd")} className="flex shrink-0 flex-col items-center space-y-2">
                <span className="text-xs font-bold text-white/50">{format(day.date, "E").charAt(0)}</span>
                <button
                  type="button"
                  aria-label={format(day.date, "EEEE, MMMM d, yyyy")}
                  aria-pressed={day.isSelected}
                  onClick={() => handleDateClick(day.date)}
                  className={cn(
                    "relative flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200",
                    day.isSelected ? "bg-[#e2a891] text-[#101416] shadow-lg" : "text-white hover:bg-white/20",
                  )}
                >
                  {day.isToday && !day.isSelected && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#e2a891]" />}
                  {getDate(day.date)}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 h-px bg-white/20" />
        <div className="mt-4 flex items-center justify-between space-x-4">
          <button type="button" className="flex items-center space-x-2 text-sm font-medium text-white/70 transition-colors hover:text-white">
            <Edit2 className="h-4 w-4" />
            <span>Add a note...</span>
          </button>
          <button type="button" className="flex items-center space-x-2 rounded-lg bg-black/20 px-3 py-2 text-xs font-bold text-white shadow-md transition-colors hover:bg-black/30">
            <Plus className="h-4 w-4" />
            <span>New Event</span>
          </button>
        </div>
      </div>
    );
  },
);

GlassCalendar.displayName = "GlassCalendar";
