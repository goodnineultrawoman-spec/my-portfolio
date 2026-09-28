'use client';
import { useRef, useState } from 'react';
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { destinations } from '@/data/navigation';
import { getSceneItem, type SceneSelection } from '@/data/scene';
import { PaperContent } from './paper-content';
import { SceneRoot } from './scene/scene-root';

export function Portfolio() {
 const [selection,setSelection]=useState<SceneSelection>({facility:'about'});
 const [open,setOpen]=useState(false);
 const opener=useRef<HTMLButtonElement|null>(null);
 const current=destinations.find(d=>d.id===selection.facility)!;
 const item=getSceneItem(selection);
 function reveal(next:SceneSelection,button:HTMLButtonElement) {opener.current=button;setSelection(next);setOpen(true);}
 return <>
  <main className={`portfolio ${open?'paper-open':''}`}>
   <a className="skip-link" href="#park-scene">跳至游园地图</a>
   <SceneRoot onSelect={reveal}/>
  </main>
  <Sheet open={open} onOpenChange={setOpen}>
   <SheetContent className="paper-panel" showCloseButton={false} onCloseAutoFocus={e=>{e.preventDefault();opener.current?.focus();}}>
    <div className="paper-topline"><span>Tianjiao Hao <span className="topline-slash">/</span> Portfolio</span><SheetClose className="paper-close" aria-label="关闭内容，返回地图">返回地图 <span aria-hidden="true">×</span></SheetClose></div>
    <div className="paper-scroll" key={`${selection.facility}-${selection.itemId ?? 'overview'}`}>
     <header className="paper-heading"><p className="eyebrow">{current.number} / {item ? current.title : current.chinese}</p><SheetTitle>{item?.label ?? current.title}</SheetTitle><SheetDescription className="demo-note">内容示例 · 待替换为个人真实信息</SheetDescription></header>
     <PaperContent id={selection.facility} itemId={selection.itemId}/>
     <div className="paper-bottom"><span>{current.number} / 05</span><button className="text-link" onClick={()=>setSelection({facility:destinations[(destinations.findIndex(d=>d.id===selection.facility)+1)%5].id})}>下一页 · {destinations[(destinations.findIndex(d=>d.id===selection.facility)+1)%5].title} <span aria-hidden="true">→</span></button></div>
    </div>
   </SheetContent>
  </Sheet>
 </>;
}
