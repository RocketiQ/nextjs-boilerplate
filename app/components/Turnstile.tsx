'use client';

import Script from 'next/script';

export default function Turnstile({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!;
  // Cloudflare auto-injects a hidden input named "cf-turnstile-response" into the *nearest form*
  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      <div className="cf-turnstile" data-sitekey={siteKey} data-theme={theme} />
    </>
  );
}
