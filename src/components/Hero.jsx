import React from "react";

export default function Hero({ lang, t }) {
  // Translate Chief Minister name and labels based on language
  const cmName = lang === "en" ? "V.D. SATHEESAN" : "വി. ഡി. സതീശൻ";
  const cmSub = lang === "en" ? "Chief Minister of Kerala (UDF)" : "കേരള മുഖ്യമന്ത്രി (യു.ഡി.എഫ്)";
  const daysSub = lang === "en" ? "Sworn in on May 18, 2026" : "2026 മെയ് 18-ന് സത്യപ്രതിജ്ഞ ചെയ്തു";
  const remainingSub = lang === "en" ? "To Complete 5-Year Term (May 18, 2031)" : "5 വർഷത്തെ കാലാവധി പൂർത്തിയാക്കാൻ (2031 മെയ് 18)";

  return (
    <section className="relative min-h-[550px] flex items-center justify-center bg-slate-950 text-white overflow-hidden py-16 px-4 md:px-8">
      <div className="absolute inset-0 z-0">
        <img 
          src="/kerala.webp" 
          alt="Kerala Landscape" 
          className="w-full h-full object-cover object-center opacity-50 scale-100"
        />

      </div>

      <div className="relative z-10 max-w-6xl w-full flex flex-col items-center text-center">
        {/* Big Title */}
        <h2 className="text-6xl lg:text-7xl font-space font-bold tracking-tighter text-white leading-none uppercase max-w-4xl">
          UDF MANIFESTO 
          <div>2026 - 2031</div>
        </h2>
        
        {/* Subtext */}
        <p className="mt-4 text-sm md:text-lg text-slate-300 font-space max-w-2xl">
          {t.tagline}
        </p>

        {/* 3 Flat Accent Cards in Flag Sequence (Thin 1px borders on all sides, no thick border-left) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mt-8 w-full max-w-4xl">
          {/* Card 1: Saffron */}
          <div className="bg-saffron/70 text-left p-6 rounded-xl">
            <span className="text-[10px] font-mono-tech font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              {t.chief_minister}
            </span>
            <h3 className="text-xl md:text-2xl font-space font-bold text-white mt-2 tracking-tight">
              {cmName}
            </h3>
            <p className="text-[10px] text-white font-mono-tech mt-1.5 uppercase">{cmSub}</p>
          </div>

          {/* Card 2: White */}
          <div className="bg-white/70 text-left p-6 rounded-xl">
            <span className="text-[10px] font-mono-tech font-bold uppercase tracking-wider text-navy-flag flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-navy-flag"></span>
              {t.days_in_office}
            </span>
            <h3 className="text-3xl md:text-4xl font-mono-tech font-bold text-navy-flag mt-1">
              2
            </h3>
            <p className="text-[10px] text-navy-flag font-mono-tech mt-1.5 uppercase">{daysSub}</p>
          </div>

          {/* Card 3: Green */}
          <div className="bg-green-flag/70 text-left p-6 rounded-xl">
            <span className="text-[10px] font-mono-tech font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              {t.days_remaining}
            </span>
            <h3 className="text-3xl md:text-4xl font-mono-tech font-bold text-white mt-1">
              1824
            </h3>
            <p className="text-[10px] text-white font-mono-tech mt-1.5 uppercase">{remainingSub}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
