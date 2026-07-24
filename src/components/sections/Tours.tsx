/* eslint-disable @next/next/no-img-element */
import { Reveal } from "./Reveal";

type Guide = {
  img: string;
  title: string;
  desc: string;
  soon?: boolean;
};

const GUIDES: Guide[] = [
  {
    img: "/images/KCzaP2wFXirf4rM05DaNs7YhEg.png",
    title: "База знаний для путешествий",
    desc: "Отели, перелёты, визы, связь, маршруты и полезные инструменты для самостоятельных поездок.",
  },
  {
    img: "/images/GJJb8Uv9Akr2qx0xpfl7zQqPRM.png",
    title: "Италия: Рим, Флоренция и Венеция",
    desc: "Практичный гид по Италии: города, маршруты, транспорт, бюджет, язык и идеи для насыщенной поездки.",
  },
  {
    img: "/images/LGj6z4TDM3zL3Uv8ViTYEB4rUY.png",
    title: "Япония: Токио, Киото и Осака",
    desc: "Города, маршруты, транспорт и бюджет для самостоятельной поездки по Японии.",
    soon: true,
  },
  {
    img: "/images/WCUZeyJNvc6yYkaSy2ZbBATFmMo.png",
    title: "Таиланд: Бангкок, Пхукет и Панган",
    desc: "Пляжи, острова, маршруты, транспорт и бюджет для комфортного путешествия по Таиланду.",
    soon: true,
  },
];

function GuideCard({ img, title, desc, soon }: Guide) {
  return (
    <a
      href="#"
      className="group flex w-[calc((100%-3rem)/3)] shrink-0 flex-col overflow-hidden rounded-[20px] bg-[#f2f2f0]"
    >
      <div className="relative">
        <img
          src={img}
          alt={title}
          className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          draggable={false}
        />
        {soon && (
          <span className="t-label absolute bottom-3 left-3 rounded-full bg-ink px-3 py-1 text-white">
            Скоро
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[20px] font-semibold leading-tight text-ink">
          {title}
        </h3>
        <p className="mt-2 line-clamp-3 min-h-[3.6em] font-stack text-[15px] leading-[1.35] text-gray">
          {desc}
        </p>
        <div className="mt-auto flex items-center justify-between pt-5">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-[20px] font-semibold text-ink">50%</span>
            <span className="font-stack text-[13px] text-gray">скидка</span>
          </div>
          <span className="rounded-full bg-ink px-3.5 py-1.5 font-display text-[13px] font-medium text-white transition-opacity group-hover:opacity-80">
            Подробнее
          </span>
        </div>
      </div>
    </a>
  );
}

export function Tours() {
  return (
    <section id="products" className="bg-white py-24">
      <div className="container-page">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="t-h2 max-w-[620px]">
            База <span className="t-h2-i">Знаний</span> для Путешественников
          </h2>
          <p className="t-body max-w-[380px] text-gray md:text-right">
            поможет вам сэкономить десятки, а то и сотни тысяч рублей и кучу
            времени в путешествиях
          </p>
        </Reveal>
      </div>

      {/* Slider — exactly 3 visible, 4th hidden (no opacity fade here) */}
      <Reveal delay={80} className="mx-auto mt-12 max-w-[1200px] px-10">
        <div data-slider="tours" className="cursor-grab overflow-hidden active:cursor-grabbing">
          <div className="flex items-stretch gap-6">
            {GUIDES.map((g) => (
              <GuideCard key={g.title} {...g} />
            ))}
          </div>
        </div>
      </Reveal>

      {/* pagination pill (gray) */}
      <div className="mt-10 flex justify-center">
        <div
          data-dots="tours"
          className="inline-flex items-center gap-2 rounded-full bg-ink/10 px-3 py-2"
        >
          {GUIDES.map((_, i) => (
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
