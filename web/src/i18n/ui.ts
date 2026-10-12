export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

/** Text that exists in both languages. */
export type L = { en: string; ar: string };

export const ui = {
  en: {
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.skills': 'Skills',
    'nav.experience': 'Experience',
    'nav.contact': 'Contact',
    'nav.cv': 'CV',
    'nav.blog': 'Writing',
    'nav.skip': 'Skip to content',
    'theme.toggle': 'Toggle light/dark theme',
    'lang.switch': 'العربية',
    'hero.eyebrow': 'AI/ML Engineer',
    'hero.cta.projects': 'View projects',
    'hero.cta.contact': 'Get in touch',
    'hero.cta.cv': 'Download CV',
    'hero.canvas.label': 'Animated illustration: object detection boxes tracking synthetic figures',
    'hero.location': 'Aleppo, Syria · Open to remote',
    'about.title': 'About',
    'projects.title': 'Selected work',
    'projects.all': 'All projects',
    'projects.featured': 'Featured',
    'projects.problem': 'Problem',
    'projects.approach': 'Approach',
    'projects.stack': 'Stack',
    'projects.metrics': 'Results',
    'projects.architecture': 'Architecture',
    'projects.repo': 'Repository',
    'projects.demo': 'Live demo',
    'projects.back': 'Back to projects',
    'projects.pending': 'Metric pending publication',
    'nda.full': 'Under NDA',
    'nda.light': 'Partially sanitized',
    'nda.note.full': 'Client work under NDA. Only technique, architecture, and sanitized metrics are shown; visuals are synthetic.',
    'nda.note.light': 'Some details are generalized to protect internal work.',
    'skills.title': 'Skills',
    'skills.sub': 'Grouped by area. Hover or tap a tool to see the projects that used it.',
    'skills.usedIn': 'Used in',
    'experience.title': 'Experience',
    'education.title': 'Education',
    'present': 'Present',
    'beyond.title': 'Beyond code',
    'publications.title': 'Publications & talks',
    'contact.title': 'Contact',
    'contact.sub': 'Have a computer vision or LLM problem that needs to work outside a notebook? Write to me.',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Send message',
    'contact.sending': 'Sending…',
    'contact.ok': 'Thanks! Your message was received. I will reply soon.',
    'contact.err': 'Something went wrong. Please try again or reach me on LinkedIn.',
    'contact.rate': 'Too many messages. Please try again later.',
    'contact.invalid': 'Please fill in all fields with a valid email (message at least 10 characters).',
    'contact.elsewhere': 'Elsewhere',
    'contact.direct': 'Email me directly',
    'contact.write': 'Write an email',
    'contact.copy': 'Copy address',
    'contact.copied': 'Copied',
    'cv.title': 'Curriculum vitae',
    'cv.download': 'Download PDF',
    'blog.title': 'Writing',
    'notfound.title': 'Nothing detected here',
    'notfound.body': 'The page you are looking for does not exist (confidence 0.00).',
    'notfound.home': 'Back home',
    'footer.built': 'Built with Astro & FastAPI.',
  },
  ar: {
    'nav.about': 'نبذة',
    'nav.projects': 'المشاريع',
    'nav.skills': 'المهارات',
    'nav.experience': 'الخبرة',
    'nav.contact': 'تواصل',
    'nav.cv': 'السيرة الذاتية',
    'nav.blog': 'مقالات',
    'nav.skip': 'انتقل إلى المحتوى',
    'theme.toggle': 'تبديل الوضع الفاتح/الداكن',
    'lang.switch': 'English',
    'hero.eyebrow': 'مهندس ذكاء اصطناعي وتعلّم آلي',
    'hero.cta.projects': 'استعرض المشاريع',
    'hero.cta.contact': 'تواصل معي',
    'hero.cta.cv': 'تحميل السيرة الذاتية',
    'hero.canvas.label': 'رسم متحرك: صناديق كشف الأجسام تتبع أشكالاً اصطناعية',
    'hero.location': 'حلب، سوريا · متاح للعمل عن بُعد',
    'about.title': 'نبذة',
    'projects.title': 'أعمال مختارة',
    'projects.all': 'كل المشاريع',
    'projects.featured': 'مميز',
    'projects.problem': 'المشكلة',
    'projects.approach': 'المنهجية',
    'projects.stack': 'التقنيات',
    'projects.metrics': 'النتائج',
    'projects.architecture': 'البنية',
    'projects.repo': 'المستودع',
    'projects.demo': 'عرض حي',
    'projects.back': 'العودة إلى المشاريع',
    'projects.pending': 'المقياس قيد النشر',
    'nda.full': 'خاضع لاتفاقية سرية',
    'nda.light': 'مُعمَّم جزئياً',
    'nda.note.full': 'عمل لعميل خاضع لاتفاقية عدم إفصاح. تُعرض التقنية والبنية والمقاييس المنقّحة فقط، والصور اصطناعية.',
    'nda.note.light': 'بعض التفاصيل معمّمة لحماية العمل الداخلي.',
    'skills.title': 'المهارات',
    'skills.sub': 'مجمّعة حسب المجال. مرّر المؤشر على أي أداة أو اضغط عليها لترى المشاريع التي استُخدمت فيها.',
    'skills.usedIn': 'استُخدمت في',
    'experience.title': 'الخبرة',
    'education.title': 'التعليم',
    'present': 'حتى الآن',
    'beyond.title': 'خارج البرمجة',
    'publications.title': 'منشورات ومحاضرات',
    'contact.title': 'تواصل',
    'contact.sub': 'لديك مشكلة في الرؤية الحاسوبية أو النماذج اللغوية وتحتاج حلاً يعمل خارج الـ notebook؟ راسلني.',
    'contact.name': 'الاسم',
    'contact.email': 'البريد الإلكتروني',
    'contact.message': 'الرسالة',
    'contact.send': 'إرسال',
    'contact.sending': 'جارٍ الإرسال…',
    'contact.ok': 'شكراً! وصلت رسالتك وسأرد قريباً.',
    'contact.err': 'حدث خطأ. حاول مرة أخرى أو راسلني عبر LinkedIn.',
    'contact.rate': 'رسائل كثيرة. حاول لاحقاً.',
    'contact.invalid': 'يرجى تعبئة كل الحقول ببريد صحيح (الرسالة 10 أحرف على الأقل).',
    'contact.elsewhere': 'روابط أخرى',
    'contact.direct': 'راسلني مباشرة',
    'contact.write': 'اكتب رسالة',
    'contact.copy': 'نسخ العنوان',
    'contact.copied': 'تم النسخ',
    'cv.title': 'السيرة الذاتية',
    'cv.download': 'تحميل PDF',
    'blog.title': 'مقالات',
    'notfound.title': 'لم يُكتشف شيء هنا',
    'notfound.body': 'الصفحة التي تبحث عنها غير موجودة (الثقة 0.00).',
    'notfound.home': 'العودة للرئيسية',
    'footer.built': 'بُني باستخدام Astro و FastAPI.',
  },
} as const;

export type UIKey = keyof (typeof ui)['en'];

export function useT(locale: Locale) {
  return (key: UIKey): string => ui[locale][key] ?? ui.en[key];
}

/** Pick the locale variant of a bilingual value. */
export function pick(value: L, locale: Locale): string {
  return value[locale] || value.en;
}

/** Prefix a path for a locale. Paths are given without locale, e.g. "/projects/x". */
export function localePath(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (locale === defaultLocale) return `${base}${clean}`;
  return `${base}/${locale}${clean === '/' ? '/' : clean}`;
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'ar' : 'en';
}

export function dirOf(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}
