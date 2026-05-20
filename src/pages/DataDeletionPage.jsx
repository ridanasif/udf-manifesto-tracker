import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { FaArrowLeft, FaTrashAlt, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner";

const TRANSLATIONS = {
  en: {
    backBtn: "BACK TO DASHBOARD",
    badge: "DATA DELETION",
    title: "Data Deletion Instructions",
    subtitle: "Compliance with Meta Platforms Data Protection",
    intro: "According to Facebook Meta Developer Policies, we provide this page so users can easily delete all data collected through Facebook or Google login.",
    deleteBoxTitle: "Instantly Delete My Suggested Updates & Comments",
    deleteBoxDesc: "You are currently signed in as {identity}. Clicking below will instantly delete your comments, suggested updates, votes, and public profile record from our database and log you out.",
    deletingBtn: "Wiping Records...",
    deleteBtn: "Delete All My Data & Log Out",
    successMsg: "All records deleted! Signing out...",
    noUserText: "Please sign in to delete your data directly from this portal.",
    manualRevokeTitle: "How to Revoke Facebook Access Manually",
    manualRevokeStep1: "Go to your Facebook Profile -> Settings & Privacy -> Settings.",
    manualRevokeStep2: "Click on Apps and Websites in the left menu.",
    manualRevokeStep3: "Find UDF Manifesto Tracker and click Remove.",
    manualRevokeStep4: "Confirm the deletion and click Remove again.",
    supportTitle: "Request Manual Deletion",
    supportDesc: "If you want us to manually delete all your records, please send an email with your profile details to:",
    supportNote: "We will delete all your records within 48 hours of verification.",
    footerSecured: "We do not post to your profile or share your details. Read our privacy policy in the footer."
  },
  ml: {
    backBtn: "തിരികെ ഹോം പേജിലേക്ക്",
    badge: "ഡാറ്റ ഡിലീഷൻ",
    title: "ഡാറ്റ ഡിലീറ്റ് ചെയ്യാനുള്ള വിവരങ്ങൾ",
    subtitle: "മെറ്റാ പ്ലാറ്റ്‌ഫോംസ് ഡാറ്റാ പ്രൊട്ടക്ഷൻ നയം അനുസരിച്ച്",
    intro: "ഫേസ്ബുക്ക് മെറ്റാ ഡെവലപ്പർ പോളിസി അനുസരിച്ച്, ഗൂഗിൾ അല്ലെങ്കിൽ ഫേസ്ബുക്ക് ലോഗിൻ വഴി ശേഖരിച്ച വിവരങ്ങൾ ഉപയോക്താക്കൾക്ക് എളുപ്പത്തിൽ ഡിലീറ്റ് ചെയ്യാനുള്ള സൗകര്യം ഞങ്ങൾ ഇവിടെ ഒരുക്കിയിട്ടുണ്ട്.",
    deleteBoxTitle: "എന്റെ നിർദ്ദേശങ്ങളും കമന്റുകളും ഉടൻ ഡിലീറ്റ് ചെയ്യുക",
    deleteBoxDesc: "നിങ്ങൾ ഇപ്പോൾ {identity} എന്ന പേരിൽ ലോഗിൻ ചെയ്തിരിക്കുന്നു. താഴെയുള്ള ബട്ടണിൽ ക്ലിക്ക് ചെയ്താൽ നിങ്ങൾ രേഖപ്പെടുത്തിയ കമന്റുകളും നിർദ്ദേശങ്ങളും വോട്ടുകളും പൊതു പ്രൊഫൈൽ റെക്കോർഡും ഡാറ്റാബേസിൽ നിന്ന് ഡിലീറ്റ് ചെയ്യപ്പെടുകയും ലോഗ് ഔട്ട് ആവുകയും ചെയ്യും.",
    deletingBtn: "ഡിലീറ്റ് ചെയ്യുന്നു...",
    deleteBtn: "എന്റെ ഡാറ്റ മുഴുവൻ ഡിലീറ്റ് ചെയ്ത് ലോഗ് ഔട്ട് ചെയ്യുക",
    successMsg: "എല്ലാ വിവരങ്ങളും ഡിലീറ്റ് ചെയ്തു! ലോഗ് ഔട്ട് ചെയ്യുന്നു...",
    noUserText: "നിങ്ങളുടെ ഡാറ്റ ഡിലീറ്റ് ചെയ്യാൻ അക്കൗണ്ടിലേക്ക് ലോഗിൻ ചെയ്യുക.",
    manualRevokeTitle: "ഫേസ്ബുക്ക് ആക്സസ് എങ്ങനെ സ്വയം ഒഴിവാക്കാം",
    manualRevokeStep1: "നിങ്ങളുടെ ഫേസ്ബുക്ക് പ്രൊഫൈൽ -> സെറ്റിംഗ്സ് & പ്രൈവസി -> സെറ്റിംഗ്സ് തുറക്കുക.",
    manualRevokeStep2: "ഇടതുവശത്തെ മെനുവിൽ നിന്ന് ആപ്പുകൾ & വെബ്സൈറ്റുകൾ ക്ലിക്ക് ചെയ്യക്കുക.",
    manualRevokeStep3: "UDF Manifesto Tracker കണ്ടെത്തുക, തുടർന്ന് റിമൂവ് ചെയ്യുക.",
    manualRevokeStep4: "കൺഫേം ചെയ്ത് ഒരിക്കൽ കൂടി റിമൂവ് ചെയ്യുക.",
    supportTitle: "മറ്റ് സഹായങ്ങൾക്ക് ബന്ധപ്പെടുക",
    supportDesc: "നിങ്ങൾക്ക് അക്കൗണ്ടിലെ വിവരങ്ങൾ നേരിട്ട് ഡിലീറ്റ് ചെയ്യാൻ സാധിക്കുന്നില്ലെങ്കിൽ, നിങ്ങളുടെ പ്രൊഫൈൽ വിവരങ്ങൾ താഴെയുള്ള ഇമെയിലിലേക്ക് അയക്കുക:",
    supportNote: "നിങ്ങളുടെ അപേക്ഷ ലഭിച്ച് 48 മണിക്കൂറിനുള്ളിൽ ഡാറ്റ പൂർണ്ണമായി ഒഴിവാക്കുന്നതാണ്.",
    footerSecured: "ഞങ്ങൾ നിങ്ങളുടെ അനുവാദമില്ലാതെ പ്രൊഫൈലിൽ ഒന്നും പോസ്റ്റ് ചെയ്യുകയോ വിവരങ്ങൾ പങ്കിടുകയോ ഇല്ല. കൂടുതൽ വിവരങ്ങൾക്ക് പ്രൈവസി പോളിസി കാണുക."
  }
};

export default function DataDeletionPage({ user, onSignOut, lang = "en" }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const handleRequestDeletion = async () => {
    if (!user) return;
    setLoading(true);
    setErrorMsg("");
    setSuccess(false);

    try {
      // 1. Delete upvotes cast by this user on any updates.
      const { error: votesByUserErr } = await supabase
        .from("upvotes")
        .delete()
        .eq("user_id", user.id);
      if (votesByUserErr) throw votesByUserErr;

      // 2. Delete comments created by the user.
      const { error: commentsErr } = await supabase
        .from("comments")
        .delete()
        .eq("user_id", user.id);
      if (commentsErr) throw commentsErr;

      // 3. Delete updates suggested by the user. Upvotes on those updates cascade.
      const { error: updatesErr } = await supabase
        .from("updates")
        .delete()
        .eq("user_id", user.id);
      if (updatesErr) throw updatesErr;

      // 4. Delete the public profile record created for display/moderation.
      const { error: profileErr } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id);
      if (profileErr) throw profileErr;

      setSuccess(true);
      setTimeout(() => {
        if (onSignOut) onSignOut();
        navigate("/");
      }, 3000);

    } catch (err) {
      setErrorMsg(err.message || "Failed to submit data deletion request. Please contact moderator.");
    } finally {
      setLoading(false);
    }
  };

  const identityName = user ? (user.user_metadata?.full_name || user.email) : "";

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-12 animate-fade-in text-slate-700 leading-relaxed font-sans font-medium text-sm">
      {/* Header section */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-6">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-xs font-mono-tech font-bold text-slate-600 hover:text-slate-900 transition-all border-none bg-transparent cursor-pointer"
        >
          <FaArrowLeft className="text-slate-500 text-xs" />
          {t.backBtn}
        </button>
        <span className="text-[10px] font-mono-tech font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200/50 flex items-center gap-1.5">
          <FaTrashAlt className="text-rose-500" /> {t.badge}
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-10 space-y-8">
        
        <div className="space-y-3 text-center">
          <h1 className="text-2xl md:text-3xl font-space font-bold text-slate-900">
            {t.title}
          </h1>
          <p className="text-xs text-slate-400 font-mono-tech">{t.subtitle}</p>
        </div>

        <p className="bg-slate-50 border border-slate-200/50 p-4 rounded-xl">
          {t.intro}
        </p>

        {/* Dynamic Deletion Action for Logged In User */}
        {user ? (
          <div className="border border-rose-200 bg-rose-50/30 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-space font-bold text-rose-700 uppercase flex items-center gap-2">
              <FaExclamationTriangle className="text-rose-500 text-base" /> {t.deleteBoxTitle}
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              {t.deleteBoxDesc.replace("{identity}", identityName)}
            </p>

            {errorMsg && (
              <div role="alert" className="bg-rose-100 border border-rose-200 text-rose-700 rounded-lg p-3 text-xs">
                {errorMsg}
              </div>
            )}

            {success && (
              <div role="status" className="bg-green-100 border border-green-200 text-green-700 rounded-lg p-3 text-xs flex items-center gap-2">
                <FaCheckCircle className="text-green-600" /> {t.successMsg}
              </div>
            )}

            <button
              type="button"
              onClick={handleRequestDeletion}
              disabled={loading || success}
              aria-busy={loading}
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg py-2.5 px-6 text-xs font-mono-tech font-bold uppercase transition-all cursor-pointer border-none flex items-center gap-2 disabled:cursor-wait disabled:opacity-75"
            >
              {loading && <LoadingSpinner label={t.deletingBtn} />}
              {loading ? t.deletingBtn : t.deleteBtn}
            </button>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-center text-xs text-slate-500 font-space flex items-center justify-center gap-2 animate-fade-in">
            <FaInfoCircle className="text-slate-400 text-sm flex-shrink-0" />
            <span>{t.noUserText}</span>
          </div>
        )}

        {/* Standard Manual Instruction list for Meta reviewer */}
        <div className="space-y-6 pt-4 border-t border-slate-100">
          <section className="space-y-2">
            <h2 className="text-base font-space font-bold text-slate-900 uppercase">{t.manualRevokeTitle}</h2>
            <ol className="list-decimal list-inside pl-4 space-y-2">
              <li>{t.manualRevokeStep1}</li>
              <li>{t.manualRevokeStep2}</li>
              <li>{t.manualRevokeStep3}</li>
              <li>{t.manualRevokeStep4}</li>
            </ol>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-space font-bold text-slate-900 uppercase">{t.supportTitle}</h2>
            <p>
              {t.supportDesc}
            </p>
            <a href="mailto:ridhaanasif@gmail.com" className="text-navy-flag font-bold hover:underline">
              ridhaanasif@gmail.com
            </a>
            <p className="text-xs text-slate-400 mt-1">{t.supportNote}</p>
          </section>
        </div>

      </div>
    </div>
  );
}
