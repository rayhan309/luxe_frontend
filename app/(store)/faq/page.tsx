import { StaticPage, staticPageMetadata } from '@/lib/content/createStaticPage';

export const metadata = staticPageMetadata('faq');
export default function FAQPage() {
  return <StaticPage slug="faq" />;
}
