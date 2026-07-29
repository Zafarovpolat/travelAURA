"use client";
/* eslint-disable @next/next/no-img-element */

import {
  useAssortment,
  updateCountry,
  addCountry,
  deleteCountry,
  moveCountry,
  type Country,
} from "../admin/assortment";
import { T, SlideBar, AddSlide } from "../admin/inline";

function Row({ items }: { items: Country[] }) {
  return (
    <div className="flex shrink-0 items-center gap-20 pr-20">
      {items.map((it) => (
        <div key={it.id} className="flex shrink-0 items-center gap-20">
          <span className="t-display whitespace-nowrap text-white">{it.label}</span>
          <img
            src={it.img}
            alt=""
            className="h-[64px] w-auto shrink-0 scale-[2.4]"
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}

/** Admin view: static row where each country can be edited / reordered / removed. */
function EditableRow({ items }: { items: Country[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-10 px-8">
      {items.map((it, i) => (
        <div key={it.id} className="relative flex shrink-0 items-center gap-6 rounded-2xl p-4 pt-10 ring-1 ring-white/25">
          <T
            admin
            as="span"
            className="t-display whitespace-nowrap text-white"
            value={it.label}
            onCommit={(v) => updateCountry(it.id, { label: v })}
          />
          <img
            src={it.img}
            alt=""
            className="h-[64px] w-auto shrink-0"
            draggable={false}
          />
          <SlideBar
            img={it.img}
            onImg={(v) => updateCountry(it.id, { img: v })}
            onUp={() => moveCountry(it.id, -1)}
            onDown={() => moveCountry(it.id, 1)}
            onDelete={() => deleteCountry(it.id)}
            canUp={i > 0}
            canDown={i < items.length - 1}
          />
        </div>
      ))}
      <AddSlide label="Добавить страну" onAdd={addCountry} className="ta-inl-add-country" />
    </div>
  );
}

export function CitiesMarquee({ admin = false }: { admin?: boolean }) {
  const { countries } = useAssortment();
  return (
    <section
      data-noedit
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom, #ffffff 0%, #ffffff 50%, #ffdfcd 50%, #ffdfcd 100%)",
      }}
    >
      <div className="py-12">
        {/* whole tilted black band (mask gives scalloped edges — no stray pixel) */}
        <div className={admin ? "" : "-rotate-3 scale-x-[1.12]"}>
          <div className="marquee-band overflow-hidden py-16">
            {admin ? (
              <EditableRow items={countries} />
            ) : (
              <div className="flex w-max animate-[marquee_72s_linear_infinite]">
                <Row items={countries} />
                <Row items={countries} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
