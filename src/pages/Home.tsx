/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { ArrowRight, Sparkles, TrendingUp, Cloud, ShoppingCart, Layout, Search, Settings, Quote, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import Spline from '@splinetool/react-spline';
import { useState } from "react";
import { BackgroundPaths } from "../components/ui/background-paths";
import OrbitingSkills from "../components/ui/orbiting-skills";

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
                  <p className="text-on-surface-variant leading-relaxed font-sans">{service.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section className="bg-surface-container-lowest/50 py-24 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-headline text-3xl md:text-5xl font-bold tracking-tight mb-6">Expertise in Cutting-Edge Technologies</h2>
              <p className="text-on-surface-variant text-lg mb-8 leading-relaxed max-w-xl">
                We utilize the most advanced tools and frameworks to build scalable, multi-threaded, and high-performance applications. Our stack is engineered for the future, ensuring your digital products stay ahead of the curve.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-surface border border-outline-variant">
                  <h4 className="font-bold text-primary mb-1">Performance</h4>
                  <p className="text-sm text-on-surface-variant">Sub-second response times and core web vital optimization.</p>
                </div>
                <div className="p-4 rounded-xl bg-surface border border-outline-variant">
                  <h4 className="font-bold text-secondary mb-1">Scalability</h4>
                  <p className="text-sm text-on-surface-variant">Cloud-native architectures that grow with your user base.</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex justify-center items-center h-[400px] md:h-[500px]"
            >
              <OrbitingSkills />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
