/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { Plus, Check, MoreHorizontal, Rocket, Clock, MessageSquare, ChevronRight, User as UserIcon, Phone, Mail, Lock, LogIn, Loader2, AlertCircle, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { collection, query, where, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

interface ProjectRequest {
  id: string;
  businessType: string;
  aesthetic: string;
  status: string;
  createdAt: Timestamp;
  mobile: string;
  userName: string;
  userEmail: string;
}

interface Booking {
  id: string;
  category: string;
  date: string;
  time: string;
  status: string;
  createdAt: Timestamp;
}

interface UserContact {
  id: string;
  subject: string;
  message: string;
  status: string;
  createdAt: Timestamp;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [contacts, setContacts] = useState<UserContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || authLoading) {
      if (!authLoading) setLoading(false);
      return;
    }

    setLoading(true);

    const reqQ = query(
      collection(db, "requests"),
      where("userId", "==", user.uid)
    );
    const bookQ = query(
      collection(db, "bookings"),
      where("userId", "==", user.uid)
    );
    const contQ = query(
      collection(db, "contacts"),
      where("userId", "==", user.uid)
    );

    let resolvedCount = 0;
    const checkLoading = () => {
      resolvedCount++;
      if (resolvedCount === 3) setLoading(false);
    };

    const sortDocs = (docs: any[]) => {
      return docs.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
    };

    const unsubscribeReq = onSnapshot(reqQ, (snapshot) => {
      setRequests(sortDocs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProjectRequest))));
      checkLoading();
    }, (err) => {
      console.error("Error watching requests:", err);
      checkLoading();
    });

    const unsubscribeBook = onSnapshot(bookQ, (snapshot) => {
      setBookings(sortDocs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking))));
      checkLoading();
    }, (err) => {
      console.error("Error watching bookings:", err);
      checkLoading();
    });

    const unsubscribeCont = onSnapshot(contQ, (snapshot) => {
      setContacts(sortDocs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserContact))));
      checkLoading();
    }, (err) => {
      console.error("Error watching contacts:", err);
      checkLoading();
    });

    return () => {
      unsubscribeReq();
      unsubscribeBook();
      unsubscribeCont();
    };
  }, [user, authLoading]);

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return "Just now";
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'text-primary bg-primary/10 border-primary/20';
      case 'approved': return 'text-secondary bg-secondary/10 border-secondary/20';
      case 'in progress': return 'text-tertiary bg-tertiary/10 border-tertiary/20';
      default: return 'text-on-surface-variant bg-surface-container-high border-white/5';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-32 pb-24 px-8 max-w-7xl mx-auto w-full min-h-screen flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full p-12 rounded-2xl bg-surface border border-outline-variant text-center space-y-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
          
          <div className="mx-auto w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center text-primary mb-6">
            <Lock className="w-10 h-10" />
          </div>
          
          <div className="space-y-3">
            <h2 className="font-headline text-3xl font-bold tracking-tight">Access Restricted</h2>
            <p className="text-on-surface-variant leading-relaxed">
              Please sign in to your Allieswebers account to view your active projects and architectural blueprints.
            </p>
          </div>

          <div className="pt-4">
            <Link 
              to="/login"
              className="w-full py-4 rounded-xl bg-primary text-background font-bold text-center flex items-center justify-center gap-2 btn-primary-glow group"
            >
              Sign In to Your Workspace
              <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const latestRequest = requests[0];
  const hasAnything = requests.length > 0 || bookings.length > 0 || contacts.length > 0;

  return (
    <div className="pt-32 pb-24 px-8 max-w-7xl mx-auto w-full min-h-screen space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-white/5">
        <div>
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{user?.displayName?.split(' ')[0] || "Architect"}</span>
          </h1>
          <p className="text-on-surface-variant mt-2">Here's a look at your current project landscape.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            to="/booking"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-surface border border-outline-variant font-bold text-sm tracking-wide hover:bg-surface-bright transition-all"
          >
            <Clock className="w-5 h-5" />
            Book Call
          </Link>
          <Link 
            to="/templates"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-background font-bold text-sm tracking-wide shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            New Project
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left main area */}
        <div className="lg:col-span-2 space-y-12">
          {hasAnything ? (
            <>
              {/* All Requests List */}
              {requests.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h2 className="font-headline text-xl font-bold">Architectural Missions</h2>
                    <span className="text-xs text-on-surface-variant font-mono">{requests.length} Active</span>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {requests.map((req) => {
                      // Map legacy specific names to simple categories
                      const typeMap: Record<string, string> = {
                        "zenith wealth management": "finance",
                        "lexington corporate law": "legal",
                        "ethereal island retreat": "hospitality",
                        "form & function studio": "architecture",
                        "solaris green energy": "green tech",
                        "neon pulse agency": "creative",
                        "strategy nexus consulting": "consulting",
                        "vitality integrated care": "medical",
                        "scholar portal elite": "education",
                        "culinary canvas": "restaurant"
                      };
                      const displayType = typeMap[req.businessType?.toLowerCase() || ""] || req.businessType;
                      
                      return (
                        <motion.div 
                          key={req.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-surface rounded-2xl overflow-hidden border border-outline-variant flex group transition-all hover:bg-surface-container p-6 items-center justify-between"
                        >
                          <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-xl bg-surface-container-high flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner">
                              <FileText className="w-7 h-7" />
                            </div>
                            <div>
                              <h3 className="font-headline font-bold text-lg capitalize">{displayType} Identity</h3>
                              <p className="text-xs text-on-surface-variant flex items-center gap-2 mt-1">
                                <span className="font-mono">{formatDate(req.createdAt)}</span>
                                <span className="opacity-30">•</span>
                                <span className="opacity-70">Aesthetic: {req.aesthetic || "Not specified"}</span>
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${getStatusColor(req.status)}`}>
                              {req.status}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Bookings List */}
              {bookings.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h2 className="font-headline text-xl font-bold">Strategical Sessions</h2>
                    <span className="text-xs text-on-surface-variant font-mono">{bookings.length} Booked</span>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {bookings.map((booking) => (
                      <motion.div 
                        key={booking.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-surface rounded-2xl overflow-hidden border border-outline-variant flex group transition-all hover:bg-surface-container p-6 items-center justify-between"
                      >
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 rounded-xl bg-surface-container-high flex items-center justify-center text-secondary group-hover:scale-110 transition-transform shadow-inner">
                            <Clock className="w-7 h-7" />
                          </div>
                          <div>
                            <h3 className="font-headline font-bold text-lg capitalize">{booking.category} Session</h3>
                            <p className="text-xs text-on-surface-variant flex items-center gap-2 mt-1">
                              <span className="font-mono">{booking.date} at {booking.time}</span>
                              <span className="opacity-30">•</span>
                              <span className="opacity-70 italic">Verified Submission</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* Contacts List */}
              {contacts.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h2 className="font-headline text-xl font-bold">Direct Transmissions</h2>
                    <span className="text-xs text-on-surface-variant font-mono">{contacts.length} Messages</span>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {contacts.map((contact) => (
                      <motion.div 
                        key={contact.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-surface rounded-2xl overflow-hidden border border-outline-variant flex group transition-all hover:bg-surface-container p-6 items-center justify-between"
                      >
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 rounded-xl bg-surface-container-high flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform shadow-inner">
                            <MessageSquare className="w-7 h-7" />
                          </div>
                          <div>
                            <h3 className="font-headline font-bold text-lg">{contact.subject}</h3>
                            <p className="text-xs text-on-surface-variant line-clamp-1 mt-1 opacity-70">
                              {contact.message}
                            </p>
                            <p className="text-[9px] uppercase tracking-tighter opacity-40 mt-1 font-black">Received {formatDate(contact.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${
                            contact.status === 'new' ? 'text-primary bg-primary/10 border-primary/20' : 'text-on-surface-variant bg-surface-container-high border-white/5'
                          }`}>
                            {contact.status}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}
            </>
          ) : (
            <div className="bg-surface rounded-3xl p-16 border border-outline-variant border-dashed flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant/20 mb-2">
                <Plus className="w-10 h-10" />
              </div>
              <div>
                <h3 className="font-headline text-2xl font-bold text-on-surface">No projects found</h3>
                <p className="text-on-surface-variant max-w-sm mx-auto mt-2 leading-relaxed">
                  You haven't initiated any architectural missions yet. Start your journey by requesting your first website.
                </p>
              </div>
              <Link 
                to="/templates"
                className="px-8 py-4 bg-primary text-background font-bold rounded-xl btn-primary-glow"
              >
                Explore Categories
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar area */}
        <div className="space-y-8">
          {/* Profile settings */}
          <section className="bg-surface rounded-2xl p-8 border border-outline-variant space-y-6">
            <h3 className="font-headline text-lg font-bold flex items-center gap-3">
              <UserIcon className="w-5 h-5 text-on-surface-variant" />
              Your Architectural Identity
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-70">Email Address</label>
                <div className="flex items-center justify-between p-4 bg-surface-container-highest rounded-xl border border-white/5 group hover:border-primary/30 transition-all">
                  <span className="text-sm truncate font-mono">{user?.email}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-70">Full Name</label>
                <div className="flex items-center justify-between p-4 bg-surface-container-highest rounded-xl border border-white/5 group hover:border-primary/30 transition-all">
                  <span className="text-sm truncate">{user?.displayName}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Activity Placeholder */}
          <section className="bg-surface rounded-2xl p-8 border border-outline-variant space-y-6 flex-grow">
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-lg font-bold">Status Feed</h3>
              <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Full Logs</button>
            </div>
            <div className="space-y-8 relative">
              <div className="absolute top-2 bottom-2 left-1 w-0.5 bg-white/5" />
              {requests.length > 0 ? (
                requests.slice(0, 3).map((req, i) => (
                  <div key={req.id} className="relative pl-8 flex flex-col gap-1">
                    <div className={`absolute top-1.5 left-0 w-2.5 h-2.5 rounded-full border-2 border-surface-container-low z-10 ${i === 0 ? "bg-primary shadow-[0_0_10px_rgba(99,102,241,1)]" : "bg-white/10"}`} />
                    <p className={`text-sm font-bold leading-tight ${i === 0 ? "text-on-surface" : "text-on-surface-variant"}`}>
                      Request for {req.businessType} website received
                    </p>
                    <p className="text-[10px] text-on-surface-variant opacity-70">{formatDate(req.createdAt)} • System</p>
                  </div>
                ))
              ) : (
                <div className="relative pl-8 flex flex-col gap-1 grayscale opacity-50">
                  <div className="absolute top-1.5 left-0 w-2.5 h-2.5 rounded-full border-2 border-surface-container-low z-10 bg-white/10" />
                  <p className="text-sm font-bold leading-tight text-on-surface-variant">No activity yet</p>
                  <p className="text-[10px] text-on-surface-variant opacity-70">Timeline start</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
