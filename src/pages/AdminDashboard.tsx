/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MoreHorizontal, 
  Search, 
  Filter, 
  ChevronDown,
  ArrowUpDown,
  Mail,
  Phone,
  Calendar,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  XCircle,
  TrendingUp,
  Layout
} from "lucide-react";
import { collection, query, getDocs, orderBy, updateDoc, doc, Timestamp, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

interface ProjectRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  mobile: string;
  businessType: string;
  aesthetic: string;
  status: string;
  createdAt: Timestamp;
}

export default function AdminDashboard() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    inProgress: requests.filter(r => r.status === 'in progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
  };

  useEffect(() => {
    fetchRequests();
  }, [user, isAdmin]);

  const fetchRequests = async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const q = query(collection(db, "requests"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedRequests: ProjectRequest[] = [];
      querySnapshot.forEach((doc) => {
        fetchedRequests.push({ id: doc.id, ...doc.data() } as ProjectRequest);
      });
      setRequests(fetchedRequests);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    setUpdatingId(requestId);
    try {
      const requestRef = doc(db, "requests", requestId);
      await updateDoc(requestRef, { 
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      
      // Update local state
      setRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      ));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Check permissions.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.businessType?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = statusFilter === "all" || req.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'approved': return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'in progress': return 'bg-primary/10 text-primary border-primary/20';
      case 'completed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'rejected': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-surface-container-high text-on-surface-variant border-white/5';
    }
  };

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <RefreshCw className="w-10 h-10 text-primary animate-spin" />
    </div>
  );

  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-8 max-w-7xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[3px]">
            <ShieldCheck className="w-4 h-4" />
            Central Command
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight">
            Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Portal</span>
          </h1>
          <p className="text-on-surface-variant max-w-lg">Manage all incoming architectural missions and deployment requests.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={fetchRequests}
            className="p-3 rounded-xl bg-surface border border-outline-variant hover:bg-surface-container transition-all text-on-surface-variant active:scale-95"
            title="Refresh Requests"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Missions", value: stats.total, icon: <Layout />, color: "primary" },
          { label: "Pending Review", value: stats.pending, icon: <Clock />, color: "amber-500" },
          { label: "Active Deploy", value: stats.inProgress, icon: <TrendingUp />, color: "secondary" },
          { label: "Completed", value: stats.completed, icon: <CheckCircle2 />, color: "emerald-500" },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-surface border border-outline-variant relative overflow-hidden group shadow-lg"
          >
            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant opacity-60 mb-2">{stat.label}</p>
            <p className="text-4xl font-headline font-bold text-on-surface">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Table Interface */}
      <section className="bg-surface rounded-3xl border border-outline-variant overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-surface-container-low flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant opacity-50" />
            <input 
              type="text" 
              placeholder="Search by name, email or industry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-surface-container-highest border border-white/5 rounded-xl outline-none focus:border-primary/50 text-sm transition-all"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Filter className="w-4 h-4 text-on-surface-variant opacity-50 hidden md:block" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-12 px-4 rounded-xl bg-surface-container-highest border border-white/5 outline-none text-sm font-bold appearance-none cursor-pointer pr-10 relative"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-white/5">
                <th className="p-6 text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-50">Identity</th>
                <th className="p-6 text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-50">Mission Path</th>
                <th className="p-6 text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-50">Timeline</th>
                <th className="p-6 text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-50">Status Control</th>
                <th className="p-6 text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-50">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {filteredRequests.map((req) => (
                  <motion.tr 
                    key={req.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-surface-container-lowest transition-colors group"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-surface-container-high border border-white/10 flex items-center justify-center text-primary font-bold">
                          {req.userName?.[0] || "?"}
                        </div>
                        <div>
                          <p className="font-bold text-on-surface leading-tight">{req.userName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Mail className="w-3 h-3 text-on-surface-variant opacity-40" />
                            <span className="text-xs text-on-surface-variant truncate max-w-[150px]">{req.userEmail}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div>
                        <p className="text-sm font-black capitalize tracking-tight">{req.businessType}</p>
                        <p className="text-xs text-on-surface-variant mt-1 italic">Style: {req.aesthetic || "Architectural"}</p>
                        <div className="flex items-center gap-2 mt-2">
                           <Phone className="w-3 h-3 text-secondary opacity-50" />
                           <span className="text-[10px] font-mono text-on-surface-variant">{req.mobile}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs text-on-surface font-medium">
                          <Calendar className="w-3 h-3 text-primary opacity-40" />
                          {req.createdAt?.toDate().toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-on-surface-variant opacity-60">
                          <Clock className="w-3 h-3" />
                          {req.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="relative inline-block w-full">
                        <select 
                          value={req.status}
                          disabled={updatingId === req.id}
                          onChange={(e) => handleStatusUpdate(req.id, e.target.value)}
                          className={`w-full h-10 pl-4 pr-10 rounded-lg border text-[10px] font-black uppercase tracking-widest appearance-none cursor-pointer transition-all outline-none ${getStatusStyle(req.status)} ${updatingId === req.id ? "opacity-50" : ""}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="in progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          {updatingId === req.id ? (
                            <RefreshCw className="w-3 h-3 animate-spin opacity-50" />
                          ) : (
                            <ChevronDown className="w-3 h-3 opacity-50" />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex items-center gap-2">
                        <a 
                          href={`mailto:${req.userEmail}?subject=Regarding your ${req.businessType} project request`}
                          className="p-2 rounded-lg bg-surface-container-high border border-white/5 text-on-surface-variant hover:text-primary transition-all active:scale-90"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                        <button className="p-2 rounded-lg bg-surface-container-high border border-white/5 text-on-surface-variant hover:text-secondary transition-all active:scale-90">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filteredRequests.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <Search className="w-12 h-12" />
                      <p className="font-bold text-xl uppercase tracking-widest">No transmissions found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Cards Layout */}
        <div className="md:hidden divide-y divide-white/5">
          <AnimatePresence>
            {filteredRequests.map((req) => (
              <motion.div 
                key={req.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 space-y-6"
              >
                {/* Header: User Info & Status */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high border border-white/10 flex items-center justify-center text-primary font-bold">
                      {req.userName?.[0] || "?"}
                    </div>
                    <div>
                      <p className="font-bold text-on-surface leading-tight">{req.userName}</p>
                      <p className="text-xs text-on-surface-variant opacity-60">{req.userEmail}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusStyle(req.status)}`}>
                    {req.status}
                  </div>
                </div>

                {/* Body: Mission Info */}
                <div className="grid grid-cols-2 gap-4 bg-surface-container-low p-4 rounded-xl border border-white/5">
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-40 mb-1">Mission</p>
                    <p className="text-sm font-bold text-on-surface capitalize truncate">{req.businessType}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-40 mb-1">Style</p>
                    <p className="text-sm font-bold text-on-surface capitalize truncate">{req.aesthetic || "Normal"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-40 mb-1">Timeline</p>
                    <p className="text-xs font-mono text-on-surface-variant">{req.createdAt?.toDate().toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-40 mb-1">Mobile</p>
                    <p className="text-xs font-mono text-on-surface-variant">{req.mobile}</p>
                  </div>
                </div>

                {/* Actions: Dedicated Touch Buttons */}
                <div className="space-y-4">
                  <p className="text-[10px] uppercase font-black tracking-widest text-center text-on-surface-variant opacity-50">Quick Missions Control</p>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => handleStatusUpdate(req.id, 'approved')}
                      disabled={updatingId === req.id || req.status === 'approved'}
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all active:scale-95 ${req.status === 'approved' ? 'bg-secondary/20 border-secondary text-secondary' : 'bg-surface-container-high border-white/5 text-on-surface-variant'}`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-[8px] font-black uppercase tracking-widest">Approve</span>
                    </button>
                    
                    <button 
                      onClick={() => handleStatusUpdate(req.id, 'in progress')}
                      disabled={updatingId === req.id || req.status === 'in progress'}
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all active:scale-95 ${req.status === 'in progress' ? 'bg-primary/20 border-primary text-primary' : 'bg-surface-container-high border-white/5 text-on-surface-variant'}`}
                    >
                      <TrendingUp className="w-5 h-5" />
                      <span className="text-[8px] font-black uppercase tracking-widest">Deploy</span>
                    </button>

                    <button 
                      onClick={() => handleStatusUpdate(req.id, 'completed')}
                      disabled={updatingId === req.id || req.status === 'completed'}
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all active:scale-95 ${req.status === 'completed' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : 'bg-surface-container-high border-white/5 text-on-surface-variant'}`}
                    >
                      <ShieldCheck className="w-5 h-5" />
                      <span className="text-[8px] font-black uppercase tracking-widest">Mastered</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <a 
                      href={`mailto:${req.userEmail}`}
                      className="flex items-center justify-center gap-3 p-4 rounded-xl bg-surface-container-highest border border-white/10 text-on-surface font-bold text-sm active:scale-95 transition-all"
                    >
                      <Mail className="w-4 h-4 text-primary" />
                      Contact User
                    </a>
                    <button 
                      onClick={() => handleStatusUpdate(req.id, 'rejected')}
                      disabled={updatingId === req.id || req.status === 'rejected'}
                      className="flex items-center justify-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 font-bold text-sm active:scale-95 transition-all"
                    >
                      <XCircle className="w-4 h-4" />
                      Abort
                    </button>
                  </div>
                </div>

                {updatingId === req.id && (
                  <div className="flex items-center justify-center gap-3 text-primary animate-pulse">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-[2px]">Updating Satellite Link...</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredRequests.length === 0 && !loading && (
            <div className="p-20 text-center flex flex-col items-center gap-4 opacity-30">
              <Search className="w-12 h-12" />
              <p className="font-bold text-xl uppercase tracking-widest">No transmissions</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
