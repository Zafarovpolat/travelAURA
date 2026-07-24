/* eslint-disable @next/next/no-img-element */

const CLOUD = "/images/Q5S1u6umPHpGRA2Vw4EGgTijziI.png";

/**
 * A row of three overlapping white clouds glued to the bottom edge
 * (or the top edge, flipped 180°). Absolute — never affects block height.
 * `edge`  — px offset of the anchored edge (negative pushes clouds past it).
 * `tight` — pull the side clouds closer to the centre.
 */
export function CloudStrip({
  flip = false,
  edge = 0,
  tight = false,
}: {
  flip?: boolean;
  edge?: number;
  tight?: boolean;
}) {
  const style = flip ? { top: edge } : { bottom: edge };
  const side = tight ? "w-[44%]" : "w-[48%]";
  const center = tight ? "w-[50%]" : "w-[58%]";
  const lx = tight ? "left-[6%]" : "left-[-5%]";
  const rx = tight ? "right-[6%]" : "right-[-5%]";
  return (
    <div
      aria-hidden
      style={style}
      className={`pointer-events-none absolute inset-x-0 z-[6] h-[200px] ${
        flip ? "rotate-180" : ""
      }`}
    >
      <img src={CLOUD} alt="" draggable={false} className={`absolute bottom-0 ${lx} ${side} max-w-none`} />
      <img src={CLOUD} alt="" draggable={false} className={`absolute bottom-0 left-1/2 ${center} max-w-none -translate-x-1/2`} />
      <img src={CLOUD} alt="" draggable={false} className={`absolute bottom-0 ${rx} ${side} max-w-none`} />
    </div>
  );
}
