import { useCallback, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { FaLock, FaRegComments, FaArrowLeft } from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner";

const PAGE_TRANSLATIONS = {
  en: {
    backBtn: "BACK TO ALL PROMISES",
    badge: "COMMENTS SECTION",
    notFoundTitle: "Promise Not Found",
    notFoundDesc: "The comments page you are looking for could not be found.",
    goHome: "Go Home",
    writeLabel: "Write your comment:",
    textareaPlaceholder: "Provide details or discuss this promise...",
    postingBtn: "Posting...",
    addBtn: "Add Comment",
    loginRequired: "Log in using the Sign In button at the top to write comments.",
    sectionTitle: "Comments & Discussion",
    loading: "Loading comments...",
    emptyState: "No comments have been posted yet. Start the discussion!"
  },
  ml: {
    backBtn: "തിരികെ വാഗ്ദാനങ്ങളുടെ പട്ടികയിലേക്ക്",
    badge: "കമന്റുകൾ",
    notFoundTitle: "വാഗ്ദാനം കണ്ടെത്താനായില്ല",
    notFoundDesc: "നിങ്ങൾ തിരയുന്ന വാഗ്ദാനത്തിന്റെ കമന്റുകൾ ലഭ്യമല്ല.",
    goHome: "തിരികെ പോവുക",
    writeLabel: "കമന്റ് രേഖപ്പെടുത്തുക:",
    textareaPlaceholder: "ഈ വാഗ്ദാനത്തെക്കുറിച്ചുള്ള അഭിപ്രായങ്ങൾ പങ്കുവെക്കുക...",
    postingBtn: "രേഖപ്പെടുത്തുന്നു...",
    addBtn: "കമന്റ് ചേർക്കുക",
    loginRequired: "അഭിപ്രായങ്ങൾ രേഖപ്പെടുത്താനായി മുകളിൽ കാണുന്ന ലോഗിൻ ബട്ടൺ ഉപയോഗിച്ച് ലോഗിൻ ചെയ്യുക.",
    sectionTitle: "കമന്റുകളും ചർച്ചകളും",
    loading: "കമന്റുകൾ ലഭ്യമാക്കുന്നു...",
    emptyState: "കമന്റുകൾ ഒന്നും രേഖപ്പെടുത്തിയിട്ടില്ല. നിങ്ങളുടെ അഭിപ്രായം ആദ്യമായി പങ്കുവെക്കൂ!"
  }
};

export default function PromiseCommentsPage({ allPromises, user, lang = "en", t }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loadError, setLoadError] = useState("");

  const promise = allPromises.find(p => p.id === id);
  const pageT = PAGE_TRANSLATIONS[lang] || PAGE_TRANSLATIONS.en;

  const loadComments = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("promise_id", id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      console.error("Error loading comments:", err.message);
      setLoadError("Could not load comments right now.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (promise) {
      Promise.resolve().then(loadComments);
    }
  }, [promise, loadComments]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    const trimmedContent = commentContent.trim();
    if (!user || !trimmedContent) return;

    if (trimmedContent.length < 3 || trimmedContent.length > 1000) {
      setErrorMsg("Comments must be between 3 and 1000 characters.");
      return;
    }

    setErrorMsg("");
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from("comments")
        .insert({
          promise_id: id,
          user_id: user.id,
          user_name: user.user_metadata?.full_name || "User",
          content: trimmedContent
        });

      if (error) throw error;

      setCommentContent("");
      loadComments();
    } catch (err) {
      setErrorMsg(err.message || "Failed to post comment.");
    } finally {
      setSubmitting(false);
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
          className="mt-6 px-4 py-2 bg-navy-flag text-white text-xs font-mono-tech font-bold uppercase rounded-lg border-none cursor-pointer"
        >
          {pageT.goHome}
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

      {/* Unified Promise Card containing Embedded Comment Box at the bottom */}
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

        {/* Bottom Panel containing Department info and Embedded Comment Input Form */}
        <div className="pt-5 border-t border-slate-100 space-y-4">
          <div>
            <span className="block text-[9px] font-mono-tech uppercase font-bold text-slate-400">{t.department}</span>
            <span className="text-xs text-slate-800 font-bold font-space mt-1 block">{deptLabel || "TBD"}</span>
          </div>

          {/* Embedded Comment Field */}
          <div className="pt-2">
            {user ? (
              <form onSubmit={handleAddComment} className="space-y-3 bg-slate-50 p-4 border border-slate-200 rounded-xl">
                <label htmlFor="comment-content" className="block text-[10px] font-mono-tech uppercase font-bold text-slate-400">
                  {pageT.writeLabel}
                </label>
                
                {errorMsg && (
                  <div role="alert" className="bg-rose-50 border border-rose-100 text-rose-600 rounded-lg p-2 text-xs">
                    {errorMsg}
                  </div>
                )}

                <div className="flex flex-col md:flex-row gap-3 items-end">
                  <textarea
                    id="comment-content"
                    required
                    rows="2"
                    minLength="3"
                    maxLength="1000"
                    placeholder={pageT.textareaPlaceholder}
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs focus:outline-none focus:border-navy-flag/50 text-slate-800 font-sans"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    aria-busy={submitting}
                    className="w-full md:w-auto bg-navy-flag hover:bg-navy-flag-dark text-white rounded-lg py-2.5 px-5 text-xs font-mono-tech font-bold uppercase cursor-pointer border-none flex items-center justify-center gap-2 flex-shrink-0 transition-all disabled:cursor-wait disabled:opacity-75"
                  >
                    {submitting && <LoadingSpinner label={pageT.postingBtn} />}
                    {submitting ? pageT.postingBtn : pageT.addBtn}
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center text-xs text-slate-500 font-space font-medium flex items-center justify-center gap-1.5 animate-fade-in">
                <FaLock className="text-slate-400" /> {pageT.loginRequired}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Discussion List */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono-tech font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
          <FaRegComments className="text-navy-flag text-sm" /> {pageT.sectionTitle}
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
        ) : comments.length === 0 ? (
          <div className="text-slate-400 text-xs font-space italic p-8 bg-white border border-slate-200 rounded-2xl text-center animate-fade-in">
            {pageT.emptyState}
          </div>
        ) : (
          <div className="space-y-3.5 animate-fade-in">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white border border-slate-200 p-5 rounded-2xl">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-space font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-navy-flag"></span>
                    {comment.user_name}
                  </span>
                  <span className="text-slate-400 text-[10px] font-mono-tech font-bold bg-slate-50 px-2 py-0.5 rounded border border-slate-200/50">
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-sans font-medium">
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
