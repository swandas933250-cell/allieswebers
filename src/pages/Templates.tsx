/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Filter, Check, ChevronDown, Sparkles } from "lucide-react";

export default function Templates() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const categories = [
    { name: "All Categories", count: 10 },
    { name: "Finance", count: 1 },
    { name: "Legal", count: 1 },
    { name: "Hospitality", count: 1 },
    { name: "Architecture", count: 1 },
    { name: "Green Tech", count: 1 },
    { name: "Creative", count: 1 },
    { name: "Consulting", count: 1 },
    { name: "Medical", count: 1 },
    { name: "Education", count: 1 },
    { name: "Restaurant", count: 1 },
  ];

  const styles = ["Minimalist", "Dark Mode", "Corporate", "Creative", "Modern"];

  const assets = [
    {
      id: 1,
      name: "Zenith Wealth Management",
      category: "Finance",
      details: "Secure Transaction Flow • Portfolio Analytics • Compliance Ready",
      style: "Corporate",
      price: "Free",
      desc: "Trust-centric financial ecosystem for private wealth management and investment firms.",
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800&h=600",
      featured: true
    },
    {
      id: 2,
      name: "Lexington Corporate Law",
      category: "Legal",
      details: "Document Automation • Encrypted Client Portals • Case Management",
      style: "Corporate",
      price: "Free",
      desc: "A prestigious, secure framework for high-stakes corporate legal practices.",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800&h=600",
    },
    {
      id: 3,
      name: "Ethereal Island Retreat",
      category: "Hospitality",
      details: "Property Management • Virtual Concierge • Multi-region Booking",
      style: "Modern",
      price: "Free",
      desc: "Immersive booking experience for luxury boutique hotels and private islands.",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800&h=600",
    },
    {
      id: 4,
      name: "Form & Function Studio",
      category: "Architecture",
      details: "BIM Integration • Dynamic Project Timelines • Portfolio Engine",
      style: "Minimalist",
      price: "Free",
      desc: "Asymmetric design canvas for boutique architecture and interior design firms.",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80&w=800&h=600",
    },
    {
      id: 5,
      name: "Solaris Green Energy",
      category: "Green Tech",
      details: "Impact Reporting • Real-time Monitoring • Investor Hub",
      style: "Modern",
      price: "Free",
      desc: "Data-driven platform for renewable energy innovators and sustainability consultants.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800&h=600",
    },
    {
      id: 6,
      name: "Neon Pulse Agency",
      category: "Creative",
      details: "Asset Management • Collaborative Review • High-speed CDN",
      style: "Creative",
      price: "Free",
      desc: "High-energy, vibrant digital hub for cutting-edge marketing and design studios.",
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800&h=600",
    },
    {
      id: 7,
      name: "Strategy Nexus Consulting",
      category: "Consulting",
      details: "Authority Engine • Strategic Frameworks • Client Onboarding",
      style: "Corporate",
      price: "Free",
      desc: "Authority-building platform for management consultants and strategic advisors.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800&h=600",
    },
    {
      id: 8,
      name: "Vitality Integrated Care",
      category: "Medical",
      details: "Secure Health Records • Telehealth Engine • Patient Engagement",
      style: "Modern",
      price: "Free",
      desc: "Patient-centered digital ecosystem for private clinics and specialty healthcare.",
      image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800&h=600",
    },
    {
      id: 9,
      name: "Scholar Portal Elite",
      category: "Education",
      details: "Curriculum Engine • Engagement Tracking • Student Success CRM",
      style: "Minimalist",
      price: "Free",
      desc: "Sophisticated learning environment for high-end educational institutions.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800&h=600",
    },
    {
      id: 10,
      name: "Culinary Canvas",
      category: "Restaurant",
      details: "Reservation System • Interactive Menus • Order Management",
      style: "Creative",
      price: "Free",
      desc: "An appetizing visual experience for fine dining establishments and culinary brands.",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800&h=600",
    }
  ];

  const filteredAssets = assets.filter(item => {
    return selectedCategory === "All Categories" || item.category === selectedCategory;
  });

  return (
    <div className="pt-32 pb-24 px-8 max-w-7xl mx-auto w-full min-h-screen">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col gap-8 sticky top-32 h-fit">
          <div className="bg-surface p-6 rounded-xl border border-outline-variant space-y-8">
            <div>
              <h3 className="font-headline font-bold text-lg mb-4">Categories</h3>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <label 
                    key={cat.name} 
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => setSelectedCategory(cat.name)}
                  >
                    <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${
                      selectedCategory === cat.name 
                      ? "bg-primary border-primary shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                      : "bg-surface-container-lowest border-white/10 group-hover:border-primary/50"
                    }`}>
                      {selectedCategory === cat.name && <Check className="w-3 h-3 text-background" />}
                    </div>
                    <span className={`text-sm font-medium ${selectedCategory === cat.name ? "text-on-surface" : "text-on-surface-variant group-hover:text-on-surface"}`}>
                      {cat.name}
                    </span>
                    <span className="ml-auto text-xs text-on-surface-variant/50">{cat.count}</span>
                  </label>
                ))}

                <button 
                  onClick={() => navigate("/request")}
                  className="w-full mt-6 flex items-center gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all group overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-primary/5 translate-x-[-100%] group-hover:translate-x-[0%] transition-transform duration-500" />
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center relative z-10">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex flex-col items-start relative z-10">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">Custom</span>
                    <span className="text-sm font-black text-on-surface">Personalized Category</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-grow flex flex-col gap-8">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="font-headline text-4xl font-extrabold tracking-tight mb-2">Explore Categories</h1>
              <p className="text-on-surface-variant text-sm max-w-xl">Start building your next project with our premium, high-performance categories.</p>
            </div>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 min-h-[400px]">
            <AnimatePresence mode="popLayout">
              {filteredAssets.length > 0 ? (
                filteredAssets.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5 }}
                    className="group bg-surface rounded-2xl overflow-hidden border border-outline-variant shadow-xl transition-all h-fit"
                  >
                    <div className="relative h-60 overflow-hidden bg-surface-container-high">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-background/80 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-wider">
                          {item.category}
                        </span>
                        {item.featured && (
                          <span className="px-2.5 py-1 rounded-lg bg-primary/20 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                            Popular
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                           <span className="text-[10px] font-black uppercase text-primary tracking-widest">{item.details}</span>
                           <span className="text-[10px] font-black uppercase text-on-surface-variant/40 border border-current rounded px-1">{item.style}</span>
                        </div>
                        <p className="text-sm text-on-surface-variant line-clamp-2 mt-1">{item.desc}</p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="text-lg font-bold">
                          {item.price}
                          <span className="text-xs text-on-surface-variant font-normal ml-1">{item.price !== "Free" && "/ project"}</span>
                        </div>
                        <button 
                          onClick={() => navigate("/request", { state: { selectedCategory: item.category } })}
                          className="px-5 py-2 rounded-lg bg-surface-container-highest hover:bg-primary hover:text-background text-sm font-bold transition-all border border-white/5"
                        >
                          Inquire Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full flex flex-col items-center justify-center py-20 text-on-surface-variant"
                >
                  <Filter className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-lg font-medium">No solutions match your selection.</p>
                  <button 
                    onClick={() => { setSelectedCategory("All Categories"); }}
                    className="mt-4 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-bold border border-primary/20 hover:bg-primary/20"
                  >
                    Clear all filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
