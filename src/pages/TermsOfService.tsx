/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { FileText, Scale, Gavel, CheckCircle2, Clock, Globe } from "lucide-react";

export default function TermsOfService() {
  const sections = [
    {
      id: "1",
      title: "1. Services",
      icon: <Globe className="w-5 h-5" />,
      content: "We provide website design, development, and related digital services. The scope of each project will be defined and agreed upon before work begins."
    },
    {
      id: "2",
      title: "2. User Responsibilities",
      icon: <CheckCircle2 className="w-5 h-5" />,
      content: (
        <ul className="space-y-2 list-none">
          {[
            "Provide accurate and complete information",
            "Ensure content does not violate laws or third-party rights",
            "Maintain confidentiality of login credentials",
            "Use services only for lawful purposes"
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-on-surface-variant">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      )
    },
    {
      id: "3",
      title: "3. Payments and Pricing",
      icon: <Scale className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p>All fees and payment terms will be agreed upon before the start of the project. Payments must be made on time as per the agreed schedule.</p>
          <p className="text-xs text-secondary font-bold uppercase tracking-wider">Delayed payments may result in suspension or termination of services.</p>
        </div>
      )
    },
    {
      id: "4",
      title: "4. Intellectual Property",
      icon: <FileText className="w-5 h-5" />,
      content: "Upon full payment, the final website design and deliverables will be transferred to you unless otherwise agreed. We reserve the right to showcase completed work in our portfolio. Any third-party tools, plugins, or resources remain the property of their respective owners."
    },
    {
      id: "5-6",
      title: "5 & 6. Revisions & Timelines",
      icon: <Clock className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>We offer revisions as agreed in the project scope. Additional revisions beyond the limit may incur extra charges.</p>
          <p>Project timelines are estimated. Delays caused by the client (e.g., late feedback) may affect delivery timelines.</p>
        </div>
      )
    },
    {
      id: "7-9",
      title: "7, 8 & 9. Liability & Termination",
      icon: <Gavel className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p>We are not liable for indirect damages, loss of data, or issues caused by third-party services. We reserve the right to terminate services for Terms violations or non-payment.</p>
          <p className="text-sm font-semibold">Fees for completed work are non-refundable.</p>
        </div>
      )
    },
    {
      id: "10-12",
      title: "General & Contact",
      content: (
        <div className="p-8 rounded-2xl bg-surface-container border border-outline-variant space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-[10px] uppercase font-black tracking-widest text-primary mb-2">Support Email</h4>
              <p className="text-sm font-bold">allieswebers@gmail.com</p>
            </div>
            <div>
              <h4 className="text-[10px] uppercase font-black tracking-widest text-secondary mb-2">Lead Architect</h4>
              <p className="text-sm font-bold">9475467704 / 9332502401</p>
            </div>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            These Terms shall be governed by and interpreted in accordance with the applicable laws of your jurisdiction. We may update these Terms from time to time.
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-8 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-b from-secondary/5 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-outline-variant text-[10px] font-black uppercase tracking-[3px] text-secondary mb-6 shadow-sm">
            <Gavel className="w-4 h-4" />
            Service Agreement
          </div>
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Service</span>
          </h1>
          <p className="text-on-surface-variant font-medium">Effective Date: April 19, 2026</p>
        </motion.div>

        <div className="space-y-16">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 rounded-3xl bg-surface border border-outline-variant/30 leading-relaxed text-on-surface-variant font-medium text-center"
          >
            Welcome to allieswebers (“we,” “our,” or “us”). These Terms of Service (“Terms”) govern your use of our website and services related to website design and development. By accessing or using our services, you agree to be bound by these Terms.
          </motion.div>

          <div className="grid grid-cols-1 gap-12">
            {sections.map((section, idx) => (
              <motion.section
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="group p-8 rounded-3xl bg-surface/50 border border-outline-variant/20 hover:border-primary/30 transition-all hover:bg-surface/80"
              >
                <div className="flex items-start gap-6">
                  {section.icon && (
                    <div className="p-3 rounded-xl bg-surface-container-high text-primary group-hover:scale-110 transition-transform shadow-inner">
                      {section.icon}
                    </div>
                  )}
                  <div className="space-y-4 flex-grow">
                    <h2 className="font-headline text-2xl font-bold text-on-surface tracking-tight group-hover:text-primary transition-colors">
                      {section.title}
                    </h2>
                    <div className="text-on-surface-variant leading-relaxed text-sm md:text-base">
                      {section.content}
                    </div>
                  </div>
                </div>
              </motion.section>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="pt-16 text-center border-t border-outline-variant/30"
          >
            <p className="text-xl font-bold text-on-surface mb-8 max-w-lg mx-auto leading-relaxed">
              By using our website and services, you agree to these Terms of Service.
            </p>
            <div className="flex flex-col items-center gap-4 opacity-40">
              <Scale className="w-8 h-8" />
              <div className="text-[10px] font-black uppercase tracking-[0.3em]">
                Standard Digital Service Contract v4.1
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
