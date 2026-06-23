import type { Metadata } from 'next';
import CategoryClient from './CategoryClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
  return { title: `${title} Collection` };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  return <CategoryClient slug={slug} />;
}
