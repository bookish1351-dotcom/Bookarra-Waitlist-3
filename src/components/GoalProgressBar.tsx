import { Users } from 'lucide-react';

interface GoalProgressBarProps {
  currentCount?: number;
  goalCount?: number;
  onOpenWaitlist: () => void;
}

export function GoalProgressBar({
  currentCount = 9,
  goalCount = 10000,
  onOpenWaitlist,
}: GoalProgressBarProps) {
  const rawPercentage = (currentCount / goalCount) * 100;
  const displayPercentage =
    rawPercentage > 0 && rawPercentage < 1
      ? '<1%'
      : `${Math.min(100, Math.round(rawPercentage))}%`;
  // Give at least a subtle visible indicator if count > 0
  const barWidth =
    currentCount > 0 ? Math.max(1, Math.min(100, rawPercentage)) : 0;

  return (
    <aside
      id="goal-progress-bar"
      aria-label="Community Waitlist Goal Progress"
      className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-black/10 py-2.5 sm:py-3 px-4 sm:px-8 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-6">
        {/* Left Stats: 1,000 people already */}
        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <Users className="w-3.5 h-3.5 text-neutral-700 hidden sm:inline-block shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-neutral-950 whitespace-nowrap">
              {currentCount.toLocaleString()} people already
            </span>
          </div>

          {/* Goal on mobile view */}
          <span className="text-xs text-neutral-600 font-medium whitespace-nowrap sm:hidden">
            Goal {goalCount.toLocaleString()} people
          </span>
        </div>

        {/* Center: Interactive Progress Bar */}
        <div className="w-full sm:flex-1 max-w-lg flex items-center gap-3">
          <div
            className="flex-1 h-2 sm:h-2.5 bg-neutral-200/90 rounded-full overflow-hidden p-[1px] border border-black/5"
            title={`${currentCount.toLocaleString()} of ${goalCount.toLocaleString()} people (${displayPercentage})`}
          >
            <div
              className="h-full bg-black rounded-full transition-all duration-700 ease-out"
              style={{ width: `${barWidth}%` }}
              role="progressbar"
              aria-valuenow={currentCount}
              aria-valuemin={0}
              aria-valuemax={goalCount}
            />
          </div>
          <span className="text-[11px] sm:text-xs font-mono font-medium text-neutral-600 shrink-0">
            {displayPercentage}
          </span>
        </div>

        {/* Right: Goal 10,000 people + Join Button */}
        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
          <span className="hidden sm:inline-block text-xs sm:text-sm text-neutral-700 font-medium whitespace-nowrap">
            Goal {goalCount.toLocaleString()} people
          </span>

          <button
            id="goal-bar-join-waitlist-button"
            type="button"
            onClick={onOpenWaitlist}
            className="bg-black text-white text-xs font-semibold px-4 py-1.5 sm:py-2 rounded-full hover:bg-neutral-800 active:scale-95 transition-all hover:scale-[1.02] shadow-xs cursor-pointer whitespace-nowrap ml-auto sm:ml-0"
          >
            Join Waitlist
          </button>
        </div>
      </div>
    </aside>
  );
}
