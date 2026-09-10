'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowRight, Network, Pause, Play } from 'lucide-react';
import WorkflowShowcase from './workflow-showcase';
import ConnectionFlow from './connection-flow';
import ExpandableSection from './expandable-section';
import RollingHeading from './rolling-heading';
const APP = 'https://redditscan.vercel.app';

function Graph() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);
  const rotation = useRef({x: -.16, y: 0});
  const drag = useRef<{x:number;y:number}|null>(null);
  useEffect(() => {
    const el = canvas.current; if (!el) return;
    const ctx = el.getContext('2d'); if (!ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0, width = 0, height = 0, visible = true;
    const nodes = Array.from({length: 145}, (_, i) => {
      const phi = Math.acos(1 - 2 * (i + .5) / 145), theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = .64 + .36 * ((Math.sin(i * 42.71) + 1) / 2);
      return {x: r*Math.sin(phi)*Math.cos(theta), y:r*Math.cos(phi), z:r*Math.sin(phi)*Math.sin(theta), group:i%5};
    });
    const edges: [number,number][] = [];
    nodes.forEach((a,i) => nodes.forEach((b,j) => {
      if(j>i && Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z)<.44) edges.push([i,j]);
    }));
    const resize = () => { const b=el.getBoundingClientRect();width=b.width;height=b.height;const d=Math.min(window.devicePixelRatio||1,2);el.width=width*d;el.height=height*d;ctx.setTransform(d,0,0,d,0,0);};
    const ro=new ResizeObserver(resize);ro.observe(el);resize();
    const io=new IntersectionObserver(e=>{visible=e[0].isIntersecting;});io.observe(el);
    let last=0;
    const render=(now:number)=>{
      const delta=Math.min(now-last,40);last=now;
      if(visible){
        if(!paused&&!reduced.matches&&!drag.current) rotation.current.y+=delta*.000055;
        ctx.clearRect(0,0,width,height);
        const {x:rx,y:ry}=rotation.current;
        const scale=Math.min(width*.39, height*.63);
        const projected=nodes.map(n=>{
          const x=n.x*Math.cos(ry)+n.z*Math.sin(ry), z=-n.x*Math.sin(ry)+n.z*Math.cos(ry);
          const y=n.y*Math.cos(rx)-z*Math.sin(rx), zz=n.y*Math.sin(rx)+z*Math.cos(rx);
          const depth=2.9/(2.9-zz);
          return {x:width/2+x*scale*depth*1.42,y:height*.49+y*scale*depth*.72,z:zz,depth,group:n.group};
        });
        for(const [a,b] of edges){const p=projected[a],q=projected[b];const bright=p.group===0||q.group===0;ctx.strokeStyle=bright?`rgba(255,69,0,${.09+(p.z+q.z+2)*.065})`:`rgba(154,164,178,${.045+(p.z+q.z+2)*.04})`;ctx.lineWidth=bright?.8:.6;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}
        projected.map((p,i)=>({...p,i})).sort((a,b)=>a.z-b.z).forEach(p=>{
          const major=p.i%19===0;const radius=(major?5:1.7)*p.depth;ctx.globalAlpha=.4+(p.z+1)*.3;ctx.fillStyle=p.group===0||major?'#ff4500':'#9aa4b2';
          if(major){ctx.shadowColor='#ff4500';ctx.shadowBlur=18;}ctx.beginPath();ctx.arc(p.x,p.y,radius,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
          if(major&&p.z>-.55){const labels=['Subreddit','Thread','Brand','Intent','Question'];ctx.font='12px Arial';ctx.fillStyle='#e8eaed';ctx.fillText(labels[p.group],p.x+12,p.y+4);}
        });ctx.globalAlpha=1;
      }
      raf=requestAnimationFrame(render);
    };raf=requestAnimationFrame(render);
    return()=>{cancelAnimationFrame(raf);ro.disconnect();io.disconnect();};
  },[paused]);
  return <div className="graph-stage" id="graph">
    <canvas ref={canvas} tabIndex={0} role="img" aria-label="Interactive 3D Reddit knowledge graph. Drag or use arrow keys to rotate."
      onPointerDown={e=>{drag.current={x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId);}}
      onPointerMove={e=>{if(drag.current){rotation.current.y+=(e.clientX-drag.current.x)*.006;rotation.current.x+=(e.clientY-drag.current.y)*.004;drag.current={x:e.clientX,y:e.clientY};}}}
      onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}}
      onKeyDown={e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();rotation.current.y+=e.key==='ArrowLeft'?-.15:e.key==='ArrowRight'?.15:0;rotation.current.x+=e.key==='ArrowUp'?-.15:e.key==='ArrowDown'?.15:0;}}}/>
    <div className="graph-bottom"><span>POSTS · COMMUNITIES · BRANDS · INTENT</span><div><span className="drag-hint">Drag to explore</span><button aria-label={paused?'Play graph animation':'Pause graph animation'} onClick={()=>setPaused(!paused)}>{paused?<Play size={15}/>:<Pause size={15}/>}</button></div></div>
  </div>;
}
function Fragments() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add('is-visible');
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className="fragments" aria-hidden="true"><span>Search</span><i>↗</i><span>Tabs</span><i>↘</i><span>Notes</span><i>↗</i><span>Gut feel</span></div>;
}
function CTA(){return <a className="primary" href={APP}>Get access <ArrowUpRight size={17}/></a>;}
export default function Home(){return <><a href="#main" className="skip">Skip to content</a><header className="nav"><a href="#" className="wordmark"><Network size={22}/>GoHook</a><nav aria-label="Main navigation"><a href="#product">Product</a><a href="#workflows">Workflows</a><a href="#how-it-works">How it works</a></nav><a className="nav-cta" href={APP}>Get access <ArrowUpRight size={15}/></a></header><main id="main"><section className="hero"><div className="hero-copy"><div className="hero-brand">GoHook</div><h1>Your knowledge graph<br/>for <span>Reddit.</span></h1><p>Map threads, intent, brands, and communities — then query<br className="desktop"/> the connections instead of hunting with search.</p><div className="cta-group"><CTA/><a className="secondary" href="#graph">See the graph <ArrowRight size={16}/></a></div></div><Graph/></section>
<section className="section problem" id="problem"><ExpandableSection id="problem" label="01 / THE PROBLEM"><div className="split"><RollingHeading/><div><p className="section-copy">Search, tabs, notes, gut feel — nothing connects.</p><Fragments/></div></div></ExpandableSection></section>
<section className="section thesis" id="product"><ExpandableSection id="product" label="02 / THE KNOWLEDGE GRAPH"><div className="split"><h2>A graph<br/>you can query.</h2><p className="section-copy">Connect entities and relationships. Follow the connections to an answer — with a path you can trace.</p></div><ConnectionFlow/></ExpandableSection></section>
<section className="section workflows" id="workflows"><ExpandableSection id="workflows" label="03 / GRAPH WORKFLOWS"><h2>What you do in GoHook.</h2><WorkflowShowcase/></ExpandableSection></section>
<section className="section how" id="how-it-works"><ExpandableSection id="how-it-works" label="04 / HOW IT WORKS"><h2>Seed → map → query → act.</h2><div className="steps">{[['Seed','Start with a brand, topic, or community.'],['Map','Connect threads, entities, and intent.'],['Query → act','Ask a question. Trace the answer. Decide what to do next.']].map(([name,body],i)=><article key={name}><span className="step-number">0{i+1}</span><h3>{name}</h3><p>{body}</p></article>)}</div></ExpandableSection></section>
<section className="section trust" id="trust"><ExpandableSection id="trust" label="05 / TRUST & SAFETY"><div className="split"><h2>Ban-aware<br/>by design.</h2><div><p className="section-copy">Subreddit rules. Controlled volume. Quality over spray.</p><p className="quiet">Keep the community’s context in every action.</p></div></div></ExpandableSection></section>
<section className="section audience" id="audience"><ExpandableSection id="audience" label="06 / WHO IT’S FOR"><div className="split"><h2>From solo<br/>to agency.</h2><p className="section-copy">One knowledge graph for research, listening, and growth.</p></div><div className="audience-line"><span>Hobbyists</span><span>Freelancers</span><span>Startups</span><span>Agencies</span></div></ExpandableSection></section>
<section className="final-cta" id="get-access"><Network size={36}/><h2>Start mapping<br/><span>Reddit.</span></h2><CTA/></section>
</main><footer><a href="#" className="wordmark"><Network size={20}/>GoHook</a><span>Your knowledge graph for Reddit.</span><a href="#main">Back to top ↑</a></footer></>;}
