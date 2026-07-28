/* eslint-disable @next/next/no-img-element */
import { Reveal } from "./Reveal";
import { DiscountTimer } from "./DiscountTimer";

type Guide = {
  img: string;
  title: string;
  teaser: string;
  full: React.ReactNode;
  soon?: boolean;
};

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1 pl-4">
      {items.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  );
}

const GUIDES: Guide[] = [
  {
    img: "/images/prod-italy.jpg",
    title: "Италия: Рим / Флоренция / Милан / Комо / Венеция",
    teaser:
      "Полный гид по Италии — от визы и маршрутов до еды, языка и лайфхаков на месте.",
    full: (
      <div className="space-y-3">
        <div>
          <p className="font-semibold text-ink">База перед поездкой:</p>
          <Bullets
            items={[
              "Виза",
              "Города, обязательные для посещения",
              "Куда сходить",
              "Контакты",
              "транспорт: такси, метро, поезда дальнего следования, автобусы",
              "Когда ехать",
              "бюджет",
              "готовые маршруты",
            ]}
          />
        </div>
        <div>
          <p className="font-semibold text-ink">Про быт на месте</p>
          <Bullets
            items={[
              "Еда",
              "Язык: основные итальянские слова",
              "Лайфхаки — билеты без очередей, музейные карты, обходные пути",
              "Шоппинг и что привезти",
              "Полезные приложения",
              "Безопасность и типичные разводы туристов",
            ]}
          />
        </div>
      </div>
    ),
  },
  {
    img: "/images/LGj6z4TDM3zL3Uv8ViTYEB4rUY.png",
    title: "Япония: Токио / Осака / Киото / Нара / Окинава",
    teaser: "Токио, Осака, Киото, Нара и Окинава.",
    full: <p>Скоро — материалы готовятся.</p>,
    soon: true,
  },
  {
    img: "/images/prod-thailand.jpg",
    title: "Таиланд: Бангкок / Пхукет / Панган",
    teaser: "Бангкок, Пхукет и Панган.",
    full: <p>Скоро — материалы готовятся.</p>,
    soon: true,
  },
];

function GuideCard({ img, title, teaser, full, soon }: Guide) {
  return (
    <div
      data-expand
      className="group relative flex w-full shrink-0 cursor-pointer flex-col overflow-hidden rounded-[20px] bg-[#f2f2f0] sm:w-[calc((100%-1.5rem)/2)] xl:w-[calc((100%-3rem)/3)]"
    >
      <div className="relative">
        <img
          src={img}
          alt={title}
          className="aspect-square w-full select-none object-cover"
          draggable={false}
        />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-ink/85 px-2.5 py-1 text-white shadow-[0_4px_14px_rgba(0,0,0,0.28)] backdrop-blur-sm">
          <span className="font-display text-[12px] font-bold">−50%</span>
          <span className="font-display text-[12px] font-semibold tabular-nums">
            <DiscountTimer />
          </span>
        </span>
        {soon && (
          <span className="t-label absolute bottom-3 left-3 rounded-full bg-ink px-3 py-1 text-white">
            Скоро
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[18px] font-semibold leading-tight text-ink">
          {title}
        </h3>
        <p className="exp-short mt-2 font-stack text-[14px] leading-[1.4] text-gray">
          {teaser}
        </p>
        <div className="exp-full mt-2 font-stack text-[13.5px] leading-[1.45] text-gray">
          {full}
        </div>
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
            времени в путешествиях.
          </p>
        </Reveal>
      </div>

      <Reveal delay={80} className="mx-auto mt-12 max-w-[1200px] px-10">
        <div data-slider="tours" data-loop="" className="overflow-hidden">
          <div className="flex items-stretch gap-6">
            {GUIDES.map((g, i) => (
              <GuideCard key={i} {...g} />
            ))}
          </div>
        </div>
      </Reveal>

      {/* pagination dots */}
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
