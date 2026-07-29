"use client";
/* eslint-disable @next/next/no-img-element */
import { Reveal } from "./Reveal";
import { DiscountTimer } from "./DiscountTimer";
import {
  useAssortment,
  updateGuide,
  addGuide,
  deleteGuide,
  moveGuide,
  setTimer,
  type Guide,
} from "../admin/assortment";
import { T, SlideBar, BadgeToggle, AddSlide, TimerEdit } from "../admin/inline";

function GuideCard({
  g,
  i,
  total,
  admin,
  timerHours,
  timerMinutes,
}: {
  g: Guide;
  i: number;
  total: number;
  admin: boolean;
  timerHours: number;
  timerMinutes: number;
}) {
  return (
    <div
      data-expand
      className="group relative flex w-full shrink-0 cursor-pointer flex-col overflow-hidden rounded-[20px] bg-[#f2f2f0] sm:w-[calc((100%-1.5rem)/2)] xl:w-[calc((100%-3rem)/3)]"
    >
      <div className="relative">
        <img
          src={g.img}
          alt={g.title}
          className="aspect-square w-full select-none object-cover"
          draggable={false}
        />
        {g.showTimer && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-ink/85 px-2.5 py-1 text-white shadow-[0_4px_14px_rgba(0,0,0,0.28)] backdrop-blur-sm">
            <T
              admin={admin}
              as="span"
              className="font-display text-[12px] font-bold"
              value={g.badgeText}
              onCommit={(v) => updateGuide(g.id, { badgeText: v })}
            />
            <span className="font-display text-[12px] font-semibold tabular-nums">
              <DiscountTimer />
            </span>
            {admin && (
              <TimerEdit
                hours={timerHours}
                minutes={timerMinutes}
                onApply={(h, m) => setTimer(h, m)}
              />
            )}
          </span>
        )}
        {g.showSoon && (
          <span className="t-label absolute bottom-3 left-3 rounded-full bg-ink px-3 py-1 text-white">
            <T
              admin={admin}
              as="span"
              value={g.soonLabel}
              onCommit={(v) => updateGuide(g.id, { soonLabel: v })}
            />
          </span>
        )}
        {admin && (
          <SlideBar
            img={g.img}
            onImg={(v) => updateGuide(g.id, { img: v })}
            onUp={() => moveGuide(g.id, -1)}
            onDown={() => moveGuide(g.id, 1)}
            onDelete={() => deleteGuide(g.id)}
            canUp={i > 0}
            canDown={i < total - 1}
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {admin && (
          <div className="ta-inl-badges">
            <BadgeToggle active={g.showSoon} label="Тег «Скоро»" onToggle={() => updateGuide(g.id, { showSoon: !g.showSoon })} />
            <BadgeToggle active={g.showTimer} label="Скидка + таймер" onToggle={() => updateGuide(g.id, { showTimer: !g.showTimer })} />
          </div>
        )}
        <T
          admin={admin}
          as="h3"
          className="font-display text-[18px] font-semibold leading-tight text-ink"
          value={g.title}
          onCommit={(v) => updateGuide(g.id, { title: v })}
        />
        <T
          admin={admin}
          as="p"
          className="exp-short mt-2 font-stack text-[14px] leading-[1.4] text-gray"
          value={g.teaser}
          onCommit={(v) => updateGuide(g.id, { teaser: v })}
        />
        <T
          admin={admin}
          as="div"
          className="exp-full mt-2 whitespace-pre-line font-stack text-[13.5px] leading-[1.45] text-gray"
          value={g.full}
          onCommit={(v) => updateGuide(g.id, { full: v })}
        />
        <div className="mt-auto pt-5">
          <div className="border-t border-dashed border-ink/20" />
          <div className="mt-4 flex items-center justify-between">
            {g.showTimer ? (
              <div className="flex items-baseline gap-1.5">
                <T
                  admin={admin}
                  as="span"
                  className="font-display text-[20px] font-semibold text-ink"
                  value={g.discount}
                  onCommit={(v) => updateGuide(g.id, { discount: v })}
                />
                <T
                  admin={admin}
                  as="span"
                  className="font-stack text-[13px] text-gray"
                  value={g.discountWord}
                  onCommit={(v) => updateGuide(g.id, { discountWord: v })}
                />
              </div>
            ) : (
              <span />
            )}
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

export function Tours({ admin = false }: { admin?: boolean }) {
  const { guides, timerHours, timerMinutes } = useAssortment();
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
            {guides.map((g, i) => (
              <GuideCard
                key={g.id}
                g={g}
                i={i}
                total={guides.length}
                admin={admin}
                timerHours={timerHours}
                timerMinutes={timerMinutes}
              />
            ))}
            {admin && (
              <AddSlide
                label="Добавить товар"
                onAdd={addGuide}
                className="w-full shrink-0 self-stretch sm:w-[calc((100%-1.5rem)/2)] xl:w-[calc((100%-3rem)/3)]"
              />
            )}
          </div>
        </div>
      </Reveal>

      {/* pagination dots */}
      <div className="mt-10 flex justify-center">
        <div
          data-dots="tours"
          className="inline-flex items-center gap-2 rounded-full bg-ink/10 px-3 py-2"
        >
          {guides.map((g, i) => (
            <span
              key={g.id}
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
