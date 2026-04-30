/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full border-t border-outline-variant bg-surface-dim py-10 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-8">
        {/* Branding & Description */}
        <div className="flex flex-col gap-3">
          <div>
            <div className="text-xl font-headline font-bold text-on-surface">Allieswebers</div>
            <div className="text-xs text-on-surface-variant max-w-xs leading-relaxed mt-1">
              The ethereal architect's workspace. Designed for precision and creative depth.
            </div>
          </div>
          <div className="flex flex-col gap-0.5 border-l border-primary/30 pl-3">
            <div className="text-[10px] uppercase font-black tracking-widest text-primary/70">Founder</div>
            <div className="text-xs font-bold text-on-surface">Dip Nandi</div>
            <div className="text-[10px] uppercase font-black tracking-widest text-secondary/70 mt-1">Co-Founder</div>
            <div className="text-xs font-bold text-on-surface">Swan Das</div>
          </div>
        </div>
        
        {/* Navigation Links - Centered on Tablet/Desktop */}
        <nav className="flex flex-wrap justify-start md:justify-center gap-x-8 gap-y-4">
          <Link to="/terms-of-service" className="p-0 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors">Terms of Service</Link>
          <Link to="/privacy-policy" className="p-0 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</Link>
          <Link to="/pricing" className="p-0 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors">Pricing</Link>
          <Link to="/contact" className="p-0 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors">Contact</Link>
        </nav>
        
        {/* Copyright - Right Aligned on Tablet/Desktop */}
        <div className="text-[10px] md:text-xs text-on-surface-variant md:text-right whitespace-nowrap">
          © 2026 Allieswebers. Designed for the Ethereal Architect.
        </div>
      </div>
    </footer>
  );
}
