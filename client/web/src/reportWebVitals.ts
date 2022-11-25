import {ReportCallback} from 'web-vitals';

/**
 * Measure web vital metrics on real users and collect the results
 * by passing any of the below functions as arguments or console.log
 * for logging result in browser console.
 *
 * `1) Send results to analytics endpoint`
 * @example
 * ```
 * function sendToAnalytics(metric) {
 *   const body = JSON.stringify(metric);
 *   const url = 'https://example.com/analytics';
 *
 *   // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
 *   if (navigator.sendBeacon) {
 *     navigator.sendBeacon(url, body);
 *   } else {
 *     fetch(url, { body, method: 'POST', keepalive: true });
 *   }
 * }
 *
 * reportWebVitals(sendToAnalytics);
 * ```
 * `2) Send results to google analytics`
 * @example
 * ```
 * function sendToAnalytics({ id, name, value }) {
 *   ga('send', 'event', {
 *     eventCategory: 'Web Vitals',
 *     eventAction: name,
 *     eventValue: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
 *     eventLabel: id, // id unique to current page load
 *     nonInteraction: true, // avoids affecting bounce rate
 *   });
 * }
 *
 * reportWebVitals(sendToAnalytics);
 * ```
 */
const reportWebVitals = (onPerfEntry?: ReportCallback) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({onCLS, onFCP, onFID, onLCP, onTTFB}) => {
      // Core web vitals
      onCLS(onPerfEntry); // Cumulative Layout Shift
      onFID(onPerfEntry); // First Input Delay
      onLCP(onPerfEntry); // Largest Contentful Paint

      // Other metrics
      // onINP(onPerfEntry); //Interaction to Next Paint (experimental)
      onFCP(onPerfEntry); // First Contentful Paint
      onTTFB(onPerfEntry); // Time To First Byte
    });
  }
};

export default reportWebVitals;
