const TERM_START = new Date("2026-05-18T00:00:00+05:30");
const TERM_END = new Date("2031-05-18T00:00:00+05:30");
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export default function Hero({ lang, t }) {
  // Translate Chief Minister name and labels based on language
  const cmName = lang === "en" ? "V.D. SATHEESAN" : "വി. ഡി. സതീശൻ";
  const cmSub = lang === "en" ? "Chief Minister of Kerala (UDF)" : "കേരള മുഖ്യമന്ത്രി (യു.ഡി.എഫ്)";
  const daysSub = lang === "en" ? "Sworn in on May 18, 2026" : "2026 മെയ് 18-ന് സത്യപ്രതിജ്ഞ ചെയ്തു";
  const remainingSub = lang === "en" ? "To Complete 5-Year Term (May 18, 2031)" : "5 വർഷത്തെ കാലാവധി പൂർത്തിയാക്കാൻ (2031 മെയ് 18)";
  const now = new Date();
  const daysInOffice = Math.max(0, Math.floor((now.getTime() - TERM_START.getTime()) / MS_PER_DAY));
  const daysRemaining = Math.max(0, Math.ceil((TERM_END.getTime() - now.getTime()) / MS_PER_DAY));

  return (
    <section className="relative min-h-[550px] flex items-center justify-center bg-slate-950 text-white overflow-hidden py-16 px-4 md:px-8" aria-labelledby="hero-title">
      <div className="absolute inset-0 z-0">
        <img 
          src="/kerala.webp" 
          alt="" 
          aria-hidden="true"
          className="w-full h-full object-cover object-center opacity-50 scale-100"
        />

      </div>

      <div className="relative z-10 max-w-6xl w-full flex flex-col items-center text-center">
        {/* Big Title */}
        <h2 id="hero-title" className="text-4xl sm:text-5xl lg:text-7xl font-space font-bold text-white leading-none uppercase max-w-4xl">
          UDF MANIFESTO 
          <div>2026 - 2031</div>
        </h2>
        
        {/* Subtext */}
        <p className="mt-4 text-base md:text-lg text-slate-300 font-space max-w-2xl">
          {t.tagline}
        </p>

        {/* 3 Flat Accent Cards in Flag Sequence (Thin 1px borders on all sides, no thick border-left) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mt-8 w-full max-w-4xl">
          {/* Card 1: Saffron */}
          <div className="bg-saffron text-left p-6 rounded-xl text-slate-950">
            <span className="text-xs font-mono-tech font-bold uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-950"></span>
              {t.chief_minister}
            </span>
            <h3 className="text-xl md:text-2xl font-space font-bold mt-2">
              {cmName}
            </h3>
            <p className="text-xs font-mono-tech mt-1.5 uppercase">{cmSub}</p>
          </div>

          {/* Card 2: White */}
          <div className="bg-white text-left p-6 rounded-xl">
            <span className="text-xs font-mono-tech font-bold uppercase text-navy-flag flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-navy-flag"></span>
              {t.days_in_office}
            </span>
            <h3 className="text-3xl md:text-4xl font-mono-tech font-bold text-navy-flag mt-1">
              {daysInOffice}
            </h3>
            <p className="text-xs text-navy-flag font-mono-tech mt-1.5 uppercase">{daysSub}</p>
          </div>

          {/* Card 3: Green */}
          <div className="bg-green-flag text-left p-6 rounded-xl">
            <span className="text-xs font-mono-tech font-bold uppercase text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              {t.days_remaining}
            </span>
            <h3 className="text-3xl md:text-4xl font-mono-tech font-bold text-white mt-1">
              {daysRemaining}
            </h3>
            <p className="text-xs text-white font-mono-tech mt-1.5 uppercase">{remainingSub}</p>
          </div>
        </div>

        {/* View Full Manifesto PDF CTA */}
        <div className="mt-8">
          <a
            href="https://artifacts.keraladigitalarchive.org/public/2026-udf-manifesto/2026-udf-manifesto.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 rounded-xl px-5 py-2.5 text-xs font-mono-tech font-bold uppercase tracking-wider transition-all duration-300 backdrop-blur-xs cursor-pointer no-underline interactive-card"
          >
            <svg className="w-4 h-4 text-saffron flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>
              {lang === "en" ? "View Full Manifesto (PDF)" : "പൂർണ്ണ പ്രകടനപത്രിക കാണുക (PDF)"}
            </span>
          </a>
        </div>

      </div>
    </section>
  );
}
