const C='exampilot-v2';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html'])));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||!(u.origin===location.origin||u.host==='www.gstatic.com'))return;
  if(r.mode==='navigate'){
    e.respondWith(fetch(r).then(x=>{const y=x.clone();caches.open(C).then(c=>c.put('./index.html',y));return x}).catch(()=>caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.open(C).then(async c=>{
    const m=await c.match(r);
    const n=fetch(r).then(x=>{if(x.ok)c.put(r,x.clone());return x}).catch(()=>m||Response.error());
    return m||n;
  }));
});
