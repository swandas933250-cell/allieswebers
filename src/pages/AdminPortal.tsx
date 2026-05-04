/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { 
  Database, 
  Users, 
  MessageSquare, 
  Settings, 
  Search, 
  Filter, 
  ChevronRight, 
  MoreVertical, 
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Loader2,
  ArrowUpRight,
  TrendingUp,
  Layout,
  RefreshCw
} from "lucide-react";
import { useState, useEffect } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { collection, query, onSnapshot, orderBy, Timestamp, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

interface ProjectRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  mobile: string;
  businessType: string;
  aesthetic: string;
  status: 'pending' | 'approved' | 'in progress' | 'completed' | 'rejected';
  createdAt: Timestamp;
}

interface Booking {
  id: string;
  userId: string;
  name: string;
  email: string;
  mobile: string;
  category: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Timestamp;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  mobile: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'archived';
  createdAt: Timestamp;
}

export default function AdminPortal() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'requests' | 'bookings' | 'contacts'>('requests');
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);

    const reqQ = query(collection(db, "requests"), orderBy("createdAt", "desc"));
    const bookQ = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const contQ = query(collection(db, "contacts"), orderBy("createdAt", "desc"));

    let resolvedCount = 0;
    const checkLoading = () => {
      resolvedCount++;
      if (resolvedCount === 3) setLoading(false);
    };

    const unsubscribeReq = onSnapshot(reqQ, (snapshot) => {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProjectRequest)));
      checkLoading();
    }, (error) => {
      console.error("Error watching requests metadata:", error);
      checkLoading();
    });

    const unsubscribeBook = onSnapshot(bookQ, (snapshot) => {
      setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking)));
      checkLoading();
    }, (error) => {
      console.error("Error watching bookings metadata:", error);
      checkLoading();
    });

    const unsubscribeCont = onSnapshot(contQ, (snapshot) => {
      setContacts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Contact)));
      checkLoading();
    }, (error) => {
      console.error("Error watching contacts metadata:", error);
      checkLoading();
    });

    return () => {
      unsubscribeReq();
      unsubscribeBook();
      unsubscribeCont();
    };
  }, [isAdmin]);

  const updateRequestStatus = async (requestId: string, newStatus: ProjectRequest['status']) => {
    setUpdatingId(requestId);
    try {
      const docRef = doc(db, "requests", requestId);
      await updateDoc(docRef, { 
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      setRequests(requests.map(r => r.id === requestId ? { ...r, status: newStatus } : r));
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: Booking['status']) => {
    setUpdatingId(bookingId);
    try {
      const docRef = doc(db, "bookings", bookingId);
      await updateDoc(docRef, { status: newStatus });
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    } catch (error) {
      console.error("Failed to update booking status", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const updateContactStatus = async (contactId: string, newStatus: Contact['status']) => {
    setUpdatingId(contactId);
    try {
      const docRef = doc(db, "contacts", contactId);
      await updateDoc(docRef, { status: newStatus });
      setContacts(contacts.map(c => c.id === contactId ? { ...c, status: newStatus } : c));
    } catch (error) {
      console.error("Failed to update contact status", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteEntry = async (collectionName: string, docId: string) => {
    if (!window.confirm(`Are you sure you want to delete this ${collectionName.slice(0, -1)}?`)) return;
    
    setUpdatingId(docId);
    try {
      await deleteDoc(doc(db, collectionName, docId));
      if (collectionName === "requests") setRequests(requests.filter(r => r.id !== docId));
      if (collectionName === "bookings") setBookings(bookings.filter(b => b.id !== docId));
      if (collectionName === "contacts") setContacts(contacts.filter(c => c.id !== docId));
    } catch (error) {
      console.error(`Failed to delete from ${collectionName}`, error);
    } finally {
      setUpdatingId(null);
    }
  };

  const getFilteredData = () => {
    if (activeTab === 'requests') {
      return requests.filter(req => {
        const matchesSearch = 
          req.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.businessType?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || req.status === statusFilter;
        return matchesSearch && matchesStatus;
      });
    } else if (activeTab === 'bookings') {
      return bookings.filter(book => {
        const matchesSearch = 
          book.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.category?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || book.status === statusFilter;
        return matchesSearch && matchesStatus;
      });
    } else {
      return contacts.filter(cont => {
        const matchesSearch = 
          cont.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cont.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cont.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cont.message?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || cont.status === statusFilter;
        return matchesSearch && matchesStatus;
      });
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
      case 'new': return { color: 'text-primary bg-primary/10 border-primary/20', icon: <Clock className="w-3 h-3" /> };
      case 'approved':
      case 'confirmed':
      case 'read': return { color: 'text-secondary bg-secondary/10 border-secondary/20', icon: <CheckCircle2 className="w-3 h-3" /> };
      case 'in progress': return { color: 'text-tertiary bg-tertiary/10 border-tertiary/20', icon: <TrendingUp className="w-3 h-3" /> };
      case 'completed': return { color: 'text-green-400 bg-green-400/10 border-green-400/20', icon: <CheckCircle2 className="w-3 h-3" /> };
      case 'rejected':
      case 'cancelled':
      case 'archived': return { color: 'text-rose-400 bg-rose-400/10 border-rose-400/20', icon: <XCircle className="w-3 h-3" /> };
      default: return { color: 'text-on-surface-variant bg-surface-container border-white/5', icon: <AlertCircle className="w-3 h-3" /> };
    }
  };

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const filteredData = getFilteredData();

  return (
    <div className="min-h-screen bg-background text-on-surface pt-32 pb-24 px-8 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-secondary/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 w-full space-y-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-white/5">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-primary">
              <Database className="w-6 h-6" />
              <span className="text-xs font-black uppercase tracking-[4px]">Administrator</span>
            </div>
            <h1 className="font-headline text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Center.</span>
            </h1>
            <p className="text-on-surface-variant max-w-xl">
              Allieswebers project nerve center. Manage architectural requests and track global missions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full md:w-auto">
            <div className="p-3 sm:p-4 rounded-2xl bg-surface border border-outline-variant flex items-center gap-4 shadow-xl">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                <Users className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="pr-2 sm:pr-4">
                <p className="text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wider">Requests</p>
                <p className="text-xl sm:text-2xl font-headline font-black">{requests.length}</p>
              </div>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-surface border border-outline-variant flex items-center gap-4 shadow-xl">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-tertiary/20 flex items-center justify-center text-tertiary shrink-0">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="pr-2 sm:pr-4">
                <p className="text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wider">Bookings</p>
                <p className="text-xl sm:text-2xl font-headline font-black">{bookings.length}</p>
              </div>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-surface border border-outline-variant flex items-center gap-4 shadow-xl">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary shrink-0">
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="pr-2 sm:pr-4">
                <p className="text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wider">Contacts</p>
                <p className="text-xl sm:text-2xl font-headline font-black">{contacts.length}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-1 p-1 bg-surface-container rounded-2xl border border-white/5 w-fit max-w-full overflow-x-hidden">
          <button 
            onClick={() => { setActiveTab('requests'); setStatusFilter('all'); }}
            className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'requests' ? 'bg-primary text-background shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Requests
          </button>
          <button 
            onClick={() => { setActiveTab('bookings'); setStatusFilter('all'); }}
            className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'bookings' ? 'bg-primary text-background shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Bookings
          </button>
          <button 
            onClick={() => { setActiveTab('contacts'); setStatusFilter('all'); }}
            className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'contacts' ? 'bg-primary text-background shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Contacts
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main List */}
          <div className="lg:col-span-4 space-y-6">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-surface rounded-2xl border border-outline-variant shadow-lg">
              <div className="relative w-full md:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-surface-container border border-white/5 focus:border-primary/50 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant pr-2">
                  <Filter className="w-4 h-4" />
                  Filter Status:
                </div>
                {['all', 
                  ...(activeTab === 'requests' ? ['pending', 'approved', 'in progress', 'completed', 'rejected'] : 
                     activeTab === 'bookings' ? ['pending', 'confirmed', 'cancelled'] : 
                     ['new', 'read', 'archived'])
                ].map((status) => (
                  <button 
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
                      statusFilter === status 
                        ? "bg-primary text-background border-primary shadow-lg shadow-primary/20" 
                        : "bg-surface-container border-white/5 text-on-surface-variant hover:text-on-surface hover:border-white/10"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="bg-surface rounded-3xl border border-outline-variant overflow-hidden shadow-2xl">
              {loading ? (
                <div className="p-24 flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <p className="text-on-surface-variant font-bold animate-pulse uppercase tracking-[2px] text-xs">Synchronizing Database...</p>
                </div>
              ) : filteredData.length === 0 ? (
                <div className="p-24 flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant/20">
                    <Database className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold">No {activeTab} found</h3>
                  <p className="text-on-surface-variant max-w-sm">No entries match your current filters or architectural search query.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container/50 border-b border-white/5">
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Info / Date</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">User Entity</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Details</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-center">Current Status</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredData.map((item: any) => {
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
                        const displayType = typeMap[item.businessType?.toLowerCase() || ""] || item.businessType;

                        return (
                        <motion.tr 
                          key={item.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="group border-b border-white/5 transition-all"
                        >
                          <td className="p-6">
                            <div className="space-y-1">
                              <p className="text-xs font-mono font-bold opacity-30 select-all">{item.id.slice(0, 8)}...</p>
                              <p className="text-sm font-medium">{item.createdAt?.toDate().toLocaleDateString()}</p>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant font-black text-xs border border-white/5">
                                {(item.userName || item.name || "U").charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-sm tracking-tight">{item.userName || item.name}</p>
                                <p className="text-xs text-on-surface-variant font-mono">{item.userEmail || item.email}</p>
                                <p className="text-[10px] text-primary font-bold mt-1">{item.mobile}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="space-y-1">
                              {activeTab === 'requests' && (
                                <>
                                  <div className="flex items-center gap-2">
                                    <Layout className="w-3.5 h-3.5 text-secondary" />
                                    <span className="font-headline font-black text-xs uppercase tracking-wider">{displayType}</span>
                                  </div>
                                  <p className="text-xs text-on-surface-variant">Aesthetic: <span className="text-on-surface capitalize font-medium">{item.aesthetic || "None"}</span></p>
                                </>
                              )}
                              {activeTab === 'bookings' && (
                                <>
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5 text-secondary" />
                                    <span className="font-headline font-black text-xs uppercase tracking-wider">{item.category}</span>
                                  </div>
                                  <p className="text-xs text-on-surface-variant">{item.date} at {item.time}</p>
                                </>
                              )}
                              {activeTab === 'contacts' && (
                                <>
                                  <p className="font-bold text-xs uppercase tracking-wider text-secondary">{item.subject}</p>
                                  <p className="text-xs text-on-surface-variant line-clamp-1 max-w-[200px]">{item.message}</p>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="p-6 text-center">
                            <div className="flex justify-center">
                              <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[2px] flex items-center gap-2 ${getStatusConfig(item.status).color}`}>
                                {updatingId === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : getStatusConfig(item.status).icon}
                                {item.status}
                              </div>
                            </div>
                          </td>
                          <td className="p-6 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-100 transition-all">
                              <div className="relative group/menu">
                                <button className="p-2 rounded-lg bg-surface-container border border-white/5 transition-all text-on-surface-variant">
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                                
                                <div className="absolute right-0 top-full mt-2 w-48 py-2 rounded-xl bg-surface-container-high border border-outline-variant shadow-2xl z-50 invisible group-hover/menu:visible opacity-0 group-hover/menu:opacity-100 transition-all translate-y-2 group-hover/menu:translate-y-0">
                                  <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Change Status</div>
                                  
                                  {activeTab === 'requests' && (
                                    <>
                                      <button onClick={() => updateRequestStatus(item.id, 'approved')} className="w-full text-left px-4 py-2 text-sm hover:bg-secondary/10 hover:text-secondary transition-all">Mark Approved</button>
                                      <button onClick={() => updateRequestStatus(item.id, 'in progress')} className="w-full text-left px-4 py-2 text-sm hover:bg-tertiary/10 hover:text-tertiary transition-all">Set In Progress</button>
                                      <button onClick={() => updateRequestStatus(item.id, 'completed')} className="w-full text-left px-4 py-2 text-sm hover:bg-green-400/10 hover:text-green-400 transition-all">Mark Completed</button>
                                      <button onClick={() => updateRequestStatus(item.id, 'rejected')} className="w-full text-left px-4 py-2 text-sm hover:bg-rose-400/10 hover:text-rose-400 transition-all">Reject Request</button>
                                    </>
                                  )}

                                  {activeTab === 'bookings' && (
                                    <>
                                      <button onClick={() => updateBookingStatus(item.id, 'confirmed')} className="w-full text-left px-4 py-2 text-sm hover:bg-secondary/10 hover:text-secondary transition-all">Confirm Booking</button>
                                      <button onClick={() => updateBookingStatus(item.id, 'cancelled')} className="w-full text-left px-4 py-2 text-sm hover:bg-rose-400/10 hover:text-rose-400 transition-all">Cancel Booking</button>
                                    </>
                                  )}

                                  {activeTab === 'contacts' && (
                                    <>
                                      <button onClick={() => updateContactStatus(item.id, 'read')} className="w-full text-left px-4 py-2 text-sm hover:bg-secondary/10 hover:text-secondary transition-all">Mark as Read</button>
                                      <button onClick={() => updateContactStatus(item.id, 'archived')} className="w-full text-left px-4 py-2 text-sm hover:bg-rose-400/10 hover:text-rose-400 transition-all">Archive</button>
                                    </>
                                  )}

                                  <div className="h-px bg-white/5 my-1" />
                                  <button onClick={() => deleteEntry(activeTab, item.id)} className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/10 transition-all">Delete Entry</button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 right-8 z-[100] md:hidden">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setLoading(true);
            window.location.reload();
          }}
          className="w-16 h-16 rounded-full bg-primary text-background shadow-2xl flex items-center justify-center border-4 border-background group"
        >
          <RefreshCw className={`w-8 h-8 ${loading ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>
    </div>
  );
}
