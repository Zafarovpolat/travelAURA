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
    <div
      data-expand
      className="group relative flex w-full shrink-0 cursor-pointer flex-col overflow-hidden rounded-[20px] bg-[#f2f2f0] sm:w-[calc((100%-3rem)/3)]"
    >
      <div className="relative">
        <img
          src={img}
          alt={title}
          className="aspect-square w-full select-none object-cover"
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
        <p className="exp-desc mt-2 font-stack text-[15px] leading-[1.4] text-gray">
          {desc}
        </p>
        <div className="mt-auto pt-5">
          <div className="border-t border-dashed border-ink/20" />
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-[20px] font-semibold text-ink">50%</span>
              <span className="font-stack text-[13px] text-gray">скидка</span>
            </div>
            <span
              data-expand-btn
              className="inline-flex items-center rounded-full bg-ink px-4 py-2 font-display text-[13px] font-medium text-white transition-transform hover:scale-105"
            >
              Подробнее
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Tours() {
  return (
    <section id="products" className="relative overflow-hidden bg-white py-24">
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

      <Reveal delay={80} className="mx-auto mt-12 max-w-[1200px] px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-stretch">
          {GUIDES.map((g) => (
            <GuideCard key={g.title} {...g} />
          ))}
        </div>
      </Reveal>

      {/* decorative travel stamps */}
      <img
        src="/images/SnABVqpQNDrXWxMDeg1Jccwe7E.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-16 hidden w-28 rotate-6 select-none xl:block"
      />
      <img
        src="/images/gOJRbmwKYAD0JYd5PpEgdgxrq8.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 left-6 hidden w-28 -rotate-6 select-none xl:block"
      />
    </section>
  );
}
