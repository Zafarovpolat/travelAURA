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
      className="group flex w-[calc((100%-3rem)/3)] shrink-0 flex-col rounded-[24px] bg-white p-3 shadow-[0_2px_20px_rgba(26,26,23,0.06)] ring-1 ring-ink/5"
    >
      <div className="relative overflow-hidden rounded-[16px]">
        <img
          src={img}
          alt={title}
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          draggable={false}
        />
        {soon && (
          <span className="t-label absolute bottom-3 left-3 rounded-full bg-ink px-3 py-1.5 text-white">
            Скоро
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-2 pb-1 pt-5">
        <h3 className="t-card-title text-ink">{title}</h3>
        <p className="t-body mt-2 line-clamp-3 min-h-[3.6em] text-gray">{desc}</p>

        <div className="mt-auto pt-6">
          <div className="border-t border-ink/10 pt-4" />
          <div className="mt-1 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="t-h3 text-ink">50%</span>
              <span className="t-label text-gray">скидка</span>
            </div>
            <span className="t-label rounded-full bg-ink px-4 py-2.5 text-white transition-opacity group-hover:opacity-80">
              Подробнее
            </span>
          </div>
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
          <h2 className="t-h2 max-w-[560px]">
            База <span className="t-h2-i">Знаний</span> для Путешественников
          </h2>
          <p className="t-body max-w-[460px] text-gray md:text-right">
            поможет вам сэкономить десятки, а то и сотни тысяч рублей и кучу
            времени в путешествиях
          </p>
        </Reveal>
      </div>

      {/* Slider — exactly 3 visible, 4th hidden (overflow hidden + JS autoplay) */}
      <Reveal delay={80} className="mx-auto mt-12 max-w-[1200px] px-10">
        <div data-slider="tours" className="overflow-hidden">
          <div className="flex items-stretch gap-6">
            {GUIDES.map((g) => (
              <GuideCard key={g.title} {...g} />
            ))}
          </div>
        </div>
      </Reveal>

      {/* pagination pill (gray background) */}
      <div className="mt-10 flex justify-center">
        <div
          data-dots="tours"
          className="inline-flex items-center gap-2 rounded-full bg-ink/10 px-3 py-2"
        >
          {GUIDES.map((_, i) => (
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
