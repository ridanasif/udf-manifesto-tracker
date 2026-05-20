import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import UpdateStatusModal from "../components/UpdateStatusModal";
import { FaArrowLeft, FaArrowUp, FaArrowDown, FaLock, FaHistory, FaBalanceScale } from "react-icons/fa";

export default function PromiseHistoryPage({ allPromises, user, lang, t, onPromiseUpdated }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [history, setHistory] = useState([]);
  const [votesMap, setVotesMap] = useState({}); // updateId -> { score, userVote }
  const [loading, setLoading] = useState(true);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  // Find the target promise
  const promise = allPromises.find(p => p.id === id);

  useEffect(() => {
    if (promise) {
      loadHistory();
    }
  }, [promise, user]);

  const loadHistory = async () => {
    setLoading(true);
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
      }
    } catch (err) {
      console.error("Error loading verification history:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (updateId, voteVal) => {
    if (!user) return;

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

      loadHistory();
    } catch (err) {
      console.error("Error casting vote:", err.message);
    }
  };

  if (!promise) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-fade-in">
        <h3 className="text-lg font-space font-bold text-slate-800 uppercase">Promise Not Found</h3>
        <p className="text-slate-500 text-xs mt-2">The requested history page could not be found.</p>
        <button 
          onClick={() => navigate("/")} 
          className="mt-6 px-4 py-2 bg-navy-flag text-white text-xs font-mono-tech font-bold uppercase rounded-lg border-none cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
        >
          <FaArrowLeft /> Go Home
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
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-xs font-mono-tech font-bold text-slate-600 hover:text-slate-900 transition-all border-none bg-transparent cursor-pointer"
        >
          <FaArrowLeft className="text-slate-500 text-xs" />
          BACK TO ALL PROMISES
        </button>
        <span className="text-[10px] font-mono-tech font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200/50">
          HISTORY SECTION
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
                onClick={() => setUpdateModalOpen(true)}
                className="w-full md:w-auto bg-navy-flag hover:bg-navy-flag-dark text-white rounded-lg py-2.5 px-5 text-xs font-mono-tech font-bold uppercase cursor-pointer border-none flex items-center justify-center gap-1.5 transition-all"
              >
                <FaBalanceScale /> Submit Verification Log
              </button>
            ) : (
              <div className="text-[11px] text-slate-500 font-space font-medium bg-slate-100 border border-slate-200/50 px-4 py-2.5 rounded-xl w-full text-center flex items-center justify-center gap-1.5">
                <FaLock className="text-slate-400 text-xs" /> Log in via the Sign In button at the top to suggest status changes.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Timeline Section */}
      <div className="space-y-6">
        <h3 className="text-xs font-mono-tech font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
          <FaHistory className="text-navy-flag text-sm" /> Dynamic Timeline & Status Updates
        </h3>

        {loading ? (
          <div className="py-8 text-center text-slate-400 font-mono-tech text-xs">Loading updates log...</div>
        ) : history.length === 0 ? (
          <div className="text-slate-400 text-xs font-space italic p-8 bg-white border border-slate-200 rounded-2xl text-center">
            No dynamic updates have been registered yet. All card values remain set to Pending.
          </div>
        ) : (
          <div className="relative border-l border-slate-200 ml-4 pl-8 py-2 space-y-8">
            {history.map((edit) => {
              const voteScore = votesMap[edit.id]?.score || 0;
              const userVote = votesMap[edit.id]?.userVote || 0;
              
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
                        <span className="text-slate-400">Changed progress to:</span>
                        <span className="font-bold text-navy-flag uppercase">{edit.new_status}</span>
                      </div>

                      <div className="text-xs pt-1.5 flex items-start gap-1.5">
                        <span className="text-[10px] font-mono-tech font-bold text-slate-400 uppercase mt-0.5">Verification Source:</span>
                        <a 
                          href={edit.source_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-navy-flag hover:underline truncate max-w-xs md:max-w-md font-sans font-medium flex items-center gap-1"
                        >
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          {edit.source_link}
                        </a>
                      </div>
                    </div>

                    {/* Upvote & Downvote Verification Panel */}
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-0.5 flex-shrink-0 self-end md:self-center">
                      <button
                        disabled={!user}
                        onClick={() => handleVote(edit.id, 1)}
                        className={`p-2 rounded transition-all border-none bg-transparent ${!user ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${userVote === 1 ? "bg-green-flag/10 text-green-flag" : "text-slate-400 hover:text-slate-600"}`}
                        title={user ? "Upvote: This source is real and correct" : "Log in to vote"}
                      >
                        <FaArrowUp className="w-3 h-3" />
                      </button>
                      
                      <span className={`text-xs font-mono-tech font-bold px-2 ${voteScore > 0 ? "text-green-flag" : voteScore < 0 ? "text-rose-500" : "text-slate-500"}`}>
                        {voteScore > 0 ? `+${voteScore}` : voteScore}
                      </span>

                      <button
                        disabled={!user}
                        onClick={() => handleVote(edit.id, -1)}
                        className={`p-2 rounded transition-all border-none bg-transparent ${!user ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${userVote === -1 ? "bg-rose-500/10 text-rose-500" : "text-slate-400 hover:text-slate-600"}`}
                        title={user ? "Downvote: This source is false or misleading" : "Log in to vote"}
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
