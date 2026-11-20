import SmartImage from "@/components/ui/SmartImage";
import type { ClientLogo } from "@/lib/data";

/**
 * Client logo strip. Server-rendered (logos + names are in the HTML for crawlers).
 * - ≥ 6 logos: CSS-only infinite marquee (pauses on hover, disabled for reduced-motion users).
 * - < 6 logos: static centred row (a marquee with 2–3 logos looks broken).
 */
export default function Clients({
  clients,
  heading = "Trusted by businesses across Mumbai",
}: {
  clients: ClientLogo[];
  heading?: string;
}) {
  if (!clients.length) return null;
  const animate = clients.length >= 6;

  const logo = (client: ClientLogo, key: string, hidden = false) => (
    <li
      key={key}
      className="flex h-20 w-36 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white px-4 py-3 md:h-24 md:w-44"
      aria-hidden={hidden || undefined}
    >
      <SmartImage
        src={client.image}
        alt={hidden ? "" : `${client.name} logo`}
        width={176}
        height={96}
        sizes="176px"
        loading="lazy"
        className="h-full w-full object-contain"
      />
    </li>
  );

  return (
    <section className="w-full overflow-hidden border-y border-gray-100 bg-white py-12" aria-labelledby="clients-heading">
      <div className="mx-auto mb-8 max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 id="clients-heading" className="text-2xl font-bold text-gray-900">{heading}</h2>
      </div>

      {animate ? (
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent md:w-32" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent md:w-32" />
          <ul className="marquee flex w-max items-center gap-6 md:gap-10">
            {clients.map((client) => logo(client, `a-${client.id}`))}
            {clients.map((client) => logo(client, `b-${client.id}`, true))}
          </ul>
        </div>
      ) : (
        <ul className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-6 px-4">
          {clients.map((client) => logo(client, client.id))}
        </ul>
      )}
    </section>
  );
}
