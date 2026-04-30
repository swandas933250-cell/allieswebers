import { motion, useInView, Variants } from "motion/react";
import React, { useRef } from "react";

interface TimelineContentProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  animationNum?: number;
  timelineRef?: React.RefObject<HTMLElement> | any;
  customVariants?: Variants;
  as?: React.ElementType;
  className?: string; // Explicitly adding it back
  key?: React.Key;
}

export const TimelineContent = ({
  children,
  animationNum = 0,
  timelineRef,
  customVariants,
  className,
  as = "div",
  ...props
}: TimelineContentProps) => {
  const localRef = useRef(null);
  const isInView = useInView(timelineRef || localRef, { once: true, margin: "-10% 0px" });

  const Component = (motion as any)[as as string] || (motion as any).div;

  const defaultVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        delay: animationNum * 0.1,
      }
    },
  };

  return (
    <Component
      ref={localRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={customVariants || defaultVariants}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
};
