/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, User, Briefcase, ChevronRight, ChevronLeft, CheckCircle2, Video, ChevronDown, Loader2, AlertCircle } from "lucide-react";
import { COUNTRY_CODES } from "../constants/countryCodes";
import { useAuth } from "../context/AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

export default function Booking() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    mobileCode: "+91",
    mobileNumber: "",
    category: "eCommerce Architecture"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const timeSlots = ["09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM", "05:30 PM"];
  
  // Dynamic calendar generation
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  const monthName = viewDate.toLocaleString("default", { month: "long" });
  const year = viewDate.getFullYear();

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && 
           viewDate.getMonth() === today.getMonth() && 
           viewDate.getFullYear() === today.getFullYear();
  };

  const isPast = (day: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateToCheck = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    return dateToCheck < today;
  };

  const isTimePast = (time: string) => {
    if (!selectedDate || !isToday(selectedDate)) return false;
    
    const now = new Date();
    const [timeStr, modifier] = time.split(' ');
    let [hours, minutes] = timeStr.split(':').map(Number);
    
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    
    const slotTime = new Date();
    slotTime.setHours(hours, minutes, 0, 0);
    
    // Add 15 min buffer to give the user time to complete booking
    const buffer = 15;
    slotTime.setMinutes(slotTime.getMinutes() - buffer);
    
    return now > slotTime;
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

    setError(null);
    
    // Validation
    const mobileValue = bookingData.mobileNumber.trim();
    if (!mobileValue) {
      setError("Mobile number is required.");
      return;
    }
    if (bookingData.mobileCode === "+91" && mobileValue.length !== 10) {
      setError("Mobile number must be exactly 10 digits for India (+91).");
      return;
    }

    setIsSubmitting(true);
    
    // Check if auth session is actually active
    if (!auth.currentUser) {
      setError("Your session has expired. Please sign out and sign in again.");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        name: bookingData.name.trim(),
        email: bookingData.email.trim(),
        mobile: `${bookingData.mobileCode} ${bookingData.mobileNumber}`.trim(),
        category: bookingData.category,
        date: `${monthName} ${selectedDate}, ${year}`,
        time: selectedTime,
        status: 'pending',
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      };
      
      console.log("Attempting to submit booking payload:", payload);
      
      await addDoc(collection(db, 'bookings'), payload);
      setStep(4);
    } catch (err: any) {
      console.error("Booking error:", err);
      // More descriptive error for the user
      const msg = err.code === 'permission-denied' 
        ? "Database Permission Denied. Please ensure your Firestore Database is initialized and in 'Test Mode'." 
        : err.message || "An error occurred while confirming booking.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-8 relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-1 h-64 bg-gradient-to-b from-transparent via-primary/20 to-transparent" />

      <div className="max-w-4xl mx-auto relative z-10 text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20 mb-6 inline-block">
            Discovery Session
          </span>
          <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tight mb-4">Book Your Architect.</h1>
          <p className="text-on-surface-variant max-w-xl mx-auto">
            Schedule a 30-minute discovery call to discuss your vision, requirements, and project scope.
          </p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="bg-surface border border-outline-variant rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
          
          {/* Progress Sidebar */}
          <div className="lg:col-span-4 bg-surface-container-low p-10 border-r border-outline-variant flex flex-col justify-between">
            <div className="space-y-8">
              {[
                { s: 1, name: "Select Date", icon: <Calendar className="w-5 h-5" /> },
                { s: 2, name: "Pick a Slot", icon: <Clock className="w-5 h-5" /> },
                { s: 3, name: "Your Info", icon: <User className="w-5 h-5" /> },
              ].map((item) => (
                <div 
                  key={item.s}
                  className={`flex items-center gap-4 transition-all duration-500 ${
                    step >= item.s ? "text-primary opacity-100" : "text-on-surface-variant opacity-40"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all ${
                    step === item.s ? "bg-primary text-background border-primary scale-110 shadow-lg shadow-primary/20" : 
                    step > item.s ? "bg-primary/20 border-primary/30 text-primary" : "border-outline-variant"
                  }`}>
                    {step > item.s ? <CheckCircle2 className="w-6 h-6" /> : item.icon}
                  </div>
                  <span className="font-bold text-sm uppercase tracking-wider">{item.name}</span>
                </div>
              ))}
            </div>

            <div className="pt-10 border-t border-outline-variant/30 space-y-4">
              <div className="flex items-center gap-3 text-on-surface-variant">
                <Video className="w-5 h-5 opacity-60" />
                <span className="text-sm font-medium">Google Meet / Zoom</span>
              </div>
              <div className="flex items-center gap-3 text-on-surface-variant">
                <Clock className="w-5 h-5 opacity-60" />
                <span className="text-sm font-medium">30 Minutes duration</span>
              </div>
            </div>
          </div>

          {/* Main Booking Content */}
          <div className="lg:col-span-8 p-10 bg-surface relative">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full flex flex-col"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="font-headline text-2xl font-bold">Choose a Date</h2>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={handlePrevMonth}
                        className="p-2 rounded-lg hover:bg-surface-container-high transition-all"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="font-bold uppercase tracking-widest text-sm min-w-[120px] text-center">
                        {monthName} {year}
                      </span>
                      <button 
                        onClick={handleNextMonth}
                        className="p-2 rounded-lg hover:bg-surface-container-high transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-2 mb-4 text-center">
                    {days.map(d => <div key={d} className="text-[10px] font-black uppercase text-on-surface-variant/40 py-2">{d}</div>)}
                  </div>

                  <div className="grid grid-cols-7 gap-2 flex-grow">
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const date = i + 1;
                      const active = selectedDate === date;
                      const today = isToday(date);
                      const past = isPast(date);
                      
                      return (
                        <button
                          key={date}
                          disabled={past}
                          onClick={() => setSelectedDate(date)}
                          className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all border ${
                            active 
                              ? "bg-primary text-background border-primary shadow-lg shadow-primary/20 scale-105" 
                              : today
                                ? "bg-primary/10 text-primary border-primary/20"
                                : past
                                  ? "opacity-20 cursor-not-allowed"
                                  : "bg-surface-container-low border-white/5 hover:border-primary/50"
                          }`}
                        >
                          {date}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-10 flex justify-end">
                    <button 
                      onClick={() => setStep(2)}
                      disabled={!selectedDate}
                      className="px-8 py-3 bg-on-surface text-surface rounded-xl font-bold flex items-center gap-2 hover:bg-primary hover:text-background transition-all disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Next Step <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full flex flex-col"
                >
                  <h2 className="font-headline text-2xl font-bold mb-8">Available Time Slots</h2>
                  <div className="grid grid-cols-2 gap-4 flex-grow">
                    {timeSlots.map((time) => {
                      const timeExpired = isTimePast(time);
                      return (
                        <button
                          key={time}
                          disabled={timeExpired}
                          onClick={() => setSelectedTime(time)}
                          className={`p-6 rounded-2xl flex items-center justify-between border transition-all ${
                            selectedTime === time
                              ? "bg-primary text-background border-primary shadow-lg shadow-primary/20 scale-105"
                              : timeExpired
                                ? "opacity-20 cursor-not-allowed border-white/5 bg-surface-container-low"
                                : "bg-surface-container-low border-white/5 hover:border-primary/50 group"
                          }`}
                        >
                          <span className={`${timeExpired ? "line-through opacity-50" : "font-bold"}`}>{time}</span>
                          <Clock className={`w-5 h-5 ${selectedTime === time ? "opacity-100" : timeExpired ? "opacity-10" : "opacity-20 group-hover:opacity-100"}`} />
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-10 flex justify-between">
                    <button 
                      onClick={() => setStep(1)}
                      className="px-8 py-3 text-on-surface-variant font-bold hover:text-on-surface transition-all"
                    >
                      Back
                    </button>
                    <button 
                      onClick={() => setStep(3)}
                      disabled={!selectedTime}
                      className="px-8 py-3 bg-on-surface text-surface rounded-xl font-bold flex items-center gap-2 hover:bg-primary hover:text-background transition-all disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="font-headline text-2xl font-bold mb-8">Confirm Details</h2>
                  <form onSubmit={handleBooking} className="space-y-6">
                    {error && (
                      <div className="p-4 bg-error/10 border border-error/20 rounded-xl flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                        <p className="text-sm text-error text-left">{error}</p>
                      </div>
                    )}
                    <div className="space-y-4 text-left">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-70">Name</label>
                          <input 
                            required 
                            type="text" 
                            placeholder="Your full name" 
                            value={bookingData.name}
                            onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                            className="w-full h-12 px-6 rounded-full bg-surface-container-low border border-white/5 focus:border-primary/50 outline-none transition-all" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-70">Email</label>
                          <input 
                            required 
                            type="email" 
                            placeholder="email@address.com" 
                            value={bookingData.email}
                            onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                            className="w-full h-12 px-6 rounded-full bg-surface-container-low border border-white/5 focus:border-primary/50 outline-none transition-all" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-70">Mobile No.</label>
                          <div className="flex items-center w-full gap-0 rounded-full bg-surface-container-low border border-white/10 focus-within:border-primary/50 transition-all overflow-hidden group">
                            <div className="relative w-24 flex-shrink-0 group-focus-within:bg-white/5 transition-colors">
                              <select 
                                required
                                value={bookingData.mobileCode}
                                onChange={e => setBookingData({...bookingData, mobileCode: e.target.value})}
                                className="w-full h-12 pl-6 pr-6 bg-transparent border-transparent outline-none appearance-none cursor-pointer text-xs transition-all font-medium"
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
                            placeholder="Phone number"
                            value={bookingData.mobileNumber}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              if (bookingData.mobileCode === "+91" && value.length > 10) return;
                              setBookingData({...bookingData, mobileNumber: value});
                            }}
                            maxLength={bookingData.mobileCode === "+91" ? 10 : undefined}
                            className="flex-grow w-full min-w-0 h-12 px-5 bg-transparent border-transparent outline-none text-sm transition-colors font-medium border-l border-white/5"
                          />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-70">Project Category</label>
                          <select 
                            required 
                            value={bookingData.category}
                            onChange={(e) => setBookingData({...bookingData, category: e.target.value})}
                            className="w-full h-12 px-6 rounded-full bg-surface-container-low border border-white/5 focus:border-primary/50 outline-none appearance-none cursor-pointer transition-all"
                          >
                            <option>eCommerce Architecture</option>
                            <option>Corporate Identity</option>
                            <option>Creative Portfolio</option>
                            <option>Web Application</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="bg-surface-container-high p-6 rounded-2xl border border-white/5 space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-on-surface-variant">Date</span>
                        <span className="font-bold">{monthName} {selectedDate}, {year}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-on-surface-variant">Time</span>
                        <span className="font-bold">{selectedTime} (GMT +5:30)</span>
                      </div>
                    </div>

                    <div className="pt-6 flex justify-between">
                      <button 
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-8 py-3 text-on-surface-variant font-bold hover:text-on-surface transition-all"
                      >
                        Back
                      </button>
                      <button 
                        disabled={isSubmitting}
                        className="px-10 h-14 bg-primary text-background rounded-xl font-bold hover:scale-[1.02] shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                      >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                        {isSubmitting ? "Confirming..." : "Confirm Booking"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-6 py-6"
                >
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-2 p-4 border-4 border-primary/10">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-headline text-3xl font-extrabold tracking-tight">Booking Confirmed!</h2>
                    <p className="text-on-surface-variant text-sm">Your discovery session has been secured.</p>
                  </div>

                  <div className="w-full max-w-sm bg-surface-container-high rounded-2xl border border-white/5 overflow-hidden">
                    <div className="p-4 bg-primary/5 border-b border-white/5">
                      <p className="text-[10px] uppercase font-black tracking-widest text-primary">Summary Details</p>
                    </div>
                    <div className="p-6 space-y-4 text-left">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[9px] uppercase font-bold text-on-surface-variant opacity-60">Category</p>
                          <p className="text-sm font-bold truncate">{bookingData.category}</p>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-[9px] uppercase font-bold text-on-surface-variant opacity-60">Status</p>
                          <p className="text-sm font-bold text-primary">Scheduled</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[9px] uppercase font-bold text-on-surface-variant opacity-60">Date</p>
                          <p className="text-sm font-bold">{monthName} {selectedDate}, {year}</p>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-[9px] uppercase font-bold text-on-surface-variant opacity-60">Time</p>
                          <p className="text-sm font-bold">{selectedTime}</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-white/5 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-on-surface-variant opacity-60">NAME</span>
                          <span className="text-xs font-semibold">{bookingData.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-on-surface-variant opacity-60">EMAIL</span>
                          <span className="text-xs font-semibold">{bookingData.email}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-on-surface-variant opacity-60">MOBILE</span>
                          <span className="text-xs font-semibold">{bookingData.mobileCode} {bookingData.mobileNumber}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 w-full max-w-sm">
                    <button 
                      onClick={() => navigate('/dashboard')}
                      className="w-full py-4 bg-primary text-background rounded-xl font-bold hover:scale-[1.02] shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2"
                    >
                      Go to Dashboard <ChevronRight className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => navigate('/')}
                      className="w-full mt-3 py-3 text-on-surface-variant text-xs font-bold hover:text-on-surface transition-all underline underline-offset-4"
                    >
                      Return to Home
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
