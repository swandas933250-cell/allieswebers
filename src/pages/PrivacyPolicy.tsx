/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Shield, Lock, FileText, ChevronRight } from "lucide-react";

export default function PrivacyPolicy() {
  const sections = [
    {
      id: "1",
      title: "1. Information We Collect",
      content: (
        <div className="space-y-4">
          <p>We may collect the following types of information:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant">
              <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Personal Information
              </h4>
              <ul className="text-xs space-y-1 text-on-surface-variant list-disc list-inside">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Business details</li>
                <li>Billing and payment information</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant">
              <h4 className="font-bold text-secondary mb-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                Non-Personal Info
              </h4>
              <ul className="text-xs space-y-1 text-on-surface-variant list-disc list-inside">
                <li>Browser type</li>
                <li>IP address</li>
                <li>Device information</li>
                <li>Pages visited & time spent</li>
              </ul>
            </div>
          </div>
          <p className="pt-2"><strong>c. Client Project Data:</strong> Content, images, and data you provide for website development projects.</p>
        </div>
      )
    },
    {
      id: "2",
      title: "2. How We Use Your Information",
      content: (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 list-none">
          {[
            "Provide and manage our services",
            "Communicate about projects or support",
            "Process payments and invoices",
            "Improve our website and services",
            "Send promotional emails (opt-out anytime)",
            "Comply with legal obligations"
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-on-surface-variant">
              <ChevronRight className="w-3 h-3 text-primary" />
              {item}
            </li>
          ))}
        </ul>
      )
    },
    {
      id: "3",
      title: "3. Cookies and Tracking Technologies",
      content: (
        <div className="space-y-3">
          <p>We use cookies and similar technologies to enhance user experience, analyze website traffic, and remember your preferences.</p>
          <p className="text-xs italic text-on-surface-variant/70 border-l-2 border-primary pl-4">
            You can choose to disable cookies through your browser settings.
          </p>
        </div>
      )
    },
    {
      id: "4",
      title: "4. How We Share Your Information",
      content: (
        <p>We do not sell your personal information. However, we may share your data with trusted third-party service providers (e.g., hosting, payment processors), legal authorities if required by law, and business partners with your consent.</p>
      )
    },
    {
      id: "5-6",
      title: "5 & 6. Security & Retention",
      content: (
        <div className="space-y-4">
          <p>We implement appropriate technical and organizational measures to protect your data. However, no method of transmission over the internet is 100% secure.</p>
          <p>We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, and resolve disputes.</p>
        </div>
      )
    },
    {
      id: "7",
      title: "7. Your Rights",
      content: (
        <div className="space-y-3">
          <p>Depending on your location, you may have the right to access, correct, delete, or withdraw consent for your personal data.</p>
          <p className="font-bold text-on-surface">To exercise your rights, contact us at allieswebers@gmail.com.</p>
        </div>
      )
    },
    {
      id: "8-11",
      title: "Contact & Information",
      content: (
        <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div>
              <h4 className="text-[10px] uppercase font-black tracking-widest text-primary mb-2">Email</h4>
              <p className="text-sm font-bold">allieswebers@gmail.com</p>
            </div>
            <div>
              <h4 className="text-[10px] uppercase font-black tracking-widest text-secondary mb-2">Phone</h4>
              <p className="text-sm font-bold">9475467704 / 9332502401</p>
            </div>
          </div>
          <p className="text-xs text-on-surface-variant">We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.</p>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-8 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-outline-variant text-[10px] font-black uppercase tracking-[3px] text-primary mb-6 shadow-sm">
            <Shield className="w-4 h-4" />
            Legal Document
          </div>
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Policy</span>
          </h1>
          <p className="text-on-surface-variant font-medium">Effective Date: April 19, 2026</p>
        </motion.div>

        <div className="space-y-12 backdrop-blur-sm bg-background/40">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 rounded-3xl bg-surface border border-outline-variant/30 leading-relaxed text-on-surface-variant font-medium italic mb-16"
          >
            Welcome to allieswebers (“we,” “our,” or “us”). We specialize in providing website design and development services. Your privacy is important to us, and this Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
          </motion.div>

          {sections.map((section, idx) => (
            <motion.section
              key={section.id}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-6 relative pl-8 border-l border-outline-variant/30 group"
            >
              <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] rounded-full bg-outline-variant group-hover:bg-primary transition-colors" />
              <h2 className="font-headline text-2xl font-bold text-on-surface tracking-tight">
                {section.title}
              </h2>
              <div className="text-on-surface-variant leading-relaxed text-sm md:text-base">
                {section.content}
              </div>
            </motion.section>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="pt-16 text-center border-t border-outline-variant/30"
          >
            <p className="text-lg font-bold text-on-surface mb-8">
              By using our website, you consent to this Privacy Policy.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs font-black uppercase tracking-widest text-on-surface-variant/50">
              <Lock className="w-4 h-4" />
              Secure Data Protocol v2.6
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
