import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type RegionCode =
  | "US"
  | "GB"
  | "SA"
  | "AE"
  | "PK"
  | "ID"
  | "MY"
  | "TR"
  | "FR"
  | "DE"
  | "NG";

export type LangCode = "en" | "ar" | "ur" | "id" | "ms" | "tr" | "fr" | "de";

export type Region = {
  code: RegionCode;
  label: string;
  flag: string;
  lang: LangCode;
  instructorName: string;
  instructorEmail: string;
};

export const REGIONS: Region[] = [
  { code: "US", label: "United States",    flag: "🇺🇸", lang: "en", instructorName: "Afnan",          instructorEmail: "kai@sellforge.com" },
  { code: "GB", label: "United Kingdom",   flag: "🇬🇧", lang: "en", instructorName: "Yusuf Ahmed",    instructorEmail: "uk@salesacademy.com" },
  { code: "SA", label: "المملكة العربية السعودية", flag: "🇸🇦", lang: "ar", instructorName: "خالد الحربي", instructorEmail: "ksa@salesacademy.com" },
  { code: "AE", label: "الإمارات",           flag: "🇦🇪", lang: "ar", instructorName: "محمد الفارسي",  instructorEmail: "uae@salesacademy.com" },
  { code: "PK", label: "پاکستان",           flag: "🇵🇰", lang: "ur", instructorName: "Bilal Hassan",   instructorEmail: "pk@salesacademy.com" },
  { code: "ID", label: "Indonesia",        flag: "🇮🇩", lang: "id", instructorName: "Ahmad Wijaya",   instructorEmail: "id@salesacademy.com" },
  { code: "MY", label: "Malaysia",         flag: "🇲🇾", lang: "ms", instructorName: "Hafiz Rahman",   instructorEmail: "my@salesacademy.com" },
  { code: "TR", label: "Türkiye",          flag: "🇹🇷", lang: "tr", instructorName: "Emre Yıldız",    instructorEmail: "tr@salesacademy.com" },
  { code: "FR", label: "France",           flag: "🇫🇷", lang: "fr", instructorName: "Karim Benali",   instructorEmail: "fr@salesacademy.com" },
  { code: "DE", label: "Deutschland",      flag: "🇩🇪", lang: "de", instructorName: "Omar Şahin",     instructorEmail: "de@salesacademy.com" },
  { code: "NG", label: "Nigeria",          flag: "🇳🇬", lang: "en", instructorName: "Ibrahim Musa",   instructorEmail: "ng@salesacademy.com" },
];

export const LANGUAGES: { code: LangCode; label: string }[] = [
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
  { code: "ur", label: "اردو" },
  { code: "id", label: "Bahasa Indonesia" },
  { code: "ms", label: "Bahasa Melayu" },
  { code: "tr", label: "Türkçe" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
];

type Dict = {
  navLearn: string; navFaq: string; navAsk: string; navInvest: string; navContact: string;
  ctaStart: string;
  heroPill: string; heroTitleA: string; heroTitleB: string; heroTitleC: string; heroTitleD: string; heroSub: string;
  tiersEyebrow: string; tiersTitle: string;
  starterTitle: string; starterPrice: string; getFree: string;
  proTitle: string; proPopular: string; joinPro: string; perMo: string; lifetime: string;
  faqEyebrow: string; faqTitle: string; faqSub: string;
  teamEyebrow: string; teamTitle: string; teamSub: string;
  chatEyebrow: string; chatTitle: string; chatSub: string; chatPlaceholder: string; chatSend: string; chatGreeting: string;
  investEyebrow: string; investTitle: string; investSub: string; minTicket: string; structure: string; useOfFunds: string; emailInvest: string; askFirst: string;
  joinEyebrow: string; joinTitle: string; joinSub: string; joinTabFree: string; joinTabPro: string; joinName: string; joinEmail: string; joinSend: string; joinSent: string; joinSentSub: string; joinAgain: string;
  regionLabel: string; languageLabel: string; assignedTo: string;
};

const en: Dict = {
  navLearn: "Learn", navFaq: "FAQ", navAsk: "Ask AI", navInvest: "Invest", navContact: "Contact",
  ctaStart: "Start Learning",
  heroPill: "Ethical Sales Training · Rooted in Islamic Values · Open to Everyone",
  heroTitleA: "ETHICAL", heroTitleB: "SALES", heroTitleC: "REAL", heroTitleD: "BUSINESS",
  heroSub: "Learn sales and business the honest way — with truthfulness, trust, and zero shady tactics. Free lessons, live coaching, and a global community. Everyone welcome, whatever your background.",
  tiersEyebrow: "Two Paths", tiersTitle: "Pick your path",
  starterTitle: "Starter", starterPrice: "Sales fundamentals — $0 forever.", getFree: "Get Free Access",
  proTitle: "Pro Mentorship", proPopular: "Most Popular", joinPro: "Join Pro", perMo: "/mo", lifetime: "lifetime",
  faqEyebrow: "Support", faqTitle: "Questions & answers", faqSub: "Everything you need to know about learning with us.",
  teamEyebrow: "The Team", teamTitle: "A team that actually shows up", teamSub: "Afnan leads, but a full team of coaches, an ethics advisor, and operators help every student.",
  chatEyebrow: "Ask Anything", chatTitle: "Talk to Kai", chatSub: "Instant answers on sales, our programs, or how to invest.",
  chatPlaceholder: "Ask a question about sales, the course, or investing…", chatSend: "Send",
  chatGreeting: "Hi — I'm Kai – Your Personal AI Assistant. Ask me anything about sales, our courses, or investing.",
  investEyebrow: "Investors", investTitle: "Invest in SellForge",
  investSub: "We're growing fast. We welcome angels and strategic partners — interest-free (riba-free) structures available for those who prefer them.",
  minTicket: "Min ticket", structure: "Structure", useOfFunds: "Use of funds",
  emailInvest: "Email invest@sellforge.com", askFirst: "Ask the AI first",
  joinEyebrow: "Contact your regional instructor", joinTitle: "Let's begin",
  joinSub: "Choose your plan and your regional instructor will personally send you the next steps.",
  joinTabFree: "Free Starter", joinTabPro: "Pro Mentorship",
  joinName: "Your name (optional)", joinEmail: "you@email.com", joinSend: "Send to instructor →",
  joinSent: "You're in.", joinSentSub: "Your email client just opened — send the message and your instructor will reply within 24 hours.",
  joinAgain: "Send another",
  regionLabel: "Country", languageLabel: "Language", assignedTo: "Your instructor",
};

const ar: Dict = {
  navLearn: "التعلم", navFaq: "الأسئلة", navAsk: "اسأل الذكاء", navInvest: "استثمر", navContact: "تواصل",
  ctaStart: "ابدأ التعلم",
  heroPill: "تدريب مبيعات حلال · من المسلمين، للمسلمين",
  heroTitleA: "مبيعات", heroTitleB: "حلال", heroTitleC: "أعمال", heroTitleD: "بركة",
  heroSub: "السلام عليكم. تعلّم المبيعات والأعمال بالطريقة الحلال — بالصدق والأمانة وبدون ربا. دروس مجانية، تدريب مباشر، ومجتمع عالمي.",
  tiersEyebrow: "مساران حلال", tiersTitle: "اختر طريقك، إن شاء الله",
  starterTitle: "المبتدئ", starterPrice: "أساسيات المبيعات الحلال — مجاناً للأبد.", getFree: "احصل على وصول مجاني",
  proTitle: "الإرشاد الاحترافي", proPopular: "الأكثر شعبية", joinPro: "انضم للاحترافي", perMo: "/شهر", lifetime: "مدى الحياة",
  faqEyebrow: "الدعم", faqTitle: "أسئلة وأجوبة", faqSub: "كل ما تحتاج معرفته عن التعلم معنا.",
  teamEyebrow: "الفريق", teamTitle: "فريق من المسلمين يعلّم المسلمين", teamSub: "أفنان يقود، لكن فريق كامل من المدربين ومستشار شرعي يساعد كل طالب.",
  chatEyebrow: "اسأل أي شيء", chatTitle: "تحدث مع مساعد الأكاديمية", chatSub: "إجابات فورية عن المبيعات الحلال أو الاستثمار.",
  chatPlaceholder: "اسأل عن المبيعات أو الدورة أو الاستثمار…", chatSend: "إرسال",
  chatGreeting: "السلام عليكم — أنا مساعد أكاديمية أفنان للمبيعات. اسألني أي شيء.",
  investEyebrow: "المستثمرون", investTitle: "استثمر في أكاديمية أفنان",
  investSub: "إن شاء الله ننمو بسرعة. نرحب بالمستثمرين المسلمين بهيكل خالٍ من الربا.",
  minTicket: "أقل مبلغ", structure: "الهيكل", useOfFunds: "استخدام الأموال",
  emailInvest: "راسل invest@sellforge.com", askFirst: "اسأل الذكاء أولاً",
  joinEyebrow: "تواصل مع مدربك الإقليمي", joinTitle: "بسم الله — لنبدأ",
  joinSub: "اختر خطتك وسيرسل لك مدربك الإقليمي الخطوات التالية.",
  joinTabFree: "المبتدئ المجاني", joinTabPro: "الإرشاد الاحترافي",
  joinName: "اسمك (اختياري)", joinEmail: "بريدك@مثال.com", joinSend: "أرسل إلى المدرب →",
  joinSent: "تم التسجيل.", joinSentSub: "افتح بريدك وأرسل الرسالة — سيرد المدرب خلال 24 ساعة.",
  joinAgain: "إرسال آخر",
  regionLabel: "الدولة", languageLabel: "اللغة", assignedTo: "مدربك",
};

const ur: Dict = {
  ...en,
  navLearn: "سیکھیں", navFaq: "سوالات", navAsk: "AI سے پوچھیں", navInvest: "سرمایہ کاری", navContact: "رابطہ",
  ctaStart: "سیکھنا شروع کریں",
  heroPill: "حلال سیلز ٹریننگ · مسلمانوں کے لیے",
  heroSub: "السلام علیکم۔ حلال طریقے سے سیلز اور کاروبار سیکھیں — صدق، امانت اور بغیر سود کے۔",
  tiersTitle: "اپنا راستہ چنیں، ان شاء اللہ",
  getFree: "مفت رسائی حاصل کریں", joinPro: "پرو میں شامل ہوں",
  joinTitle: "بسم اللہ — شروع کرتے ہیں",
  joinSub: "اپنا پلان چنیں اور آپ کا علاقائی انسٹرکٹر رابطہ کرے گا۔",
  joinSend: "انسٹرکٹر کو بھیجیں →",
  regionLabel: "ملک", languageLabel: "زبان", assignedTo: "آپ کے انسٹرکٹر",
};

const id: Dict = {
  ...en,
  navLearn: "Belajar", navFaq: "Tanya Jawab", navAsk: "Tanya AI", navInvest: "Investasi", navContact: "Kontak",
  ctaStart: "Mulai Belajar",
  heroPill: "Pelatihan Sales Halal · Oleh Muslim, Untuk Muslim",
  heroSub: "Assalamualaikum. Pelajari sales dan bisnis dengan cara halal — jujur, amanah, tanpa riba.",
  tiersEyebrow: "Dua Jalur Halal", tiersTitle: "Pilih jalurmu, insya Allah",
  starterPrice: "Dasar sales halal — $0 selamanya.", getFree: "Akses Gratis",
  proTitle: "Mentoring Pro", joinPro: "Gabung Pro", perMo: "/bln", lifetime: "seumur hidup",
  faqTitle: "Pertanyaan & jawaban", faqSub: "Semua yang perlu kamu tahu tentang belajar bersama kami.",
  teamTitle: "Tim Muslim mengajar Muslim",
  chatTitle: "Bicara dengan AI Akademi", chatSend: "Kirim",
  joinEyebrow: "Hubungi instruktur regional Anda", joinTitle: "Bismillah — mari mulai",
  joinSub: "Pilih paket Anda dan instruktur regional akan mengirimkan langkah berikutnya.",
  joinSend: "Kirim ke instruktur →",
  regionLabel: "Negara", languageLabel: "Bahasa", assignedTo: "Instruktur Anda",
};

const ms: Dict = { ...id, chatSend: "Hantar", getFree: "Akses Percuma", joinSend: "Hantar kepada instruktur →", regionLabel: "Negara", languageLabel: "Bahasa" };

const tr: Dict = {
  ...en,
  navLearn: "Öğren", navFaq: "SSS", navAsk: "AI'ya Sor", navInvest: "Yatırım", navContact: "İletişim",
  ctaStart: "Öğrenmeye Başla",
  heroPill: "Helal Satış Eğitimi · Müslümanlar İçin",
  heroSub: "Selamün aleyküm. Satış ve iş dünyasını helal yoldan öğrenin — sıdk, emanet, faizsiz.",
  tiersTitle: "Yolunu seç, inşallah",
  getFree: "Ücretsiz Erişim", joinPro: "Pro'ya Katıl",
  joinTitle: "Bismillah — başlayalım",
  joinSend: "Eğitmene gönder →",
  regionLabel: "Ülke", languageLabel: "Dil", assignedTo: "Eğitmeniniz",
};

const fr: Dict = {
  ...en,
  navLearn: "Apprendre", navFaq: "FAQ", navAsk: "Demander à l'IA", navInvest: "Investir", navContact: "Contact",
  ctaStart: "Commencer",
  heroPill: "Formation de vente halal · Par des musulmans, pour des musulmans",
  heroSub: "As-salamu alaykum. Apprenez la vente et l'entrepreneuriat de façon halal — avec sidq, amanah, sans riba.",
  tiersTitle: "Choisissez votre voie, insha'Allah",
  getFree: "Accès gratuit", joinPro: "Rejoindre Pro",
  joinTitle: "Bismillah — commençons",
  joinSend: "Envoyer à l'instructeur →",
  regionLabel: "Pays", languageLabel: "Langue", assignedTo: "Votre instructeur",
};

const de: Dict = {
  ...en,
  navLearn: "Lernen", navFaq: "FAQ", navAsk: "KI fragen", navInvest: "Investieren", navContact: "Kontakt",
  ctaStart: "Jetzt starten",
  heroPill: "Halal-Verkaufstraining · Von Muslimen, für Muslime",
  heroSub: "As-salamu alaykum. Lerne Vertrieb und Business auf halal-Weise — mit Sidq, Amanah, ohne Riba.",
  tiersTitle: "Wähle deinen Weg, insha'Allah",
  getFree: "Kostenloser Zugang", joinPro: "Pro beitreten",
  joinTitle: "Bismillah — legen wir los",
  joinSend: "An Instruktor senden →",
  regionLabel: "Land", languageLabel: "Sprache", assignedTo: "Dein Instruktor",
};

const DICTS: Record<LangCode, Dict> = { en, ar, ur, id, ms, tr, fr, de };

type Ctx = {
  region: Region;
  setRegion: (code: RegionCode) => void;
  lang: LangCode;
  setLang: (code: LangCode) => void;
  t: Dict;
  dir: "ltr" | "rtl";
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [regionCode, setRegionCode] = useState<RegionCode>("US");
  const [lang, setLangState] = useState<LangCode>("en");

  useEffect(() => {
    const r = (typeof localStorage !== "undefined" && localStorage.getItem("asa_region")) as RegionCode | null;
    const l = (typeof localStorage !== "undefined" && localStorage.getItem("asa_lang")) as LangCode | null;
    if (r && REGIONS.find((x) => x.code === r)) {
      setRegionCode(r);
      if (!l) setLangState(REGIONS.find((x) => x.code === r)!.lang);
    }
    if (l && DICTS[l]) setLangState(l);
  }, []);

  const region = REGIONS.find((r) => r.code === regionCode) ?? REGIONS[0];
  const dir: "ltr" | "rtl" = lang === "ar" || lang === "ur" ? "rtl" : "ltr";

  const setRegion = (code: RegionCode) => {
    setRegionCode(code);
    const r = REGIONS.find((x) => x.code === code);
    if (r) {
      setLangState(r.lang);
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("asa_region", code);
        localStorage.setItem("asa_lang", r.lang);
      }
    }
  };
  const setLang = (code: LangCode) => {
    setLangState(code);
    if (typeof localStorage !== "undefined") localStorage.setItem("asa_lang", code);
  };

  return (
    <I18nContext.Provider value={{ region, setRegion, lang, setLang, t: DICTS[lang], dir }}>
      <div dir={dir}>{children}</div>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
