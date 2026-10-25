import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  jsonLd?: object[];
}

export function SEO({
  title,
  description,
  canonicalUrl,
  ogImage = '/l.webp',
  jsonLd = [],
}: SEOProps) {
  useEffect(() => {
    // 1. Update document title
    document.title = title;

    // 2. Ensure browser tab favicon uses l.webp
    let iconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
    if (!iconLink) {
      iconLink = document.createElement('link');
      iconLink.rel = 'icon';
      document.head.appendChild(iconLink);
    }
    iconLink.type = 'image/webp';
    iconLink.href = '/l.webp';

    // Helper to update or create meta tags
    const setMeta = (attrName: 'name' | 'property', attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard meta
    setMeta('name', 'description', description);

    // Canonical link
    if (canonicalUrl) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonicalUrl);
    }

    // Resolve full absolute URL for Open Graph image (crucial for WhatsApp link previews)
    const resolvedOgImage = ogImage.startsWith('http')
      ? ogImage
      : typeof window !== 'undefined'
        ? `${window.location.origin}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`
        : ogImage;

    // OpenGraph
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', 'AXIA KAIROS');
    if (canonicalUrl) setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:image', resolvedOgImage);
    setMeta('property', 'og:image:secure_url', resolvedOgImage);
    setMeta('property', 'og:image:type', ogImage.endsWith('.webp') ? 'image/webp' : 'image/png');
    setMeta('property', 'og:image:width', '1254');
    setMeta('property', 'og:image:height', '1254');
    setMeta('property', 'og:image:alt', 'AXIA KAIROS Official Logo');

    // Twitter Card
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', resolvedOgImage);

    // JSON-LD Structured Data
    const scriptId = 'page-json-ld';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (jsonLd.length > 0) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = scriptId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(jsonLd.length === 1 ? jsonLd[0] : jsonLd);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      const tag = document.getElementById(scriptId);
      if (tag) tag.remove();
    };
  }, [title, description, canonicalUrl, ogImage, jsonLd]);

  return null;
}
