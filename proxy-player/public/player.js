// player.js
const inputUrl = document.getElementById('inputUrl');
const playBtn = document.getElementById('playBtn');
const jsonUrl = document.getElementById('jsonUrl');
const loadJsonBtn = document.getElementById('loadJsonBtn');
const video = document.getElementById('video');
const log = document.getElementById('log');

function logMsg(msg){
  if(!log) return;
  const p = document.createElement('p');
  p.textContent = new Date().toLocaleTimeString() + ' — ' + msg;
  log.prepend(p);
}

function playWithHls(url){
  const proxyUrl = '/proxy?url=' + encodeURIComponent(url);
  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(proxyUrl);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function() {
      video.play();
    });
    hls.on(Hls.Events.ERROR, function(event, data) {
      logMsg('HLS error: ' + JSON.stringify(data));
    });
  } else {
    video.src = proxyUrl;
    video.play().catch(e => logMsg('Play error: ' + e.message));
  }
  logMsg('Playing (proxied): ' + url);
}

playBtn.addEventListener('click', () => {
  const url = inputUrl.value.trim();
  if(!url){ alert('Please paste m3u8 URL'); return; }
  playWithHls(url);
});

loadJsonBtn.addEventListener('click', async () => {
  const jurl = jsonUrl.value.trim();
  if(!jurl){ alert('Please enter JSON URL'); return; }
  try {
    const res = await fetch(jurl);
    const data = await res.json();
    if(data && data.data){
      inputUrl.value = data.data;
      playWithHls(data.data);
    } else {
      alert('JSON did not contain "data" field');
    }
  } catch(e){
    alert('Failed to load JSON: ' + e.message);
  }
});
