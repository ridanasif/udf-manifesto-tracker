import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { FaArrowLeft, FaTrashAlt, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

export default function DataDeletionPage({ user, onSignOut }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRequestDeletion = async () => {
    if (!user) return;
    setLoading(true);
    setErrorMsg("");
    setSuccess(false);

    try {
      // 1. Fetch all update IDs submitted by this user to clean dependent upvotes
      const { data: userUpdates, error: fetchUpdatesErr } = await supabase
        .from("updates")
        .select("id")
        .eq("user_id", user.id);
      
      if (fetchUpdatesErr) throw fetchUpdatesErr;

      const userUpdateIds = userUpdates ? userUpdates.map(u => u.id) : [];

      // 2. Cascade delete upvotes on updates suggested by this user
      if (userUpdateIds.length > 0) {
        const { error: votesOnUpdatesErr } = await supabase
          .from("upvotes")
          .delete()
          .in("update_id", userUpdateIds);
        if (votesOnUpdatesErr) throw votesOnUpdatesErr;
      }

      // 3. Delete upvotes cast BY this user on any updates
      const { error: votesByUserErr } = await supabase
        .from("upvotes")
        .delete()
        .eq("user_id", user.id);
      if (votesByUserErr) throw votesByUserErr;

      // 4. Delete comments created by the user
      const { error: commentsErr } = await supabase
        .from("comments")
        .delete()
        .eq("user_id", user.id);
      if (commentsErr) throw commentsErr;

      // 5. Delete updates suggested by the user
      const { error: updatesErr } = await supabase
        .from("updates")
        .delete()
        .eq("user_id", user.id);
      if (updatesErr) throw updatesErr;

      // 6. Delete user profile record
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

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-12 animate-fade-in">
      {/* Header section */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-xs font-mono-tech font-bold text-slate-600 hover:text-slate-900 transition-all border-none bg-transparent cursor-pointer"
        >
          <FaArrowLeft className="text-slate-500 text-xs" />
          BACK TO DASHBOARD
        </button>
        <span className="text-[10px] font-mono-tech font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200/50 flex items-center gap-1.5">
          <FaTrashAlt className="text-rose-500" /> DATA DELETION
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-10 space-y-8 text-slate-700 leading-relaxed font-sans font-medium text-sm">
        
        <div className="space-y-3 text-center">
          <h1 className="text-2xl md:text-3xl font-space font-bold text-slate-900">
            Data Deletion Instructions
          </h1>
          <p className="text-xs text-slate-400 font-mono-tech">Compliance with Meta Platforms Data Protection</p>
        </div>

        <p className="bg-slate-50 border border-slate-200/50 p-4 rounded-xl">
          According to Facebook Meta Developer Policies, we are required to provide a fully transparent workflow allowing citizens to delete all data gathered during login integrations or oauth verification scopes.
        </p>

        {/* Dynamic Deletion Action for Logged In User */}
        {user ? (
          <div className="border border-rose-200 bg-rose-50/30 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-space font-bold text-rose-700 uppercase flex items-center gap-2">
              <FaExclamationTriangle className="text-rose-500 text-base" /> Instantly Delete My Citizen Contributions
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              You are currently authenticated as <strong className="text-slate-800">{user.user_metadata?.full_name || user.email}</strong>. 
              Clicking the button below will immediately expunge all your suggested status updates, citizen comments, and votes from the database, and clear your login session.
            </p>

            {errorMsg && (
              <div className="bg-rose-100 border border-rose-200 text-rose-700 rounded-lg p-3 text-xs">
                {errorMsg}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-200 text-green-700 rounded-lg p-3 text-xs flex items-center gap-2">
                <FaCheckCircle className="text-green-600" /> All records expunged! Signing out and redirecting...
              </div>
            )}

            <button
              onClick={handleRequestDeletion}
              disabled={loading || success}
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg py-2.5 px-6 text-xs font-mono-tech font-bold uppercase transition-all cursor-pointer border-none flex items-center gap-2"
            >
              {loading ? "Wiping Records..." : "Expunge My Data & Deactivate Account"}
            </button>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-center text-xs text-slate-500 font-space">
            ℹ️ Log in via your citizen account to dynamically wipe your data directly from this portal.
          </div>
        )}

        {/* Standard Manual Instruction list for Meta reviewer */}
        <div className="space-y-6">
          <section className="space-y-2">
            <h2 className="text-base font-space font-bold text-slate-900 uppercase">How to Manually Revoke Facebook OAuth Access</h2>
            <p>If you signed in using Facebook and want to remove the UDF Manifesto Tracker application privileges from your account, execute these Meta-authorized steps:</p>
            <ol className="list-decimal list-inside pl-4 space-y-2">
              <li>Open your personal **Facebook Profile** &rarr; **Settings & Privacy** &rarr; **Settings**.</li>
              <li>Scroll down the left sidebar and click on **Apps and Websites**.</li>
              <li>Locate **UDF Manifesto Tracker** inside the list of authorized apps.</li>
              <li>Click the **Remove** button positioned next to the application title.</li>
              <li>Confirm the checkbox requesting to delete all public activity history on Facebook relating to the app, and click **Remove** again.</li>
            </ol>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-space font-bold text-slate-900 uppercase">Request Deletion via Support Ticket</h2>
            <p>
              If you do not have active credentials or want our database administrators to execute a full record wipe manually, send a detailed deletion request containing your username or oauth email to:
            </p>
            <a href="mailto:ridhaanasif@gmail.com" className="text-navy-flag font-bold hover:underline">
              ridhaanasif@gmail.com
            </a>
            <p className="text-xs text-slate-400 mt-1">We commit to executing complete database sanitizations within 48 business hours of verification.</p>
          </section>
        </div>

      </div>
    </div>
  );
}
