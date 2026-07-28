import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Travelio - Travel Agency Framer Template",
  description:
    "Путешествие без границ бюджета — личные наработки, база знаний и топ направлений для самостоятельных путешествий.",
};

// Runs before first paint: marks that JS is active so scroll-reveal content
// starts hidden (and then animates in) on desktop. Without JS the content is
// visible by default — it can never get stuck invisible.
const JS_READY = "document.documentElement.classList.add('js')";

// Vanilla mobile-carousel enhancer. On touch devices the sliders are native
// CSS scroll-snap (see globals.css); this plain script (NOT React — so it runs
// even where React hydration fails on the device) adds autoplay, dot syncing
// and tap-to-go pagination on top of the native swipe.
const MOBILE_CAROUSEL = `
(function(){
  if(!window.matchMedia||!matchMedia('(pointer: coarse)').matches)return;
  function setup(){
    document.querySelectorAll('[data-slider]').forEach(function(s){
      var key=s.getAttribute('data-slider');
      var track=s.firstElementChild; if(!track)return;
      var slides=track.children; if(!slides||!slides.length)return;
      var dw=document.querySelector('[data-dots="'+key+'"]');
      var dots=dw?dw.querySelectorAll('[data-dot]'):[];
      var interval=parseInt(s.getAttribute('data-interval')||'4200',10)||4200;
      function step(){return slides[0].getBoundingClientRect().width+24;}
      function active(){return Math.max(0,Math.min(slides.length-1,Math.round(s.scrollLeft/step())));}
      function paint(){var a=active();for(var i=0;i<dots.length;i++){dots[i].style.width=i===a?'24px':'8px';dots[i].style.background=i===a?'#1a1a17':'rgba(26,26,23,0.3)';}}
      var raf;s.addEventListener('scroll',function(){cancelAnimationFrame(raf);raf=requestAnimationFrame(paint);},{passive:true});
      var auto=!s.hasAttribute('data-noauto'),t,rt;
      function stop(){clearInterval(t);}
      function start(){if(!auto)return;stop();t=setInterval(function(){var n=(active()+1)%slides.length;s.scrollTo({left:n*step(),behavior:'smooth'});},interval);}
      function schedule(){clearTimeout(rt);rt=setTimeout(start,Math.max(3000,interval));}
      for(var i=0;i<dots.length;i++){(function(idx){dots[idx].addEventListener('click',function(){stop();clearTimeout(rt);s.scrollTo({left:idx*step(),behavior:'smooth'});schedule();});})(i);}
      s.addEventListener('touchstart',function(){stop();clearTimeout(rt);},{passive:true});
      s.addEventListener('touchend',schedule,{passive:true});
      paint();start();
    });
  }
  function boot(){setTimeout(setup,80);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <script dangerouslySetInnerHTML={{ __html: JS_READY }} />
        {children}
        <script dangerouslySetInnerHTML={{ __html: MOBILE_CAROUSEL }} />
      </body>
    </html>
  );
}
