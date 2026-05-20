import { Link } from "react-router-dom";
import { FaHistory, FaRegComments, FaBalanceScale } from "react-icons/fa";

export default function PromiseCard({ promise, viewMode, lang, t, onOpenUpdateStatus }) {
  // Map styles based on status
  const getStatusStyle = (status) => {
    switch (status) {
      case "fulfilled":
        return {
          bg: "bg-green-flag-light text-green-flag-dark border-green-flag/20",
          dot: "bg-green-flag"
        };
      case "in_progress":
        return {
          bg: "bg-saffron-light text-saffron-dark border-saffron/20",
          dot: "bg-saffron"
        };
      case "evaded":
        return {
          bg: "bg-rose-50 text-rose-700 border-rose-200",
          dot: "bg-rose-500"
        };
      default:
        return {
          bg: "bg-navy-flag-light text-navy-flag-dark border-navy-flag/15",
          dot: "bg-navy-flag"
        };
    }
  };

  const statusStyle = getStatusStyle(promise.status);

  // Field translations
  const title = lang === "en" ? promise.title : promise.title_ml;
  const description = lang === "en" ? promise.description : promise.description_ml;
  const department = lang === "en" ? promise.department : promise.department_ml;
  const statusLabel = lang === "en" ? promise.statusLabel : promise.statusLabel_ml;
  const categoryLabel = lang === "en" ? promise.category : promise.category_ml;

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between interactive-card">
        <div className="flex-1 pr-6">
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span className="text-[10px] font-mono-tech font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              {categoryLabel}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold uppercase tracking-wider border ${statusStyle.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
              {statusLabel}
            </span>
          </div>

          <h3 className="text-lg font-space font-bold text-slate-900 leading-snug">
            {title}
          </h3>
          <p className="text-slate-700 text-sm mt-2 leading-relaxed font-sans font-medium">
            {description}
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-col gap-3 border-t md:border-none pt-3 md:pt-0 border-slate-200/60 flex-shrink-0 min-w-[220px]">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 font-mono-tech uppercase font-bold">{t.department}</span>
            <span className="text-sm text-slate-800 font-bold font-space leading-tight">
              {department || "TBD"}
            </span>
          </div>
          
          {/* Action Route Keys - Dedicated Grid Line */}
          <div className="grid grid-cols-2 gap-2">
            <Link 
              to={`/promise/${promise.id}/history`}
              className="py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-mono-tech font-bold uppercase tracking-wider text-slate-600 hover:text-slate-800 transition-all no-underline bg-white text-center flex items-center justify-center gap-1"
            >
              <FaHistory className="text-slate-400" /> History
            </Link>
            <Link 
              to={`/promise/${promise.id}/comments`}
              className="py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-mono-tech font-bold uppercase tracking-wider text-slate-600 hover:text-slate-800 transition-all no-underline bg-white text-center flex items-center justify-center gap-1"
            >
              <FaRegComments className="text-slate-400" /> Comments
            </Link>
          </div>
          
          <button
            type="button"
            onClick={() => onOpenUpdateStatus(promise)}
            aria-label={`Suggest a status update for ${title}`}
            className="w-full bg-navy-flag hover:bg-navy-flag-dark text-white rounded-lg py-2 text-xs font-mono-tech font-bold uppercase tracking-wider transition-all cursor-pointer border-none text-center flex items-center justify-center gap-1.5"
          >
            <FaBalanceScale /> Update Status
          </button>
        </div>
      </div>
    );
  }

  // Grid Card Layout
  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col justify-between overflow-hidden interactive-card">
      <div className="p-6">
        {/* Card Top */}
        <div className="flex justify-between items-start gap-2 mb-3.5">
          <span className="text-[10px] font-mono-tech font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
            {categoryLabel}
          </span>
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold uppercase tracking-wider border ${statusStyle.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
            {statusLabel}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-space font-bold text-slate-900 leading-snug mt-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-slate-700 text-sm mt-3 leading-relaxed font-sans font-medium">
          {description}
        </p>
      </div>

      {/* Card Bottom - Responsible Department and Actions Grid */}
      <div className="bg-slate-50 px-6 py-4 border-t border-slate-200/40 flex flex-col gap-3.5">
        <div className="flex flex-col gap-1 overflow-hidden">
          <span className="text-[10px] text-slate-400 font-mono-tech uppercase font-bold">{t.department}</span>
          <span className="text-sm text-slate-800 font-bold font-space leading-tight truncate">
            {department || "TBD"}
          </span>
        </div>
        
        {/* Dedicated Grid Line for actions */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/40">
          <Link 
            to={`/promise/${promise.id}/history`}
            className="py-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-mono-tech font-bold uppercase tracking-wider text-slate-600 hover:text-slate-800 transition-all no-underline bg-white text-center flex items-center justify-center gap-1"
          >
            <FaHistory className="text-slate-400" /> History
          </Link>
          <Link 
            to={`/promise/${promise.id}/comments`}
            className="py-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-mono-tech font-bold uppercase tracking-wider text-slate-600 hover:text-slate-800 transition-all no-underline bg-white text-center flex items-center justify-center gap-1"
          >
            <FaRegComments className="text-slate-400" /> Comments
          </Link>
        </div>

        <button
          type="button"
          onClick={() => onOpenUpdateStatus(promise)}
          aria-label={`Suggest a status update for ${title}`}
          className="w-full bg-navy-flag hover:bg-navy-flag-dark text-white rounded-lg py-2 text-xs font-mono-tech font-bold uppercase tracking-wider transition-all cursor-pointer border-none text-center flex items-center justify-center gap-1.5"
        >
          <FaBalanceScale /> Update Status
        </button>
      </div>
    </div>
  );
}
