/* eslint-disable @next/next/no-img-element */
import { Reveal } from "./Reveal";
import { CloudStrip } from "./Clouds";

const CARD_IMG = "/images/KCzaP2wFXirf4rM05DaNs7YhEg.png";
const ARROW_UP_RIGHT = "/images/BbyPZY09N03enLhkU6HDikyBz0I.svg";
const ARROW_LEFT = "/images/EuCRBEy3WmP3TOPcFR80q5d18NM.svg";
const ARROW_RIGHT = "/images/ujDHATQhQaeDKRnUwXqlIRn8.svg";

function NavArrow({ icon }: { icon: string }) {
  return (
    <button className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_6px_18px_rgba(26,26,23,0.12)] transition-transform hover:scale-105 md:flex">
      <img src={icon} alt="" className="h-3 w-auto" />
    </button>
  );
}

export function TopSeason() {
  return (
    <section
      id="season"
      className="relative overflow-hidden bg-peach pb-56 pt-24"
    >
      <div className="container-page relative z-10">
        <Reveal className="text-center">
          <h2 className="t-h2">
            Топ <span className="t-h2-i">Баз-Знаний</span>
            <br />
            этого сезона
          </h2>
        </Reveal>

        <Reveal
          delay={100}
          className="mt-14 flex items-center justify-center gap-6"
        >
          <NavArrow icon={ARROW_LEFT} />

          <article className="flex w-full max-w-[680px] flex-col overflow-hidden rounded-[28px] bg-white p-3 sm:flex-row">
            <img
              src={CARD_IMG}
              alt="Общая база знаний"
              className="h-56 w-full rounded-[20px] object-cover sm:h-auto sm:w-[46%]"
              draggable={false}
            />
            <div className="flex flex-1 flex-col p-6">
              <h3 className="t-h3 text-ink">Общая база знаний</h3>
              <p className="t-body mt-3 text-gray">
                Все лайфхаки для путешествий в одном месте — от бронирования до
                легального дохода за границей
              </p>
              <button className="mt-auto flex w-fit items-center gap-3 rounded-full bg-ink py-1.5 pl-6 pr-1.5 text-white transition-opacity hover:opacity-90">
                <span className="font-display text-[16px] font-medium">
                  Подробнее
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
                  <img src={ARROW_UP_RIGHT} alt="" className="h-3.5 w-3.5" />
                </span>
              </button>
            </div>
          </article>

          <NavArrow icon={ARROW_RIGHT} />
        </Reveal>
      </div>

      {/* three clouds stuck to the bottom */}
      <CloudStrip />
    </section>
  );
}
