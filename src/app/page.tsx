import { SmoothScroll } from "@/components/sections/SmoothScroll";
import { CarouselInit } from "@/components/sections/CarouselInit";
import { SiteNav } from "@/components/sections/SiteNav";
import { Hero } from "@/components/sections/Hero";
import { Categories } from "@/components/sections/Categories";
import { Tours } from "@/components/sections/Tours";
import { CitiesMarquee } from "@/components/sections/CitiesMarquee";
import { TopSeason } from "@/components/sections/TopSeason";
import { SiteFooter } from "@/components/sections/SiteFooter";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <CarouselInit />
      <SiteNav />
      <main>
        <Hero />
        <Categories />
        <Tours />
        <CitiesMarquee />
        <TopSeason />
      </main>
      <SiteFooter />
    </>
  );
}
