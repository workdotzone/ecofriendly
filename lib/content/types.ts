export type FaqItem = { question: string; answer: string };

export type ServiceFact = { label: string; value: string };

export type ServiceStep = { name: string; text: string };

export type ServiceSection = {
  /** Section H2. Phrase as the question people actually search/ask (AEO + voice). */
  heading: string;
  /** Lightweight markdown: paragraphs, "### sub-heading", "- bullet", "1. step", **bold**. */
  body: string;
};

export type ServiceContent = {
  slug: string;
  /** Other slugs that should resolve to this content (old URLs / admin variations). */
  aliases?: string[];
  title: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  shortDescription: string;
  /** 40–60 word direct answer: featured snippets, AI overviews and voice assistants read this. */
  quickAnswer: string;
  image: string;
  imageAlt: string;
  keywords: string[];
  pest: string;
  facts: ServiceFact[];
  signs: string[];
  sections: ServiceSection[];
  process: ServiceStep[];
  preparation: string[];
  aftercare: string[];
  prevention: string[];
  faqs: FaqItem[];
  related: string[];
};
