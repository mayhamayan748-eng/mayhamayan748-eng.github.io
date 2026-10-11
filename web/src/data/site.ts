import type { L } from '@/i18n/ui';

export const profile = {
  name: { en: 'Mohamad Ayham Ayan', ar: 'محمد أيهم عيان' } satisfies L,
  displayName: { en: 'Ayham Ayan', ar: 'أيهم عيان' } satisfies L,
  initials: 'AA',
  title: { en: 'AI/ML Engineer', ar: 'مهندس ذكاء اصطناعي وتعلّم آلي' } satisfies L,
  focus: {
    en: 'Document AI · Computer Vision · LLMs & Agents',
    ar: 'ذكاء المستندات · الرؤية الحاسوبية · النماذج اللغوية والوكلاء',
  } satisfies L,
  tagline: {
    en: 'Building computer vision and LLM systems that run in production, from training on Grace Blackwell to serving at the edge.',
    ar: 'أبني أنظمة رؤية حاسوبية ونماذج لغوية تعمل في بيئة الإنتاج، من التدريب على Grace Blackwell إلى التشغيل على الأطراف.',
  } satisfies L,
  bio: {
    en: 'AI/ML Engineer in an Applied AI pod. My work covers computer vision (detection, re-identification, camera calibration), vision-language models and local LLM deployment, RAG pipelines, and the ML infrastructure that ties them together. I care about shipping: false-positive budgets, latency, security, and systems that hold up outside a notebook.',
    ar: 'مهندس ذكاء اصطناعي وتعلّم آلي في فريق الذكاء الاصطناعي التطبيقي. يشمل عملي الرؤية الحاسوبية (الكشف، وإعادة التعرّف، ومعايرة الكاميرات)، ونماذج الرؤية واللغة وتشغيل النماذج اللغوية محلياً، وأنظمة RAG، والبنية التحتية التي تربط كل ذلك. يهمّني التسليم الفعلي: ميزانية الإنذارات الكاذبة، وزمن الاستجابة، والأمان، وأنظمة تصمد خارج الـ notebook.',
  } satisfies L,
  location: { en: 'Aleppo, Syria', ar: 'حلب، سوريا' } satisfies L,
  languages: {
    en: 'Arabic (native) · English (B2) · German, French (basic)',
    ar: 'العربية (لغة أم) · الإنجليزية (B2) · الألمانية والفرنسية (أساسي)',
  } satisfies L,
  /** Paths are relative to /public. Swap for Cloudinary URLs later if wanted. */
  photo: '/images/ayham.webp' as string | null,
  logo: '/images/logo-mark.png',
  cvPath: '/cv/Mohamad_Ayham_Ayan_CV_AI.pdf',
};

export type Link = { label: string; href: string; icon: 'linkedin' | 'github' | 'gitlab' | 'hf' | 'kaggle' | 'scholar' | 'mail' };

/** Links set to null are hidden everywhere. */
const rawLinks: Record<Link['icon'], string | null> = {
  mail: 'mayhamayan748@gmail.com',
  linkedin: 'https://www.linkedin.com/in/ayham-ayan-02bba1203',
  github: 'https://github.com/mayhamayan748-eng',
  gitlab: 'https://gitlab.com/Ayham-Ayan',
  hf: 'https://huggingface.co/Ayham-Ayan',
  kaggle: 'https://www.kaggle.com/ayhamayan',
  scholar: null,
};

const labels: Record<Link['icon'], string> = {
  mail: 'Email', linkedin: 'LinkedIn', github: 'GitHub', gitlab: 'GitLab', hf: 'Hugging Face', kaggle: 'Kaggle', scholar: 'Scholar',
};

export const links: Link[] = (Object.keys(rawLinks) as Link['icon'][])
  .filter((k) => rawLinks[k])
  .map((k) => ({ icon: k, label: labels[k], href: k === 'mail' ? `mailto:${rawLinks[k]}` : rawLinks[k]! }));

export type Experience = {
  role: L;
  org: L;
  unit?: L;
  start: string; // YYYY-MM
  end: string | null;
  points: L[];
  projects?: string[];
};

export const experience: Experience[] = [
  {
    role: { en: 'AI/ML Engineer', ar: 'مهندس ذكاء اصطناعي وتعلّم آلي' },
    org: { en: 'Metamas Technologies', ar: 'Metamas Technologies' },
    unit: { en: 'Applied AI Pod', ar: 'فريق الذكاء الاصطناعي التطبيقي' },
    start: '2026-07',
    end: null,
    points: [
      {
        en: 'Document AI: a spec-driven engine that turns image-only Arabic PDFs into typed JSON (123 fields, 31 document types), with a golden-set evaluation and fine-tuning loop.',
        ar: 'ذكاء المستندات: محرّك قائم على المواصفات يحوّل ملفات PDF عربية مصوّرة إلى JSON بأنواع محددة (123 حقلاً، 31 نوع مستند)، مع حلقة تقييم وضبط دقيق على مجموعة مرجعية.',
      },
      {
        en: 'VLMs: LoRA/QLoRA fine-tuning of Qwen3.5-VL (4B/9B) on an NVIDIA DGX Spark (GB10), served as adapters with vLLM behind an OpenAI-compatible API.',
        ar: 'نماذج الرؤية واللغة: ضبط دقيق لـ Qwen3.5-VL (4B/9B) بـ LoRA/QLoRA على NVIDIA DGX Spark (GB10)، وتشغيل المحوّلات عبر vLLM خلف واجهة متوافقة مع OpenAI.',
      },
      {
        en: 'Computer vision: real-time PPE compliance with YOLO26 and InsightFace, plus single-image camera calibration and tilt checks.',
        ar: 'الرؤية الحاسوبية: مراقبة الالتزام بمعدات السلامة لحظياً بـ YOLO26 وInsightFace، ومعايرة الكاميرا من صورة واحدة وفحص الميل.',
      },
      {
        en: 'LLM pipelines: citation-backed inspection-rule extraction from engineering standards as durable Temporal workflows.',
        ar: 'خطوط النماذج اللغوية: استخراج قواعد فحص موثّقة بالاقتباسات من المعايير الهندسية عبر سير عمل Temporal متين.',
      },
    ],
    projects: ['document-ai-platform', 'ppe-compliance', 'vlm-finetuning-lab', 'vlm-rule-extractor', 'camera-calibration', 'sam3-autolabel'],
  },
  {
    role: { en: 'AI & Machine Learning Intern', ar: 'متدرّب ذكاء اصطناعي وتعلّم آلي' },
    org: { en: 'Midad Organization', ar: 'منظمة مداد' },
    unit: { en: 'with Tamkin for IT', ar: 'بالتعاون مع تمكين لتقانة المعلومات' },
    start: '2025-05',
    end: null,
    points: [
      {
        en: 'Capstone ML system forecasting internal displacement (IDP) flows in Syria from ACAPS and HDX data, awarded 100/100. SHAP makes its predictions auditable.',
        ar: 'مشروع تخرّج: نظام تعلّم آلي يتنبأ بتدفقات النزوح الداخلي في سوريا من بيانات ACAPS وHDX، حصل على 100/100، مع SHAP لتفسير التنبؤات.',
      },
    ],
    projects: ['idp-forecasting'],
  },
];

export const education = [
  {
    degree: { en: 'BSc, Information Technology Engineering', ar: 'بكالوريوس هندسة تقانة المعلومات' } satisfies L,
    school: { en: 'University of Aleppo', ar: 'جامعة حلب' } satisfies L,
    year: 'Nov 2025' as string | null,
  },
];

export const certifications: { name: L; issuer: L; year?: string; href?: string }[] = [
  {
    name: { en: 'Applied AI & Machine Learning Programme', ar: 'برنامج الذكاء الاصطناعي التطبيقي والتعلّم الآلي' },
    issuer: { en: 'Tamkin for IT / Midad', ar: 'تمكين لتقانة المعلومات / مداد' },
  },
  {
    name: { en: 'Neural Networks & Deep Learning Workshop', ar: 'ورشة الشبكات العصبية والتعلّم العميق' },
    issuer: { en: 'Tamkin for IT / Midad', ar: 'تمكين لتقانة المعلومات / مداد' },
  },
];

export const community: L[] = [
  {
    en: 'Civic initiatives with local government institutions.',
    ar: 'مبادرات مدنية بالتعاون مع مؤسسات الحكم المحلي.',
  },
  {
    en: 'Communication between young people and youth authorities.',
    ar: 'تعزيز التواصل بين الشباب والجهات المعنية بالشباب.',
  },
  {
    en: 'Regulatory team member at BlueBits, University of Aleppo.',
    ar: 'عضو الفريق التنظيمي في BlueBits، جامعة حلب.',
  },
  {
    en: 'Training in TOT, HR management, public relations, and marketing (Mastry, Aleppo).',
    ar: 'تدريب في إعداد المدربين (TOT) وإدارة الموارد البشرية والعلاقات العامة والتسويق (Mastry، حلب).',
  },
];

export const publications: { title: L; venue: L; year: string; href?: string }[] = [];

export type SkillGroup = { name: L; items: { name: string; usedIn: string[] }[] };

export const skills: SkillGroup[] = [
  {
    name: { en: 'LLMs, VLMs & Agents', ar: 'النماذج اللغوية ونماذج الرؤية والوكلاء' },
    items: [
      { name: 'Qwen3.5-VL', usedIn: ['document-ai-platform', 'vlm-finetuning-lab'] },
      { name: 'Gemini', usedIn: ['document-ai-platform', 'guest-ops-copilot'] },
      { name: 'LoRA / QLoRA (Unsloth)', usedIn: ['vlm-finetuning-lab', 'document-ai-platform'] },
      { name: 'vLLM multi-LoRA serving', usedIn: ['vlm-finetuning-lab', 'document-ai-platform'] },
      { name: 'Structured output / JSON schemas', usedIn: ['document-ai-platform', 'vlm-rule-extractor'] },
      { name: 'Google ADK · LiteLLM', usedIn: ['guest-ops-copilot'] },
      { name: 'OpenRouter', usedIn: ['vlm-rule-extractor', 'guest-ops-copilot'] },
      { name: 'LLM-as-judge', usedIn: ['vlm-rule-extractor'] },
      { name: 'Claude Code skill authoring', usedIn: ['claude-code-skills'] },
    ],
  },
  {
    name: { en: 'Computer Vision', ar: 'الرؤية الحاسوبية' },
    items: [
      { name: 'YOLO (v8 / 11 / 26)', usedIn: ['ppe-compliance', 'sam3-autolabel'] },
      { name: 'Pose estimation', usedIn: ['ppe-compliance'] },
      { name: 'InsightFace (SCRFD, ArcFace)', usedIn: ['ppe-compliance'] },
      { name: 'SAM 3', usedIn: ['sam3-autolabel'] },
      { name: 'OWLv2 zero-shot detection', usedIn: ['camera-calibration'] },
      { name: 'GeoCalib', usedIn: ['camera-calibration'] },
      { name: 'OpenCV', usedIn: ['document-ai-platform', 'ppe-compliance'] },
      { name: 'ONNX export', usedIn: ['ppe-compliance'] },
    ],
  },
  {
    name: { en: 'RAG & Retrieval', ar: 'RAG والاسترجاع' },
    items: [
      { name: 'LlamaIndex', usedIn: ['text-to-sql-rag'] },
      { name: 'Qdrant', usedIn: ['text-to-sql-rag'] },
      { name: 'Text-to-SQL', usedIn: ['text-to-sql-rag'] },
      { name: 'Local LLM deployment', usedIn: ['text-to-sql-rag', 'vlm-finetuning-lab'] },
    ],
  },
  {
    name: { en: 'ML & Evaluation', ar: 'التعلّم الآلي والتقييم' },
    items: [
      { name: 'PyTorch', usedIn: ['ppe-compliance', 'vlm-finetuning-lab'] },
      { name: 'TensorFlow', usedIn: ['gan-faces'] },
      { name: 'scikit-learn', usedIn: ['idp-forecasting'] },
      { name: 'Golden-set evaluation', usedIn: ['document-ai-platform'] },
      { name: 'Weights & Biases', usedIn: ['document-ai-platform'] },
      { name: 'SHAP', usedIn: ['idp-forecasting'] },
    ],
  },
  {
    name: { en: 'Backend & Orchestration', ar: 'الخلفية والتنسيق' },
    items: [
      { name: 'FastAPI', usedIn: ['document-ai-platform', 'ppe-compliance', 'camera-calibration'] },
      { name: 'Celery · Redis', usedIn: ['document-ai-platform', 'ppe-compliance', 'sam3-autolabel'] },
      { name: 'Temporal', usedIn: ['vlm-rule-extractor', 'guest-ops-copilot'] },
      { name: 'WebSocket', usedIn: ['ppe-compliance'] },
      { name: 'PostgreSQL · SQLAlchemy · Alembic', usedIn: ['document-ai-platform', 'vlm-rule-extractor'] },
      { name: 'Oracle 19c', usedIn: ['text-to-sql-rag'] },
      { name: 'PyMuPDF', usedIn: ['vlm-rule-extractor'] },
    ],
  },
  {
    name: { en: 'Infra & Tools', ar: 'البنية التحتية والأدوات' },
    items: [
      { name: 'NVIDIA DGX Spark (GB10)', usedIn: ['ppe-compliance', 'vlm-finetuning-lab'] },
      { name: 'Docker / Compose', usedIn: ['document-ai-platform', 'ppe-compliance', 'camera-calibration'] },
      { name: 'GitLab CI · pytest', usedIn: ['camera-calibration', 'document-ai-platform'] },
      { name: 'React · TypeScript', usedIn: ['ppe-compliance', 'camera-calibration', 'guest-ops-copilot'] },
      { name: 'PyQt6', usedIn: ['sam3-autolabel'] },
    ],
  },
  {
    name: { en: 'Languages', ar: 'لغات البرمجة' },
    items: [
      { name: 'Python', usedIn: ['document-ai-platform', 'ppe-compliance', 'sam3-autolabel'] },
      { name: 'SQL', usedIn: ['text-to-sql-rag'] },
      { name: 'TypeScript', usedIn: ['camera-calibration'] },
      { name: 'C#', usedIn: [] },
    ],
  },
];
