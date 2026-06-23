import { StaticPage, staticPageMetadata } from '@/lib/content/createStaticPage';

export const metadata = staticPageMetadata('size-guide');
export default function SizeGuidePage() {
  return <StaticPage slug="size-guide" />;
}
