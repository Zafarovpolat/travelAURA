/* eslint-disable @next/next/no-img-element */

const CLOUD = "/images/Q5S1u6umPHpGRA2Vw4EGgTijziI.png";

/**
 * A row of three overlapping white clouds stuck to the bottom edge
 * (or the top edge, flipped 180°). Purely decorative.
 */
export function CloudStrip({ flip = false }: { flip?: boolean }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 z-[6] h-[200px] ${
        flip ? "top-0 rotate-180" : "bottom-0"
      }`}
    >
      <img
        src={CLOUD}
        alt=""
        className="absolute bottom-0 left-[-6%] w-[46%] max-w-none"
        draggable={false}
      />
      <img
        src={CLOUD}
        alt=""
        className="absolute bottom-0 left-1/2 w-[58%] max-w-none -translate-x-1/2"
        draggable={false}
      />
      <img
        src={CLOUD}
        alt=""
        className="absolute bottom-0 right-[-6%] w-[46%] max-w-none"
        draggable={false}
      />
    </div>
  );
}
