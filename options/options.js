import { parseResumeFile } from '/parsers/resume-parser.js';

const fields = ["fullName","email","phone","address","linkedIn","github","portfolio","skills","education","experience","currentCompany","jobTitles","certifications","expectedSalary","noticePeriod","preferredLocation","coverLetterTemplate"];
let profiles = [];
let selectedId = null;

async function load() {
  try {
    const data = await chrome.storage.local.get(["profiles", "activeProfileId", "activityLogs", "theme"]);
    profiles = data.profiles || [];
    selectedId = data.activeProfileId || profiles[0]?.id || null;
    document.body.classList.toggle('light', data.theme === 'light');
    renderProfiles();
    renderForm();
    renderLogs(data.activityLogs || []);
  } catch (err) {
    console.error('Failed to load profiles:', err);
    alert('Failed to load profiles: ' + err.message);
  }
}

function renderProfiles(){
  const s=document.getElementById('profiles'); s.innerHTML='';
  profiles.forEach(p=>{const o=document.createElement('option');o.value=p.id;o.textContent=p.label||p.fullName||'Unnamed';if(p.id===selectedId)o.selected=true;s.appendChild(o);});
}

function renderForm(){
  const p=profiles.find(x=>x.id===selectedId);const wrap=document.getElementById('profileForm'); wrap.innerHTML=''; if(!p)return;
  const g=document.createElement('div'); g.className='grid';
  fields.forEach(f=>{const el=document.createElement(f.includes('experience')||f.includes('skills')||f.includes('education')||f.includes('cover')?'textarea':'input');el.dataset.key=f;el.value=p[f]||'';el.placeholder=f;g.appendChild(el);});
  wrap.appendChild(g);
}

function renderLogs(logs){document.getElementById('logs').textContent=logs.map(l=>`[${l.timestamp}] ${l.level}: ${l.message}`).join('\n');}

async function saveAll(){await chrome.storage.local.set({profiles,activeProfileId:selectedId});}

document.getElementById('profiles').addEventListener('change',e=>{selectedId=e.target.value;renderForm();});
document.getElementById('saveBtn').addEventListener('click',async()=>{
  const p=profiles.find(x=>x.id===selectedId); if(!p) return;
  document.querySelectorAll('#profileForm [data-key]').forEach(i=>p[i.dataset.key]=i.value);
  await saveAll(); alert('Profile saved');
});

document.getElementById('parseBtn').addEventListener('click',async()=>{
  try {
    const file=document.getElementById('resumeFile').files[0]; if(!file) return alert('Choose a file');
    const label=document.getElementById('profileLabel').value.trim()||file.name;
    const { parsed, rawText } = await parseResumeFile(file);
    const id = (typeof crypto.randomUUID === 'function') ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
    const profile={id,label,rawText,createdAt:new Date().toISOString(),...parsed};
    profiles.push(profile); selectedId=profile.id;
    await saveAll(); await chrome.storage.local.set({activeProfileId:selectedId});
    await load();
  } catch (err) {
    console.error('Parsing failed:', err);
    alert('Failed to parse resume: ' + err.message);
  }
});

document.getElementById('themeToggle').addEventListener('click',async()=>{
  const light=!document.body.classList.contains('light'); document.body.classList.toggle('light', light); await chrome.storage.local.set({theme: light?'light':'dark'});
});

document.getElementById('exportBtn').addEventListener('click',()=>{
  const blob=new Blob([JSON.stringify(profiles,null,2)],{type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='ai-job-autofiller-profiles.json'; a.click();
});

document.getElementById('importFile').addEventListener('change',async(e)=>{
  try {
    const f=e.target.files[0]; if(!f) return;
    const incoming=JSON.parse(await f.text()); if(!Array.isArray(incoming)) return;
    profiles=incoming; selectedId=profiles[0]?.id||null; await saveAll(); await load();
  } catch (err) {
    console.error('Import failed:', err);
    alert('Import failed: ' + err.message);
  }
});

load();
