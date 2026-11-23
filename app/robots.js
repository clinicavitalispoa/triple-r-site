import { INDEXABLE, SITE_URL } from '@/lib/site';

export default function robots() {
  return INDEXABLE
    ? { rules: [{ userAgent: '*', allow: '/' }], sitemap: `${SITE_URL}/sitemap.xml` }
    : { rules: [{ userAgent: '*', disallow: '/' }] };
}
