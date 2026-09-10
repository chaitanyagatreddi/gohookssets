'use client';
import { Fragment, useEffect, useRef, useState } from 'react';
import { ArrowRight, Pause, Play } from 'lucide-react';
import { motion, useMotionValue, useTransform, useAnimationFrame, useReducedMotion, type MotionValue } from 'motion/react';

const nodes = [
  ['COMMUNITY', 'Subreddit'],
  ['CONVERSATION', 'Thread'],
  ['ENTITY', 'Brand'],
  ['SIGNAL', 'Intent'],
  ['', 'Collaborate'],
];
const relations = ['contains', 'mentions', 'reveals', ''];

function FlowNode({category,name,index,clock}:{category:string;name:string;index:number;clock:MotionValue<number>}) {
  const backgroundColor=useTransform(clock,time=>Math.abs(time-index*1.1)<.2?'#ff4500':'#0b0d10');
  const boxShadow=useTransform(clock,time=>Math.abs(time-index*1.1)<.2?'0 0 16px #ff450070, 0 0 0 7px #ff450018':'0 0 0 7px #ff450010');
  return <div className="connection-node"><motion.span className="connection-dot" aria-hidden="true" style={{backgroundColor,boxShadow}}/><small>{category || '\u00a0'}</small><strong>{name}</strong></div>;
}
function FlowEdge({label,index,clock}:{label:string;index:number;clock:MotionValue<number>}) {
  const travel=useTransform(clock,time=>`${Math.max(0,Math.min(1,(time-index*1.1)/1.1))*100}%`);
  const opacity=useTransform(clock,time=>{const t=(time-index*1.1)/1.1;return t<0||t>1?0:Math.min(t*12,(1-t)*12,1);});
  return <div className="connection-edge"><span className="connection-line" aria-hidden="true"><motion.span className="connection-pulse" style={{'--travel':travel,opacity} as never}/><ArrowRight size={16}/></span>{label&&<span className="connection-relation">{label}</span>}</div>;
}

export default function ConnectionFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const clock=useMotionValue(0);
  const reduced=useReducedMotion();
  useAnimationFrame((_,delta)=>{if(visible&&!paused&&!reduced)clock.set((clock.get()+Math.min(delta,50)/1000)%6);});
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
        <FlowNode category={category} name={name} index={i} clock={clock}/>
        {i<relations.length&&<FlowEdge label={relations[i]} index={i} clock={clock}/>}
      </Fragment>)}
    </div>
    <button className="connection-pause" onClick={() => setPaused(!paused)} aria-label={paused ? 'Play connection animation' : 'Pause connection animation'}>{paused ? <Play size={14}/> : <Pause size={14}/>}</button>
  </div>;
}
