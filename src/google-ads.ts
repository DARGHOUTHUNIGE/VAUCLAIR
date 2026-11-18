declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export const trackQuoteConversion = (transactionId?: string) => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  window.gtag('event', 'conversion', {
    send_to: 'AW-18575624510/N-KACKnQlLodEL6SxplF',
    ...(transactionId ? { transaction_id: transactionId } : {}),
  });
};
