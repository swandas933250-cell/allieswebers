/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Phone, Mail, MapPin, Send, MessageSquare, ChevronDown, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { COUNTRY_CODES } from "../constants/countryCodes";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";

export default function Contact() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', mobileCode: '+91', mobileNumber: '', subject: '', message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject) {
      setError("Please select a subject.");
      return;
    }
    setError(null);
    
    // Validation
    const mobileValue = formData.mobileNumber.trim();
    if (!mobileValue) {
      setError("Mobile number is required.");
      return;
    }
    if (formData.mobileCode === "+91" && mobileValue.length !== 10) {
      setError("Indian mobile numbers must be exactly 10 digits.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        userId: user?.uid || null,
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: `${formData.mobileCode} ${formData.mobileNumber}`.trim(),
        subject: formData.subject,
        message: formData.message.trim(),
        status: 'new',
        createdAt: serverTimestamp()
      };
      await addDoc(collection(db, 'contacts'), payload);
      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Submission failed:", err);
      setError(err.message || "An error occurred while sending your message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      details: ["+91 9475467704", "+91 9332502401"],
      link: "tel:+919475467704"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      details: ["allieswebers@gmail.com"],
      link: "mailto:allieswebers@gmail.com"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Studio",
      details: ["Habra, North 24 parganas", "West Bengal, India"],
      link: "https://maps.app.goo.gl/L3r5eXn1Zpjjak8y6"
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-8 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-secondary/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Header & Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            <div>
              <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight text-on-surface leading-tight mb-6">
                Let's Build Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Digital Empire.</span>
              </h1>
              <p className="text-xl text-on-surface-variant max-w-lg leading-relaxed">
                Whether you have a specific vision or need creative direction, our architects are ready to design your ethereal presence.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
              {contactInfo.map((info, idx) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx + 0.5 }}
                  className="p-4 sm:p-6 rounded-2xl bg-surface border border-outline-variant hover:bg-surface-container transition-all group"
                >
                  <a 
                    href={info.link} 
                    target={info.title === "Studio" ? "_blank" : undefined}
                    rel={info.title === "Studio" ? "noopener noreferrer" : undefined}
                    className="p-3 rounded-xl bg-surface-container-high border border-white/5 w-fit text-primary group-hover:scale-110 transition-transform block"
                  >
                    {info.icon}
                  </a>
                  <h3 className="mt-4 font-headline font-bold text-lg text-on-surface">{info.title}</h3>
                  <div className="mt-2 space-y-1">
                    {info.details.map((detail, dIdx) => (
                      <a 
                        key={detail} 
                        href={info.title === "Call Us" ? `tel:${detail.replace(/\s+/g, '')}` : info.link}
                        target={info.title === "Studio" ? "_blank" : undefined}
                        rel={info.title === "Studio" ? "noopener noreferrer" : undefined}
                        className="block text-sm text-on-surface-variant font-medium hover:text-primary transition-colors cursor-pointer"
                      >
                        {detail}
                      </a>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <Link 
              to="/booking"
              className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-surface-container-low border border-outline-variant flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 hover:bg-surface-container-high transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shrink-0">
                <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div className="text-center sm:text-left">
                <h4 className="font-headline font-bold text-lg sm:text-xl text-on-surface">Live Consultation</h4>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-1">Book a 30-minute discovery call with our lead designer.</p>
              </div>
            </Link>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="p-6 sm:p-10 rounded-2xl sm:rounded-3xl bg-surface border border-outline-variant shadow-2xl relative overflow-hidden min-h-[500px] sm:min-h-[600px] flex items-center justify-center"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] -mr-16 -mt-16" />
            
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form 
                  key="contact-form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6 relative z-10 w-full" 
                  onSubmit={handleSubmit}
                >
                  {error && (
                    <div className="p-4 bg-error/10 border border-error/20 rounded-xl flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                      <p className="text-sm text-error">{error}</p>
                    </div>
                  )}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-70">Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="Enter name"
                        className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-white/5 focus:bg-surface-container transition-all outline-none focus:border-primary/50 text-sm font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-70">Email</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        placeholder="name@email.com"
                        className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-white/5 focus:bg-surface-container transition-all outline-none focus:border-primary/50 text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-70">Mobile No.</label>
                      <div className="flex gap-2">
                        <div className="relative w-32 flex-shrink-0">
                          <select 
                            required
                            value={formData.mobileCode}
                            onChange={e => setFormData({...formData, mobileCode: e.target.value})}
                            className="w-full h-12 pl-3 pr-8 rounded-xl bg-surface-container-low border border-white/5 focus:bg-surface-container transition-all outline-none focus:border-primary/50 text-sm font-medium appearance-none cursor-pointer"
                          >
                            {COUNTRY_CODES.map((country) => (
                              <option key={`${country.code}-${country.name}`} value={country.code}>
                                {country.code} ({country.name})
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                            <ChevronDown className="w-3 h-3" />
                          </div>
                        </div>
                        <input 
                          type="tel" 
                          required
                          value={formData.mobileNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            if (formData.mobileCode === "+91" && value.length > 10) return;
                            setFormData({...formData, mobileNumber: value});
                          }}
                          maxLength={formData.mobileCode === "+91" ? 10 : undefined}
                          placeholder="XXXXX XXXXX"
                          className="flex-grow h-12 px-4 rounded-xl bg-surface-container-low border border-white/5 focus:bg-surface-container transition-all outline-none focus:border-primary/50 text-sm font-medium"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-70">Subject</label>
                      <div className="relative">
                        <select 
                          required
                          value={formData.subject}
                          onChange={e => setFormData({...formData, subject: e.target.value})}
                          className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-white/5 focus:bg-surface-container transition-all outline-none focus:border-primary/50 text-sm font-medium appearance-none cursor-pointer"
                        >
                          <option value="">Select a subject</option>
                          <option value="New Project Inquiry">New Project Inquiry</option>
                          <option value="Support Request">Support Request</option>
                          <option value="Partnership Idea">Partnership Idea</option>
                          <option value="Other">Other</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-70">Message</label>
                    <textarea 
                      rows={4}
                      required
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      placeholder="Tell us about your project..."
                      className="w-full p-4 rounded-xl bg-surface-container-low border border-white/5 focus:bg-surface-container transition-all outline-none focus:border-primary/50 text-sm font-medium resize-none shadow-inner"
                    />
                  </div>

                  <button 
                    disabled={isSubmitting}
                    className="w-full h-14 bg-gradient-to-r from-primary to-secondary text-background font-bold rounded-xl btn-primary-glow flex items-center justify-center gap-3 transition-all active:scale-[0.98] hover:scale-[1.02] group overflow-hidden disabled:opacity-70 disabled:pointer-events-none"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      {isSubmitting ? "Connecting..." : "Initiate Connection"}
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      )}
                    </span>
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6 relative z-10"
                >
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-primary mx-auto border-4 border-primary/10">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">Connection Initiated!</h2>
                    <p className="text-on-surface-variant max-w-xs mx-auto">
                      Our architects have received your transmission. Expect a response within one business cycle.
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate("/")}
                    className="px-8 py-3 bg-surface-container-highest rounded-xl font-bold hover:bg-primary hover:text-background transition-all text-sm"
                  >
                    Go to Home
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
