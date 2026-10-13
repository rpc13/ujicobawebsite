(async()=>{
const Q=s=>document.querySelector(s);
document.head.insertAdjacentHTML('beforeend','<style>'+`body.editing{padding-top:52px;padding-bottom:64px}.editing #nav{top:52px}
#etb{position:fixed;top:0;left:0;right:0;z-index:1000;background:#0f172a;color:#fff;display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:8px 12px;font:500 .8rem Inter,sans-serif}
#etb button,#esb button{background:#334155;color:#fff;border:0;border-radius:6px;padding:6px 10px;cursor:pointer;font:inherit}#etb button:hover{background:#475569}
#etb input{width:30px;height:28px;padding:0;border:0;background:none;cursor:pointer}#etb .sp{flex:1;opacity:.7;min-width:160px}
#esb{position:fixed;bottom:0;left:0;right:0;z-index:1000;background:#0f172a;color:#fff;display:flex;justify-content:space-between;align-items:center;padding:10px 16px;font:500 .85rem Inter,sans-serif}
#esb button{background:#16a34a;padding:9px 20px;font-weight:700}#toast{bottom:80px;z-index:1100}
.editing [data-e]{outline:1px dashed #38bdf866;outline-offset:2px;cursor:text}.editing [data-e]:hover{outline-color:#38bdf8}.editing .esel{outline:2px solid #2563eb!important}.editing [data-img]{cursor:pointer}
#emv,#erz{position:fixed;z-index:1001;width:22px;height:22px;border-radius:50%;background:#2563eb;color:#fff;display:none;place-items:center;font-size:.7rem;touch-action:none}#emv{cursor:move}#erz{cursor:nwse-resize}`+'</style>');
try{await api('me')}catch(e){alert('Sesi admin berakhir. Buka kembali dari panel admin.');return}
clearInterval(window.si);document.body.classList.add('editing');
document.body.insertAdjacentHTML('beforeend',`<div id="etb"><b>✏️ Mode Edit</b><button data-a="left">Kiri</button><button data-a="center">Tengah</button><button data-a="right">Kanan</button><button data-a="justify">Rata</button><button data-f="-2">A−</button><button data-f="2">A+</button><button data-t="b"><b>B</b></button><button data-t="i"><i>I</i></button><input type="color" id="ecl" title="Warna teks"><button id="eimg" style="display:none">🖼 Ganti Gambar</button><button id="erst">↺ Reset</button><span class="sp">Klik teks untuk mengetik · seret ✥ untuk memindah · seret ⇲ untuk mengubah ukuran · tempel/seret gambar ke foto untuk mengganti</span></div><div id="esb"><span id="est">Belum ada perubahan</span><button id="esv">💾 Simpan Perubahan</button></div><div id="emv">✥</div><div id="erz">⇲</div>`);
const S=applyStyles(),dirty=new Set(),vals={},mv=Q('#emv'),rz=Q('#erz');let sel=null,sd=false;
const upd=()=>Q('#est').textContent=dirty.size||sd?`${dirty.size} teks/gambar diubah${sd?' · gaya diubah':''} — belum disimpan`:'Belum ada perubahan';
const pos=()=>{if(!sel){mv.style.display=rz.style.display='none';return}const r=sel.getBoundingClientRect();mv.style.display=rz.style.display='grid';mv.style.left=r.left-11+'px';mv.style.top=r.top-11+'px';rz.style.left=r.right-11+'px';rz.style.top=r.bottom-11+'px'};setInterval(pos,100);
const pick=t=>{if(sel){sel.classList.remove('esel');sel.contentEditable='false'}sel=t;if(t){t.classList.add('esel');if(!t.dataset.img)t.contentEditable='true';Q('#eimg').style.display=t.dataset.img?'':'none'}pos()};
document.addEventListener('click',e=>{if(e.target.closest('#etb,#esb,#emv,#erz'))return;e.preventDefault();e.stopPropagation();pick(e.target.closest('[data-e]'))},true);
document.addEventListener('input',e=>{const k=e.target.dataset&&e.target.dataset.e;if(k){dirty.add(k);upd()}});
const ap=f=>{if(!sel)return toast('Pilih teks atau gambar dulu',1);const k=sel.dataset.e,o=S[k]=S[k]||{};f(o);sty(sel,o);sd=true;upd()};
Q('#etb').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
if(d.a)ap(o=>o.a=d.a);else if(d.f)ap(o=>o.fs=Math.max(8,Math.round((o.fs||parseFloat(getComputedStyle(sel).fontSize))+ +d.f)));else if(d.t)ap(o=>o[d.t]=!o[d.t]);
else if(b.id=='erst'&&sel){delete S[sel.dataset.e];sty(sel,{});sd=true;upd()}else if(b.id=='eimg')chooseImg()});
Q('#ecl').oninput=e=>ap(o=>o.c=e.target.value);
const drag=(h,fn)=>h.addEventListener('pointerdown',e=>{if(!sel)return;e.preventDefault();e.stopPropagation();const k=sel.dataset.e,o=S[k]=S[k]||{},r=sel.getBoundingClientRect(),x0=e.clientX,y0=e.clientY,s0={x:o.x||0,y:o.y||0,w:r.width,h:r.height};
const mm=v=>{fn(o,v.clientX-x0,v.clientY-y0,s0);sty(sel,o);sd=true;upd()},end=()=>{removeEventListener('pointermove',mm);removeEventListener('pointerup',end)};addEventListener('pointermove',mm);addEventListener('pointerup',end)});
drag(mv,(o,dx,dy,s)=>{o.x=Math.round(s.x+dx);o.y=Math.round(s.y+dy)});
drag(rz,(o,dx,dy,s)=>{o.w=Math.max(30,Math.round(s.w+dx));if(sel.dataset.img)o.h=Math.max(30,Math.round(s.h+dy))});
const up=f=>new Promise((ok,no)=>{const r=new FileReader;r.onload=()=>{const im=new Image;im.onload=()=>{const q=Math.min(1,1400/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*q;c.height=im.height*q;c.getContext('2d').drawImage(im,0,0,c.width,c.height);const png=f.type=='image/png'&&c.toDataURL('image/png').length<1.2e6,d=c.toDataURL(png?'image/png':'image/jpeg',.82);api('upload',{filename:f.name.replace(/\.\w+$/,'')+(png?'.png':'.jpg'),mimeType:png?'image/png':'image/jpeg',data:d.split(',')[1]}).then(x=>ok(x.url),no)};im.onerror=()=>no(Error('File bukan gambar'));im.src=r.result};r.readAsDataURL(f)});
const setImg=async f=>{if(!sel||!sel.dataset.img||!f)return;toast('Mengunggah gambar…');try{const u=await up(f);sel.src=u;vals[sel.dataset.e]=u;dirty.add(sel.dataset.e);upd();toast('Gambar diganti. Jangan lupa Simpan.')}catch(x){toast(x.message,1)}};
const chooseImg=async()=>{try{if(window.showOpenFilePicker){const[h]=await showOpenFilePicker({types:[{description:'Gambar',accept:{'image/*':['.jpg','.jpeg','.png','.webp','.gif']}}]});return setImg(await h.getFile())}}catch(e){if(e.name=='AbortError')return}
const i=document.createElement('input');i.type='file';i.style.cssText='position:fixed;left:-9999px';i.onchange=()=>{setImg(i.files[0]);i.remove()};document.body.appendChild(i);i.click()};
addEventListener('paste',e=>{const f=[...(e.clipboardData?.files||[])].find(x=>/^image\//.test(x.type));if(f&&sel&&sel.dataset.img){e.preventDefault();setImg(f)}});
addEventListener('dragover',e=>e.preventDefault());
addEventListener('drop',e=>{e.preventDefault();const f=[...e.dataTransfer.files].find(x=>/^image\//.test(x.type)),t=e.target.closest&&e.target.closest('[data-img]');if(f&&t){pick(t);setImg(f)}});
Q('#esv').onclick=async()=>{const b=Q('#esv');b.disabled=true;b.textContent='Menyimpan…';try{const sets={},cols={};
dirty.forEach(k=>{const el=document.querySelector(`[data-e="${k}"]`);if(!el)return;const v=el.dataset.img?vals[k]:el.innerText.replace(/\n{3,}/g,'\n\n').trim(),p=k.split(':');
if(p[0]=='set')sets[p[1]]=v;else{const id=p[1]+':'+p[2];(cols[id]=cols[id]||{collection:p[1],item:{id:p[2]}}).item[p[3]]=v}});
sets.gaya_halaman=JSON.stringify(S);await api('saveSettings',{settings:sets});for(const c of Object.values(cols))await api('save',c);
dirty.clear();sd=false;upd();toast('Tersimpan! Website sudah diperbarui.')}catch(x){toast(x.message,1)}finally{b.disabled=false;b.textContent='💾 Simpan Perubahan'}};
addEventListener('beforeunload',e=>{if(dirty.size||sd){e.preventDefault();e.returnValue=''}});
})();
