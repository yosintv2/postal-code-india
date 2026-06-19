'use client';

import { useEffect } from 'react';

export default function PrefetchLinks({ hrefs }: { hrefs: string[] }) {
  useEffect(() => {
    hrefs.forEach(href => {
      if (document.querySelector(`link[rel="prefetch"][href="${href}"]`)) return;
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      link.as = 'document';
      document.head.appendChild(link);
    });
  }, [hrefs]);

  return null;
}
