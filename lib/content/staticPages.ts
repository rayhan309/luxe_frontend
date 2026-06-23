export interface StaticPageContent {
  title: string;
  subtitle?: string;
  sections: { heading?: string; body: string }[];
}

export const staticPages = {
  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know about shopping with LUXE',
    sections: [
      { heading: 'Orders & Shipping', body: 'Standard delivery takes 3–5 business days. Express shipping is available at checkout for select regions. You will receive tracking information once your order ships.' },
      { heading: 'Returns', body: 'We offer complimentary returns within 30 days of delivery. Items must be unworn with original tags attached. Visit our Shipping & Returns page for full details.' },
      { heading: 'Payments', body: 'We accept all major credit cards and cash on delivery in supported regions. All transactions are encrypted and secure.' },
      { heading: 'Account', body: 'Create an account to track orders, save addresses, and manage your wishlist. Contact our support team if you need help accessing your account.' },
    ],
  },
  shipping: {
    title: 'Shipping & Returns',
    subtitle: 'Premium delivery, effortless returns',
    sections: [
      { heading: 'Shipping', body: 'Complimentary standard shipping on orders over $150. Orders below $150 incur a flat $9.99 shipping fee. International shipping rates are calculated at checkout.' },
      { heading: 'Returns', body: 'Initiate a return from your account within 30 days. Refunds are processed within 5–7 business days after we receive your item.' },
      { heading: 'Exchanges', body: 'Contact our concierge team for size exchanges. We will arrange collection and dispatch your preferred size subject to availability.' },
    ],
  },
  'size-guide': {
    title: 'Size Guide',
    subtitle: 'Find your perfect fit',
    sections: [
      { body: 'Our sizing follows international standards. When in doubt, we recommend sizing up for a relaxed luxury fit. Product pages include specific measurements where available.' },
      { heading: 'Women\'s Tops', body: 'XS: 32–34" bust · S: 34–36" · M: 36–38" · L: 38–40" · XL: 40–42"' },
      { heading: 'Men\'s Tops', body: 'S: 36–38" chest · M: 38–40" · L: 40–42" · XL: 42–44" · XXL: 44–46"' },
    ],
  },
  'track-order': {
    title: 'Track Your Order',
    subtitle: 'Stay updated on your delivery',
    sections: [
      { body: 'Sign in to your account and visit My Orders to view real-time status updates. Once shipped, your tracking number will appear on the order detail page.' },
      { body: 'For assistance, contact our support team with your order number and we will provide an update within 24 hours.' },
    ],
  },
  contact: {
    title: 'Contact Us',
    subtitle: 'We are here to help',
    sections: [
      { heading: 'Customer Care', body: 'Email: concierge@luxe.store · Hours: Mon–Sat, 9am–6pm EST' },
      { heading: 'Press & Partnerships', body: 'Email: press@luxe.store' },
      { heading: 'Flagship', body: 'By appointment only · New York · London · Milan' },
    ],
  },
  about: {
    title: 'About LUXE',
    subtitle: 'Curated luxury for the modern world',
    sections: [
      { body: 'LUXE is an independent fashion house dedicated to timeless design, exceptional craftsmanship, and conscious curation. Every piece in our collection is selected for quality, longevity, and understated elegance.' },
      { body: 'Founded on the belief that luxury should feel effortless, we partner with artisans and designers who share our commitment to excellence.' },
    ],
  },
  careers: {
    title: 'Careers',
    subtitle: 'Join our team',
    sections: [
      { body: 'We are always looking for passionate individuals in design, technology, operations, and customer experience. Send your portfolio and CV to careers@luxe.store.' },
    ],
  },
  press: {
    title: 'Press',
    subtitle: 'Media inquiries',
    sections: [
      { body: 'For press kits, interview requests, and brand assets, contact press@luxe.store. Our team responds within two business days.' },
    ],
  },
  sustainability: {
    title: 'Sustainability',
    subtitle: 'Responsible luxury',
    sections: [
      { body: 'We prioritize responsible sourcing, reduced packaging waste, and partnerships with suppliers who meet our ethical standards. Our goal is to minimize environmental impact without compromising quality.' },
      { body: 'We are committed to transparent progress reporting and continuous improvement across our supply chain.' },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'How we protect your data',
    sections: [
      { body: 'We collect only the information necessary to process orders and improve your experience. Payment data is handled by certified payment processors and never stored on our servers.' },
      { body: 'You may request data export or deletion at any time by contacting privacy@luxe.store.' },
    ],
  },
} as const satisfies Record<string, StaticPageContent>;

export type StaticPageSlug = keyof typeof staticPages;
