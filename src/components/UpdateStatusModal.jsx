import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { FaBalanceScale, FaInfoCircle, FaTimes } from "react-icons/fa";
import { SOURCE_DOMAINS, STATUS_OPTIONS, VALID_STATUSES } from "../constants";
import LoadingSpinner from "./LoadingSpinner";

export default function UpdateStatusModal({ promise, user, lang, isOpen, onClose, onPromiseUpdated }) {
  const [newStatus, setNewStatus] = useState("pending");
  const [sourceLink, setSourceLink] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (isOpen && promise) {
      Promise.resolve().then(() => {
        setNewStatus(promise.status);
        setSourceLink("");
        setErrorMsg("");
        setSuccessMsg("");
      });
    } else if (!isOpen) {
      Promise.resolve().then(() => {
        setNewStatus("pending");
        setSourceLink("");
        setSubmitting(false);
        setErrorMsg("");
        setSuccessMsg("");
      });
    }
  }, [isOpen, promise]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape" && !submitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, submitting]);

  if (!isOpen || !promise) return null;

  const checkDomainAllowed = (urlStr) => {
    try {
      const url = new URL(urlStr);
      if (!["http:", "https:"].includes(url.protocol)) return false;
      const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
      return SOURCE_DOMAINS.some(domain => hostname === domain || hostname.endsWith("." + domain));
    } catch {
      return false;
    }
  };

  const handleBackdropMouseDown = (event) => {
    if (event.target === event.currentTarget && !submitting) {
      onClose();
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!user) return;

    setErrorMsg("");
    setSuccessMsg("");

    if (!VALID_STATUSES.includes(newStatus)) {
      setErrorMsg("Please choose a valid status.");
      return;
    }

    const normalizedSourceLink = sourceLink.trim();

    // Simple URL validation
    if (!/^https?:\/\//i.test(normalizedSourceLink)) {
      setErrorMsg("Please provide a valid source URL starting with http:// or https://");
      return;
    }

    // Strict Domain Whitelist Validation
    if (!checkDomainAllowed(normalizedSourceLink)) {
      setErrorMsg("Approved Sources Only: You must enter a link from an approved official government site (.gov.in), reputable news portal (e.g. Mathrubhumi, Manorama, The Hindu), or international agency database (WHO, UN).");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("updates")
        .insert({
          promise_id: promise.id,
          user_id: user.id,
          user_name: user.user_metadata?.full_name || "Anonymous Citizen",
          previous_status: promise.status,
          new_status: newStatus,
          source_link: normalizedSourceLink
        });

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
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/70 animate-fade-in" onMouseDown={handleBackdropMouseDown}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="update-status-title"
        className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl overflow-hidden flex flex-col relative animate-slide-up"
      >
        
        {/* Header */}
        <div className="bg-navy-flag text-white px-6 py-4 flex items-center justify-between">
          <span className="font-space font-bold uppercase tracking-wider text-sm flex items-center gap-2">
            <FaBalanceScale aria-hidden="true" className="text-white text-sm" /> UPDATE PROMISE STATUS
          </span>
          <button 
            type="button"
            onClick={onClose}
            aria-label="Close status update dialog"
            disabled={submitting}
            className="text-white/80 hover:text-white cursor-pointer p-1 rounded-lg hover:bg-white/10 transition-all border-none bg-transparent"
          >
            <FaTimes aria-hidden="true" className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleStatusUpdate} className="p-6 space-y-4">
          <h4 id="update-status-title" className="text-sm text-slate-500 font-mono-tech uppercase font-bold tracking-wider">
            Target Promise: <span className="text-slate-800 font-space font-bold text-base block mt-1 normal-case">{translatedTitle}</span>
          </h4>

          {errorMsg && (
            <div role="alert" className="bg-rose-50 border border-rose-100 text-rose-600 rounded-lg p-3 text-sm font-space font-medium flex items-start gap-2">
              <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0"></span>
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div role="status" className="bg-green-flag-light border border-green-flag/10 text-green-flag-dark rounded-lg p-3 text-sm font-space font-medium flex items-start gap-2">
              <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-green-flag mt-1.5 flex-shrink-0"></span>
              {successMsg}
            </div>
          )}

          <div className="space-y-4 bg-slate-50 p-4 border border-slate-200 rounded-xl">
            <div>
              <label htmlFor="new-status" className="block text-xs font-mono-tech uppercase font-bold text-slate-400 mb-1">Select New Status</label>
              <select
                id="new-status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3 focus:outline-none focus:border-navy-flag/50 text-sm font-space font-bold text-slate-800"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.label_en} ({status.label_ml})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="source-link" className="block text-xs font-mono-tech uppercase font-bold text-slate-400 mb-1">Source Verification Link (Required)</label>
              <input 
                id="source-link"
                type="url"
                required
                maxLength="2048"
                placeholder="https://reputable-news-source.com/report"
                value={sourceLink}
                onChange={(e) => setSourceLink(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3 focus:outline-none focus:border-navy-flag/50 text-sm font-sans"
              />
            </div>
          </div>

          <div className="text-xs text-slate-600 font-sans leading-relaxed italic bg-amber-50 border border-amber-100 p-3 rounded-lg flex items-start gap-1.5">
            <FaInfoCircle aria-hidden="true" className="text-amber-500 mt-0.5 flex-shrink-0 text-sm" />
            <span>Traditional credentials limit submissions to 3 updates per week. Spammers or false flags will lead to immediate account bans.</span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              disabled={submitting}
              className="border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2.5 rounded-lg text-sm font-mono-tech font-bold uppercase transition-all cursor-pointer bg-white"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={submitting || !!successMsg}
              aria-busy={submitting}
              className="bg-navy-flag hover:bg-navy-flag-dark text-white rounded-lg px-5 py-2.5 text-sm font-mono-tech font-bold uppercase cursor-pointer border-none flex items-center justify-center gap-2 disabled:cursor-wait disabled:opacity-75"
            >
              {submitting && <LoadingSpinner label="Submitting status update" />}
              {submitting ? "Submitting..." : "Save Change"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
