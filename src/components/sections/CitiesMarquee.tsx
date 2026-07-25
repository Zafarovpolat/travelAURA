/* eslint-disable @next/next/no-img-element */

const ITEMS = [
  { label: "Италия", flag: "/images/cujjMXLnRh0ubB7Y9PHKkqUqHng.png" },
  { label: "Таиланд", flag: "/images/MRnUANnt1GkkM6MXqkEUxrts.png" },
];

function Row() {
  return (
    <div className="flex shrink-0 items-center gap-20 pr-20">
      {ITEMS.map((it, i) => (
        <div key={i} className="flex shrink-0 items-center gap-20">
          <span className="t-display whitespace-nowrap text-white">{it.label}</span>
          <img
            src={it.flag}
            alt=""
            className="h-[64px] w-auto shrink-0 scale-[2.4]"
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}

export function CitiesMarquee() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom, #ffffff 0%, #ffffff 50%, #ffdfcd 50%, #ffdfcd 100%)",
      }}
    >
      <div className="py-12">
        {/* whole tilted black band (mask gives scalloped edges — no stray pixel) */}
        <div className="-rotate-3 scale-x-[1.12]">
          <div className="marquee-band overflow-hidden py-16">
            <div className="flex w-max animate-[marquee_72s_linear_infinite]">
              <Row />
              <Row />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
