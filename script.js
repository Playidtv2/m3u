// Sidebar IPTV UI — script.js (uses GROUP_DEFINITIONS)
const GROUP_DEFINITIONS = [
    { name: "ดิจิทัลทีวี", path: "playlists/digital_tv.json" },
    { name: "สารคดี", path: "playlists/documentary.json" },
    { name: "บันเทง", path: "playlists/entertain.json" },
    { name: "Max", path: "playlists/monomax_ais.json" },
    { name: "Sports", path: "playlists/sports.json" },
    { name: "Cartoon", path: "playlists/cartoon.json" }
];

let CURRENT_CHANNELS = [];
let currentChannel = null;

function createGroupButtons(){
  const container = document.getElementById('group-container');
  container.innerHTML = '';
  GROUP_DEFINITIONS.forEach((g, idx) => {
    const btn = document.createElement('button');
    btn.className = 'group-button';
    btn.innerText = g.name;
    btn.onclick = ()=>{
      document.querySelectorAll('.group-button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      loadGroupChannels(g.path);
    };
    container.appendChild(btn);
  });
  // auto click first
  setTimeout(()=>{
    const first = document.querySelector('.group-button');
    if(first) first.click();
  },20);
}

function renderChannelList(searchTerm=''){
  const list = document.getElementById('channel-list');
  list.innerHTML='';
  const filtered = CURRENT_CHANNELS.filter(ch => ch.name && ch.name.toLowerCase().includes(searchTerm.toLowerCase()));
  if(filtered.length===0){
    list.innerHTML = '<div style="padding:12px;color:var(--muted)">ไม่พบช่องตามที่ค้นหา</div>';
    document.getElementById('player').innerHTML = '<div class="player-placeholder"><p>ไม่พบช่องที่ตรงกับคำค้นหา</p></div>';
    document.getElementById('now-playing').innerText = 'ยังไม่มีช่องที่เล่น';
    return;
  }
  filtered.forEach((ch, i)=>{
    const el = document.createElement('div');
    el.className = 'channel-item';
    el.innerHTML = `
      ${ch.logo? `<img src="${ch.logo}" alt="${ch.name}">` : '<div style="width:72px;height:48px;background:#222;border-radius:8px"></div>'}
      <div class="channel-text">
        <div class="channel-name">${ch.name}</div>
        <div class="channel-info">${ch.info||''}</div>
      </div>
    `;
    el.onclick = ()=>{
      document.querySelectorAll('.channel-item').forEach(x=>x.classList.remove('active'));
      el.classList.add('active');
      playChannel(ch);
    };
    list.appendChild(el);
  });
}

async function loadGroupChannels(groupPath){
  const list = document.getElementById('channel-list');
  list.innerHTML = '<div style="padding:12px">กำลังโหลดช่อง...</div>';
  const searchBox = document.getElementById('search-box');
  if(searchBox) searchBox.value='';
  try{
    const res = await fetch(groupPath);
    if(!res.ok) throw new Error('โหลดไม่สำเร็จ: '+res.statusText);
    CURRENT_CHANNELS = await res.json();
    renderChannelList();
    // do not autoplay — wait for click
    document.getElementById('now-playing').innerText = 'ยังไม่ได้เลือกช่อง';
  }catch(err){
    console.error(err);
    CURRENT_CHANNELS = [];
    list.innerHTML = '<div style="padding:12px;color:#ff8b8b">Error loading channels</div>';
    document.getElementById('player').innerHTML = '<div class="player-placeholder"><p>ไม่สามารถโหลดรายการช่องในกลุ่มนี้ได้</p></div>';
  }
}

function playChannel(channel){
  currentChannel = channel;
  document.getElementById('now-playing').innerText = channel.name;
  // clear player and create jw container
  const playerDiv = document.getElementById('player');
  playerDiv.innerHTML = '<div id="jwplayer-container" style="width:100%;height:100%;"></div>';
  const cfg = {
    file: channel.file,
    autostart: true,
    width: "100%",
    height: "100%"
  };
  try{
    if(typeof jwplayer !== 'undefined'){
      jwplayer('jwplayer-container').setup(cfg);
    } else {
      playerDiv.innerHTML = '<div class="player-placeholder"><p>JW Player library ไม่ถูกโหลด — กรุณาเพิ่ม library ของคุณใน index.html</p></div>';
    }
  }catch(e){
    console.error(e);
    playerDiv.innerHTML = '<div class="player-placeholder"><p>เกิดข้อผิดพลาดในการเริ่ม player</p></div>';
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  createGroupButtons();
  const searchBox = document.getElementById('search-box');
  if(searchBox) searchBox.addEventListener('input', ()=> renderChannelList(searchBox.value));
});
