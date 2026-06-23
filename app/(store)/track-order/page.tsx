import { StaticPage, staticPageMetadata } from '@/lib/content/createStaticPage';

export const metadata = staticPageMetadata('track-order');
export default function TrackOrderPage() {
  return <StaticPage slug="track-order" />;
}
