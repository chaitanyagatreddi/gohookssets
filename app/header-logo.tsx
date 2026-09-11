'use client';

import { motion, useReducedMotion } from 'motion/react';
import { Network } from 'lucide-react';

const spring = { type: 'spring' as const, stiffness: 520, damping: 24, mass: .55 };

export default function HeaderLogo() {
  const reducedMotion = useReducedMotion();
  const active = reducedMotion ? {} : { y: -2 };

  return (
    <motion.a
      href="#"
      className="wordmark header-wordmark"
      initial="rest"
      animate="rest"
      whileHover="active"
      whileFocus="active"
      whileTap={reducedMotion ? undefined : { scale: .96 }}
      variants={{ rest: { y: 0 }, active }}
      transition={spring}
    >
      <motion.span
        className="header-logo-mark"
        variants={{ rest: { rotate: 0, scale: 1 }, active: reducedMotion ? {} : { rotate: 12, scale: 1.14 } }}
        transition={spring}
      >
        <Network size={22}/>
      </motion.span>
      <motion.span
        variants={{ rest: { letterSpacing: '-1.4px' }, active: reducedMotion ? {} : { letterSpacing: '-.8px' } }}
        transition={spring}
      >GoHook</motion.span>
    </motion.a>
  );
}

export function HeroLogo() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className="hero-brand"
      tabIndex={0}
      initial="rest"
      animate="rest"
      whileHover="active"
      whileFocus="active"
      whileTap={reducedMotion ? undefined : { scale: .98 }}
      variants={{ rest: { y: 0, letterSpacing: '-.065em' }, active: reducedMotion ? {} : { y: -5, letterSpacing: '-.045em' } }}
      transition={{ ...spring, stiffness: 430, damping: 22 }}
    >GoHook</motion.div>
  );
}
