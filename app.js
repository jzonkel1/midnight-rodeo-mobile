'use strict';
const menuButton = document.querySelector('.menu-button');
const menu = document.querySelector('#mobile-menu');
function closeMenu() { menu.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Open menu'); }
menuButton.addEventListener('click', () => { const open = menu.hidden; menu.hidden = !open; menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); });
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !menu.hidden) { closeMenu(); menuButton.focus(); } });
document.addEventListener('click', event => { if (!menu.hidden && !menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu(); });
window.matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
document.querySelector('#year').textContent = new Date().getFullYear();
// Use Corpus Christi time and keep the previous night's event until 2 AM.
const lineup = {0:['Young Country Night','8 PM–close · 18 & up · No cover for 21+'],3:['Ladies Night','5 PM–close · $3 margaritas all night'],4:['Military & first responders','5 PM–close · $1.75 Bud Light all night'],5:['Country & dancing','5 PM–2 AM · Bring your crew'],6:['Saturday at the Rodeo','6 PM–2 AM · Country music & dancing']};
function updateNight(now = new Date()) {
 const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {timeZone:'America/Chicago',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',hourCycle:'h23'}).formatToParts(now).map(p => [p.type,p.value]));
 const date = new Date(Date.UTC(+parts.year,+parts.month-1,+parts.day));
 const afterMidnight = +parts.hour < 2;
 if(afterMidnight) date.setUTCDate(date.getUTCDate()-1);
 let day = date.getUTCDay();
 let label = afterMidnight && lineup[day] ? 'Late night at the Rodeo' : 'Tonight at the Rodeo';
 if(!lineup[day]) { label='Up next · Wednesday'; while(date.getUTCDay()!==3) date.setUTCDate(date.getUTCDate()+1); day=3; }
 document.querySelector('#night-day').textContent=new Intl.DateTimeFormat('en-US',{weekday:'short',timeZone:'UTC'}).format(date).toUpperCase();
 document.querySelector('#night-date').textContent=date.getUTCDate();
 document.querySelector('#night-label').textContent=label;
 document.querySelector('#night-title').textContent=lineup[day][0];
 document.querySelector('#night-detail').textContent=lineup[day][1];
}
updateNight();
document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateNight()});
const flyerDialog=document.querySelector('.flyer-dialog');
document.querySelectorAll('[data-flyer]').forEach(link=>link.addEventListener('click',event=>{
 if(typeof flyerDialog.showModal!=='function')return;
 event.preventDefault();flyerDialog.querySelector('img').src=link.getAttribute('href');flyerDialog.querySelector('img').alt=link.querySelector('img').alt;flyerDialog.setAttribute('aria-label',link.dataset.flyer+' flyer');flyerDialog.showModal();document.body.classList.add('locked');
}));
document.querySelector('.dialog-close').addEventListener('click',()=>flyerDialog.close());
flyerDialog.addEventListener('close',()=>document.body.classList.remove('locked'));
flyerDialog.addEventListener('click',event=>{if(event.target===flyerDialog){const r=flyerDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)flyerDialog.close()}});
document.querySelectorAll('[data-topic]').forEach(link=>link.addEventListener('click',()=>{document.querySelector('#topic').value=link.dataset.topic}));
document.querySelector('#inquiry-form').addEventListener('submit',event=>{
 event.preventDefault();const data=new FormData(event.currentTarget);const subject='Midnight Rodeo inquiry: '+data.get('topic');const body='Hi Midnight Rodeo,\n\nMy name is '+data.get('name').trim()+'. I’m interested in '+data.get('topic')+'.\n\n'+data.get('message').trim()+'\n\nThank you!';
 window.location.href='mailto:mrcrp@mrcrp.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
 document.querySelector('#form-status').textContent='Finish sending in your email app. If it didn’t open, email mrcrp@mrcrp.com or call (361) 277-6336.';
});

// Silent, lightweight motion. A still image stays visible if autoplay is blocked.
const video = document.querySelector('#hero-video');
const videoToggle = document.querySelector('.video-toggle');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const connection = navigator.connection;
let videoUserPaused = false;
let videoInView = true;
function allowVideo() { return !motionPreference.matches && !connection?.saveData && !['slow-2g','2g'].includes(connection?.effectiveType); }
function playVideo() { if (video.getAttribute('src') && allowVideo() && !videoUserPaused && videoInView && !document.hidden) video.play().catch(() => { videoToggle.hidden = false; videoToggle.innerHTML = '<span aria-hidden="true">▷</span> Play video'; videoToggle.setAttribute('aria-label','Play background video'); }); }
function setupVideo() {
 if (!allowVideo()) return;
 if (!video.getAttribute('src')) video.src = window.matchMedia('(max-width: 760px)').matches ? 'media/club-atmosphere-mobile.mp4' : 'media/club-atmosphere-desktop.mp4';
 video.muted = true;
 playVideo();
}
video.addEventListener('playing', () => { video.classList.add('ready'); videoToggle.hidden = false; videoToggle.innerHTML = '<span aria-hidden="true">Ⅱ</span> Pause video'; videoToggle.setAttribute('aria-label','Pause background video'); });
video.addEventListener('pause', () => { videoToggle.innerHTML = '<span aria-hidden="true">▷</span> Play video'; videoToggle.setAttribute('aria-label','Play background video'); });
video.addEventListener('error', () => { video.classList.remove('ready'); videoToggle.hidden = true; });
videoToggle.addEventListener('click', () => { videoUserPaused = !video.paused; if (videoUserPaused) video.pause(); else playVideo(); });
if ('IntersectionObserver' in window) new IntersectionObserver(entries => { videoInView = entries[0].isIntersecting; if (videoInView) playVideo(); else video.pause(); },{threshold:.1}).observe(document.querySelector('.hero'));
document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); else playVideo(); });
motionPreference.addEventListener('change', () => { if (motionPreference.matches) { video.pause(); video.removeAttribute('src'); video.load(); video.classList.remove('ready'); videoToggle.hidden = true; } else setupVideo(); });
if (document.readyState === 'complete') setupVideo(); else window.addEventListener('load',setupVideo,{once:true});
