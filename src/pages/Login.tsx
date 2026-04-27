/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { ArrowRight, Layout, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React, { useEffect, useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loginWithGoogle, signInWithEmail } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleGoogleLogin = async () => {
    setError("");
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
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmail(formData.email, formData.password);
    } catch (err: any) {
      console.error("Login error caught:", err);
      let message = err.message;
      
      // Handle Firebase specific error codes
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        message = 'Invalid email or password. Please try again.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (err.code === 'auth/user-disabled') {
        message = 'This account has been disabled.';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'Too many failed attempts. Please try again later.';
      } else if (err.code === 'auth/operation-not-allowed') {
        message = 'Email/Password sign-in is currently disabled. Please enable it in the Firebase Console.';
      } else if (err.code === 'auth/network-request-failed') {
        message = 'Network error detected. Please check your internet connection or disable adblockers (like uBlock Origin) and refresh the page.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        message = 'Sign-in window was closed. Please try again.';
      }
      
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background antialiased pt-20 lg:pt-0">
      <button 
        onClick={() => navigate(-1)}
        className="fixed top-8 left-8 p-1 text-on-surface-variant hover:text-primary transition-all z-50 group active:scale-95"
        aria-label="Go back"
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

      {/* Right side: Form */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex flex-col justify-center px-6 sm:px-12 lg:px-24 bg-background z-20 relative min-h-screen">
        <div className="lg:hidden flex items-center gap-2 mb-12">
          <Layout className="w-7 h-7 text-primary" />
          <span className="text-xl font-headline font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tight">
            Allieswebers
          </span>
        </div>

        <div className="max-w-md w-full mx-auto space-y-10">
          <header>
            <h2 className="text-3xl font-headline font-bold text-on-surface tracking-tight mb-2">Welcome back</h2>
            <p className="text-on-surface-variant font-medium">Enter your details to access your workspace.</p>
          </header>

          {error && (
            <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-bold animate-shake">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleEmailLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-70">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="designer@ethereal.com"
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-low border-transparent focus:bg-surface-container-high transition-all text-sm outline-none border border-white/5 focus:border-primary/50 placeholder:text-on-surface-variant/30 font-medium"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-70">Password</label>
                  <a href="#" className="text-xs font-bold text-primary hover:text-secondary transition-colors">Forgot Password?</a>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full h-12 px-4 pr-12 rounded-xl bg-surface-container-low border-transparent focus:bg-surface-container-high transition-all text-sm outline-none border border-white/5 focus:border-primary/50 placeholder:text-on-surface-variant/30 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer group w-fit">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-5 h-5 rounded border bg-surface-container-lowest border-white/10 peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-background rounded-sm scale-0 peer-checked:scale-100 transition-transform" />
              </div>
              <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">Remember me for 30 days</span>
            </label>

            <button 
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-primary to-secondary text-background font-bold rounded-xl btn-primary-glow flex items-center justify-center gap-2 group transition-all disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Log In"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <footer className="space-y-8">
            <div className="flex items-center gap-4 before:h-px before:flex-1 before:bg-white/5 after:h-px after:flex-1 after:bg-white/5">
              <span className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-50">Or continue with</span>
            </div>

            <div className="grid grid-cols-1">
              <button 
                onClick={handleGoogleLogin}
                className="h-12 flex items-center justify-center gap-3 rounded-xl bg-surface-container-low border border-white/5 hover:bg-surface-container transition-all font-bold text-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
            </div>

            <p className="text-center text-sm font-medium text-on-surface-variant">
              Don't have an account? 
              <Link to="/signup" className="text-primary hover:text-secondary font-bold ml-2 transition-colors">Create Account</Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
