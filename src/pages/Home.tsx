/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, Cloud, ShoppingCart, Layout, Search, Settings, Quote, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import Spline from '@splinetool/react-spline';
import { useState } from "react";
import { BackgroundPaths } from "../components/ui/background-paths";

export default function Home() {
  const [isSplineLoaded, setIsSplineLoaded] = useState(false);
  const [splineError, setSplineError] = useState(false);

  // Note: To trigger your specific design, you need to Export it as "Code" in Spline 
  // and use the .splinecode URL provided there. 
  const splineScene = "https://prod.spline.design/Vg6YYdJL4Pun0Vdh/scene.splinecode";
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
      <BackgroundPaths 
        title="Make Your Stunning Website With Us" 
        buttonText="Send Request" 
        buttonHref="/request" 
      />

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
