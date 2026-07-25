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
        <div className="hidden items-center justify-center gap-8 md:flex">
          {[...LEFT_LINKS, ...RIGHT_LINKS].map((l) => (
            <NavLink key={l.href} {...l} />
          ))}
        </div>
      </div>
    </nav>
  );
}
