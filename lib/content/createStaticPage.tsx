import type { Metadata } from 'next';
import StaticPageView from '@/components/content/StaticPageView';
import { staticPages, type StaticPageSlug } from './staticPages';

export function staticPageMetadata(slug: StaticPageSlug): Metadata {
  return { title: staticPages[slug].title };
}

export function StaticPage({ slug }: { slug: StaticPageSlug }) {
  return <StaticPageView content={staticPages[slug]} />;
}
