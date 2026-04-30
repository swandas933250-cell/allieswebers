"use client";
import { Card, CardContent, CardHeader } from "./card";
import { TimelineContent } from "./timeline-animation";
import NumberFlow from "@number-flow/react";
import { Briefcase, CheckCheck, Database, Server, Smartphone, Globe, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";

const plans = [
  {
    name: "Starter",
    description:
      "Essential maintenance for small personal or portfolio websites.",
    price: 999,
    yearlyPrice: 9999,
    buttonText: "Start Maintaining",
    buttonVariant: "outline" as const,
    features: [
        { text: "Monthly Security Updates", icon: <Shield size={20} /> },
        { text: "Core Framework Updates", icon: <Globe size={20} /> },
        { text: "Daily Backups", icon: <Database size={20} /> },
    ],
    includes: [
      "Basic includes:",
      "SSL Certificate Monitoring",
      "Uptime Monitoring (5 min)",
      "Standard Support",
    ],
  },
  {
    name: "Professional",
    description:
      "Comprehensive care for growing businesses and multi-page sites.",
    price: 2499,
    yearlyPrice: 24999,
    buttonText: "Get Professional Care",
    buttonVariant: "default" as const,
    popular: true,
    features: [
        { text: "Weekly Security Scanning", icon: <Shield size={20} /> },
        { text: "Performance Optimization", icon: <Smartphone size={20} /> },
        { text: "Priority Content Updates", icon: <Briefcase size={20} /> },
    ],
    includes: [
      "Everything in Starter, plus:",
      "Speed Optimization",
      "Database Optimization",
      "Monthly Traffic Reports",
      "Priority Email Support",
    ],
  },
  {
    name: "Enterprise",
    description:
      "Advanced maintenance and 24/7 support for high-traffic platforms.",
    price: 4999,
    yearlyPrice: 49999,
    buttonText: "Hire Experts",
    buttonVariant: "outline" as const,
    features: [
      { text: "Real-time Security Guard", icon: <Shield size={20} /> },
      { text: "Dedicated Server Support", icon: <Server size={20} /> },
      { text: "Full Content Management", icon: <Briefcase size={20} /> },
    ],
    includes: [
      "Everything in Professional, plus:",
      "Visual Regression Testing",
      "Custom Feature Development",
      "24/7 Emergency Support",
      "Direct Developer Access",
    ],
  },
];

const PricingSwitch = ({ onSwitch }: { onSwitch: (value: string) => void }) => {
  const [selected, setSelected] = useState("0");

  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div className="flex justify-center">
      <div className="relative z-50 mx-auto flex w-fit rounded-full bg-surface-container-high border border-outline-variant p-1 shadow-inner">
        <button
          onClick={() => handleSwitch("0")}
          className={`relative z-10 w-fit sm:h-12 h-10 rounded-full sm:px-6 px-4 sm:py-2 py-1 font-medium transition-colors ${
            selected === "0"
              ? "text-background"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          {selected === "0" && (
            <motion.span
              layoutId={"switch"}
              className="absolute inset-0 rounded-full bg-primary"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-20">Monthly</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={`relative z-10 w-fit sm:h-12 h-8 flex-shrink-0 rounded-full sm:px-6 px-4 sm:py-2 py-1 font-medium transition-colors ${
            selected === "1"
              ? "text-background"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          {selected === "1" && (
            <motion.span
              layoutId={"switch"}
              className="absolute inset-0 rounded-full bg-primary"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-20 flex items-center gap-2">
            Yearly
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition-colors ${
              selected === "1" ? "bg-background/20 text-background" : "bg-primary/20 text-primary"
            }`}>
              Save 20%
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.2,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(4px)",
      y: 20,
      opacity: 0,
    },
  };

  const togglePricingPeriod = (value: string) =>
    setIsYearly(Number.parseInt(value) === 1);

  return (
    <div className="px-4 md:pt-32 pt-16 pb-24 min-h-screen mx-auto relative bg-transparent" ref={pricingRef}>
      <div
        className="absolute top-0 left-[10%] right-[10%] w-[80%] h-full z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
        radial-gradient(circle at center, currentColor 0%, transparent 70%)
      `,
          color: 'var(--color-primary)',
          mixBlendMode: "overlay",
        }}
      />

      <div className="text-center mb-12 max-w-3xl mx-auto relative z-10 px-6">
        <TimelineContent
          as="h2"
          animationNum={0}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="md:text-6xl sm:text-4xl text-3xl font-bold text-on-surface mb-6 tracking-tight"
        >
          Plans that work best for your{" "}
          <TimelineContent
            as="span"
            animationNum={1}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="border border-dashed border-primary px-4 py-2 rounded-2xl bg-primary/10 text-primary capitalize inline-block"
          >
            Sustenance
          </TimelineContent>
        </TimelineContent>

        <TimelineContent
          as="p"
          animationNum={2}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="sm:text-lg text-base text-on-surface-variant max-w-xl mx-auto font-sans"
        >
          Ensure your digital empire never sleeps. From routine updates to complex performance tuning, we care for your code.
        </TimelineContent>
      </div>

      <TimelineContent
        as="div"
        animationNum={3}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="relative z-10"
      >
        <PricingSwitch onSwitch={togglePricingPeriod} />
      </TimelineContent>

      <div className="grid md:grid-cols-3 max-w-7xl gap-8 py-16 mx-auto relative z-10 px-6">
        {plans.map((plan, index) => (
          <TimelineContent
            key={plan.name}
            as="div"
            animationNum={4 + index}
            timelineRef={pricingRef}
            customVariants={revealVariants}
          >
            <Card
              className={`relative border-outline-variant h-full flex flex-col transition-all duration-300 hover:translate-y-[-4px] overflow-hidden backdrop-blur-xl ${
                plan.popular ? "ring-2 ring-primary bg-surface-container/60 shadow-2xl" : "bg-surface/40 shadow-lg"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary" />
              )}
              <CardHeader className="text-left px-8 pt-10 pb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-on-surface">
                    {plan.name}
                  </h3>
                  {plan.popular && (
                    <span className="bg-primary text-background px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      Most Active
                    </span>
                  )}
                </div>
                <p className="text-sm text-on-surface-variant mb-8 line-clamp-2 min-h-[40px] font-sans leading-relaxed">
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-on-surface">
                        ₹
                        <NumberFlow
                        value={isYearly ? plan.yearlyPrice : plan.price}
                        className="text-5xl font-bold font-sans tracking-tight"
                        />
                    </span>
                    <span className="text-on-surface-variant font-medium text-sm">
                        /{isYearly ? "year" : "mo"}
                    </span>
                </div>
              </CardHeader>

              <CardContent className="px-8 pb-10 flex-grow flex flex-col">
                <button
                  className={`w-full mb-8 py-4 px-6 text-sm font-bold rounded-xl transition-all active:scale-[0.98] ${
                    plan.popular
                      ? "bg-primary text-background shadow-lg shadow-primary/20 hover:opacity-90"
                      : "bg-surface-container-highest text-on-surface hover:bg-on-surface hover:text-background border border-outline-variant"
                  }`}
                >
                  {plan.buttonText}
                </button>
                <div className="space-y-6">
                    <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3">
                        <span className="text-primary bg-primary/10 p-1.5 rounded-lg">
                            {feature.icon}
                        </span>
                        <span className="text-sm font-medium text-on-surface-variant font-sans">
                            {feature.text}
                        </span>
                        </li>
                    ))}
                    </ul>

                    <div className="pt-6 border-t border-outline-variant">
                    <h4 className="font-bold text-xs uppercase tracking-widest text-on-surface mb-4">
                        {plan.includes[0]}
                    </h4>
                    <ul className="space-y-3">
                        {plan.includes.slice(1).map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                            <span className="mt-0.5 min-w-[20px] h-5 w-5 bg-primary/10 rounded-full flex items-center justify-center">
                            <CheckCheck className="h-3 w-3 text-primary" />
                            </span>
                            <span className="text-xs font-medium text-on-surface-variant/80 font-sans leading-relaxed">{feature}</span>
                        </li>
                        ))}
                    </ul>
                    </div>
                </div>
              </CardContent>
            </Card>
          </TimelineContent>
        ))}
      </div>
    </div>
  );
}
