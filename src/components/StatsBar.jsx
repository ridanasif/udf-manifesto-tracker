export default function StatsBar({ stats, selectedStatus, setSelectedStatus, t }) {
  return (
    <section className="bg-white border-y border-slate-100 py-6 relative z-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          
          {/* Stat 1: Total */}
          <button 
            type="button"
            onClick={() => setSelectedStatus("All")}
            aria-pressed={selectedStatus === "All"}
            aria-label={`Show all ${stats.total} promises`}
            className={`text-center md:text-left md:px-4 py-3 md:py-2 hover:bg-slate-50 transition-all flex flex-col justify-center items-center md:items-start border rounded-xl cursor-pointer w-full border-transparent interactive-card ${
              selectedStatus === "All" ? "bg-slate-100 border-slate-200/60!" : ""
            }`}
          >
            <span className="text-3xl md:text-4xl font-mono-tech font-bold text-slate-900">
              {stats.total}
            </span>
            <span className="text-[10px] md:text-[11px] font-mono-tech font-bold text-slate-400 tracking-wider mt-1.5 uppercase">
              {t.total_promises}
            </span>
          </button>

          {/* Stat 2: Fulfilled */}
          <button 
            type="button"
            onClick={() => setSelectedStatus("fulfilled")}
            aria-pressed={selectedStatus === "fulfilled"}
            aria-label={`Show ${stats.fulfilled} implemented promises`}
            className={`text-center md:text-left md:px-4 py-3 md:py-2 hover:bg-slate-50 transition-all flex flex-col justify-center items-center md:items-start border rounded-xl cursor-pointer w-full border-transparent interactive-card ${
              selectedStatus === "fulfilled" ? "bg-green-flag/5 border-slate-200!" : ""
            }`}
          >
            <span className="text-3xl md:text-4xl font-mono-tech font-bold text-green-flag">
              {stats.fulfilled}
            </span>
            <span className="text-[10px] md:text-[11px] font-mono-tech font-bold text-slate-400 tracking-wider mt-1.5 uppercase">
              {t.fulfilled}
            </span>
          </button>

          {/* Stat 3: In Progress */}
          <button 
            type="button"
            onClick={() => setSelectedStatus("in_progress")}
            aria-pressed={selectedStatus === "in_progress"}
            aria-label={`Show ${stats.inProgress} promises in progress`}
            className={`text-center md:text-left md:px-4 py-3 md:py-2 hover:bg-slate-50 transition-all flex flex-col justify-center items-center md:items-start border rounded-xl cursor-pointer w-full border-transparent interactive-card ${
              selectedStatus === "in_progress" ? "bg-saffron/5 border-slate-200!" : ""
            }`}
          >
            <span className="text-3xl md:text-4xl font-mono-tech font-bold text-saffron">
              {stats.inProgress}
            </span>
            <span className="text-[10px] md:text-[11px] font-mono-tech font-bold text-slate-400 tracking-wider mt-1.5 uppercase">
              {t.in_progress}
            </span>
          </button>

          {/* Stat 4: Evaded */}
          <button 
            type="button"
            onClick={() => setSelectedStatus("evaded")}
            aria-pressed={selectedStatus === "evaded"}
            aria-label={`Show ${stats.evaded} bypassed promises`}
            className={`text-center md:text-left md:px-4 py-3 md:py-2 hover:bg-slate-50 transition-all flex flex-col justify-center items-center md:items-start border rounded-xl cursor-pointer w-full border-transparent interactive-card ${
              selectedStatus === "evaded" ? "bg-rose-50 border-slate-200!" : ""
            }`}
          >
            <span className="text-3xl md:text-4xl font-mono-tech font-bold text-slate-400">
              {stats.evaded}
            </span>
            <span className="text-[10px] md:text-[11px] font-mono-tech font-bold text-slate-400 tracking-wider mt-1.5 uppercase">
              {t.evaded}
            </span>
          </button>

          {/* Stat 5: Pending */}
          <button 
            type="button"
            onClick={() => setSelectedStatus("pending")}
            aria-pressed={selectedStatus === "pending"}
            aria-label={`Show ${stats.pending} pending promises`}
            className={`text-center md:text-left md:px-4 py-3 md:py-2 hover:bg-slate-50 transition-all flex flex-col justify-center items-center md:items-start border rounded-xl cursor-pointer w-full border-transparent interactive-card ${
              selectedStatus === "pending" ? "bg-navy-flag/5 border-slate-200!" : ""
            }`}
          >
            <span className="text-3xl md:text-4xl font-mono-tech font-bold text-navy-flag">
              {stats.pending}
            </span>
            <span className="text-[10px] md:text-[11px] font-mono-tech font-bold text-slate-400 tracking-wider mt-1.5 uppercase">
              {t.pending}
            </span>
          </button>

          {/* Stat 6: Completion Rate */}
          <div className="text-center md:text-left md:px-4 py-3 md:py-2 flex flex-col justify-center items-center md:items-start w-full">
            <span className="text-3xl md:text-4xl font-mono-tech font-bold text-navy-flag">
              {stats.completionRate}%
            </span>
            <span className="text-[10px] md:text-[11px] font-mono-tech font-bold text-slate-400 tracking-wider mt-1.5 uppercase">
              {t.completion_rate}
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
