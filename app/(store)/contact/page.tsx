import { StaticPage, staticPageMetadata } from '@/lib/content/createStaticPage';

export const metadata = staticPageMetadata('contact');
export default function ContactPage() {
  return <StaticPage slug="contact" />;
}
