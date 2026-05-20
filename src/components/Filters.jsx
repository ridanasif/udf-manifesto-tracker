import React from "react";

export default function Filters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  viewMode,
  setViewMode,
  categories,
  categoryCounts,
  t,
  lang
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 mb-8">
      
      {/* Search Input, Status and View Mode */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between pb-5 border-b border-slate-200/60">
        
        {/* Search */}
        <div className="relative flex-1">
          <svg className="w-5 h-5 text-slate-400 absolute left-4 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder={t.search_placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-12 pr-10 focus:outline-none focus:border-navy-flag/40 focus:bg-white text-sm font-sans transition-all placeholder:text-slate-400 text-slate-800"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 rounded-full p-0.5 hover:bg-slate-200/50 transition-all border-none bg-transparent cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filters and View toggles */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Status Pills with Bypassed added */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
            {[
              { id: "All", label_en: "All", label_ml: "എല്ലാം" },
              { id: "fulfilled", label_en: "Implemented", label_ml: "നടപ്പിലായത്" },
              { id: "in_progress", label_en: "In Progress", label_ml: "പുരോഗതിയിൽ" },
              { id: "pending", label_en: "Pending", label_ml: "ബാക്കി" },
              { id: "evaded", label_en: "Bypassed", label_ml: "ഉപേക്ഷിച്ചത്" }
            ].map(st => (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono-tech font-bold uppercase transition-all cursor-pointer border-none outline-none ${
                  selectedStatus === st.id 
                    ? "bg-navy-flag text-white" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {lang === "en" ? st.label_en : st.label_ml}
              </button>
            ))}
          </div>

          {/* Grid/List View Toggles */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5">
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded transition-all cursor-pointer border-none outline-none ${viewMode === "grid" ? "bg-white text-navy-flag border border-slate-200/50" : "text-slate-400 hover:text-slate-600"}`}
              title="Grid View"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded transition-all cursor-pointer border-none outline-none ${viewMode === "list" ? "bg-white text-navy-flag border border-slate-200/50" : "text-slate-400 hover:text-slate-600"}`}
              title="List View"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

        </div>

      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 mt-4 pt-1 overflow-x-auto">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          const displayLabel = lang === "en" ? cat.name : cat.name_ml;
          return (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-space font-bold uppercase transition-all duration-150 cursor-pointer border-none outline-none flex-shrink-0 ${
                isSelected 
                  ? "bg-slate-900 text-white" 
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800"
              }`}
            >
              {displayLabel}
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono-tech font-bold ${isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"}`}>
                {categoryCounts[cat.name] || 0}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
}
