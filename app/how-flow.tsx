'use client';

import { motion, useReducedMotion } from 'motion/react';

const steps = [
  ['01', 'Seed', 'Start with a brand, topic, or community.'],
  ['02', 'Map', 'Connect threads, entities, and intent.'],
  ['03', 'Query → act', 'Ask a question. Trace the answer. Decide what to do next.'],
];

export default function HowFlow() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="how-flow">
      {steps.map(([number, name, body], index) => (
        <article className="how-flow-step" key={name}>
          <div className="how-flow-track" aria-hidden="true">
            <motion.span
              className="how-flow-dot"
              animate={reducedMotion ? undefined : { boxShadow: ['0 0 0 9px #ff450010', '0 0 28px #ff450090', '0 0 0 9px #ff450010'] }}
              transition={{ duration: 2.4, delay: index * .65, repeat: Infinity }}
            />
            {index < steps.length - 1 && (
              <span className="how-flow-connector">
                <motion.i
                  animate={reducedMotion ? undefined : { x: ['0%', '420%'], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.7, delay: index * .65, repeat: Infinity, ease: 'easeInOut' }}
                />
                <b>→</b>
              </span>
            )}
          </div>
          <span className="step-number">{number}</span>
          <h3>{name}</h3>
          <p>{body}</p>
        </article>
      ))}
    </div>
  );
}
