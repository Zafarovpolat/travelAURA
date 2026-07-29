import { SmoothScroll } from "@/components/sections/SmoothScroll";
import { CarouselInit } from "@/components/sections/CarouselInit";
import { ExpandInit } from "@/components/sections/ExpandInit";
import { ContentOverrides } from "@/components/admin/ContentOverrides";
import { TimerInit } from "@/components/sections/TimerInit";
import { SiteNav } from "@/components/sections/SiteNav";
import { Hero } from "@/components/sections/Hero";
import { Categories } from "@/components/sections/Categories";
import { Tours } from "@/components/sections/Tours";
import { CitiesMarquee } from "@/components/sections/CitiesMarquee";
import { TopSeason } from "@/components/sections/TopSeason";
import { SiteFooter } from "@/components/sections/SiteFooter";

/**
 * The whole landing page. Shared by `/` and `/admin` so the admin editor is a
 * true 1:1 WYSIWYG surface. When `admin` is set, carousels/expanders are frozen
 * so every element sits still and editable.
 */
export function Landing({ admin = false }: { admin?: boolean }) {
  return (
    <>
      <ContentOverrides />
      <TimerInit />
      <SmoothScroll />
      <CarouselInit disabled={admin} />
      <ExpandInit disabled={admin} />
      <SiteNav />
      <main>
        <Hero />
        <Categories admin={admin} />
        <Tours admin={admin} />
        <CitiesMarquee admin={admin} />
        <TopSeason admin={admin} />
      </main>
      <SiteFooter />
    </>
  );
}
