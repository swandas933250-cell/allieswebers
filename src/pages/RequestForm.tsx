/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Zap, Component, Layout, Monitor, PanelsTopLeft, Columns, ArrowLeft, Loader2, CheckCircle2, ChevronDown } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React, { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { COUNTRY_CODES } from "../constants/countryCodes";

export default function RequestForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const selectedSolution = location.state?.selectedCategory || "";

  const [formData, setFormData] = useState({
    fullName: user?.displayName || "",
    email: user?.email || "",
    countryCode: "+91",
    mobile: "",
    businessType: selectedSolution.toLowerCase() || "",
    aesthetic: ""
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.displayName || "",
        email: prev.email || user.email || ""
      }));
    }
  }, [user]);

  const validate = () => {
    const newErrors: Record<string, boolean> = {};
    if (!formData.fullName.trim()) newErrors.fullName = true;
    if (!formData.email.trim() || !formData.email.includes("@")) newErrors.email = true;
    
    const mobileValue = formData.mobile.trim();
    if (!mobileValue) {
      newErrors.mobile = true;
    } else if (formData.countryCode === "+91" && mobileValue.length !== 10) {
      newErrors.mobile = true;
    }
    
    if (!formData.businessType) newErrors.businessType = true;
    
    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (!validate()) {
      if (formData.countryCode === "+91" && formData.mobile.trim().length !== 10) {
        setError("Indian mobile numbers must be exactly 10 digits.");
      } else {
        setError("Please rectify the highlighted architectural flaws.");
      }
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const requestData = {
        userId: user.uid,
        userName: formData.fullName.trim(),
        userEmail: formData.email.trim(),
        mobile: `${formData.countryCode} ${formData.mobile.trim()}`,
        businessType: formData.businessType.trim(),
        aesthetic: formData.aesthetic.trim() || "architectural",
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      console.log("Submitting request data:", requestData);
      
      await addDoc(collection(db, "requests"), requestData);
      
      setSubmitted(true);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err: any) {
      console.error("Submission failed with full error details:", {
        code: err.code,
        message: err.message,
        details: err.details,
        stack: err.stack
      });
      if (err.message?.includes("insufficient permissions")) {
        setError("Security block: Your request does not match architectural standards. Please check your details.");
      } else {
        setError("Transmission interrupted. Please attempt another sync.");
      }
    } finally {
      setLoading(false);
    }
  };

  const aesthetics = [
    { id: "minimal", name: "Minimal", desc: "Clean workspace", icon: <Monitor className="w-5 h-5 text-on-surface" /> },
    { id: "bold", name: "Bold", desc: "Vibrant art", icon: <PanelsTopLeft className="w-5 h-5 text-on-surface" /> },
    { id: "editorial", name: "Editorial", desc: "Magazine spread", icon: <Columns className="w-5 h-5 text-on-surface" /> },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-surface border border-outline-variant p-12 rounded-3xl text-center space-y-6 shadow-2xl"
        >
          <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-secondary" />
          </div>
          <h2 className="text-3xl font-headline font-bold">Request Received</h2>
          <p className="text-on-surface-variant leading-relaxed">
            Your architectural mission has been registered. Our designers are already analyzing your vision.
          </p>
          <p className="text-xs font-bold text-primary animate-pulse">Redirecting to your workspace...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden pt-32 lg:pt-0">
      <button 
        onClick={() => navigate(-1)}
        className="fixed top-8 left-8 p-1 text-on-surface-variant hover:text-primary transition-all z-50 group active:scale-95"
        aria-label="Go back"
      >
        <ArrowLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
      </button>

      {/* Decorative */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[120px] pointer-events-none" />

      <Link
        to="/"
        className="absolute top-8 left-1/2 -translate-x-1/2 text-2xl font-headline font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary flex items-center gap-2 group transition-all"
      >
        <Layout className="w-7 h-7 text-primary group-hover:rotate-12 transition-all" />
        Allieswebers
      </Link>

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 z-10">
        {/* Context Side */}
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8 }}
          className="lg:col-span-5 flex flex-col justify-center space-y-12 p-10 rounded-2xl bg-surface border border-outline-variant relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          
          <div>
            <h1 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface mb-6 leading-tight">
              Build Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Ethereal</span> Presence
            </h1>
            <p className="text-on-surface-variant font-medium leading-relaxed">
              {selectedSolution 
                ? `Great choice! You are interested in our "${selectedSolution}" expertise. Tell us about your vision, and our architects will begin preparing your tailored digital space.`
                : `Claim your free professional website. Tell us about your vision, and our architects will begin preparing your tailored digital space.`}
            </p>
          </div>

          <div className="space-y-8 pt-8 border-t border-white/10">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary border border-white/5 shadow-inner">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-on-surface">Rapid Deployment</h3>
                <p className="text-xs text-on-surface-variant mt-1">Get online faster with our optimized infrastructure.</p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-secondary border border-white/5 shadow-inner">
                <Component className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-on-surface">Universal Categories</h3>
                <p className="text-xs text-on-surface-variant mt-1">Access to our curated collection of high-end business sectors.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form Side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 rounded-2xl p-10 bg-surface border border-outline-variant shadow-3xl"
        >
          {/* Progress */}
          <div className="mb-10 space-y-3">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-[2px] text-on-surface-variant opacity-70">
              <span className="text-primary">Details</span>
              <span>Preferences</span>
              <span>Complete</span>
            </div>
            <div className="h-1 w-full bg-surface-container-low rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "33.3%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" 
              />
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-bold animate-shake">
              {error}
            </div>
          )}

          <form className="space-y-8" onSubmit={handleRequest}>
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-70">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({...formData, fullName: e.target.value});
                    if (fieldErrors.fullName) setFieldErrors(prev => ({...prev, fullName: false}));
                  }}
                  placeholder="Jane Doe"
                  className={`w-full h-12 px-6 rounded-full bg-surface-container-low focus:bg-surface-container-high transition-all text-sm outline-none border ${
                    fieldErrors.fullName ? 'border-error focus:border-error focus:ring-error/20' : 'border-white/10 focus:border-primary/50 focus:ring-primary/20'
                  } focus:ring-4 font-medium`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-70">Mobile Number</label>
                <div className={`flex items-center w-full gap-0 rounded-full bg-surface-container-low border ${
                  fieldErrors.mobile ? 'border-error ring-error/20' : 'border-white/10 focus-within:border-primary/50 focus-within:ring-primary/20'
                } focus-within:ring-4 transition-all overflow-hidden group`}>
                  <div className="relative w-24 flex-shrink-0 group-focus-within:bg-white/5 transition-colors">
                    <select 
                      value={formData.countryCode}
                      onChange={(e) => setFormData({...formData, countryCode: e.target.value})}
                      required
                      className="w-full h-12 pl-6 pr-6 bg-transparent border-transparent outline-none text-xs sm:text-sm font-bold appearance-none cursor-pointer transition-all"
                    >
                      {COUNTRY_CODES.map((country) => (
                        <option key={`${country.code}-${country.name}`} value={country.code}>
                          {country.code}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  </div>
                  <input 
                    type="tel" 
                    required
                    value={formData.mobile}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (formData.countryCode === "+91" && value.length > 10) return;
                      setFormData({...formData, mobile: value});
                      if (fieldErrors.mobile) setFieldErrors(prev => ({...prev, mobile: false}));
                    }}
                    maxLength={formData.countryCode === "+91" ? 10 : undefined}
                    placeholder="98765 43210"
                    className="flex-grow w-full min-w-0 h-12 px-5 bg-transparent border-transparent outline-none group-focus-within:bg-surface-container-high text-sm font-bold transition-colors border-l border-white/5"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-70">Email Address</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => {
                  setFormData({...formData, email: e.target.value});
                  if (fieldErrors.email) setFieldErrors(prev => ({...prev, email: false}));
                }}
                placeholder="jane@ethereal.co"
                className={`w-full h-12 px-6 rounded-full bg-surface-container-low focus:bg-surface-container-high transition-all text-sm outline-none border ${
                  fieldErrors.email ? 'border-error focus:border-error focus:ring-error/20' : 'border-white/10 focus:border-primary/50 focus:ring-primary/20'
                } focus:ring-4 font-medium`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-70">Business Type</label>
              <select 
                value={formData.businessType}
                onChange={(e) => {
                  setFormData({...formData, businessType: e.target.value});
                  if (fieldErrors.businessType) setFieldErrors(prev => ({...prev, businessType: false}));
                }}
                required
                className={`w-full h-12 px-6 rounded-full bg-surface-container-low focus:bg-surface-container-high transition-all text-sm outline-none border ${
                  fieldErrors.businessType ? 'border-error focus:border-error focus:ring-error/20' : 'border-white/10 focus:border-primary/50 focus:ring-primary/20'
                } focus:ring-4 font-medium appearance-none cursor-pointer`}
              >
                <option value="" disabled className="text-on-surface-variant/30">Select your industry</option>
                <option value="creative">Creative Portfolio</option>
                <option value="ecommerce">E-Commerce</option>
                <option value="agency">Agency / Studio</option>
                <option value="saas">SaaS / Tech</option>
                <option value="finance">Finance</option>
                <option value="legal">Legal</option>
                <option value="hospitality">Hospitality</option>
                <option value="architecture">Architecture</option>
                <option value="green tech">Green Tech</option>
                <option value="consulting">Consulting</option>
                <option value="medical">Medical</option>
                <option value="education">Education</option>
                <option value="restaurant">Restaurant</option>
              </select>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-4">
              <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-70">Preferred Aesthetic (Optional)</label>
              <div className="grid grid-cols-3 gap-4">
                {aesthetics.map((a) => (
                  <label key={a.id} className="relative group cursor-pointer">
                    <input 
                      type="radio" 
                      name="aesthetic" 
                      value={a.id} 
                      checked={formData.aesthetic === a.id}
                      onChange={(e) => setFormData({...formData, aesthetic: e.target.value})}
                      className="sr-only peer" 
                    />
                    <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-surface-container-low border border-white/5 group-hover:bg-surface-container-high transition-all peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                      {a.icon}
                      <span className="text-[10px] font-bold mt-2 uppercase tracking-wide">{a.name}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between">
              <button 
                type="button" 
                onClick={() => navigate("/")}
                className="text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="bg-gradient-to-r from-primary to-secondary text-background font-bold px-6 py-2.5 md:px-8 md:py-3.5 text-sm md:text-base rounded-xl btn-primary-glow flex items-center gap-2 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Request Website
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
