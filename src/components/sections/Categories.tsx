"use client";
/* eslint-disable @next/next/no-img-element */
import { Reveal } from "./Reveal";
import { useAssortment, updatePhoto, addPhoto, deletePhoto, movePhoto } from "../admin/assortment";
import { SlideBar, AddSlide } from "../admin/inline";

export function Categories({ admin = false }: { admin?: boolean }) {
  const { photos } = useAssortment();
  return (
    <section id="about" className="relative bg-white pb-12 pt-28 sm:pb-24">
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
          data-interval="2600"
          className="overflow-hidden"
        >
          <div className="flex items-start gap-6">
            {photos.map((p, i) => (
              <div
                key={p.id}
                className="relative aspect-[5/7] w-full shrink-0 sm:w-[calc((100%-3rem)/3)]"
              >
                <div className="h-full w-full overflow-hidden" style={{ clipPath: "inset(0 round 50% / 36%)" }}>
                  <img
                    src={p.img}
                    alt="Соло путешествие"
                    className="h-full w-full select-none object-cover"
                    draggable={false}
                  />
                </div>
                {admin && (
                  <SlideBar
                    img={p.img}
                    onImg={(v) => updatePhoto(p.id, v)}
                    onUp={() => movePhoto(p.id, -1)}
                    onDown={() => movePhoto(p.id, 1)}
                    onDelete={() => deletePhoto(p.id)}
                    canUp={i > 0}
                    canDown={i < photos.length - 1}
                  />
                )}
              </div>
            ))}
            {admin && <AddSlide label="Добавить фото" onAdd={addPhoto} />}
          </div>
        </div>
      </Reveal>

      {/* pagination pill (gray) */}
      <div className="mt-6 flex justify-center sm:mt-10">
        <div
          data-dots="cats"
          className="inline-flex items-center gap-2 rounded-full bg-ink/10 px-3 py-2"
        >
          {photos.map((p, i) => (
            <span
              key={p.id}
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
