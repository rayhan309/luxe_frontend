import { StaticPage, staticPageMetadata } from '@/lib/content/createStaticPage';

export const metadata = staticPageMetadata('careers');
export default function CareersPage() {
  return <StaticPage slug="careers" />;
}
