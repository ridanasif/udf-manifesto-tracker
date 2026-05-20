import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaShieldAlt } from "react-icons/fa";

export default function PrivacyPolicyPage({ lang }) {
  const navigate = useNavigate();

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
          <FaShieldAlt className="text-navy-flag" /> PRIVACY POLICY
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-10 space-y-8 text-slate-700 leading-relaxed font-sans font-medium text-sm">
        <div className="space-y-3 text-center">
          <h1 className="text-2xl md:text-3xl font-space font-bold text-slate-900">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-400 font-mono-tech">Last Updated: May 20, 2026</p>
        </div>

        <p className="italic text-slate-500 bg-slate-50 border border-slate-200/50 p-4 rounded-xl">
          This Privacy Policy explains how the UDF Manifesto Tracker ("we", "our", or "us") collects, uses, and protects your information when you register an account or use social logins (Google, Facebook) to suggest political promise status updates or deliberate on comments.
        </p>

        {/* Sections */}
        <div className="space-y-6">
          <section className="space-y-2">
            <h2 className="text-base font-space font-bold text-slate-900 uppercase">1. Information We Collect</h2>
            <p>When you access our platform, we collect two main categories of information:</p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li><strong>Traditional Sign-Up Details:</strong> Name, email address, and hashed passwords provided during manual registration.</li>
              <li><strong>Social Authentication Details (Google/Facebook):</strong> User profile metadata (full name, email, and avatar picture URL) as authorized by the OAuth permission scopes.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-space font-bold text-slate-900 uppercase">2. How We Use Your Information</h2>
            <p>Your details are processed strictly to establish public transparency and prevent tracking spam:</p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>To associate status suggestion edits and source validation links with a verified citizen name.</li>
              <li>To attribute public comments within the citizen deliberation forum to a single human user.</li>
              <li>To calculate anti-spam rate limiting (maximum 3 updates per user per week).</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-space font-bold text-slate-900 uppercase">3. Data Retention & Third-Party Services</h2>
            <p>
              Your credentials and sessions are securely stored inside our Supabase database cluster using production-grade Postgres encryption. We do not sell, rent, or lease your profile information to political parties, advertising agencies, or marketing companies.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-space font-bold text-slate-900 uppercase">4. User Rights & Data Deletion Requests</h2>
            <p>
              Under global data protection guidelines (including GDPR and CCPA), you reserve the absolute right to terminate your account and erase all transaction history. 
            </p>
            <p>
              For detailed, step-by-step instructions on erasing your database records or removing Facebook OAuth permissions, please visit our dedicated page:{" "}
              <a href="/data-deletion" className="text-navy-flag font-bold hover:underline">
                Data Deletion Instructions Page
              </a>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-space font-bold text-slate-900 uppercase">5. Updates & Contact Information</h2>
            <p>
              We may revise this policy periodically. If you have any inquiries regarding data protection or platform operations, please contact our community moderator at:{" "}
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
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
