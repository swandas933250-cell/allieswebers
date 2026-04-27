/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { ArrowRight, Layout, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React, { useEffect, useState } from "react";

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loginWithGoogle, signUpWithEmail } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    // Only redirect if user is fully logged in and verified
    if (user && user.emailVerified) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error("Google signup error:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Sign-up window was closed before completion. Please try again.");
      } else if (err.code === 'auth/unauthorized-domain') {
        setError("This domain is not authorized for Firebase Authentication. Please check Firebase Console.");
      } else {
        setError("Google signup failed. Please try again.");
      }
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters.");
      }
      await signUpWithEmail(formData.email, formData.password, formData.name);
      setSuccess(true);
    } catch (err: any) {
      console.error("Signup error caught:", err);
      let message = err.message;
      
      // Handle Firebase specific error codes
      if (err.code === 'auth/email-already-in-use') {
        message = 'This email is already in use. Try logging in instead.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Password is too weak. Use at least 6 characters.';
      } else if (err.code === 'auth/operation-not-allowed') {
        message = 'Email/Password accounts are currently disabled. Please enable them in the Firebase Console.';
      } else if (err.code === 'auth/network-request-failed') {
        message = 'A network error occurred. Please check your connection.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        message = 'Sign-up window was closed. Please try again.';
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
            Create your<br />digital legacy.
          </h1>
          <p className="text-xl text-on-surface-variant font-body leading-relaxed">
            The ethereal architect's workspace. Start building the next generation of web experiences today.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="flex -space-x-4">
            {[4, 5, 6].map((i) => (
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
            Join elite designers
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
            <h2 className="text-3xl font-headline font-bold text-on-surface tracking-tight mb-2">Join the revolution</h2>
            <p className="text-on-surface-variant font-medium">Create your account to start building.</p>
          </header>

          {error && (
            <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-bold animate-shake">
              {error}
            </div>
          )}

          {success ? (
            <div className="p-6 rounded-2xl bg-surface border border-outline-variant text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 text-primary mx-auto flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-headline font-bold text-on-surface">Verify your email</h3>
              <p className="text-sm text-on-surface-variant">
                We've sent a verification link to <span className="font-bold text-on-surface">{formData.email}</span>. 
                Please check your inbox and verify your email to continue.
              </p>
              <Link 
                to="/login"
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-surface-container-high font-bold text-sm hover:bg-surface-container-highest transition-colors"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSignup}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-70">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Jane Doe"
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-low border-transparent focus:bg-surface-container-high transition-all text-sm outline-none border border-white/5 focus:border-primary/50 placeholder:text-on-surface-variant/30 font-medium"
                />
              </div>
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
                <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-70">Password</label>
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

            <button 
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-primary to-secondary text-background font-bold rounded-xl btn-primary-glow flex items-center justify-center gap-2 group transition-all disabled:opacity-70"
            >
              {loading ? "Creating account..." : "Sign Up"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          )}

          <footer className="space-y-8">
            <div className="flex items-center gap-4 before:h-px before:flex-1 before:bg-white/5 after:h-px after:flex-1 after:bg-white/5">
              <span className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-50">Or sign up with</span>
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
              Already have an account? 
              <Link to="/login" className="text-primary hover:text-secondary font-bold ml-2 transition-colors">Log In</Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
