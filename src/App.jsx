import React, { useState, useMemo } from "react";
import { PROMISES_DATA } from "./data/promises";

// Modular UI Component Imports
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import StatsBar from "./components/StatsBar";
import Filters from "./components/Filters";
import PromisesGrid from "./components/PromisesGrid";

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
    fulfilled: "FULFILLED",
    in_progress: "IN PROGRESS",
    pending: "PENDING",
    evaded: "EVADED",
    completion_rate: "COMPLETION RATE",
    search_placeholder: "Search promises by title, keyword, or category...",
    department: "Responsible Department",
    all_categories: "All Categories",
    no_results: "No promises found matching your criteria.",
    reset_filters: "Reset All Filters"
  },
  ml: {
    disclaimer: "ഡിസ്ക്ലെയിമർ: ഇതൊരു ഔദ്യോഗിക സർക്കാർ വെബ്‌സൈറ്റല്ല. കേരളത്തിലെ ജനങ്ങൾ നിയന്ത്രിക്കുന്ന ഒരു സ്വതന്ത്ര വിവരശേഖരണ പ്ലാറ്റ്‌ഫോം മാത്രമാണിത്.",
    title: "യു.ഡി.എഫ് പ്രകടനപത്രിക ട്രാക്കർ",
    tagline: "സർക്കാരിന്റെ പൂർണ്ണ കാലാവധിയിലുടനീളം എല്ലാ വാഗ്ദാനങ്ങളും പരസ്യമായി ട്രാക്ക് ചെയ്യുന്നു.",
    chief_minister: "മുഖ്യമന്ത്രി",
    days_in_office: "അധികാരത്തിൽ കഴിഞ്ഞ ദിവസങ്ങൾ",
    days_remaining: "ബാക്കി ദിവസങ്ങൾ",
    total_promises: "മുഖ്യ വാഗ്ദാനങ്ങൾ",
    fulfilled: "നടപ്പിലാക്കിയത്",
    in_progress: "പുരോഗതിയിൽ",
    pending: "ബാക്കിനിൽക്കുന്നത്",
    evaded: "ലംഘിച്ചത്",
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

  const t = UI_TRANSLATIONS[lang];

  // Flatten the promises array from nested categories structure for quick query computation
  const allPromises = useMemo(() => {
    const list = [];
    PROMISES_DATA.forEach(catGroup => {
      catGroup.promises.forEach(p => {
        list.push({
          ...p,
          category: catGroup.category,
          category_ml: catGroup.category_ml
        });
      });
    });
    return list;
  }, []);

  // Compute stats metrics dynamically from the active JSON values
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

  // Dynamic filter processing
  const filteredPromises = useMemo(() => {
    let list = [...allPromises];

    // Search query filter matching English and Malayalam values
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.title_ml.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) || 
        p.description_ml.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      list = list.filter(p => p.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== "All") {
      list = list.filter(p => p.status === selectedStatus);
    }

    return list;
  }, [allPromises, searchQuery, selectedCategory, selectedStatus]);

  // Reset helper
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedStatus("All");
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative antialiased select-none">
      
      {/* Combined Header (Sticky Top, Disclaimer + Navigation Row, no shadow, no blur, EN / മലയാളം toggle) */}
      <Navbar lang={lang} setLang={setLang} t={t} />

      {/* 3. Hero Section (Misty Munnar Hills, Flat Sequence Term Cards) */}
      <Hero lang={lang} t={t} />

      {/* 4. Flat Dynamic Stats Counters */}
      <StatsBar 
        stats={stats} 
        selectedStatus={selectedStatus} 
        setSelectedStatus={setSelectedStatus} 
        t={t} 
      />

      {/* 5. Main Content Filters & Grid */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-8 py-12">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-space font-bold tracking-widest text-slate-900 uppercase">
            {lang === "en" ? "UDF'S KEY PROMISES" : "യു.ഡി.എഫ് മുഖ്യ വാഗ്ദാനങ്ങൾ"}
          </h2>
          <div className="w-12 h-1 bg-navy-flag mx-auto mt-2 rounded"></div>
        </div>

        {/* Dynamic Filters Component */}
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

        {/* Dynamic flat promises grid */}
        <PromisesGrid 
          filteredPromises={filteredPromises}
          viewMode={viewMode}
          lang={lang}
          t={t}
          resetFilters={handleResetFilters}
        />

      </main>

      {/* 6. Footer (Flag stripe base, flat design credits linked to Ridan Asif) */}
      <footer className="bg-slate-950 text-slate-500 py-12 px-4 md:px-8 border-t border-slate-900 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs md:text-sm">
          <p>
            &copy; {new Date().getFullYear()} {lang === "en" ? "UDF MANIFESTO TRACKER." : "യു.ഡി.എഫ് പ്രകടനപത്രിക ട്രാക്കർ."} {lang === "en" ? "All Rights Reserved." : "എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം."}
          </p>
          
          {/* Custom Designer attribution linked to ridanasif.com */}
          <div className="font-mono-tech tracking-wide text-slate-400 bg-white/5 border border-white/10 px-4 py-2 rounded-lg">
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

    </div>
  );
}

export default App;
