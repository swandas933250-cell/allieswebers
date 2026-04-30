import PricingSection from "../components/ui/pricing-section";
import { motion } from "motion/react";

export default function Pricing() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-background min-h-screen"
    >
      <PricingSection />
    </motion.div>
  );
}
