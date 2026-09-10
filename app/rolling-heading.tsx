'use client';
import { motion, useReducedMotion } from 'motion/react';

const lines = ['Reddit research', 'is fragmented.'];

export default function RollingHeading() {
  const reduced = useReducedMotion();
  return <motion.h2 className="rolling-heading" aria-label="Reddit research is fragmented." tabIndex={0}
    initial="rest" animate="rest" whileHover={reduced ? 'rest' : 'rolled'} whileFocus={reduced ? 'rest' : 'rolled'} whileTap={reduced ? 'rest' : 'rolled'}>
    {lines.map((line, lineIndex) => <span className="rolling-line" aria-hidden="true" key={line}>
      {Array.from(line).map((letter, index) => <span className="rolling-letter-window" key={index}>
        <motion.span className="rolling-letter" variants={{rest:{y:'0%'},rolled:{y:'-100%'}}}
          transition={{duration:reduced ? 0 : .38,delay:reduced ? 0 : (index + lineIndex * 3) * .014,ease:[.22,.61,.36,1]}}>
          <span>{letter===' ' ? '\u00a0' : letter}</span>
          <span className="rolling-letter-copy">{letter===' ' ? '\u00a0' : letter}</span>
        </motion.span>
      </span>)}
    </span>)}
  </motion.h2>;
}
