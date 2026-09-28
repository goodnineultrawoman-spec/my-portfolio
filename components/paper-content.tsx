'use client';
import { useState } from 'react';
import type { DestinationId } from '@/data/navigation';
import { about } from '@/data/about';
import { experiences } from '@/data/experience';
import { projects, type Project } from '@/data/projects';
import { interests } from '@/data/interests';
import { contact } from '@/data/contact';

function About() {
 return <>
  <p className="introduction">{about.introduction}</p>
  <section className="paper-section"><h3>教育背景 <span>Education</span></h3>{about.education.map(item=><div className="education-entry" key={item.title}><p>{item.title}</p><p className="secondary">{item.detail}<span>{item.period}</span></p></div>)}</section>
  <section className="paper-section"><h3>语言与国际经历 <span>Across cultures</span></h3><p>{about.languages}</p><p className="secondary">{about.international}</p></section>
  <section className="paper-section"><h3>工作方式 <span>How I work</span></h3>{about.workingStyle.map((s,i)=><p className="working-line" key={s}><span>0{i+1}</span>{s}</p>)}</section>
 </>;
}
function AboutDetail({itemId}:{itemId:string}) {
 if(itemId==='education') return <section className="paper-section"><h3>教育背景 <span>Education</span></h3>{about.education.map(item=><div className="education-entry" key={item.title}><p>{item.title}</p><p className="secondary">{item.detail}<span>{item.period}</span></p></div>)}</section>;
 if(itemId==='languages') return <section className="paper-section"><h3>语言 <span>Languages</span></h3><p>{about.languages}</p><p className="secondary">请按真实语言能力更新。</p></section>;
 if(itemId==='international') return <section className="paper-section"><h3>国际经历 <span>Across cultures</span></h3><p>{about.international}</p></section>;
 return <section className="paper-section"><h3>工作方式 <span>How I work</span></h3>{about.workingStyle.map((s,i)=><p className="working-line" key={s}><span>0{i+1}</span>{s}</p>)}</section>;
}
function ExperienceEntry({item}:{item:typeof experiences[number]}) {
 return <article className="timeline-entry">
  <p className="eyebrow">{item.period}</p><h3>{item.company}</h3><p className="english role">{item.role}</p><p>{item.summary}</p>
  <ul>{item.responsibilities.map(r=><li key={r}>{r}</li>)}</ul><p className="outcome"><span>成果</span>{item.outcome}</p>
 </article>;
}
function Experience() {
 return <div className="timeline">{experiences.map(item=><ExperienceEntry item={item} key={item.id}/>)}</div>;
}
function Work({initialId}:{initialId?:string}) {
 const [selected,setSelected]=useState<Project|null>(()=>projects.find(p=>p.id===initialId)??null);
 if(selected) return <article className="case-study">
  <button className="text-link back-link" onClick={()=>setSelected(null)}>← 返回项目</button>
  <p className="eyebrow">{selected.category}</p><h3 className="case-title">{selected.title}</h3><p className="secondary">{selected.role}</p>
  {selected.sections.map(s=><section className="paper-section" key={s.title}><h4>{s.title}</h4><p>{s.body}</p></section>)}
 </article>;
 return <div className="project-list">{projects.map(p=><article className="project" key={p.id}>
  <button className="project-cover" style={{'--cover-color':p.color} as React.CSSProperties} onClick={()=>setSelected(p)} aria-label={`查看项目：${p.title}`}><span className="cover-number">{p.initials}</span><span className="cover-category">{p.category}</span></button>
  <div className="project-copy"><p className="eyebrow">{p.role}</p><h3>{p.title}</h3><p>{p.description}</p><button className="text-link" onClick={()=>setSelected(p)}>查看项目 <span aria-hidden="true">↗</span></button></div>
 </article>)}</div>;
}
function Interests() {
 return <div className="interest-list">{interests.map(i=><article className="interest" key={i.title}><img src={i.file} alt=""/><div><h3>{i.title}</h3><p>{i.description}</p></div></article>)}</div>;
}
function InterestDetail({itemId}:{itemId:string}) {
 const item=interests.find(i=>i.id===itemId);
 if(!item) return <Interests/>;
 return <article className="interest interest-detail"><img src={item.file} alt=""/><div><h3>{item.title}</h3><p>{item.description}</p></div></article>;
}
function Contact() {
 return <div className="contact-content"><p className="introduction">期待交流新的想法、项目与工作机会。</p>
  <dl className="contact-list"><div><dt>Email</dt><dd>{contact.email ? <a href={`mailto:${contact.email}`}>{contact.email} ↗</a> : <span className="secondary">邮箱地址待补充</span>}</dd></div>
  <div><dt>LinkedIn</dt><dd>{contact.linkedIn ? <a href={contact.linkedIn} target="_blank" rel="noreferrer">查看个人主页 ↗</a> : <span className="secondary">个人主页待补充</span>}</dd></div>
  <div><dt>Resume</dt><dd>{contact.resume ? <a href={contact.resume} download>下载简历 ↓</a> : <span className="secondary">简历文件待补充</span>}</dd></div></dl>
  <p className="contact-signature">Tianjiao Hao</p><p className="secondary english">Global Marketing · Brand · GTM</p>
 </div>;
}
function ContactDetail({itemId}:{itemId:string}) {
 if(itemId==='email') return <div className="contact-content"><p className="introduction">欢迎通过邮件联系。</p><dl className="contact-list"><div><dt>Email</dt><dd>{contact.email ? <a href={`mailto:${contact.email}`}>{contact.email} ↗</a> : <span className="secondary">邮箱地址待补充</span>}</dd></div></dl></div>;
 if(itemId==='linkedin') return <div className="contact-content"><p className="introduction">可以在这里找到更多职业经历与近况。</p><dl className="contact-list"><div><dt>LinkedIn</dt><dd>{contact.linkedIn ? <a href={contact.linkedIn} target="_blank" rel="noreferrer">查看个人主页 ↗</a> : <span className="secondary">个人主页待补充</span>}</dd></div></dl></div>;
 return <div className="contact-content"><p className="introduction">简历将放在这里供下载。</p><dl className="contact-list"><div><dt>Resume</dt><dd>{contact.resume ? <a href={contact.resume} download>下载简历 ↓</a> : <span className="secondary">简历文件待补充</span>}</dd></div></dl></div>;
}
export function PaperContent({id,itemId}:{id:DestinationId;itemId?:string}) {
 return <div className="paper-copy">{
  id==='about'?(itemId?<AboutDetail itemId={itemId}/>:<About/>):
  id==='experience'?(itemId?<div className="timeline"><ExperienceEntry item={experiences.find(e=>e.id===itemId)??experiences[0]}/></div>:<Experience/>):
  id==='work'?<Work initialId={itemId}/>:
  id==='interests'?(itemId?<InterestDetail itemId={itemId}/>:<Interests/>):
  itemId?<ContactDetail itemId={itemId}/>:<Contact/>
 }</div>;
}
