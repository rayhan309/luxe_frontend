import { StaticPage, staticPageMetadata } from '@/lib/content/createStaticPage';

export const metadata = staticPageMetadata('privacy');
export default function PrivacyPage() {
  return <StaticPage slug="privacy" />;
}
