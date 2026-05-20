import React, { useState } from "react";
import { supabase } from "../supabase";
import { FaGoogle, FaFacebook, FaLock, FaUserCircle } from "react-icons/fa";

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (isSignUp) {
        // Register traditional account
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        });

        if (error) throw error;
        
        setSuccessMsg("Registration successful! You can now log in.");
        setIsSignUp(false);
      } else {
        // Log in traditional account
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        onAuthSuccess(data.user);
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.message || "An authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
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
      const { data, error } = await supabase.auth.signInWithOAuth({
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
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl overflow-hidden flex flex-col relative animate-slide-up">
        
        {/* Header Banner */}
        <div className="bg-navy-flag text-white px-6 py-4 flex items-center justify-between">
          <span className="font-space font-bold uppercase tracking-wider text-sm flex items-center gap-2">
            <FaLock className="text-white text-sm" />
            CITIZEN ACCOUNT
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

        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {/* Tabs */}
          <div className="grid grid-cols-2 border border-slate-200 rounded-lg p-0.5 mb-5 bg-slate-50">
            <button 
              onClick={() => { setIsSignUp(false); setErrorMsg(""); setSuccessMsg(""); }}
              className={`py-2 text-xs font-space font-bold uppercase rounded-md cursor-pointer border-none outline-none transition-all ${!isSignUp ? "bg-white text-navy-flag border border-slate-200/50" : "text-slate-500 hover:text-slate-800"}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setIsSignUp(true); setErrorMsg(""); setSuccessMsg(""); }}
              className={`py-2 text-xs font-space font-bold uppercase rounded-md cursor-pointer border-none outline-none transition-all ${isSignUp ? "bg-white text-navy-flag border border-slate-200/50" : "text-slate-500 hover:text-slate-800"}`}
            >
              Register
            </button>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-lg p-3 text-xs font-space font-medium mb-4 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0"></span>
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="bg-green-flag-light border border-green-flag/10 text-green-flag-dark rounded-lg p-3 text-xs font-space font-medium mb-4 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-flag mt-1.5 flex-shrink-0"></span>
              {successMsg}
            </div>
          )}

          {/* Traditional Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-[10px] font-mono-tech uppercase font-bold text-slate-400 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Enter your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:border-navy-flag/50 focus:bg-white text-sm font-sans"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-mono-tech uppercase font-bold text-slate-400 mb-1">Email Address</label>
              <input 
                type="email" 
                required
                placeholder="citizen@kerala.gov"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:border-navy-flag/50 focus:bg-white text-sm font-sans"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono-tech uppercase font-bold text-slate-400 mb-1">Password</label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:border-navy-flag/50 focus:bg-white text-sm font-sans"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-navy-flag hover:bg-navy-flag-dark text-white rounded-lg py-2.5 text-xs font-mono-tech font-bold uppercase tracking-wider transition-all cursor-pointer border-none mt-2"
            >
              {loading ? "Authenticating..." : isSignUp ? "Create Account" : "Access Account"}
            </button>
          </form>

          {/* Social Logins Action Section */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <span className="text-[10px] font-mono-tech font-bold text-slate-400 uppercase tracking-widest block mb-4">
              Or Sign In With
            </span>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={handleGoogleLogin}
                className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg text-xs font-space font-bold flex items-center justify-center gap-2 cursor-pointer bg-white transition-all"
              >
                <FaGoogle className="text-rose-500 text-sm" />
                Google
              </button>
              
              <button 
                type="button"
                onClick={handleFacebookLogin}
                className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg text-xs font-space font-bold flex items-center justify-center gap-2 cursor-pointer bg-white transition-all"
              >
                <FaFacebook className="text-blue-600 text-sm" />
                Facebook
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
