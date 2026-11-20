import type { Metadata } from "next";
import PageFaqSection from "@/components/faq/PageFaqSection";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import { JsonLd } from "@/components/faq/FaqAccordion";
import { getBlogs } from "@/lib/data";
import { ORG_ID, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pest Control Blog & Tips",
  alternates: { canonical: absoluteUrl("/blog") },
  description: "Practical pest control guides for Mumbai homes and businesses — termite prevention, cockroach control, monsoon mosquito tips and treatment preparation.",
};

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric", timeZone: "Asia/Kolkata" }) : "";

export default async function BlogListPage() {
  const blogs = await getBlogs();
  const url = absoluteUrl("/blog");
  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${url}#blog`,
    url,
    name: "Eco-Friendly Pests blog",
    publisher: { "@id": ORG_ID },
    blogPost: blogs.slice(0, 20).map((b) => ({
      "@type": "BlogPosting",
      headline: b.title,
      url: absoluteUrl(`/blog/${b.slug}`),
      ...(b.createdAt ? { datePublished: b.createdAt } : {}),
    })),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <JsonLd data={schema} />
      <section className="bg-green-800 px-4 py-16 text-center">
        <h1 className="mb-4 text-4xl font-extrabold text-white md:text-5xl">Pest control blog &amp; guides</h1>
        <p className="mx-auto max-w-2xl text-green-100">Practical advice on preventing and treating pests in Mumbai homes and businesses.</p>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {blogs.length === 0 ? (
          <p className="text-center text-gray-500">No articles published yet. <Link href="/services" className="font-semibold text-green-700 underline">Browse our services</Link>.</p>
        ) : (
          <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog, index) => (
              <li key={blog.id}>
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-lg">
                  <div className="relative aspect-[16/9] bg-gray-200">
                    <SmartImage src={blog.image} alt={blog.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px" loading={index < 3 ? "eager" : "lazy"} className="object-cover" />
                  </div>
                  <div className="flex flex-grow flex-col p-6">
                    {blog.createdAt && (
                      <p className="mb-3 flex items-center gap-2 text-xs text-gray-500">
                        <Calendar size={14} aria-hidden="true" /> <time dateTime={blog.createdAt}>{formatDate(blog.createdAt)}</time>
                      </p>
                    )}
                    <h2 className="mb-3 text-xl font-bold text-gray-900">
                      <Link href={`/blog/${blog.slug}`} className="hover:text-green-700">{blog.title}</Link>
                    </h2>
                    <p className="mb-6 line-clamp-3 text-sm text-gray-600">{blog.metaDescription}</p>
                    <Link href={`/blog/${blog.slug}`} className="mt-auto inline-flex items-center font-bold text-green-700 hover:text-green-800">
                      Read article<span className="sr-only">: {blog.title}</span> <ArrowRight size={16} className="ml-1" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
      <PageFaqSection page="blog" path="/blog" />
    </div>
  );
}
