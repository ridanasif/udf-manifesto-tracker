import React from "react";

export default function Hero({ lang, t }) {
  // Translate Chief Minister name and labels based on language
  const cmName = lang === "en" ? "V.D. SATHEESAN" : "വി. ഡി. സതീശൻ";
  const cmSub = lang === "en" ? "Chief Minister of Kerala (UDF)" : "കേരള മുഖ്യമന്ത്രി (യു.ഡി.എഫ്)";
  const daysSub = lang === "en" ? "Sworn in on May 18, 2026" : "2026 മെയ് 18-ന് സത്യപ്രതിജ്ഞ ചെയ്തു";
  const remainingSub = lang === "en" ? "To Complete 5-Year Term (May 18, 2031)" : "5 വർഷത്തെ കാലാവധി പൂർത്തിയാക്കാൻ (2031 മെയ് 18)";

  return (
    <section className="relative min-h-[420px] flex items-center justify-center bg-slate-950 text-white overflow-hidden py-16 px-4 md:px-8">
      {/* Background image of Munnar hills with dark flat overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80" 
          alt="Misty Munnar Hills, Kerala" 
          className="w-full h-full object-cover object-center opacity-40 scale-100"
        />
        <div className="absolute inset-0 bg-slate-950/80"></div>
      </div>

      <div className="relative z-10 max-w-6xl w-full flex flex-col items-center text-center">
        {/* Tagline Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-3.5 py-1.5 rounded-full text-[10px] md:text-xs font-mono-tech uppercase tracking-wider text-saffron mb-6">
          <span className="w-2 h-2 rounded-full bg-saffron animate-pulse"></span>
          {lang === "en" ? "Legislative Promise Tracker" : "നിയമസഭാ വാഗ്ദാന ട്രാക്കർ"}
        </div>

        {/* Big Title */}
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-space font-bold tracking-tighter text-white leading-tight uppercase max-w-4xl">
          UDF MANIFESTO <span className="text-saffron">26</span>-<span className="text-green-flag">31</span>
        </h2>
        
        {/* Subtext */}
        <p className="text-sm md:text-lg text-slate-300 font-space max-w-2xl">
          {t.tagline}
        </p>

        {/* 3 Flat Accent Cards in Flag Sequence (Thin 3px borders, no shadow, no blur) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 w-full max-w-4xl">
          {/* Card 1: Saffron */}
          <div className="card-flat-saffron text-left p-6 rounded-xl border-l-[3px]! border-l-saffron">
            <span className="text-[10px] font-mono-tech font-bold uppercase tracking-wider text-saffron-dark flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-saffron"></span>
              {t.chief_minister}
            </span>
            <h3 className="text-xl md:text-2xl font-space font-bold text-saffron-dark mt-2 tracking-tight">
              {cmName}
            </h3>
            <p className="text-[10px] text-slate-400 font-mono-tech mt-1.5 uppercase">{cmSub}</p>
          </div>

          {/* Card 2: White */}
          <div className="card-flat-white text-left p-6 rounded-xl border-l-[3px]! border-l-slate-400">
            <span className="text-[10px] font-mono-tech font-bold uppercase tracking-wider text-navy-flag flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-navy-flag"></span>
              {t.days_in_office}
            </span>
            <h3 className="text-3xl md:text-4xl font-mono-tech font-bold text-navy-flag mt-1">
              2
            </h3>
            <p className="text-[10px] text-slate-500 font-mono-tech mt-1.5 uppercase">{daysSub}</p>
          </div>

          {/* Card 3: Green */}
          <div className="card-flat-green text-left p-6 rounded-xl border-l-[3px]! border-l-green-flag">
            <span className="text-[10px] font-mono-tech font-bold uppercase tracking-wider text-green-flag-dark flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-flag"></span>
              {t.days_remaining}
            </span>
            <h3 className="text-3xl md:text-4xl font-mono-tech font-bold text-green-flag-dark mt-1">
              1824
            </h3>
            <p className="text-[10px] text-slate-400 font-mono-tech mt-1.5 uppercase">{remainingSub}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
