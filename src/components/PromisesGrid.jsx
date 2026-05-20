import React from "react";
import PromiseCard from "./PromiseCard";

export default function PromisesGrid({ filteredPromises, viewMode, lang, t, resetFilters }) {
  if (filteredPromises.length === 0) {
    return (
      <div className="text-center py-16 bg-white border-2 border-slate-200 rounded-xl p-8 max-w-lg mx-auto">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-base font-space font-bold text-slate-800 uppercase">{t.no_results}</h3>
        <button 
          onClick={resetFilters}
          className="mt-5 text-xs font-mono-tech font-bold bg-navy-flag hover:bg-navy-flag-dark text-white px-5 py-2.5 rounded-lg transition-all cursor-pointer border-none"
        >
          {t.reset_filters}
        </button>
      </div>
    );
  }

  return (
    <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
      {filteredPromises.map((promise) => (
        <PromiseCard 
          key={promise.id} 
          promise={promise} 
          viewMode={viewMode} 
          lang={lang} 
          t={t}
        />
      ))}
    </div>
  );
}
