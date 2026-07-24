/* eslint-disable @next/next/no-img-element */

const LOGO = "/images/LILzm3rkYRV49194JCrUDbwS5c.svg";

const LEFT_LINKS = [
  { label: "О себе", href: "#about" },
  { label: "Продукты", href: "#products" },
];

const RIGHT_LINKS = [
  { label: "Топ сезона", href: "#season" },
  { label: "Контакты", href: "#contact" },
];

function NavLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="link-underline font-display text-[16px] font-semibold text-white"
    >
      {label}
    </a>
  );
}

export function SiteNav() {
  return (
    <nav className="absolute inset-x-0 top-0 z-50 pt-8">
      <div className="container-page">
        <div className="flex items-center justify-center gap-6">
          <div className="hidden items-center gap-6 md:flex">
            {LEFT_LINKS.map((l) => (
              <NavLink key={l.href} {...l} />
            ))}
          </div>

          <a href="#top" aria-label="travelAURA" className="shrink-0">
            <img src={LOGO} alt="travelAURA" className="h-12 w-auto" />
          </a>

          <div className="hidden items-center gap-6 md:flex">
            {RIGHT_LINKS.map((l) => (
              <NavLink key={l.href} {...l} />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
