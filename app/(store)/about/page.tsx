import { StaticPage, staticPageMetadata } from '@/lib/content/createStaticPage';

export const metadata = staticPageMetadata('about');
export default function AboutPage() {
  return <StaticPage slug="about" />;
}
