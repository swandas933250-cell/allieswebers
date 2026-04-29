/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Layout, ChevronLeft, LogOut, User as UserIcon, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile menu on click outside
  useEffect(() => {
    if (!showProfileMenu) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.profile-menu-container')) {
        setShowProfileMenu(false);
      }
    };
    
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [showProfileMenu]);



  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Categories", path: "/templates" },
    { name: "Dashboard", path: "/dashboard" },
    ...(isAdmin ? [{ name: "Admin", path: "/admin" }] : []),
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md py-3 shadow-lg border-b border-outline-variant"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {!isHome && (
            <button
              onClick={() => navigate(-1)}
              className="p-1 text-on-surface-variant hover:text-primary transition-all group active:scale-95 flex items-center justify-center"
              aria-label="Go back"
            >
              <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
            </button>
          )}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary transition-transform active:scale-95"
          >
            Allieswebers
          </Link>
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-all duration-300 relative ${
                  location.pathname === link.path
                    ? "text-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">

          
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-[10px] font-black uppercase text-on-surface-variant opacity-50 tracking-widest">{user.displayName || 'Architect'}</p>
              </div>
              <div className="relative profile-menu-container">
                <img 
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=random`} 
                  alt="Avatar" 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 transition-all cursor-pointer shadow-lg shadow-primary/10 ${
                    showProfileMenu ? "border-primary scale-105" : "border-primary/20 hover:border-primary"
                  }`}
                  referrerPolicy="no-referrer"
                />
                <div className={`absolute top-full right-0 mt-2 w-48 py-2 bg-surface-container-high backdrop-blur-3xl rounded-xl border border-white/10 shadow-2xl transition-all origin-top-right z-[100] ${
                  showProfileMenu 
                    ? "scale-100 opacity-100 pointer-events-auto translate-y-0" 
                    : "scale-95 opacity-0 pointer-events-none -translate-y-2"
                }`}>
                  <div className="px-4 py-2 border-b border-white/5 mb-2">
                    <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-0.5">Signed in as</p>
                    <p className="text-xs font-bold text-on-surface truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm font-bold text-on-surface hover:bg-white/5 transition-colors"
                  >
                    <UserIcon className="w-4 h-4" />
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm font-bold text-primary hover:bg-white/5 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Admin Portal
                    </Link>
                  )}
                  <button 
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm font-bold text-error hover:bg-error/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-primary text-background px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95 whitespace-nowrap btn-primary-glow"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
