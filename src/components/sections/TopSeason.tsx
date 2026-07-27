/* eslint-disable @next/next/no-img-element */
import { Reveal } from "./Reveal";
import { CloudStrip } from "./Clouds";

const ARROW_UP_RIGHT = "/images/BbyPZY09N03enLhkU6HDikyBz0I.svg";
const ARROW_LEFT = "/images/EuCRBEy3WmP3TOPcFR80q5d18NM.svg";
const ARROW_RIGHT = "/images/ujDHATQhQaeDKRnUwXqlIRn8.svg";

const SLIDES = [
  {
    img: "/images/prod-italy.jpg",
    title: "Италия: Рим, Флоренция и Венеция",
    desc: "Практичный гид по Италии: города, маршруты, транспорт, бюджет, язык и идеи для насыщенной поездки",
  },
];

function NavArrow({ icon, dir }: { icon: string; dir: "prev" | "next" }) {
  return (
    <button
      data-arrow={dir}
      data-ref="season"
      aria-label={dir === "next" ? "Следующий" : "Предыдущий"}
      className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_6px_18px_rgba(26,26,23,0.12)] transition-transform hover:scale-105 md:flex"
    >
      <img src={icon} alt="" className="h-3 w-auto" />
    </button>
  );
}

function Slide({
  img,
  title,
  desc,
}: {
  img: string;
  title: string;
  desc: string;
}) {
  return (
    <article className="flex w-full shrink-0 flex-col overflow-hidden rounded-[28px] bg-white p-3 sm:flex-row">
      <img
        src={img}
        alt={title}
        className="h-56 w-full rounded-[20px] object-cover sm:h-auto sm:w-[46%]"
        draggable={false}
      />
      <div className="flex flex-1 flex-col p-6">
        <h3 className="t-h3 text-ink">{title}</h3>
        <p className="t-body mb-6 mt-3 text-gray">{desc}</p>
        <button className="mt-auto flex w-fit items-center gap-3 rounded-full bg-ink py-1.5 pl-6 pr-1.5 text-white transition-opacity hover:opacity-90">
          <span className="font-display text-[16px] font-medium">Подробнее</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
            <img src={ARROW_UP_RIGHT} alt="" className="h-3.5 w-3.5" />
          </span>
        </button>
      </div>
    </article>
  );
}

export function TopSeason() {
  return (
    <section
      id="season"
      className="relative overflow-hidden pb-[440px] pt-24"
      style={{
        background:
          "linear-gradient(to bottom, #ffdfcd 0%, #ffdfcd 66%, #ffffff 92%)",
      }}
    >
      <div className="container-page relative z-10">
        <Reveal className="text-center">
          <h2 className="t-h2">
            Топ <span className="t-h2-i">Баз-Знаний</span>
            <br />
            этого сезона
          </h2>
        </Reveal>

        <Reveal delay={100} className="mt-14 flex items-center justify-center gap-6">
          {SLIDES.length > 1 && <NavArrow icon={ARROW_LEFT} dir="prev" />}
          <div
            data-slider="season"
            data-loop=""
            data-noauto=""
            className="w-full max-w-[680px] overflow-hidden"
          >
            <div className="flex gap-6">
              {SLIDES.map((s) => (
                <Slide key={s.title} {...s} />
              ))}
            </div>
          </div>
          {SLIDES.length > 1 && <NavArrow icon={ARROW_RIGHT} dir="next" />}
        </Reveal>
      </div>

      {/* decorative sticker */}
      <img
        src="/images/ItLtNQTx2gNR3XQv8S3RluU6ph0.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-8 top-16 hidden w-28 -rotate-6 select-none xl:block"
      />

      {/* three clouds stuck to the bottom (dropped lower) */}
      <CloudStrip edge={-90} />
    </section>
  );
}
