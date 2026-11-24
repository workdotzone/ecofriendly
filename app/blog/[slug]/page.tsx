import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, ChevronLeft, User } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import { JsonLd } from "@/components/faq/FaqAccordion";
import { getBlogBySlug, getBlogs } from "@/lib/data";
import { Markdown } from "@/lib/markdown";
import { ORG_ID, SITE, absoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

// Known slugs are fully prerendered (generateStaticParams). Reading `params` at the top of the page is
// intentional: it lets notFound()/redirects run before streaming, so crawlers get real 404/308 status codes.
export const instant = false;

export async function generateStaticParams() {
  const blogs = await getBlogs();
  // Cache Components needs at least one param; unknown slugs still render on demand.
  return (blogs.length ? blogs : [{ slug: "pest-control-tips" }])
    .slice(0, 5)
    .map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return { title: "Article not found", robots: { index: false, follow: true } };
  const url = absoluteUrl(`/blog/${blog.slug}`);
  const image = blog.image ? absoluteUrl(blog.image) : absoluteUrl(SITE.defaultOgImage);
  return {
    title: blog.title,
    description: blog.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "en_IN",
      title: blog.title,
      description: blog.metaDescription,
      url,
      siteName: SITE.name,
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt,
      authors: [blog.author],
      images: [{ url: image, alt: blog.title }],
    },
    twitter: { card: "summary_large_image", title: blog.title, description: blog.metaDescription, images: [image] },
  };
}

export default async function SingleBlogPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) notFound();

  const url = absoluteUrl(`/blog/${blog.slug}`);
  const isBrandAuthor = /eco[- ]?friendly ?pests/i.test(blog.author);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: blog.title,
        description: blog.metaDescription,
        image: blog.image ? absoluteUrl(blog.image) : absoluteUrl(SITE.defaultOgImage),
        ...(blog.createdAt ? { datePublished: blog.createdAt } : {}),
        ...(blog.updatedAt ? { dateModified: blog.updatedAt } : {}),
        author: isBrandAuthor ? { "@id": ORG_ID } : { "@type": "Person", name: blog.author },
        publisher: { "@id": ORG_ID },
        mainEntityOfPage: url,
        inLanguage: "en-IN",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
          { "@type": "ListItem", position: 3, name: blog.title, item: url },
        ],
      },
    ],
  };

  return (
    <article className="min-h-screen bg-white pb-20">
      <JsonLd data={schema} />
      <header className="relative h-[280px] w-full bg-gray-900 sm:h-[400px] md:h-[480px]">
        <SmartImage src={blog.image} alt="" fill preload fetchPriority="high" sizes="100vw" className="object-cover opacity-60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <h1 className="max-w-4xl text-3xl font-extrabold text-white drop-shadow-lg sm:text-4xl md:text-5xl">{blog.title}</h1>
        </div>
      </header>

      <div className="relative z-10 mx-auto -mt-12 max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl sm:p-8 md:p-12">
          <Link href="/blog" className="mb-8 inline-flex items-center text-sm font-semibold text-green-700 hover:text-green-800">
            <ChevronLeft size={16} className="mr-1" aria-hidden="true" /> Back to all articles
          </Link>
          <div className="mb-10 flex flex-wrap items-center gap-6 border-b border-gray-100 pb-6 text-sm font-medium text-gray-500">
            <span className="flex items-center gap-2"><User size={16} className="text-green-600" aria-hidden="true" /> {blog.author}</span>
            {blog.createdAt && (
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-green-600" aria-hidden="true" />
                <time dateTime={blog.createdAt}>{new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" })}</time>
              </span>
            )}
          </div>
          <Markdown source={blog.content} />
          <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl bg-green-50 p-6 sm:flex-row">
            <p className="font-semibold text-gray-900">Need help with pests? Get a free inspection and written quote.</p>
            <Link href="/book-now" className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700">Book inspection</Link>
          </div>
        </div>
      </div>
    </article>
  );
}
