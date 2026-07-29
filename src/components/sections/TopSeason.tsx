"use client";
/* eslint-disable @next/next/no-img-element */
import { Reveal } from "./Reveal";
import {
  useAssortment,
  updateSeason,
  addSeason,
  deleteSeason,
  moveSeason,
} from "../admin/assortment";
import { T, SlideBar, AddSlide } from "../admin/inline";

const ARROW_UP_RIGHT = "/images/BbyPZY09N03enLhkU6HDikyBz0I.svg";
const ARROW_LEFT = "/images/EuCRBEy3WmP3TOPcFR80q5d18NM.svg";
const ARROW_RIGHT = "/images/ujDHATQhQaeDKRnUwXqlIRn8.svg";

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

export function TopSeason({ admin = false }: { admin?: boolean }) {
  const { season } = useAssortment();
  return (
    <section
      id="season"
      className="relative overflow-hidden pb-[100px] pt-16 sm:pb-[200px] sm:pt-24"
      style={{ background: "#ffdfcd" }}
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
          {season.length > 1 && <NavArrow icon={ARROW_LEFT} dir="prev" />}
          <div
            data-slider="season"
            data-loop=""
            data-noauto=""
            className="w-full max-w-[680px] overflow-hidden"
          >
            <div className="flex gap-6">
              {season.map((s, i) => (
                <article
                  key={s.id}
                  className="relative flex w-full shrink-0 flex-col overflow-hidden rounded-[28px] bg-white p-3 sm:flex-row"
                >
                  <img
                    src={s.img}
                    alt={s.title}
                    className="h-56 w-full rounded-[20px] object-cover sm:h-auto sm:w-[46%]"
                    draggable={false}
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <T
                      admin={admin}
                      as="h3"
                      className="t-h3 text-ink"
                      value={s.title}
                      onCommit={(v) => updateSeason(s.id, { title: v })}
                    />
                    <T
                      admin={admin}
                      as="p"
                      className="t-body mb-6 mt-3 text-gray"
                      value={s.desc}
                      onCommit={(v) => updateSeason(s.id, { desc: v })}
                    />
                    <button className="mt-auto flex w-fit items-center gap-3 rounded-full bg-ink py-1.5 pl-6 pr-1.5 text-white transition-opacity hover:opacity-90">
                      <span className="font-display text-[16px] font-medium">Подробнее</span>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
                        <img src={ARROW_UP_RIGHT} alt="" className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  </div>
                  {admin && (
                    <SlideBar
                      img={s.img}
                      onImg={(v) => updateSeason(s.id, { img: v })}
                      onUp={() => moveSeason(s.id, -1)}
                      onDown={() => moveSeason(s.id, 1)}
                      onDelete={() => deleteSeason(s.id)}
                      canUp={i > 0}
                      canDown={i < season.length - 1}
                    />
                  )}
                </article>
              ))}
              {admin && (
                <AddSlide
                  label="Добавить слайд"
                  onAdd={addSeason}
                  className="min-h-[260px] w-full shrink-0 self-stretch"
                />
              )}
            </div>
          </div>
          {season.length > 1 && <NavArrow icon={ARROW_RIGHT} dir="next" />}
        </Reveal>
      </div>

      {/* decorative sticker */}
      <img
        src="/images/ItLtNQTx2gNR3XQv8S3RluU6ph0.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-8 top-16 hidden w-28 -rotate-6 select-none xl:block"
      />
    </section>
  );
}
