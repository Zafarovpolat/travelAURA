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
      className="link-underline whitespace-nowrap font-display text-[13px] font-semibold text-white sm:text-[16px]"
    >
      {label}
    </a>
  );
}

export function SiteNav() {
  return (
    <nav className="absolute inset-x-0 top-0 z-50 pt-6 md:pt-8">
      <div className="container-page">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 md:gap-8">
          {[...LEFT_LINKS, ...RIGHT_LINKS].map((l) => (
            <NavLink key={l.href} {...l} />
          ))}
        </div>
      </div>
    </nav>
  );
}
