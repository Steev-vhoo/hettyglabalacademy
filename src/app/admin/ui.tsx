export function AdminHeader({ title, intro, children }: { title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl">{title}</h1>
        {intro && <p className="text-muted">{intro}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export function Panel({ title, children, className = "" }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-line bg-white p-5 sm:p-6 ${className}`}>
      {title && <h2 className="mb-4 text-xl">{title}</h2>}
      {children}
    </section>
  );
}

export function Stat({ label, value, note }: { label: string; value: string | number; note?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="font-serif text-4xl text-burgundy">{value}</p>
      {note && <p className="text-xs text-muted">{note}</p>}
    </div>
  );
}

export const th = "border-b border-line px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted";
export const td = "border-b border-[#f1eadf] px-3 py-3 align-top text-sm";
