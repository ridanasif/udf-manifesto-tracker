import { useCallback, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import UpdateStatusModal from "../components/UpdateStatusModal";
import { FaArrowLeft, FaArrowUp, FaArrowDown, FaLock, FaHistory, FaBalanceScale } from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner";

const PAGE_TRANSLATIONS = {
  en: {
    backBtn: "BACK TO ALL PROMISES",
    badge: "HISTORY SECTION",
    notFoundTitle: "Promise Not Found",
    notFoundDesc: "The requested history page could not be found.",
    goHome: "Go Home",
    submitLog: "Suggest Status Change",
    loginRequired: "Log in using the Sign In button at the top to suggest status changes.",
    timelineTitle: "Dynamic Timeline & Status Updates",
    loading: "Loading updates log...",
    emptyState: "No dynamic updates have been registered yet. All card values remain set to Pending.",
    changedProgress: "Changed progress to:",
    verificationSource: "Verification Source:",
    upvoteTitle: "Upvote: This source is real and correct",
    downvoteTitle: "Downvote: This source is false or misleading",
    loginToVote: "Log in to vote"
  },
  ml: {
    backBtn: "തിരികെ വാഗ്ദാനങ്ങളുടെ പട്ടികയിലേക്ക്",
    badge: "ചരിത്രം",
    notFoundTitle: "വാഗ്ദാനം കണ്ടെത്താനായില്ല",
    notFoundDesc: "നിങ്ങൾ തിരയുന്ന വാഗ്ദാനത്തിന്റെ തിരുത്തൽ വിവരങ്ങൾ ലഭ്യമല്ല.",
    goHome: "തിരികെ പോവുക",
    submitLog: "മാറ്റങ്ങൾ നിർദ്ദേശിക്കുക",
    loginRequired: "മാറ്റങ്ങൾ നിർദ്ദേശിക്കാനായി മുകളിൽ കാണുന്ന ലോഗിൻ ബട്ടൺ ഉപയോഗിച്ച് ലോഗിൻ ചെയ്യുക.",
    timelineTitle: "മാറ്റങ്ങളുടെ ടൈംലൈൻ",
    loading: "വിവരങ്ങൾ ലഭ്യമാക്കുന്നു...",
    emptyState: "മാറ്റങ്ങൾ ഒന്നും രേഖപ്പെടുത്തിയിട്ടില്ല. നിലവിൽ ഈ വാഗ്ദാനം Pending അവസ്ഥയിലാണ്.",
    changedProgress: "നില മാറ്റം:",
    verificationSource: "ആധാരമായ ലിങ്ക്:",
    upvoteTitle: "ശരിയാണെന്ന് വോട്ട് ചെയ്യുക",
    downvoteTitle: "തെറ്റാണെന്ന് വോട്ട് ചെയ്യുക",
    loginToVote: "വോട്ട് ചെയ്യാൻ ലോഗിൻ ചെയ്യുക"
  }
};

export default function PromiseHistoryPage({ allPromises, user, lang = "en", t, onPromiseUpdated }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [history, setHistory] = useState([]);
  const [votesMap, setVotesMap] = useState({}); // updateId -> { score, userVote }
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [voteError, setVoteError] = useState("");
  const [votingId, setVotingId] = useState("");
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  // Find the target promise
  const promise = allPromises.find(p => p.id === id);
  const pageT = PAGE_TRANSLATIONS[lang] || PAGE_TRANSLATIONS.en;

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      // 1. Fetch edits history
      const { data: edits, error: editsErr } = await supabase
        .from("updates")
        .select("*")
        .eq("promise_id", id)
        .order("created_at", { ascending: false });

      if (editsErr) throw editsErr;
      setHistory(edits || []);

      // 2. Fetch votes
      if (edits && edits.length > 0) {
        const editIds = edits.map(e => e.id);
        const { data: votes, error: votesErr } = await supabase
          .from("upvotes")
          .select("*")
          .in("update_id", editIds);

        if (votesErr) throw votesErr;

        const initialVotes = {};
        edits.forEach(e => {
          initialVotes[e.id] = { score: 0, userVote: 0 };
        });

        votes.forEach(v => {
          if (initialVotes[v.update_id]) {
            initialVotes[v.update_id].score += v.vote;
            if (user && v.user_id === user.id) {
              initialVotes[v.update_id].userVote = v.vote;
            }
          }
        });
        setVotesMap(initialVotes);
      } else {
        setVotesMap({});
      }
    } catch (err) {
      console.error("Error loading verification history:", err.message);
      setLoadError("Could not load the verification history right now.");
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    if (promise) {
      Promise.resolve().then(loadHistory);
    }
  }, [promise, loadHistory]);

  const handleVote = async (updateId, voteVal) => {
    if (!user) return;

    setVoteError("");
    setVotingId(updateId);
    try {
      const current = votesMap[updateId] || { score: 0, userVote: 0 };
      
      if (current.userVote === voteVal) {
        // Delete vote on double click
        const { error } = await supabase
          .from("upvotes")
          .delete()
          .eq("update_id", updateId)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        // Upsert vote
        const { error } = await supabase
          .from("upvotes")
          .upsert({
            update_id: updateId,
            user_id: user.id,
            vote: voteVal
          });

        if (error) throw error;
      }

      await loadHistory();
    } catch (err) {
      console.error("Error casting vote:", err.message);
      setVoteError("Could not save your vote. Please try again.");
    } finally {
      setVotingId("");
    }
  };

  if (!promise) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-fade-in">
        <h3 className="text-lg font-space font-bold text-slate-800 uppercase">{pageT.notFoundTitle}</h3>
        <p className="text-slate-500 text-xs mt-2">{pageT.notFoundDesc}</p>
        <button 
          type="button"
          onClick={() => navigate("/")} 
          className="mt-6 px-4 py-2 bg-navy-flag text-white text-xs font-mono-tech font-bold uppercase rounded-lg border-none cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
        >
          <FaArrowLeft /> {pageT.goHome}
        </button>
      </div>
    );
  }

  const translatedTitle = lang === "en" ? promise.title : promise.title_ml;
  const categoryLabel = lang === "en" ? promise.category : promise.category_ml;
  const deptLabel = lang === "en" ? promise.department : promise.department_ml;
  const statusLabel = lang === "en" ? promise.statusLabel : promise.statusLabel_ml;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-10 animate-fade-in">
      
      {/* Back Button */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-xs font-mono-tech font-bold text-slate-600 hover:text-slate-900 transition-all border-none bg-transparent cursor-pointer"
        >
          <FaArrowLeft className="text-slate-500 text-xs" />
          {pageT.backBtn}
        </button>
        <span className="text-[10px] font-mono-tech font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200/50">
          {pageT.badge}
        </span>
      </div>

      {/* Unified Promise Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 mb-8">
        
        {/* Header Tags */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono-tech font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded">
            {categoryLabel}
          </span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono-tech font-bold uppercase tracking-wider border ${
            promise.status === 'fulfilled' ? 'bg-green-flag-light text-green-flag-dark border-green-flag/20' : 
            promise.status === 'in_progress' ? 'bg-saffron-light text-saffron-dark border-saffron/20' : 
            'bg-navy-flag-light text-navy-flag-dark border-navy-flag/15'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              promise.status === 'fulfilled' ? 'bg-green-flag' : 
              promise.status === 'in_progress' ? 'bg-saffron' : 
              'bg-navy-flag'
            }`}></span>
            {statusLabel}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-space font-bold text-slate-900 leading-snug">
          {translatedTitle}
        </h2>

        {/* Description */}
        <p className="text-slate-700 text-sm leading-relaxed font-sans font-medium bg-slate-50 p-4 rounded-xl border border-slate-200/40">
          {lang === 'en' ? promise.description : promise.description_ml}
        </p>

        {/* Bottom Panel containing Department info and Status Edit Trigger */}
        <div className="pt-5 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="block text-[9px] font-mono-tech uppercase font-bold text-slate-400">{t.department}</span>
            <span className="text-xs text-slate-800 font-bold font-space mt-1 block">{deptLabel || "TBD"}</span>
          </div>

          <div className="flex md:justify-end items-center flex-shrink-0">
            {user ? (
              <button
                type="button"
                onClick={() => setUpdateModalOpen(true)}
                className="w-full md:w-auto bg-navy-flag hover:bg-navy-flag-dark text-white rounded-lg py-2.5 px-5 text-xs font-mono-tech font-bold uppercase cursor-pointer border-none flex items-center justify-center gap-1.5 transition-all"
              >
                <FaBalanceScale /> {pageT.submitLog}
              </button>
            ) : (
              <div className="text-[11px] text-slate-500 font-space font-medium bg-slate-100 border border-slate-200/50 px-4 py-2.5 rounded-xl w-full text-center flex items-center justify-center gap-1.5 animate-fade-in">
                <FaLock className="text-slate-400 text-xs" /> {pageT.loginRequired}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Timeline Section */}
      <div className="space-y-6">
        <h3 className="text-xs font-mono-tech font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
          <FaHistory className="text-navy-flag text-sm" /> {pageT.timelineTitle}
        </h3>

        {loading ? (
          <div className="py-8 text-center text-slate-400 font-mono-tech text-xs flex items-center justify-center gap-2" role="status">
            <LoadingSpinner label={pageT.loading} className="text-navy-flag" />
            {pageT.loading}
          </div>
        ) : loadError ? (
          <div role="alert" className="text-amber-800 text-xs font-space p-8 bg-amber-50 border border-amber-200 rounded-2xl text-center animate-fade-in">
            {loadError}
          </div>
        ) : history.length === 0 ? (
          <div className="text-slate-400 text-xs font-space italic p-8 bg-white border border-slate-200 rounded-2xl text-center animate-fade-in">
            {pageT.emptyState}
          </div>
        ) : (
          <div className="relative border-l border-slate-200 ml-4 pl-8 py-2 space-y-8 animate-fade-in">
            {voteError && (
              <div role="alert" className="bg-rose-50 border border-rose-100 text-rose-600 rounded-lg p-3 text-xs font-space font-medium">
                {voteError}
              </div>
            )}
            {history.map((edit) => {
              const voteScore = votesMap[edit.id]?.score || 0;
              const userVote = votesMap[edit.id]?.userVote || 0;
              
              // Localized status badge translator
              let statusTxt = edit.new_status;
              if (lang === "ml") {
                if (edit.new_status?.toLowerCase() === "implemented" || edit.new_status?.toLowerCase() === "fulfilled") {
                  statusTxt = "നടപ്പിലാക്കിയത്";
                } else if (edit.new_status?.toLowerCase() === "in_progress") {
                  statusTxt = "പുരോഗതിയിൽ";
                } else if (edit.new_status?.toLowerCase() === "bypassed" || edit.new_status?.toLowerCase() === "evaded") {
                  statusTxt = "ഉപേക്ഷിച്ചത്";
                } else {
                  statusTxt = "ബാക്കിനിൽക്കുന്നത്";
                }
              }

              return (
                <div key={edit.id} className="relative">
                  <span className="absolute -left-[41px] top-1 w-6 h-6 rounded-full border-2 border-white bg-navy-flag flex items-center justify-center text-white">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>

                  <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row items-start justify-between gap-4 hover:shadow-xs transition-all duration-200">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-space font-bold text-slate-800">{edit.user_name}</span>
                        <span className="text-slate-400 text-[10px] font-mono-tech font-bold bg-slate-50 px-2 py-0.5 rounded border border-slate-200/50">
                          {new Date(edit.created_at).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="text-xs font-space flex items-center gap-2">
                        <span className="text-slate-400">{pageT.changedProgress}</span>
                        <span className="font-bold text-navy-flag uppercase">{statusTxt}</span>
                      </div>

                      <div className="text-xs pt-1.5 flex items-start gap-1.5">
                        <span className="text-[10px] font-mono-tech font-bold text-slate-400 uppercase mt-0.5">{pageT.verificationSource}</span>
                        <a 
                          href={edit.source_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          aria-label={`Open verification source: ${edit.source_link}`}
                          className="text-navy-flag hover:underline truncate max-w-xs md:max-w-md font-sans font-medium flex items-center gap-1"
                        >
                          <svg aria-hidden="true" className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          {edit.source_link}
                        </a>
                      </div>
                    </div>

                    {/* Upvote & Downvote Verification Panel */}
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-0.5 flex-shrink-0 self-end md:self-center">
                      <button
                        type="button"
                        disabled={!user || votingId === edit.id}
                        onClick={() => handleVote(edit.id, 1)}
                        aria-label={user ? pageT.upvoteTitle : pageT.loginToVote}
                        aria-pressed={userVote === 1}
                        className={`p-2 rounded transition-all border-none bg-transparent ${!user ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${userVote === 1 ? "bg-green-flag/10 text-green-flag" : "text-slate-400 hover:text-slate-600"}`}
                        title={user ? pageT.upvoteTitle : pageT.loginToVote}
                      >
                        <FaArrowUp className="w-3 h-3" />
                      </button>
                      
                      <span className={`text-xs font-mono-tech font-bold px-2 ${voteScore > 0 ? "text-green-flag" : voteScore < 0 ? "text-rose-500" : "text-slate-500"}`}>
                        {voteScore > 0 ? `+${voteScore}` : voteScore}
                      </span>

                      <button
                        type="button"
                        disabled={!user || votingId === edit.id}
                        onClick={() => handleVote(edit.id, -1)}
                        aria-label={user ? pageT.downvoteTitle : pageT.loginToVote}
                        aria-pressed={userVote === -1}
                        className={`p-2 rounded transition-all border-none bg-transparent ${!user ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${userVote === -1 ? "bg-rose-50/10 text-rose-500" : "text-slate-400 hover:text-slate-600"}`}
                        title={user ? pageT.downvoteTitle : pageT.loginToVote}
                      >
                        <FaArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dedicated Status Update Modal */}
      <UpdateStatusModal
        promise={promise}
        user={user}
        lang={lang}
        t={t}
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        onPromiseUpdated={(pid, newSt) => {
          if (onPromiseUpdated) onPromiseUpdated(pid, newSt);
          loadHistory();
        }}
      />

    </div>
  );
}
