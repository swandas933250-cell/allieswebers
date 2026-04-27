/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { ArrowRight, Layout, ArrowLeft } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React, { useEffect, useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loginWithGoogle } = useAuth();
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error("Google login error:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Sign-in window was closed before completion. Please try again.");
      } else if (err.code === 'auth/unauthorized-domain') {
        setError("This domain is not authorized for Firebase Authentication. Please add it in the Firebase Console.");
      } else {
        setError("Google login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background antialiased pt-20 lg:pt-0">
      <button 
        onClick={() => navigate("/")}
        className="fixed top-8 left-8 p-1 text-on-surface-variant hover:text-primary transition-all z-50 group active:scale-95"
        aria-label="Go home"
      >
        <ArrowLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
      </button>

      {/* Left side: Branding/Visual */}
      <div className="flex-1 hidden lg:flex flex-col relative overflow-hidden bg-surface-dim p-12 xl:p-24 justify-between">
        <div className="absolute inset-0 bg-ethereal-gradient mix-blend-overlay opacity-50" />
        <div className="absolute inset-0 backdrop-blur-[100px]" />
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 group">
            <Layout className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform" />
            <span className="text-2xl font-headline font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tight">
              Allieswebers
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-xl">
          <h1 className="text-5xl xl:text-7xl font-headline font-bold text-on-surface leading-[1.05] tracking-tight mb-8">
            Design without limits.<br />Build with precision.
          </h1>
          <p className="text-xl text-on-surface-variant font-body leading-relaxed">
            The ethereal architect's workspace. Join thousands of creators building the next generation of web experiences.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="flex -space-x-4">
            {[1, 2, 3].map((i) => (
              <img 
                key={i}
                src={`https://picsum.photos/seed/user_${i}/100/100`} 
                alt="User" 
                className="w-12 h-12 rounded-full border-2 border-surface-container-low shadow-xl"
                referrerPolicy="no-referrer"
              />
            ))}
            <div className="w-12 h-12 rounded-full border-2 border-surface-container-low bg-surface-container-high flex items-center justify-center text-xs font-bold text-on-surface">
              +2k
            </div>
          </div>
          <p className="text-sm font-medium text-on-surface-variant">
            Joined by elite designers
          </p>
        </div>
      </div>

      {/* Right side: Login Button */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex flex-col justify-center px-6 sm:px-12 lg:px-24 bg-background z-20 relative min-h-screen">
        <div className="lg:hidden flex items-center gap-2 mb-12">
          <Layout className="w-7 h-7 text-primary" />
          <span className="text-xl font-headline font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tight">
            Allieswebers
          </span>
        </div>

        <div className="max-w-md w-full mx-auto space-y-10">
          <header>
            <h2 className="text-4xl font-headline font-bold text-on-surface tracking-tight mb-4">Welcome back</h2>
            <p className="text-on-surface-variant font-medium text-lg italic leading-relaxed">
              "We are not just building websites. We are building identities. We are turning visions into something people can see, explore, and trust."
            </p>
          </header>

          {error && (
            <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-bold animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full h-14 flex items-center justify-center gap-4 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 hover:border-primary/50 transition-all font-bold text-base shadow-lg shadow-primary/5 group disabled:opacity-70"
            >
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {loading ? "Connecting..." : "Continue with Google"}
              {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-primary" />}
            </button>

            <p className="text-center text-xs text-on-surface-variant/60 leading-relaxed font-medium">
              By continued, you agree to our Terms of Service and Privacy Policy. Google accounts handle your identity verification securely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
