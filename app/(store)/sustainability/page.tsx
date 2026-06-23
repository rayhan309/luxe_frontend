import { StaticPage, staticPageMetadata } from '@/lib/content/createStaticPage';

export const metadata = staticPageMetadata('sustainability');
export default function SustainabilityPage() {
  return <StaticPage slug="sustainability" />;
}
