import { useCallback, useState, useMemo, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { PROMISES_DATA } from "./data/promises";
import { supabase } from "./supabase";
import { STATUS_DISPLAY, VALID_STATUSES } from "./constants";

// Modular UI Component Imports
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import StatsBar from "./components/StatsBar";
import Filters from "./components/Filters";
import PromisesGrid from "./components/PromisesGrid";
import AuthModal from "./components/AuthModal";

// Separate Aesthetic Pages
import PromiseHistoryPage from "./pages/PromiseHistoryPage";
import PromiseCommentsPage from "./pages/PromiseCommentsPage";
import UpdateStatusModal from "./components/UpdateStatusModal";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import DataDeletionPage from "./pages/DataDeletionPage";

// Flat Translations Map for English and Malayalam localization
const UI_TRANSLATIONS = {
  en: {
    disclaimer: "DISCLAIMER: This is not a government or political website. It is an independent public notepad maintained by the people of Kerala.",
    title: "UDF MANIFESTO TRACKER",
    tagline: "Every promise publicly tracked throughout the government's full term.",
    chief_minister: "CHIEF MINISTER",
    days_in_office: "DAYS IN OFFICE",
    days_remaining: "DAYS REMAINING",
    total_promises: "KEY PROMISES",
    fulfilled: "IMPLEMENTED",
    in_progress: "IN PROGRESS",
    pending: "PENDING",
    evaded: "BYPASSED",
    completion_rate: "COMPLETION RATE",
    search_placeholder: "Search promises by title, keyword, or category...",
    department: "Responsible Department",
    all_categories: "All Categories",
    no_results: "No promises found matching your criteria.",
    reset_filters: "Reset All Filters"
  },
  ml: {
    disclaimer: "ഡിസ്ക്ലെയിമർ: ഇതൊരു ഔദ്യോഗിക സർക്കാർ വെബ്‌സൈറ്റല്ല. കേരളത്തിലെ ജനങ്ങൾ നിയന്ത്രിക്കുന്ന ഒരു സ്വതന്ത്ര വിവരശേഖരണ പ്ലാറ്റ്‌ഫോം മാത്രമാണിത്.",
    title: "UDF Manifesto Tracker",
    tagline: "സർക്കാരിന്റെ പൂർണ്ണ കാലാവധിയിലുടനീളം എല്ലാ വാഗ്ദാനങ്ങളും പരസ്യമായി ട്രാക്ക് ചെയ്യുന്നു.",
    chief_minister: "മുഖ്യമന്ത്രി",
    days_in_office: "അധികാരത്തിൽ കഴിഞ്ഞ ദിവസങ്ങൾ",
    days_remaining: "ബാക്കി ദിവസങ്ങൾ",
    total_promises: "മുഖ്യ വാഗ്ദാനങ്ങൾ",
    fulfilled: "നടപ്പിലാക്കിയത്",
    in_progress: "പുരോഗതിയിൽ",
    pending: "ബാക്കിനിൽക്കുന്നത്",
    evaded: "ഉപേക്ഷിച്ചത്",
    completion_rate: "പൂർത്തീകരണ നിരക്ക്",
    search_placeholder: "വാഗ്ദാനങ്ങൾ തിരയുക...",
    department: "ചുമതലയുള്ള വകുപ്പ്",
    all_categories: "എല്ലാ വിഭാഗങ്ങളും",
    no_results: "നിങ്ങൾ തിരഞ്ഞ വാഗ്ദാനങ്ങൾ ഒന്നും കണ്ടെത്താനായില്ല.",
    reset_filters: "ഫിൽട്ടറുകൾ റീസെറ്റ് ചെയ്യുക"
  }
};

function App() {
  // English / Malayalam language toggle state
  const [lang, setLang] = useState("en");
  
  // Interactive filtering states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  // Authentication & Dynamic Overrides States
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [updatesList, setUpdatesList] = useState([]);
  const [updatesLoading, setUpdatesLoading] = useState(true);
  const [updatesError, setUpdatesError] = useState("");
  const [activePromiseForUpdate, setActivePromiseForUpdate] = useState(null);

  const t = UI_TRANSLATIONS[lang];

  // 1. Listen for user auth sessions
  useEffect(() => {
    let mounted = true;

    supabase.auth.getUser().then(({ data, error }) => {
      if (mounted) {
        setUser(error ? null : data.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "ml" ? "ml" : "en";
  }, [lang]);

  // 2. Fetch status updates from database to override local statuses
  const loadStatusUpdates = useCallback(async () => {
    setUpdatesLoading(true);
    setUpdatesError("");
    try {
      const { data, error } = await supabase
        .from("updates")
        .select("promise_id, new_status")
        .order("created_at", { ascending: true }); // older first, so newer overwrites

      if (error) throw error;
      setUpdatesList(data || []);
    } catch (err) {
      console.error("Failed to load community status updates:", err.message);
      setUpdatesError("Live community updates could not be loaded. Showing the local promise list.");
    } finally {
      setUpdatesLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(loadStatusUpdates);
  }, [loadStatusUpdates]);

  // 3. Flatten the promises array from nested categories structure and apply live overrides
  const allPromises = useMemo(() => {
    const list = [];
    const statusMap = {};
    
    // Build a map of latest status from database
    updatesList.forEach(up => {
      if (VALID_STATUSES.includes(up.new_status)) {
        statusMap[up.promise_id] = up.new_status;
      }
    });

    PROMISES_DATA.forEach(catGroup => {
      catGroup.promises.forEach(p => {
        const dbStatus = statusMap[p.id];
        
        let statusLabel = p.statusLabel;
        let statusLabel_ml = p.statusLabel_ml;

        if (dbStatus) {
          statusLabel = STATUS_DISPLAY[dbStatus].statusLabel;
          statusLabel_ml = STATUS_DISPLAY[dbStatus].statusLabel_ml;
        }

        list.push({
          ...p,
          status: dbStatus || p.status,
          statusLabel,
          statusLabel_ml,
          category: catGroup.category,
          category_ml: catGroup.category_ml
        });
      });
    });
    return list;
  }, [updatesList]);

  // Compute stats metrics dynamically from the active live data
  const stats = useMemo(() => {
    const total = allPromises.length;
    const fulfilled = allPromises.filter(p => p.status === "fulfilled").length;
    const inProgress = allPromises.filter(p => p.status === "in_progress").length;
    const evaded = allPromises.filter(p => p.status === "evaded").length;
    const pending = allPromises.filter(p => p.status === "pending").length;
    const completionRate = total > 0 ? Math.round((fulfilled / total) * 100) : 0;

    return {
      total,
      fulfilled,
      inProgress,
      evaded,
      pending,
      completionRate
    };
  }, [allPromises]);

  // Generate category list mapping with translated fields
  const categoriesList = useMemo(() => {
    return [
      { name: "All", name_ml: "എല്ലാം" },
      ...PROMISES_DATA.map(c => ({ name: c.category, name_ml: c.category_ml }))
    ];
  }, []);

  // Compute category count badges dynamically from dataset
  const categoryCounts = useMemo(() => {
    const counts = { All: allPromises.length };
    allPromises.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [allPromises]);

  // Filter promises dynamically based on query criteria
  const filteredPromises = useMemo(() => {
    return allPromises.filter(p => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        p.title.toLowerCase().includes(query) ||
        p.title_ml.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.description_ml.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.category_ml.toLowerCase().includes(query);

      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      const matchesStatus = selectedStatus === "All" || p.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [allPromises, searchQuery, selectedCategory, selectedStatus]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedStatus("All");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handlePromiseUpdated = () => {
    loadStatusUpdates();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-navy-flag selection:text-white antialiased">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-navy-flag focus:shadow-lg"
      >
        Skip to main content
      </a>
      
      {/* Pinned Sticky Header */}
      <Navbar 
        lang={lang} 
        setLang={setLang} 
        t={t} 
        user={user}
        onOpenAuth={() => setAuthOpen(true)}
        onSignOut={handleSignOut}
      />

      <Routes>
        {/* Main Dashboard / Home Route */}
        <Route path="/" element={
          <>
            {/* Hero Header Section */}
            <Hero lang={lang} t={t} />

            {/* Main Page Content */}
            <main id="main-content" className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-10 relative z-30" tabIndex="-1">
              
              {/* Dynamic Analytics Stats Counter */}
              <div className="mb-10">
                <StatsBar 
                  stats={stats} 
                  selectedStatus={selectedStatus} 
                  setSelectedStatus={setSelectedStatus} 
                  t={t} 
                />
              </div>

              {/* Dynamic Filtering Panel */}
              <Filters 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                viewMode={viewMode}
                setViewMode={setViewMode}
                categories={categoriesList}
                categoryCounts={categoryCounts}
                t={t}
                lang={lang}
              />

              {/* Promises Presentation Grid */}
              <PromisesGrid 
                filteredPromises={filteredPromises}
                viewMode={viewMode}
                lang={lang}
                t={t}
                resetFilters={handleResetFilters}
                isLoading={updatesLoading}
                errorMessage={updatesError}
                onOpenUpdateStatus={(promise) => {
                  if (user) {
                    setActivePromiseForUpdate(promise);
                  } else {
                    setAuthOpen(true);
                  }
                }}
              />

            </main>
          </>
        } />

        {/* Verification History Timeline Page */}
        <Route path="/promise/:id/history" element={
          <div className="flex-1">
            <PromiseHistoryPage 
              allPromises={allPromises}
              user={user}
              lang={lang}
              t={t}
              onPromiseUpdated={handlePromiseUpdated}
            />
          </div>
        } />

        {/* Public Citizen Deliberation Comments Page */}
        <Route path="/promise/:id/comments" element={
          <div className="flex-1">
            <PromiseCommentsPage 
              allPromises={allPromises}
              user={user}
              lang={lang}
              t={t}
            />
          </div>
        } />

        {/* Compliance Pages */}
        <Route path="/privacy" element={<PrivacyPolicyPage lang={lang} />} />
        <Route path="/data-deletion" element={<DataDeletionPage user={user} onSignOut={handleSignOut} lang={lang} />} />
      </Routes>

      {/* Footer */}
      <footer className="bg-green-flag text-white py-12 px-4 md:px-8 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs md:text-sm">
          <div className="flex flex-col gap-2">
            <p className="text-green-50">
              &copy; {new Date().getFullYear()} UDF Manifesto Tracker. {lang === "en" ? "All Rights Reserved." : "എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം."}
            </p>
            <div className="flex items-center gap-3 text-[10px] font-mono-tech uppercase tracking-wider text-green-200">
              <Link to="/privacy" className="hover:text-white hover:underline transition-colors no-underline">Privacy Policy</Link>
              <span className="text-green-300/40">|</span>
              <Link to="/data-deletion" className="hover:text-white hover:underline transition-colors no-underline">Data Deletion</Link>
            </div>
          </div>
          
          {/* Custom Designer attribution linked to ridanasif.com */}
          <div className="font-mono-tech tracking-wide text-green-100 bg-green-flag-dark/30 border border-green-flag-dark/40 px-4 py-2 rounded-lg">
            DESIGNED AND DEVELOPED BY {" "}
            <a 
              href="https://www.ridanasif.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white hover:text-saffron underline decoration-saffron underline-offset-4 transition-colors font-bold"
            >
              RIDAN ASIF
            </a>
          </div>
        </div>
      </footer>

      {/* Traditional Account Form Modal */}
      <AuthModal 
        isOpen={authOpen} 
        onClose={() => setAuthOpen(false)} 
        lang={lang}
      />

      {/* Global Status Update Modal triggered from Home Card */}
      <UpdateStatusModal
        promise={activePromiseForUpdate}
        user={user}
        lang={lang}
        t={t}
        isOpen={!!activePromiseForUpdate}
        onClose={() => setActivePromiseForUpdate(null)}
        onPromiseUpdated={handlePromiseUpdated}
      />

    </div>
  );
}

export default App;
