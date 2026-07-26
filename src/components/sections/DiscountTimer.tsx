/**
 * Renders a countdown slot. The actual ticking (and clone updates) is handled
 * globally by <TimerInit /> so every [data-countdown] — including carousel
 * clones — stays in sync.
 */
export function DiscountTimer() {
  return (
    <span data-countdown className="tabular-nums">
      02:38:00
    </span>
  );
}
