import { FaUserCircle } from "react-icons/fa";

export default function Navbar({ lang, setLang, t, user, onOpenAuth, onSignOut }) {
  const displayName = user?.user_metadata?.full_name || user?.email || "Signed-in user";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 transition-all duration-300" role="banner">
      
      {/* 1. Flat Disclaimer Banner (Combined on top) */}
      <div className="bg-saffron text-slate-900 border-b border-saffron-dark/10 text-center py-2 px-4 text-sm font-mono-tech font-bold">
        <div className="max-w-7xl mx-auto">
          {t.disclaimer}
        </div>
      </div>

      {/* Flag Stripe Accent Line */}
      <div className="flag-stripe"></div>

      {/* 2. Main Navigation Bar Row */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0">
        
        {/* Brand Logo & Title + Mobile Auth Trigger */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-3">
            <img 
              src="/web-app-manifest-192x192.png" 
              alt="UDF Manifesto Tracker logo" 
              className="w-12 h-12 md:w-14 md:h-14 object-contain rounded-xl flex-shrink-0" 
            />
            <div>
              <h1 className="text-sm md:text-lg font-space font-bold tracking-tight text-navy-flag leading-none">
                {t.title}
              </h1>
            </div>
          </div>

          {/* Citizen Auth Controls (Mobile Viewport) */}
          <div className="md:hidden">
            {user ? (
              <button
                type="button"
                onClick={onSignOut}
                aria-label="Sign out"
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 text-[11px] font-mono-tech font-bold uppercase transition-all cursor-pointer bg-white"
              >
                Sign Out
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                aria-label="Open sign in dialog"
                className="px-4 py-2 rounded-lg bg-black hover:bg-slate-900 text-white text-[11px] font-mono-tech font-bold uppercase transition-all cursor-pointer border-none"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Action Controls: Stacks Malayalam translation on next line to middle on mobile */}
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto mt-1 md:mt-0">
          
          {/* Desktop Auth Controls */}
          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-space font-bold text-slate-600 bg-slate-100 border border-slate-200/40 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 max-w-64" title={displayName}>
                  <FaUserCircle aria-hidden="true" className="text-slate-500 text-sm flex-shrink-0" />
                  <span className="truncate">{displayName}</span>
                </span>
                <button
                  type="button"
                  onClick={onSignOut}
                  aria-label="Sign out"
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 text-sm font-mono-tech font-bold uppercase transition-all cursor-pointer bg-white"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                aria-label="Open sign in dialog"
                className="px-4 py-2 rounded-lg bg-black hover:bg-slate-900 text-white text-sm font-mono-tech font-bold uppercase transition-all cursor-pointer border-none"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Malayalam Language Selector (flows to new line and centers on mobile) */}
          <div className="flex items-center justify-center gap-1 bg-slate-100 border border-slate-200/60 rounded-lg p-0.5 mx-auto md:mx-0" role="group" aria-label="Select language">
            <button
              type="button"
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
              className={`px-3 py-1.5 rounded text-sm font-mono-tech font-bold uppercase transition-all cursor-pointer border-none outline-none ${
                lang === "en" 
                  ? "bg-navy-flag text-white font-bold" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang("ml")}
              aria-pressed={lang === "ml"}
              className={`px-3 py-1.5 rounded text-sm font-space font-bold transition-all cursor-pointer border-none outline-none ${
                lang === "ml" 
                  ? "bg-navy-flag text-white font-bold" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              മലയാളം
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}
