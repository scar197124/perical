let STORIES=[];let selected=0;let filtered=[];let scope=[];let editionLabelMap=new Map();let editionRankMap=new Map();let activeFilter='All';let archiveFilters={edition:'All'};
const PAGE=document.body.dataset.page||'home';
const $=s=>document.querySelector(s);
const esc=(s='')=>String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
const unique=(arr,key)=>[...new Set(arr.map(s=>s[key]).filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b)));
const currentEdition=s=>s.isCurrent===true;
const archiveEdition=s=>s.edition||s.editionDate||'Unlabelled edition';
const ordinal=n=>{const words=['First','Second','Third','Fourth','Fifth','Sixth'];return words[n-1]||`${n}th`;};
function buildEditionLabels(arr){editionLabelMap=new Map();editionRankMap=new Map();const dates=new Map();const firstIndex=new Map();arr.forEach((s,index)=>{const raw=archiveEdition(s),date=s.editionDate||String(raw).split(' — ')[0];if(!firstIndex.has(raw))firstIndex.set(raw,index);if(!dates.has(date))dates.set(date,[]);if(!dates.get(date).includes(raw))dates.get(date).push(raw);});dates.forEach((raws,date)=>raws.forEach((raw,i)=>editionLabelMap.set(raw,raws.length>1?`${date} — ${ordinal(i+1)} Edition`:raw)));const ordered=[...firstIndex.keys()].sort((a,b)=>editionTimestamp(b)-editionTimestamp(a)||(firstIndex.get(b)-firstIndex.get(a)));ordered.forEach((raw,index)=>editionRankMap.set(raw,index));}
const editionLabel=raw=>editionLabelMap.get(raw)||raw;
const editionTimestamp=value=>{const match=String(value||'').match(/^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}/);const time=match?Date.parse(match[0]):NaN;return Number.isFinite(time)?time:-Infinity;};
const archiveEditionValues=arr=>[...new Set(arr.map(archiveEdition).filter(Boolean))].sort((a,b)=>(editionRankMap.get(a)??9999)-(editionRankMap.get(b)??9999));
const storyEditionIndex=s=>editionRankMap.get(archiveEdition(s))??9999;
const sortNewestFirst=arr=>arr.map((story,index)=>({story,index})).sort((a,b)=>storyEditionIndex(a.story)-storyEditionIndex(b.story)||a.index-b.index).map(x=>x.story);
function renderReader(story){
  const el=$('#reader');
  if(!story){
    el.innerHTML='<p class="empty">Select a story from the display panel.</p>';
    return;
  }
  const category=story.mainCategory||story.category||'Good News';
  const date=editionLabel(story.edition||story.editionDate||'');
  el.innerHTML=`
    <div class="reader-topline"><span class="story-kicker">${esc(category)}</span><span class="story-position">Story ${selected+1} of ${filtered.length}</span></div>
    <h2>${esc(story.title)}</h2>
    <div class="meta">
      <span class="chip">${esc(story.location||'Global')}</span>
      <span class="chip">${esc(category)}</span>
      <span class="chip">${esc(date)}</span>
    </div>
    <div class="reader-section story-brief">
      <h4>The story</h4>
      <div class="story-copy"><p>${esc(story.summary||'Story details are being prepared.')}</p></div>
    </div>
    <div class="reader-takeaways">
      <div class="reader-section takeaway-card">
        <h4>Ripple effect</h4>
        <p>${esc(story.ripple||'Its impact may extend into communities, future decisions, and related work.')}</p>
      </div>
      <div class="reader-section takeaway-card">
        <h4>Closing thought</h4>
        <p>${esc(story.closingThought||story.why||'A meaningful moment can continue to matter long after the story ends.')}</p>
      </div>
    </div>
    <div class="source">
      <span class="story-kicker">Source link</span>
      <a href="${esc(story.sourceUrl||'#')}" target="_blank" rel="noopener noreferrer">${esc(story.source||'View original source')} ↗</a>
    </div>`;
}
function selectStory(index){selected=index;renderReader(filtered[index]);document.querySelectorAll('.story-btn').forEach((b,i)=>b.classList.toggle('active',i===index));}
function renderList(){
  const list=$('#storyList');if(!list)return;
  if(!filtered.length){
    list.innerHTML=`<div class="empty-state"><strong>${PAGE==='home'?'The next Pericle edition is being prepared.':'No stories match these filters.'}</strong><span>${PAGE==='home'?'New stories added here will remain Home-only until the following edition.':'Try another category, location, or edition.'}</span></div>`;
    $('#count').textContent='0 stories';
    const wheelCount=$('#wheelResults');if(wheelCount)wheelCount.textContent='0 stories';
    renderReader(null);updateMobileDock();return;
  }
  selected=Math.min(selected,Math.max(0,filtered.length-1));list.innerHTML=filtered.map((s,i)=>`<button class="story-btn ${i===selected?'active':''}" data-i="${i}"><strong>${esc(s.title)}</strong><span>${esc(s.mainCategory||s.category)} · ${esc(s.location)}</span><small>${esc(editionLabel(s.edition||s.editionDate||'Pericle archive'))}</small></button>`).join('');list.querySelectorAll('button').forEach(b=>b.onclick=()=>{selectStory(+b.dataset.i);if(matchMedia('(max-width:560px)').matches){showMobileDock();document.querySelector('.reader-panel')?.scrollIntoView({behavior:'smooth',block:'start'});}});$('#count').textContent=`${filtered.length} ${filtered.length===1?'story':'stories'}`;const wheelCount=$('#wheelResults');if(wheelCount)wheelCount.textContent=`${filtered.length} ${filtered.length===1?'story':'stories'}`;renderReader(filtered[selected]);updateMobileDock();}
function applyArchiveFilters(){
  filtered=sortNewestFirst(scope.filter(s=>archiveFilters.edition==='All'||archiveEdition(s)===archiveFilters.edition));
  selected=0;renderList();
}
function applyFilter(value){
  activeFilter=value;
  if(!value||value==='All')filtered=sortNewestFirst(scope);
  else if(PAGE==='categories')filtered=sortNewestFirst(scope.filter(s=>(s.mainCategory||s.category)===value));
  else if(PAGE==='location')filtered=sortNewestFirst(scope.filter(s=>s.location===value));
  else filtered=sortNewestFirst(scope);
  selected=0;renderList();
  document.querySelectorAll('[data-browse-value]').forEach(b=>{
    const on=b.dataset.browseValue===value;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));
  });
  const locationSelect=$('#locationSelect');if(locationSelect&&locationSelect.value!==value)locationSelect.value=value;
  const categorySelect=$('#categorySelect');if(categorySelect&&categorySelect.value!==value)categorySelect.value=value;
}
function setupArchiveFilters(){
  const t=$('#toolbar');if(!t)return;
  const editions=archiveEditionValues(scope);
  const options=['<option value="All">All archived editions</option>',...editions.map(v=>`<option value="${esc(v)}">${esc(editionLabel(v))}</option>`)].join('');
  t.className='edition-selector';
  t.innerHTML=`<label for="editionSelect"><span>Editions</span><select id="editionSelect">${options}</select></label>`;
  const latestEdition=editions[0]||'All';archiveFilters.edition=latestEdition;activeFilter=latestEdition;
  const select=t.querySelector('select');select.value=latestEdition;
  select.addEventListener('change',()=>{archiveFilters.edition=select.value;activeFilter=select.value;applyArchiveFilters();});
}
function setupCategoryBrowser(){
  const t=$('#toolbar');if(!t)return;
  const values=unique(scope,'mainCategory');
  const options=['<option value="All">All categories</option>',...values.map(v=>`<option value="${esc(v)}">${esc(v)} · ${scope.filter(s=>(s.mainCategory||s.category)===v).length}</option>`)].join('');
  t.className='category-selector';
  t.innerHTML=`<label for="categorySelect"><span>Categories</span><select id="categorySelect">${options}</select></label>`;
  t.querySelector('select').addEventListener('change',e=>applyFilter(e.target.value));
}
function setupLocationBrowser(){
  const t=$('#toolbar');if(!t)return;
  const values=unique(scope,'location');
  const options=['<option value="All">All locations</option>',...values.map(v=>`<option value="${esc(v)}">${esc(v)} · ${scope.filter(s=>s.location===v).length}</option>`)].join('');
  t.className='location-browser';
  t.innerHTML=`<div class="browse-heading"><span>Browse locations</span><small>Alphabetical places</small></div><label for="locationSelect" class="location-select-label"><span>Location</span><select id="locationSelect">${options}</select></label>`;
  t.querySelector('select').addEventListener('change',e=>applyFilter(e.target.value));
}
function setupToolbar(){
  const t=$('#toolbar');if(!t)return;
  if(PAGE==='archive'){setupArchiveFilters();return;}
  if(PAGE==='categories'){setupCategoryBrowser();return;}
  if(PAGE==='location'){setupLocationBrowser();return;}
  t.remove();
}
function setupMobileDock(){
  if(document.querySelector('.mobile-selector-dock'))return;
  const dock=document.createElement('div');dock.className='mobile-selector-dock';dock.setAttribute('aria-label','Mobile story controls');
  dock.innerHTML='<button type="button" data-dock="previous" aria-label="Previous story">‹</button><button type="button" class="dock-label" data-dock="selector">Stories</button><button type="button" data-dock="next" aria-label="Next story">›</button>';
  document.body.appendChild(dock);
  dock.querySelector('[data-dock="previous"]').onclick=()=>{if(filtered.length){selectStory((selected-1+filtered.length)%filtered.length);updateMobileDock();}};
  dock.querySelector('[data-dock="next"]').onclick=()=>{if(filtered.length){selectStory((selected+1)%filtered.length);updateMobileDock();}};
  dock.querySelector('[data-dock="selector"]').onclick=()=>{const target=$('#toolbar')?.children.length?$('#toolbar'):$('#storyList');target?.scrollIntoView({behavior:'smooth',block:'start'});};
}
function updateMobileDock(){const label=document.querySelector('.mobile-selector-dock .dock-label');if(!label)return;const group=activeFilter==='All'?(PAGE==='home'?'Current Edition':PAGE==='archive'?'All Editions':PAGE==='categories'?'All Categories':'All Locations'):(PAGE==='archive'?editionLabel(activeFilter):activeFilter);label.textContent=`${group} · ${selected+1}/${Math.max(filtered.length,1)}`;}
function showMobileDock(){setupMobileDock();document.body.classList.add('mobile-reading');updateMobileDock();}
function updateStats(){
  const current=STORIES.filter(currentEdition).length;
  const archived=STORIES.filter(s=>!currentEdition(s)).length;
  const categories=unique(STORIES,'mainCategory').length;
  const locations=unique(STORIES,'location').length;
  document.querySelectorAll('[data-stat="current"]').forEach(el=>el.textContent=current);
  document.querySelectorAll('[data-stat="archive"]').forEach(el=>el.textContent=archived);
  const title=document.querySelector('.page-title');
  if(title&&!title.querySelector('.edition-metrics')){
    const metrics=document.createElement('div');
    metrics.className='edition-metrics';
    metrics.innerHTML=`<span><b>${PAGE==='home'?current:PAGE==='archive'?archived:STORIES.length}</b>${PAGE==='home'?'Current stories':PAGE==='archive'?'Archived stories':'Stories available'}</span><span><b>${categories}</b>Editorial categories</span><span><b>${locations}</b>Places represented</span><span class="editorial-note">Evidence-led stories of people, nature, science, and progress.</span>`;
    title.appendChild(metrics);
  }
}
const bootStories=()=>{
  const data=window.STORIES;
  STORIES=Array.isArray(data)?data:[];buildEditionLabels(STORIES);
  if(!STORIES.length){
    const reader=$('#reader');
    if(reader)reader.innerHTML='<p class="empty">No story records were found in the embedded data.</p>';
    return;
  }
  scope=PAGE==='home'?STORIES.filter(currentEdition):PAGE==='archive'?STORIES.filter(s=>!currentEdition(s)):STORIES;
  scope=sortNewestFirst(scope);
  filtered=[...scope];
  setupToolbar();
  if(PAGE==='archive')applyArchiveFilters();else applyFilter('All');
  updateStats();setupMobileDock();updateMobileDock();
};
bootStories();

// v11.2 unified active navigation
document.querySelectorAll('.nav a[data-nav]').forEach(a=>{if(a.dataset.nav===PAGE)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
