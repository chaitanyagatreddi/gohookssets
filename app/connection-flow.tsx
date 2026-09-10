'use client';
import { Fragment, useEffect, useRef, useState } from 'react';
import { ArrowRight, Pause, Play } from 'lucide-react';

const nodes = [
  ['COMMUNITY', 'Subreddit'],
  ['CONVERSATION', 'Thread'],
  ['ENTITY', 'Brand'],
  ['SIGNAL', 'Intent'],
  ['', 'Collaborate'],
];
const relations = ['contains', 'mentions', 'reveals', ''];

export default function ConnectionFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .2 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className="connection-flow" data-running={visible && !paused}>
    <div className="connection-track" aria-label="Subreddit, Thread, Brand, Intent, Collaborate">
      {nodes.map(([category, name], i) => <Fragment key={name}>
        <div className="connection-node" style={{'--step': i} as React.CSSProperties}>
          <span className="connection-dot" aria-hidden="true"/>
          <small>{category || '\u00a0'}</small><strong>{name}</strong>
        </div>
        {i < relations.length && <div className="connection-edge" style={{'--step': i} as React.CSSProperties}>
          <span className="connection-line" aria-hidden="true"><span className="connection-pulse"/><ArrowRight size={16}/></span>
          {relations[i] && <span className="connection-relation">{relations[i]}</span>}
        </div>}
      </Fragment>)}
    </div>
    <button className="connection-pause" onClick={() => setPaused(!paused)} aria-label={paused ? 'Play connection animation' : 'Pause connection animation'}>{paused ? <Play size={14}/> : <Pause size={14}/>}</button>
  </div>;
}
