import { StaticPage, staticPageMetadata } from '@/lib/content/createStaticPage';

export const metadata = staticPageMetadata('shipping');
export default function ShippingPage() {
  return <StaticPage slug="shipping" />;
}
