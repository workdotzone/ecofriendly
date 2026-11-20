import Link from "next/link";
import { BadgeCheck, MessageSquareQuote, Star } from "lucide-react";
import type { Review, ReviewStats } from "@/lib/data";
import ReviewText from "./ReviewText";

const AVATAR_COLORS = [
  "bg-green-700", "bg-emerald-600", "bg-teal-700", "bg-sky-700", "bg-indigo-600", "bg-amber-600", "bg-rose-600", "bg-slate-700",
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase() || "?";
}

function colorFor(name: string) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-IN", { month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
}

export function Stars({ rating, size = 16, className = "" }: { rating: number; size?: number; className?: string }) {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} role="img" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => {
        const fill = rounded >= i + 1 ? "full" : rounded >= i + 0.5 ? "half" : "empty";
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }} aria-hidden="true">
            <Star size={size} className="absolute inset-0 text-gray-300" />
            {fill !== "empty" && (
              <span className="absolute inset-0 overflow-hidden" style={{ width: fill === "half" ? size / 2 : size }}>
                <Star size={size} className="fill-amber-400 text-amber-400" />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}

export function RatingSummary({ stats, label = "Customer rating" }: { stats: ReviewStats; label?: string }) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-sm font-bold uppercase tracking-wider text-green-700">{label}</p>
      <div className="mt-3 flex items-end gap-3">
        <span className="text-5xl font-extrabold leading-none text-gray-900">{stats.average.toFixed(1)}</span>
        <span className="pb-1 text-sm font-medium text-gray-500">out of 5</span>
      </div>
      <Stars rating={stats.average} size={22} className="mt-3" />
      <p className="mt-2 text-sm text-gray-600">
        Based on <strong className="text-gray-900">{stats.count}</strong> published {stats.count === 1 ? "review" : "reviews"}
      </p>
      <dl className="mt-6 space-y-2.5">
        {([5, 4, 3, 2, 1] as const).map((star) => {
          const value = stats.distribution[star];
          const pct = stats.count ? Math.round((value / stats.count) * 100) : 0;
          return (
            <div key={star} className="flex items-center gap-3 text-sm">
              <dt className="flex w-10 shrink-0 items-center gap-1 font-medium text-gray-700">
                {star} <Star size={13} className="fill-amber-400 text-amber-400" aria-hidden="true" />
              </dt>
              <dd className="flex flex-1 items-center gap-3">
                <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <span className="block h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                </span>
                <span className="w-9 text-right tabular-nums text-gray-500">{pct}%</span>
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}

export function ReviewCard({ review }: { review: Review }) {
  const date = formatDate(review.createdAt);
  return (
    <article
      className="flex h-full min-w-[85%] snap-start flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md sm:min-w-[60%] md:min-w-0"
      aria-label={`Review by ${review.name}`}
    >
      <header className="mb-4 flex items-start gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${colorFor(review.name)}`}
          aria-hidden="true"
        >
          {initials(review.name)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 truncate font-bold text-gray-900">
            {review.name}
            <BadgeCheck size={16} className="shrink-0 text-green-600" aria-label="Verified customer" />
          </p>
          {review.designation && <p className="truncate text-sm text-gray-500">{review.designation}</p>}
        </div>
      </header>
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <Stars rating={review.rating} size={16} />
        {date && <time dateTime={review.createdAt} className="text-xs text-gray-400">{date}</time>}
      </div>
      <ReviewText text={review.text} id={review.id} />
      {review.service && (
        <p className="mt-5 inline-flex w-max max-w-full items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800 ring-1 ring-green-100">
          <span className="truncate">{review.service}</span>
        </p>
      )}
    </article>
  );
}

type ReviewsSectionProps = {
  id?: string;
  eyebrow?: string;
  heading: string;
  description?: string;
  reviews: Review[];
  stats: ReviewStats;
  showAllLink?: boolean;
  tone?: "white" | "gray";
};

/** Server-rendered review block: rating summary + review cards (scroll-snap on mobile, grid on desktop). */
export default function ReviewsSection({
  id = "reviews",
  eyebrow = "Customer reviews",
  heading,
  description,
  reviews,
  stats,
  showAllLink = true,
  tone = "gray",
}: ReviewsSectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} className={`w-full py-16 md:py-24 ${tone === "gray" ? "bg-gray-50" : "bg-white"}`} aria-labelledby={headingId}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
          <p className="mb-3 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-green-700">
            <MessageSquareQuote size={16} aria-hidden="true" /> {eyebrow}
          </p>
          <h2 id={headingId} className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">{heading}</h2>
          {description && <p className="mt-4 text-lg leading-relaxed text-gray-600">{description}</p>}
        </div>

        {reviews.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center" role="status">
            <p className="font-semibold text-gray-900">Reviews will appear here soon.</p>
            <p className="mt-2 text-sm text-gray-600">Had a service with us? We would love to hear how it went.</p>
            <Link href="/contact" className="mt-5 inline-flex rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white hover:bg-green-700">
              Share your feedback
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[320px_1fr] lg:items-start">
            <div className="lg:sticky lg:top-32">
              <RatingSummary stats={stats} />
              {showAllLink && (
                <Link
                  href="/testimonials"
                  className="mt-4 flex w-full items-center justify-center rounded-xl border border-green-200 bg-white px-5 py-3 text-sm font-bold text-green-800 transition hover:bg-green-50"
                >
                  Read all {stats.count} reviews
                </Link>
              )}
            </div>
            <div
              className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0"
            >
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
