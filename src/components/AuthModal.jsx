import React, { useState } from "react";
import { supabase } from "../supabase";
import { FaGoogle, FaFacebook, FaLock } from "react-icons/fa";

const TRANSLATIONS = {
  en: {
    header: "ACCOUNT LOGIN",
    title: "Sign In",
    subtitle: "Sign in using your Google or Facebook account to add comments and suggest status updates.",
    googleBtn: "Sign in with Google",
    facebookBtn: "Sign in with Facebook",
    footer: "We do not post to your profile or share your details. Read our privacy policy in the footer."
  },
  ml: {
    header: "അക്കൗണ്ട് ലോഗിൻ",
    title: "ലോഗിൻ ചെയ്യുക",
    subtitle: "കമന്റുകൾ രേഖപ്പെടുത്താനും മാറ്റങ്ങൾ നിർദ്ദേശിക്കാനും ഗൂഗിൾ അല്ലെങ്കിൽ ഫേസ്ബുക്ക് ഉപയോഗിച്ച് ലോഗിൻ ചെയ്യുക.",
    googleBtn: "ഗൂഗിൾ ഉപയോഗിച്ച് ലോഗിൻ ചെയ്യുക",
    facebookBtn: "ഫേസ്ബുക്ക് ഉപയോഗിച്ച് ലോഗിൻ ചെയ്യുക",
    footer: "ഞങ്ങൾ നിങ്ങളുടെ അനുവാദമില്ലാതെ പ്രൊഫൈലിൽ ഒന്നും പോസ്റ്റ് ചെയ്യുകയോ വിവരങ്ങൾ പങ്കിടുകയോ ഇല്ല. കൂടുതൽ വിവരങ്ങൾക്ക് പ്രൈവസി പോളിസി കാണുക."
  }
};

export default function AuthModal({ isOpen, onClose, lang = "en" }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err) {
      setErrorMsg(err.message || "Failed to initialize Google Sign In.");
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err) {
      setErrorMsg(err.message || "Failed to initialize Facebook Sign In.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/70 animate-fade-in">
      <div className="bg-white border border-slate-200 w-full max-w-sm rounded-2xl overflow-hidden flex flex-col relative animate-slide-up">
        
        {/* Header Banner */}
        <div className="bg-navy-flag text-white px-6 py-4 flex items-center justify-between">
          <span className="font-space font-bold uppercase tracking-wider text-xs flex items-center gap-2">
            <FaLock className="text-white text-xs" />
            {t.header}
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

        <div className="p-6 text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-base font-space font-bold text-slate-900">
              {t.title}
            </h3>
            <p className="text-xs text-slate-500 font-sans leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-lg p-3 text-xs font-space font-medium text-left flex items-start gap-2 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0"></span>
              {errorMsg}
            </div>
          )}

          {/* Social Logins Actions */}
          <div className="flex flex-col gap-3">
            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 py-3 rounded-xl text-xs font-space font-bold flex items-center justify-center gap-2.5 cursor-pointer bg-white transition-all interactive-card"
            >
              <FaGoogle className="text-rose-500 text-base" />
              {t.googleBtn}
            </button>
            
            <button 
              type="button"
              onClick={handleFacebookLogin}
              disabled={loading}
              className="w-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 py-3 rounded-xl text-xs font-space font-bold flex items-center justify-center gap-2.5 cursor-pointer bg-white transition-all interactive-card"
            >
              <FaFacebook className="text-blue-600 text-base" />
              {t.facebookBtn}
            </button>
          </div>

          <div className="border-t border-slate-100 pt-4 flex items-start justify-center gap-2">
            <FaLock className="text-slate-400 text-[10px] mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-slate-400 font-mono-tech leading-normal text-left">
              {t.footer}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
