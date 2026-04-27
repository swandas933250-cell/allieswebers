/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { ArrowRight, Sparkles, TrendingUp, Cloud, ShoppingCart, Layout, Search, Settings, Quote } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  const services = [
    {
      title: "Bespoke Web Design",
      desc: "We craft intentional, asymmetric layouts that break the rigid box model. Your brand deserves an ethereal architecture that feels native to the modern web.",
      icon: <Layout className="w-8 h-8" />,
      span: "md:col-span-2",
      color: "text-primary"
    },
    {
      title: "Technical SEO",
      desc: "Built with semantic HTML and optimized metadata to ensure you dominate search results.",
      icon: <Search className="w-6 h-6" />,
      span: "md:col-span-1",
      color: "text-secondary"
    },
    {
      title: "Premium Hosting",
      desc: "Global edge network deployment for sub-second load times worldwide.",
      icon: <Cloud className="w-6 h-6" />,
      span: "md:col-span-1",
      color: "text-tertiary"
    },
    {
      title: "E-Commerce Ready",
      desc: "Seamless integration with major payment gateways, inventory management, and custom checkout flows designed to maximize conversion rates.",
      icon: <ShoppingCart className="w-8 h-8" />,
      span: "md:col-span-2",
      color: "text-primary"
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-8 overflow-hidden min-h-screen flex items-center">
        {/* Ambient Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[800px] pointer-events-none z-0 opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/30 blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-5%] w-[45%] h-[45%] rounded-full bg-[#FF00FF]/20 blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-start gap-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low border border-white/5 text-sm font-medium text-secondary">
              <Settings className="w-4 h-4 animate-spin-slow" />
              The Next Generation Builder
            </div>
            <h1 className="font-headline text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-br from-on-surface to-on-surface-variant">
              Allieswebers Builds Stunning Websites for Your Business
            </h1>
            <p className="text-xl text-on-surface-variant max-w-2xl leading-relaxed">
              Fast, modern, and affordable services to grow your online presence. Elevate your brand with an ethereal aesthetic that speaks volumes.
            </p>
            <Link
                to="/request"
                className="group relative px-8 py-4 rounded-xl font-bold text-background bg-primary overflow-hidden transition-all duration-300 hover:scale-[1.02] btn-primary-glow"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Your Free Website
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                to="/templates"
                className="px-8 py-4 rounded-xl font-bold text-on-surface bg-surface border border-outline-variant hover:bg-surface-bright transition-colors"
              >
                Explore categories
              </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:pl-10"
          >
            <div className="group relative w-full aspect-[4/3] rounded-2xl bg-[#080810] overflow-hidden border border-primary/30 shadow-[0_32px_64px_rgba(124,77,255,0.3)]">
              {/* Deep purple/blue background with vibrant magenta/cyan gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF00FF]/40 via-primary/20 to-[#000a12]/80 z-10 mix-blend-color pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#080810] via-transparent to-[#00E676]/20 z-10 mix-blend-overlay pointer-events-none" />
              
              {/* Volumetric lighting effect for the neon glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-primary/40 via-transparent to-transparent z-10 pointer-events-none mix-blend-screen" />
              
              {/* Scanline / Holographic noise effect */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,255,0.06),rgba(0,255,255,0.02),rgba(124,77,255,0.06))] z-20 pointer-events-none opacity-30" style={{ backgroundSize: '100% 4px, 3px 100%' }} />

              <img
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop"
                alt="Colorful code on dark background"
                className="w-full h-full object-cover opacity-100 transition-transform duration-[2000ms] group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Note: The Pinterest link (https://pin.it/7cKsaE9Fi) redirects to a webpage, not a direct image file. 
                  Replace the src above with the direct image URL (e.g. ending in .jpg or .png) if you have extracted it. */}
              
              {/* Digital "UI" Glow Overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="w-3/4 h-3/4 border border-primary/30 rounded-lg backdrop-blur-[1px] bg-primary/5 shadow-[0_0_50px_rgba(124,77,255,0.2)] flex items-start justify-center pt-8">
                  <div className="px-4 py-2 rounded-full bg-background/80 border border-primary/50 text-[10px] font-mono text-primary animate-pulse shadow-[0_0_20px_rgba(124,77,255,0.4)]">
                    https://alliewebers.io/secure_vault
                  </div>
                </div>
              </div>

              {/* Speech / Vision Quote Overlay (Desktop/Tablet) */}
              <div className="hidden sm:block absolute bottom-4 right-4 z-30 p-4 rounded-2xl bg-[#080810]/70 backdrop-blur-md border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] max-w-xs transition-transform duration-500 hover:scale-[1.02]">
                <div className="flex gap-3 items-start">
                  <div className="shrink-0 text-primary opacity-80 mt-1">
                    <Quote className="w-5 h-5 fill-primary/20" />
                  </div>
                  <p className="text-xs font-medium text-white/90 leading-relaxed italic drop-shadow-sm">
                    "We are not just building websites. We are building identities. We are turning visions into something people can see, explore, and trust. Every line of code we write is an opportunity to create impact. Every design we craft is a chance to inspire action."
                  </p>
                </div>
              </div>

              {/* Floating Decorative Badge */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30 flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-3 rounded-xl bg-surface/80 backdrop-blur-md border border-white/10 shadow-2xl animate-bounce">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-on-surface-variant leading-none">AI Engine</p>
                  <p className="text-xs sm:text-sm font-bold text-on-surface">Active State</p>
                </div>
              </div>

            </div>
            
            {/* Speech / Vision Quote (Mobile) */}
            <div className="block sm:hidden mt-4 p-4 rounded-xl bg-surface border border-outline-variant shadow-lg relative">
              <div className="flex gap-2 items-start">
                <div className="shrink-0 text-primary opacity-80 mt-0.5">
                  <Quote className="w-4 h-4 fill-primary/20" />
                </div>
                <p className="text-xs font-medium text-on-surface leading-relaxed italic">
                  "We are not just building websites. We are building identities. We are turning visions into something people can see, explore, and trust. Every line of code we write is an opportunity to create impact. Every design we craft is a chance to inspire action."
                </p>
              </div>
            </div>
            
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-8 py-24 w-full">
        <div className="mb-16">
          <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight mb-4">Our Services</h2>
          <p className="text-on-surface-variant text-lg max-w-2xl">Everything you need to establish a dominant online presence, engineered for speed and conversion.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl bg-surface p-8 relative overflow-hidden group hover:bg-surface-container transition-all duration-500 border border-outline-variant ${service.span}`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] group-hover:bg-primary/10 transition-all duration-500" />
              <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div className={`p-4 rounded-xl bg-surface-container-high border border-outline-variant w-fit ${service.color}`}>
                  {service.icon}
                </div>
                <div>
                  <h3 className="font-headline text-2xl font-bold mb-3">{service.title}</h3>
                  <p className="text-on-surface-variant leading-relaxed">{service.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
