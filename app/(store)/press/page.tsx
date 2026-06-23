import { StaticPage, staticPageMetadata } from '@/lib/content/createStaticPage';

export const metadata = staticPageMetadata('press');
export default function PressPage() {
  return <StaticPage slug="press" />;
}
