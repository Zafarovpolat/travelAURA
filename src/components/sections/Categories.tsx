/* eslint-disable @next/next/no-img-element */
import { Reveal } from "./Reveal";

const PHOTOS = [
  "/images/PZya8u3JHsscGvzhdNhi0nWpc.png",
  "/images/e4qmkfXyV6fkiMTY6XJzDwPQr4.png",
  "/images/aSZ4pclaWJ4D6Qm6UPcMQdC9A.png",
  "/images/J1TPOL7ClpOGXZwPGZA5nnE6oY.png",
  "/images/vfhudlU9zr6W4l4WYrEEUkqQ5M.jpg",
];

function PhotoCard({ src }: { src: string }) {
  return (
    <div className="aspect-[3/4] w-[calc((100%-3rem)/3)] shrink-0 overflow-hidden rounded-t-[150px] rounded-b-[90px]">
      <img
        src={src}
        alt="Соло-путешествие"
        className="h-full w-full object-cover"
        draggable={false}
      />
    </div>
  );
}

export function Categories() {
  return (
    <section id="about" className="relative bg-white pb-24 pt-28">
      <div className="container-page">
        <Reveal className="mx-auto max-w-[900px] text-center">
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

      {/* Slider — exactly 3 visible, extra slides hidden (JS autoplay) */}
      <Reveal className="relative mx-auto mt-14 max-w-[1200px] px-10">
        <div data-slider="cats" className="overflow-hidden">
          <div className="flex gap-6">
            {PHOTOS.map((src) => (
              <PhotoCard key={src} src={src} />
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[10%] bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[10%] bg-gradient-to-l from-white to-transparent" />
      </Reveal>

      {/* pagination pill (gray background) */}
      <div className="mt-10 flex justify-center">
        <div
          data-dots="cats"
          className="inline-flex items-center gap-2 rounded-full bg-ink/10 px-3 py-2"
        >
          {PHOTOS.map((_, i) => (
            <span
              key={i}
              data-dot=""
              className="h-2 rounded-full"
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
