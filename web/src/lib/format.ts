import type { Locale } from '@/i18n/ui';

const intlLocale = (l: Locale) => (l === 'ar' ? 'ar-u-nu-latn' : 'en-US');

/** "2026-07" -> "Jul 2026" / "يوليو 2026" */
export function formatMonth(ym: string, locale: Locale): string {
  const [y, m] = ym.split('-').map(Number);
  return new Intl.DateTimeFormat(intlLocale(locale), { month: 'short', year: 'numeric' }).format(new Date(y, (m ?? 1) - 1, 1));
}

export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale(locale), { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
}
