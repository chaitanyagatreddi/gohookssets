'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const workflows = [
  ['Comparison / intel', 'Trace how brands and alternatives connect across Reddit conversations.'],
  ['Intent threads', 'Find the conversations where people are expressing a need.'],
  ['Brand watch', 'Watch brand mentions in the context of their communities.'],
  ['Question batches', 'Query a connected graph with a batch of questions.'],
  ['Draft with slop check', 'Turn context into a Reddit-native draft, with a quality check before you act.'],
];

function Wireframe({ active }: { active: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const target = useRef(active);
  const [paused, setPaused] = useState(false);
  useEffect(() => { target.current = active; }, [active]);
  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext('2d');
    if (!el || !ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0, height = 0, frame = 0, visible = true, phase = 0, last = 0, selected = target.current;
    const resize = () => {
      const bounds = el.getBoundingClientRect();
      width = bounds.width; height = bounds.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      el.width = width * ratio; el.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const observer = new ResizeObserver(resize); observer.observe(el); resize();
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    intersection.observe(el);
    const draw = (now: number) => {
      const delta = Math.min(now - last, 40); last = now;
      if (visible) {
        const still = reduced.matches || paused;
        if (!still) phase += delta * .00042;
        selected = still ? target.current : selected + (target.current - selected) * (1 - Math.exp(-delta / 240));
        ctx.clearRect(0, 0, width, height);
        const scale = Math.min(width * .33, height * .49);
        const centerX = Math.sin(selected * 1.6) * .48;
        const centerZ = Math.cos(selected * 1.2) * .4;
        const point = (row: number, col: number) => {
          const x = (col / 12 - .5) * 2, z = (row / 12 - .5) * 2;
          const hill = Math.exp(-((x-centerX)**2+(z-centerZ)**2)*3.5) * .56;
          const wave = Math.sin(x*2.8+phase) * Math.cos(z*2.3+phase*.7) * .12;
          return { x: width*.5+(x*.88-z*.57)*scale, y: height*.54+(x*.24+z*.48-hill-wave)*scale };
        };
        const path = (points: {x:number;y:number}[], accent: boolean) => {
          ctx.beginPath(); points.forEach((p,i) => i ? ctx.lineTo(p.x,p.y) : ctx.moveTo(p.x,p.y));
          ctx.strokeStyle = accent ? '#ff6a33' : 'rgba(154,164,178,.48)';
          ctx.lineWidth = accent ? 1.25 : .85;
          ctx.setLineDash(accent ? [] : [4,5]); ctx.stroke();
        };
        for(let row=0;row<=12;row++) path(Array.from({length:49},(_,col)=>point(row,col/4)),row===6);
        for(let col=0;col<=12;col++) path(Array.from({length:49},(_,row)=>point(row/4,col)),col===6);
        ctx.setLineDash([]);
        [[3,3],[6,6],[9,9],[3,9],[9,3]].forEach(([r,c],i)=>{
          const p=point(r,c), chosen=i===target.current;
          ctx.beginPath(); ctx.arc(p.x,p.y,chosen?4:2.5,0,Math.PI*2);
          ctx.fillStyle=chosen?'#ff6a33':'#9aa4b2';
          ctx.shadowColor='#ff4500';ctx.shadowBlur=chosen?17:0;ctx.fill();ctx.shadowBlur=0;
          if(chosen){ctx.beginPath();ctx.arc(p.x,p.y,11,0,Math.PI*2);ctx.strokeStyle='#ff6a3355';ctx.lineWidth=1;ctx.stroke();}
        });
      }
      frame=requestAnimationFrame(draw);
    };
    frame=requestAnimationFrame(draw);
    return()=>{cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();};
  },[paused]);
  return <div className="workflow-frame">
    <span className="frame-corner top-left"/><span className="frame-corner top-right"/>
    <span className="frame-corner bottom-left"/><span className="frame-corner bottom-right"/>
    <div className="wireframe-heading"><span>{workflows[active][0]}</span><span>0{active+1} / 05</span></div>
    <canvas ref={canvas} role="img" aria-label={`Illustrative wireframe for ${workflows[active][0]}`}/>
    <button className="wireframe-pause" onClick={()=>setPaused(!paused)} aria-label={paused?'Play workflow animation':'Pause workflow animation'}>{paused?<Play size={14}/>:<Pause size={14}/>}</button>
  </div>;
}

export default function WorkflowShowcase() {
  const [active,setActive]=useState(0);
  return <div className="workflow-showcase">
    <Accordion value={[active]} onValueChange={value=>{if(value.length) setActive(Number(value[0]));}} className="workflow-accordion">
      {workflows.map(([name,body],i)=><AccordionItem key={name} value={i} className="workflow-option">
        <AccordionTrigger className="workflow-choice" onPointerMove={e=>{if(e.pointerType==='mouse' && (e.movementX || e.movementY))setActive(i);}} onFocus={()=>setActive(i)}>
          <span className="workflow-choice-number">0{i+1}</span><span className="workflow-choice-name">{name}</span>
        </AccordionTrigger>
        <AccordionContent className="workflow-description"><p>{body}</p></AccordionContent>
      </AccordionItem>)}
    </Accordion>
    <Wireframe active={active}/>
  </div>;
}
