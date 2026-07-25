/* eslint-disable @next/next/no-img-element */
import { Reveal } from "./Reveal";

const PHOTOS = [
  "/images/PZya8u3JHsscGvzhdNhi0nWpc.png",
  "/images/e4qmkfXyV6fkiMTY6XJzDwPQr4.png",
  "/images/aSZ4pclaWJ4D6Qm6UPcMQdC9A.png",
  "/images/J1TPOL7ClpOGXZwPGZA5nnE6oY.png",
];

function PhotoCard({ src }: { src: string }) {
  return (
    <div
      className="relative aspect-[5/7] w-[calc((100%-3rem)/3)] shrink-0 overflow-hidden"
      style={{ clipPath: "inset(0 round 50% / 36%)" }}
    >
      <img
        src={src}
        alt="Соло путешествие"
        className="h-full w-full select-none object-cover"
        draggable={false}
      />
    </div>
  );
}

export function Categories() {
  return (
    <section id="about" className="relative bg-white pb-24 pt-28">
      {/* decorative travel stamps */}
      <img
        src="/images/1exwTE2Y0Xf60mnDtG638CmG8I.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-6 top-28 hidden w-24 -rotate-12 select-none xl:block"
      />
      <img
        src="/images/619b3KdOinvkQ74s5Mg2BjtTGY8.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-10 top-40 hidden w-16 select-none xl:block"
      />
      <img
        src="/images/TB7orCkX60THTA0oHNiKWm8zmg.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-16 right-8 hidden w-28 rotate-6 select-none xl:block"
      />
      <div className="container-page">
        <Reveal className="mx-auto max-w-[960px] text-center">
          <h2 className="t-h2">
            4 года <span className="t-h2-i">Соло Путешествий</span>
            <br />
            17 стран
          </h2>
          <p className="t-body mx-auto mt-6 max-w-[600px] text-center text-gray">
            За 4 года соло путешествий и 17 стран я успела тыщу раз переплатить,
            заблудиться в местном транспорте, путешествовать не так комфортно, как
            можно было бы. Теперь тебе не придётся с этим столкнуться.
          </p>
        </Reveal>
      </div>

      {/* Slider — exactly 3 visible; inactive slides fade (data-fade) */}
      <Reveal className="mx-auto mt-14 max-w-[1200px] px-10">
        <div
          data-slider="cats"
          data-fade=""
          data-center=""
          data-loop=""
          className="overflow-hidden"
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
