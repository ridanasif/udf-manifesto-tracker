import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { FaBalanceScale, FaInfoCircle } from "react-icons/fa";

export default function UpdateStatusModal({ promise, user, lang, t, isOpen, onClose, onPromiseUpdated }) {
  const [newStatus, setNewStatus] = useState("pending");
  const [sourceLink, setSourceLink] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (isOpen && promise) {
      setNewStatus(promise.status);
      setSourceLink("");
      setErrorMsg("");
      setSuccessMsg("");
    }
  }, [isOpen, promise]);

  if (!isOpen || !promise) return null;

  const allowedDomains = [
    "kerala.gov.in",
    "assembly.kerala.gov.in",
    "budget.kerala.gov.in",
    "egazette.kerala.gov.in",
    "pib.gov.in",
    "eci.gov.in",
    "prsindia.org",
    "data.gov.in",
    "thehindu.com",
    "indianexpress.com",
    "timesofindia.indiatimes.com",
    "ndtv.com",
    "deccanherald.com",
    "newindianexpress.com",
    "news18.com",
    "scroll.in",
    "thewire.in",
    "onmanorama.com",
    "mathrubhumi.com",
    "manoramanews.com",
    "asianetnews.com",
    "mediaoneonline.com",
    "deshabhimani.com",
    "24newsHD.com",
    "reporterlive.com",
    "janamtv.com",
    "worldbank.org",
    "unicef.org",
    "who.int",
    "undp.org",
    "niti.gov.in"
  ];

  const checkDomainAllowed = (urlStr) => {
    try {
      const url = new URL(urlStr);
      const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
      return allowedDomains.some(domain => hostname === domain || hostname.endsWith("." + domain));
    } catch (e) {
      return false;
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!user) return;

    setErrorMsg("");
    setSuccessMsg("");

    // Simple URL validation
    if (!sourceLink.startsWith("http://") && !sourceLink.startsWith("https://")) {
      setErrorMsg("Please provide a valid source URL starting with http:// or https://");
      return;
    }

    // Strict Domain Whitelist Validation
    if (!checkDomainAllowed(sourceLink)) {
      setErrorMsg("Approved Sources Only: You must enter a link from an approved official government site (.gov.in), reputable news portal (e.g. Mathrubhumi, Manorama, The Hindu), or international agency database (WHO, UN).");
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("updates")
        .insert({
          promise_id: promise.id,
          user_id: user.id,
          user_name: user.user_metadata?.full_name || "Anonymous Citizen",
          previous_status: promise.status,
          new_status: newStatus,
          source_link: sourceLink
        })
        .select();

      if (error) throw error;

      setSuccessMsg("Status successfully updated! Verification source logged.");
      setSourceLink("");

      if (onPromiseUpdated) {
        onPromiseUpdated(promise.id, newStatus);
      }

      // Close modal on short delay
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err) {
      setErrorMsg(err.message || "Could not submit status update. You may have hit your weekly limit.");
    } finally {
      setSubmitting(false);
    }
  };

  const translatedTitle = lang === "en" ? promise.title : promise.title_ml;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/70 animate-fade-in">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl overflow-hidden flex flex-col relative animate-slide-up">
        
        {/* Header */}
        <div className="bg-navy-flag text-white px-6 py-4 flex items-center justify-between">
          <span className="font-space font-bold uppercase tracking-wider text-xs flex items-center gap-2">
            <FaBalanceScale className="text-white text-sm" /> UPDATE PROMISE STATUS
          </span>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white cursor-pointer p-1 rounded-lg hover:bg-white/10 transition-all border-none bg-transparent"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleStatusUpdate} className="p-6 space-y-4">
          <h4 className="text-xs text-slate-500 font-mono-tech uppercase font-bold tracking-wider">
            Target Promise: <span className="text-slate-800 font-space font-bold text-sm block mt-1 normal-case">{translatedTitle}</span>
          </h4>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-lg p-3 text-xs font-space font-medium flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0"></span>
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="bg-green-flag-light border border-green-flag/10 text-green-flag-dark rounded-lg p-3 text-xs font-space font-medium flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-flag mt-1.5 flex-shrink-0"></span>
              {successMsg}
            </div>
          )}

          <div className="space-y-4 bg-slate-50 p-4 border border-slate-200 rounded-xl">
            <div>
              <label className="block text-[9px] font-mono-tech uppercase font-bold text-slate-400 mb-1">Select New Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3 focus:outline-none focus:border-navy-flag/50 text-xs font-space font-bold text-slate-800"
              >
                <option value="pending">Pending (ബാക്കി)</option>
                <option value="in_progress">In Progress (പുരോഗതിയിൽ)</option>
                <option value="fulfilled">Implemented (നടപ്പിലായത്)</option>
                <option value="evaded">Bypassed (ഉപേക്ഷിച്ചത്)</option>
              </select>
            </div>

            <div>
              <label className="block text-[9px] font-mono-tech uppercase font-bold text-slate-400 mb-1">Source Verification Link (Required)</label>
              <input 
                type="url"
                required
                placeholder="https://reputable-news-source.com/report"
                value={sourceLink}
                onChange={(e) => setSourceLink(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3 focus:outline-none focus:border-navy-flag/50 text-xs font-sans"
              />
            </div>
          </div>

          <div className="text-[10px] text-slate-600 font-sans leading-relaxed italic bg-amber-50 border border-amber-100 p-3 rounded-lg flex items-start gap-1.5">
            <FaInfoCircle className="text-amber-500 mt-0.5 flex-shrink-0 text-xs" />
            <span>Traditional credentials limit submissions to 3 updates per week. Spammers or false flags will lead to immediate account bans.</span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2.5 rounded-lg text-xs font-mono-tech font-bold uppercase transition-all cursor-pointer bg-white"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={submitting}
              className="bg-navy-flag hover:bg-navy-flag-dark text-white rounded-lg px-5 py-2.5 text-xs font-mono-tech font-bold uppercase cursor-pointer border-none"
            >
              {submitting ? "Submitting..." : "Save Change"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
