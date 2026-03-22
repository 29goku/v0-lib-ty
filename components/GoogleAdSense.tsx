'use client';

import { useEffect } from 'react';

export default function GoogleAdSense() {
  useEffect(() => {
    // Initialize AdSense
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({
        google_ad_client: process.env.NEXT_PUBLIC_GOOGLE_AD_CLIENT,
        enable_page_level_ads: true,
      });
    } catch (err) {
      console.log('AdSense initialization error:', err);
    }
  }, []);

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_AD_CLIENT}`}
      crossOrigin="anonymous"
      suppressHydrationWarning
    />
  );
}
