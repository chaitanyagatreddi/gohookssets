'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';

export default function ExpandableSection({id,label,children}:{id:string;label:string;children:ReactNode}) {
  const [open,setOpen]=useState(false);
  useEffect(()=>{
    const fromHash=()=>{if(window.location.hash===`#${id}`)setOpen(true);};
    const fromLink=(event:MouseEvent)=>{const target=event.target;if(target instanceof Element && target.closest('a')?.getAttribute('href')===`#${id}`)setOpen(true);};
    fromHash();window.addEventListener('hashchange',fromHash);document.addEventListener('click',fromLink,true);
    return()=>{window.removeEventListener('hashchange',fromHash);document.removeEventListener('click',fromLink,true);};
  },[id]);
  return <Collapsible open={open} onOpenChange={setOpen}>
    <CollapsibleTrigger className="section-toggle" aria-label={`${open?'Collapse':'Expand'} ${label}`}><span>{label}</span><span className="section-toggle-icon" aria-hidden="true">{open?'−':'+'}</span></CollapsibleTrigger>
    <CollapsibleContent className="section-panel"><div className="section-panel-content">{children}</div></CollapsibleContent>
  </Collapsible>;
}
