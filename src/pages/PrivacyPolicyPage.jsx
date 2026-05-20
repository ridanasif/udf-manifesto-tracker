import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaShieldAlt } from "react-icons/fa";

const TRANSLATIONS = {
  en: {
    backBtn: "BACK TO DASHBOARD",
    badge: "PRIVACY POLICY",
    title: "Privacy Policy",
    lastUpdated: "Last Updated: May 20, 2026",
    intro: "This Privacy Policy explains how the UDF Manifesto Tracker (\"we\", \"our\", or \"us\") collects, uses, and protects your information when you log in using social accounts (Google, Facebook) to suggest status updates or add comments.",
    sec1Title: "1. Information We Collect",
    sec1Desc: "When you sign in to our platform, we only collect the basic profile information provided by the login provider:",
    sec1Item1: "Social Authentication Details (Google/Facebook): User profile metadata (full name, email address, and profile picture URL) authorized by your login permission.",
    sec2Title: "2. How We Use Your Information",
    sec2Desc: "Your details are used strictly to maintain clean content and prevent spam:",
    sec2Item1: "To display your name alongside any comments you post.",
    sec2Item2: "To associate your name with any suggested status changes you submit.",
    sec2Item3: "To prevent spam and enforce limits (maximum 3 status suggestions per user per week).",
    sec3Title: "3. Data Safety",
    sec3Desc: "Your login session is securely handled by Supabase using production-grade encryption. We do not sell, rent, or share your profile details with any third parties or political groups.",
    sec4Title: "4. Your Right to Delete Data",
    sec4Desc1: "You have the full right to delete your account and all associated data at any time.",
    sec4Desc2: "For step-by-step instructions on wiping all your suggested updates, comments, and votes from our database, please visit our:",
    sec4Link: "Data Deletion Page",
    sec5Title: "5. Contact Us",
    sec5Desc: "If you have any questions about this privacy policy, please contact us at:",
    acknowledgeBtn: "Acknowledge & Close"
  },
  ml: {
    backBtn: "തിരികെ ഡാഷ്‌ബോർഡിലേക്ക്",
    badge: "പ്രൈവസി പോളിസി",
    title: "പ്രൈവസി പോളിസി",
    lastUpdated: "അവസാനം പുതുക്കിയത്: മെയ് 20, 2026",
    intro: "നിങ്ങൾ ഗൂഗിൾ അല്ലെങ്കിൽ ഫേസ്ബുക്ക് ലോഗിൻ ഉപയോഗിച്ച് പ്രവേശിക്കുമ്പോൾ വിവരങ്ങൾ എങ്ങനെ കൈകാര്യം ചെയ്യുന്നുവെന്ന് ഈ പ്രൈവസി പോളിസി വ്യക്തമാക്കുന്നു.",
    sec1Title: "1. ശേഖരിക്കുന്ന വിവരങ്ങൾ",
    sec1Desc: "നിങ്ങൾ ഈ പ്ലാറ്റ്‌ഫോമിൽ പ്രവേശിക്കുമ്പോൾ നിങ്ങളുടെ ലോഗിൻ പ്രൊവൈഡർ വഴി താഴെ പറയുന്ന അടിസ്ഥാന വിവരങ്ങൾ മാത്രമേ ശേഖരിക്കാറുള്ളൂ:",
    sec1Item1: "ലോഗിൻ വിവരങ്ങൾ (ഗൂഗിൾ/ഫേസ്ബുക്ക്): നിങ്ങളുടെ ലോഗിൻ അനുമതി വഴി ലഭിക്കുന്ന പേര്, ഇമെയിൽ വിലാസം, പ്രൊഫൈൽ ചിത്രം എന്നിവ.",
    sec2Title: "2. ഈ വിവരങ്ങൾ എങ്ങനെ ഉപയോഗിക്കുന്നു",
    sec2Desc: "പ്ലാറ്റ്‌ഫോമിലെ ഉള്ളടക്കത്തിന്റെ വിശ്വാസ്യത നിലനിർത്താനും ദുരുപയോഗം തടയാനുമാണ് ഈ വിവരങ്ങൾ ഉപയോഗിക്കുന്നത്:",
    sec2Item1: "നിങ്ങൾ എഴുതുന്ന കമന്റുകൾക്ക് താഴെ നിങ്ങളുടെ പേര് കാണിക്കാൻ.",
    sec2Item2: "നിങ്ങൾ നിർദ്ദേശിക്കുന്ന മാറ്റങ്ങൾക്ക് ഒപ്പം നിങ്ങളുടെ പേര് ചേർക്കാൻ.",
    sec2Item3: "ദുരുപയോഗം തടയാൻ (ആഴ്ചയിൽ പരമാവധി 3 മാറ്റങ്ങൾ മാത്രമേ നിർദ്ദേശിക്കാൻ സാധിക്കൂ).",
    sec3Title: "3. ഡാറ്റ സുരക്ഷിതത്വം",
    sec3Desc: "നിങ്ങളുടെ ലോഗിൻ വിവരങ്ങൾ Supabase വഴി അതീവ സുരക്ഷിതമായി എൻക്രിപ്റ്റ് ചെയ്താണ് സൂക്ഷിക്കുന്നത്. ഞങ്ങൾ ഒരു കാരണവശാലും നിങ്ങളുടെ വിവരങ്ങൾ മറ്റാർക്കും കൈമാറില്ല.",
    sec4Title: "4. വിവരങ്ങൾ ഡിലീറ്റ് ചെയ്യാനുള്ള അവകാശം",
    sec4Desc1: "നിങ്ങളുടെ അക്കൗണ്ടും അതുമായി ബന്ധപ്പെട്ട എല്ലാ വിവരങ്ങളും എപ്പോൾ വേണമെങ്കിലും പൂർണ്ണമായി ഡിലീറ്റ് ചെയ്യാനുള്ള അവകാശം നിങ്ങൾക്കുണ്ട്.",
    sec4Desc2: "നിങ്ങൾ രേഖപ്പെടുത്തിയ കമന്റുകളും നിർദ്ദേശിച്ച മാറ്റങ്ങളും ഡാറ്റാബേസിൽ നിന്ന് പൂർണ്ണമായി ഡിലീറ്റ് ചെയ്യാൻ താഴെ കാണുന്ന ലിങ്ക് സന്ദർശിക്കുക:",
    sec4Link: "ഡാറ്റ ഡിലീഷൻ പേജ്",
    sec5Title: "5. ബന്ധപ്പെടാൻ",
    sec5Desc: "ഡാറ്റ സംരക്ഷണവുമായി ബന്ധപ്പെട്ട എന്തെങ്കിലും ചോദ്യങ്ങളുണ്ടെങ്കിൽ താഴെ കാണുന്ന ഇമെയിൽ വിലാസത്തിൽ ബന്ധപ്പെടാം:",
    acknowledgeBtn: "ശരി, മനസ്സിലായി"
  }
};

export default function PrivacyPolicyPage({ lang = "en" }) {
  const navigate = useNavigate();

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-12 animate-fade-in text-slate-700 leading-relaxed font-sans font-medium text-sm">
      {/* Header section */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-xs font-mono-tech font-bold text-slate-600 hover:text-slate-900 transition-all border-none bg-transparent cursor-pointer"
        >
          <FaArrowLeft className="text-slate-500 text-xs" />
          {t.backBtn}
        </button>
        <span className="text-[10px] font-mono-tech font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200/50 flex items-center gap-1.5">
          <FaShieldAlt className="text-navy-flag" /> {t.badge}
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-10 space-y-8">
        <div className="space-y-3 text-center">
          <h1 className="text-2xl md:text-3xl font-space font-bold text-slate-900">
            {t.title}
          </h1>
          <p className="text-xs text-slate-400 font-mono-tech">{t.lastUpdated}</p>
        </div>

        <p className="italic text-slate-500 bg-slate-50 border border-slate-200/50 p-4 rounded-xl">
          {t.intro}
        </p>

        {/* Sections */}
        <div className="space-y-6">
          <section className="space-y-2">
            <h2 className="text-base font-space font-bold text-slate-900 uppercase">{t.sec1Title}</h2>
            <p>{t.sec1Desc}</p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>{t.sec1Item1}</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-space font-bold text-slate-900 uppercase">{t.sec2Title}</h2>
            <p>{t.sec2Desc}</p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>{t.sec2Item1}</li>
              <li>{t.sec2Item2}</li>
              <li>{t.sec2Item3}</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-space font-bold text-slate-900 uppercase">{t.sec3Title}</h2>
            <p>{t.sec3Desc}</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-space font-bold text-slate-900 uppercase">{t.sec4Title}</h2>
            <p>{t.sec4Desc1}</p>
            <p>
              {t.sec4Desc2}{" "}
              <a href="/data-deletion" className="text-navy-flag font-bold hover:underline">
                {t.sec4Link}
              </a>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-space font-bold text-slate-900 uppercase">{t.sec5Title}</h2>
            <p>
              {t.sec5Desc}{" "}
              <a href="mailto:ridhaanasif@gmail.com" className="text-navy-flag font-bold hover:underline">
                ridhaanasif@gmail.com
              </a>.
            </p>
          </section>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-navy-flag hover:bg-navy-flag-dark text-white rounded-lg py-2.5 px-6 text-xs font-mono-tech font-bold uppercase transition-all cursor-pointer border-none"
          >
            {t.acknowledgeBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
