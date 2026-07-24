/* eslint-disable @next/next/no-img-element */
import { Reveal } from "./Reveal";

const ARROW = "/images/BbyPZY09N03enLhkU6HDikyBz0I.svg";

const PHOTOS = [
  "/images/PZya8u3JHsscGvzhdNhi0nWpc.png",
  "/images/e4qmkfXyV6fkiMTY6XJzDwPQr4.png",
  "/images/aSZ4pclaWJ4D6Qm6UPcMQdC9A.png",
  "/images/J1TPOL7ClpOGXZwPGZA5nnE6oY.png",
];

function PhotoCard({ src }: { src: string }) {
  return (
    <div
      className="group relative aspect-[5/7] w-[calc((100%-3rem)/3)] shrink-0 overflow-hidden transition-opacity duration-500"
      style={{ clipPath: "inset(0 round 50% / 36%)" }}
    >
      <img
        src={src}
        alt="Соло-путешествие"
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:blur-[3px]"
        draggable={false}
      />
      {/* whitish light on hover */}
      <span className="pointer-events-none absolute inset-0 bg-white/25 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
          <img src={ARROW} alt="" className="h-5 w-5" />
        </span>
      </span>
    </div>
  );
}

export function Categories() {
  return (
    <section id="about" className="relative bg-white pb-24 pt-28">
      <div className="container-page">
        <Reveal className="mx-auto max-w-[960px] text-center">
          <h2 className="t-h2">
            4 года <span className="t-h2-i">Соло-Путешествий</span>
            <br />
            17 стран
          </h2>
          <p className="t-body mx-auto mt-6 max-w-[430px] text-center text-gray">
            Составила личные наработки, с которыми тебе больше не понадобится
            изучать ничего дополнительно
          </p>
        </Reveal>
      </div>

      {/* Slider — exactly 3 visible; inactive slides fade (data-fade) */}
      <Reveal className="mx-auto mt-14 max-w-[1200px] px-10">
        <div
          data-slider="cats"
          data-fade=""
          data-center=""
          className="cursor-grab overflow-hidden active:cursor-grabbing"
        >
          <div className="flex items-start gap-6">
            {PHOTOS.map((src) => (
              <PhotoCard key={src} src={src} />
            ))}
          </div>
        </div>
      </Reveal>

      {/* pagination pill (gray) */}
      <div className="mt-10 flex justify-center">
        <div
          data-dots="cats"
          className="inline-flex items-center gap-2 rounded-full bg-ink/10 px-3 py-2"
        >
          {PHOTOS.map((_, i) => (
            <span
              key={i}
              data-dot=""
              className="dot h-2 rounded-full"
              style={{
                width: i === 0 ? 24 : 8,
                background: i === 0 ? "#1a1a17" : "rgba(26,26,23,0.3)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
