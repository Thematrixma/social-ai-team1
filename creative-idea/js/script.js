(function(){'use strict';
let currentLang=localStorage.getItem('ci-lang')||'en';
const $=(sel,ctx=document)=>ctx.querySelector(sel);
const $$=(sel,ctx=document)=>[...ctx.querySelectorAll(sel)];
function applyLang(lang){
  currentLang=lang;
  const isAr=lang==='ar';
  const root=$('#html-root');
  root.setAttribute('lang',lang);
  root.setAttribute('dir',isAr?'rtl':'ltr');
  document.body.classList.toggle('lang-ar',isAr);
  $$('[data-en]').forEach(el=>{
    const text=isAr?el.dataset.ar:el.dataset.en;
    if(!text)return;
    if(el.tagName==='TITLE'){document.title=text;return;}
    if(el.tagName==='INPUT'||el.tagName==='TEXTAREA'){el.placeholder=text;return;}
    if(el.tagName==='OPTION'){el.textContent=text;return;}
    el.innerHTML=text;
  });
  $$('select option[data-en]').forEach(opt=>{opt.textContent=isAr?opt.dataset.ar:opt.dataset.en;});
  const btn=$('#lang-toggle');
  if(btn){
    $('#lang-toggle .lang-en').style.display=isAr?'inline':'none';
    $('#lang-toggle .lang-ar').style.display=isAr?'none':'inline';
  }
  localStorage.setItem('ci-lang',lang);
}
function initLangToggle(){
  const btn=$('#lang-toggle');
  if(!btn)return;
  btn.addEventListener('click',()=>applyLang(currentLang==='en'?'ar':'en'));
}
function initNavbar(){
  const nav=$('#navbar');
  if(!nav)return;
  const onScroll=()=>nav.classList.toggle('scrolled',window.scrollY>40);
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  const burger=$('#hamburger'),links=$('#nav-links');
  if(burger&&links){
    burger.addEventListener('click',()=>{burger.classList.toggle('open');links.classList.toggle('open');});
    $$('#nav-links a').forEach(a=>a.addEventListener('click',()=>{burger.classList.remove('open');links.classList.remove('open');}));
  }
}
function initParticles(){
  const container=$('#particles');
  if(!container)return;
  const colors=['#C9A84C','#E8C96A','#EC4899','#6C63FF','#10B981'];
  for(let i=0;i<28;i++){
    const p=document.createElement('div');
    p.className='particle';
    const size=Math.random()*4+2,left=Math.random()*100,delay=Math.random()*12,dur=Math.random()*12+8,color=colors[Math.floor(Math.random()*colors.length)];
    p.style.cssText=`width:${size}px;height:${size}px;left:${left}%;bottom:0;background:${color};animation-delay:${delay}s;animation-duration:${dur}s;`;
    container.appendChild(p);
  }
}
function initScrollReveal(){
  const els=$$('.reveal');
  if(!els.length)return;
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}});
  },{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
  els.forEach(el=>obs.observe(el));
}
function animateCounter(el,target,duration=1800){
  const start=performance.now();
  const step=now=>{
    const elapsed=now-start,progress=Math.min(elapsed/duration,1),eased=1-Math.pow(1-progress,3);
    el.textContent=Math.round(eased*target);
    if(progress<1)requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
function initCounters(){
  const counters=$$('.stat-num[data-target]');
  if(!counters.length)return;
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){animateCounter(e.target,parseInt(e.target.dataset.target,10));obs.unobserve(e.target);}});
  },{threshold:0.5});
  counters.forEach(el=>obs.observe(el));
}
function initContactForm(){
  const form=$('#contact-form'),success=$('#form-success');
  if(!form||!success)return;
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const name=$('#name',form).value.trim(),email=$('#email',form).value.trim(),msg=$('#message',form).value.trim();
    if(!name||!email||!msg){
      [name?null:$('#name',form),email?null:$('#email',form),msg?null:$('#message',form)].filter(Boolean).forEach(el=>{
        el.style.borderColor='#EF4444';el.style.animation='shake 0.4s ease';
        setTimeout(()=>{el.style.borderColor='';el.style.animation='';},600);
      });return;
    }
    const btn=form.querySelector('button[type="submit"]'),orig=btn.textContent;
    btn.textContent=currentLang==='ar'?'جارٍ الإرسال...':'Sending...';
    btn.disabled=true;
    setTimeout(()=>{form.reset();btn.textContent=orig;btn.disabled=false;success.classList.add('show');setTimeout(()=>success.classList.remove('show'),5000);},1200);
  });
}
function initSmoothScroll(){
  $$('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const id=a.getAttribute('href').slice(1);if(!id)return;
      const target=document.getElementById(id);if(!target)return;
      e.preventDefault();
      window.scrollTo({top:target.getBoundingClientRect().top+window.scrollY-72,behavior:'smooth'});
    });
  });
}
function initActiveNav(){
  const sections=$$('section[id]'),navAs=$$('.nav-links a[href^="#"]');
  if(!sections.length||!navAs.length)return;
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        navAs.forEach(a=>a.classList.remove('active'));
        const match=navAs.find(a=>a.getAttribute('href')==='#'+e.target.id);
        if(match)match.classList.add('active');
      }
    });
  },{threshold:0.4,rootMargin:'-80px 0px 0px 0px'});
  sections.forEach(s=>obs.observe(s));
}
function injectStyles(){
  const style=document.createElement('style');
  style.textContent='@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}.nav-links a.active{color:var(--gold)!important}';
  document.head.appendChild(style);
}
function init(){
  injectStyles();applyLang(currentLang);initLangToggle();initNavbar();initParticles();
  initScrollReveal();initCounters();initContactForm();initSmoothScroll();initActiveNav();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}
})();