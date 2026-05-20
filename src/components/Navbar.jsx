import React from "react";

export default function Navbar({ lang, setLang, t }) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 transition-all duration-300">
      
      {/* 1. Flat Disclaimer Banner (Combined on top) */}
      <div className="bg-saffron text-slate-900 border-b border-saffron-dark/20 text-center py-2 px-4 text-xs font-mono-tech font-bold">
        <div className="max-w-7xl mx-auto">
          {t.disclaimer}
        </div>
      </div>

      {/* 2. Main Navigation Bar Row */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 flex items-center justify-center text-navy-flag">
            <svg className="w-8 h-8 animate-spin" style={{ animationDuration: '60s' }} viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" />
              <circle cx="50" cy="50" r="8" fill="currentColor" />
              {[...Array(24)].map((_, i) => (
                <line 
                  key={i} 
                  x1="50" y1="50" 
                  x2={50 + 45 * Math.cos((i * 15 * Math.PI) / 180)} 
                  y2={50 + 45 * Math.sin((i * 15 * Math.PI) / 180)} 
                  stroke="currentColor" 
                  strokeWidth="2" 
                />
              ))}
            </svg>
          </div>
          <div>
            <h1 className="text-base md:text-lg font-space font-bold tracking-tight text-navy-flag">
              {t.title}
            </h1>
          </div>
        </div>

        {/* Right Side: Malayalam Language Toggle (Flat Thin-Border Style) */}
        <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-lg p-0.5">
          <button
            onClick={() => setLang("en")}
            className={`px-3 py-1.5 rounded text-xs font-mono-tech font-bold uppercase transition-all cursor-pointer border-none outline-none ${
              lang === "en" 
                ? "bg-navy-flag text-white font-bold" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLang("ml")}
            className={`px-3 py-1.5 rounded text-xs font-space font-bold transition-all cursor-pointer border-none outline-none ${
              lang === "ml" 
                ? "bg-navy-flag text-white font-bold" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            മലയാളം
          </button>
        </div>

      </div>
    </header>
  );
}
