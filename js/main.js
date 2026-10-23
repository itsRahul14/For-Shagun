/* Personalize the experience here. Keep all names and message copy in this object. */
const CONFIG = {
  herName: 'Shagun',
  yourName: 'Rahul',
  openingText: 'I wanted to tell you something for a while. So I made this little corner for you — no pressure, just honest feelings and a hope that it makes you smile.',
  stops: [
    { title: 'Tumhari barabari…', message: 'Tumhari barabari karne ko toh chaand bhi kam padta hai. Tumhare baare mein likhne lagoon toh har kitaab ka panna chhota padta hai.' },
    { title: 'Hazaaron mein alag.', message: 'Ladkiyan dekhi hazaaron hain, lekin tumsi nahi dekh paaya. Kehna tumse bahut pehle tha, lekin darr ke maare nahi keh paaya.' },
    { title: 'Aaj himmat kar li.', message: 'Lekin aaj himmat karke tumse main bolta hoon… Shagun, main tumko pasand karta hoon. ♡' },
    { title: 'Dil ki ek aur baat.', message: 'Kehne ko toh bahut kuch hai tumse, lekin tumhari hansi ke aage ruk jaata hoon. Bahut baar sochta hoon chhodo, nahi maan rahi, aage badhte hain… lekin iss dil ke maare jhuk jaata hoon.' }
  ],
  note: {
    greeting: 'Hey Shagun,',
    paragraphs: [
      'Tumhari barabari karne ko toh chaand bhi kam padta hai. Tumhare baare mein likhne lagoon toh har kitaab ka panna chhota padta hai. Ladkiyan dekhi hazaaron hain, lekin tumsi nahi dekh paaya. Kehna tumse bahut pehle tha, lekin darr ke maare nahi keh paaya. Lekin aaj himmat karke tumse main bolta hoon — Shagun, main tumko pasand karta hoon…',
      'Kehne ko toh bahut kuch hai tumse, lekin tumhari hansi ke aage ruk jaata hoon. Bahut baar sochta hoon chhodo, nahi maan rahi, aage badhte hain, lekin iss dil ke maare jhuk jaata hoon.',
      'Socha nahi tha ab kisi se main pyaar kar paaunga, lekin tumhe milke lagta hai shayad ab aapke bina reh hi nahi paaunga. Pata hai mujhe shayad aap apna decision kabhi change nahi karengi, aur yeh bhi sach hai mera dil bhi haar toh nahi maanega.',
      'Toh dil ko kehna bas itna hai tumse ki hum tumse bahut pyaar karte hain na. Bhale hi rishta bane ya na bane, aur kuch nahi toh dost banke rehte hain na. 🤗😊',
      'P.S. Yeh message tumse kisi jawab ki umeed ya pressure ke liye nahi hai. Tum jo feel karti ho, woh important hai. Main bas chahta tha ki tum meri baat jaan lo.'
    ],
    signoff: 'With care,\nRahul ♡'
  },
  ticket: {
    heading: 'A Little Keepsake',
    route: 'A Familiar Smile → A Special Memory',
    message: 'Some people make ordinary days feel a little more beautiful, just by being themselves.',
    support: 'Whatever your answer, I am glad I got to know you.',
    footer: 'Made for Shagun'
  },
  audioPath: 'assets/audio/our-song.mpeg',
  photos: [
    { path: 'assets/photos/photo-1.jpg', alt: 'Shagun smiling in a yellow outfit at a festive evening' },
    { path: 'assets/photos/photo-2.jpg', alt: 'Shagun in a purple outfit at night' },
    { path: 'assets/photos/photo-3.jpg', alt: 'Shagun smiling outside a building in a purple outfit' },
    { path: 'assets/photos/photo-4.jpg', alt: 'Shagun in a yellow outfit beside a car' }
  ]
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const stages = ['readyQuestion', 'opening', 'journey', 'memories', 'keepsake', 'games'];
let currentStage = 'readyQuestion';
let currentStop = 0;
const visitedStops = new Set();
let noteOpen = false;
let toastTimer;

function replaceName(text) {
  return text.replaceAll('[HER_NAME]', CONFIG.herName).replaceAll('[YOUR_NAME]', CONFIG.yourName);
}
function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}
function setStage(stage, { scroll = true } = {}) {
  if (!stages.includes(stage)) return;
  currentStage = stage;
  stages.forEach(id => {
    const el = document.getElementById(id);
    const active = id === stage;
    el.hidden = !active;
    el.classList.toggle('active', active);
  });
  if (scroll) window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  if (stage === 'keepsake') {
    const wrap = $('#ticketWrap');
    wrap.classList.remove('replay-ticket');
    // Reapply the reveal if the ticket is revisited.
    void wrap.offsetWidth;
    wrap.classList.add('replay-ticket');
  }
}

function updateStop(index, playful = true) {
  currentStop = Math.max(0, Math.min(CONFIG.stops.length - 1, index));
  visitedStops.add(currentStop);
  const stop = CONFIG.stops[currentStop];
  $('#stopKicker').textContent = `STOP ${String(currentStop + 1).padStart(2, '0')} / ${String(CONFIG.stops.length).padStart(2, '0')}`;
  $('#stopTitle').textContent = stop.title;
  $('#stopMessage').textContent = stop.message;
  // Each stop reveals its matching personal photo as a soft watermark behind the note.
  const watermark = $('#stopWatermark');
  if (watermark && CONFIG.photos[currentStop]) {
    watermark.src = CONFIG.photos[currentStop].path;
    watermark.alt = '';
    watermark.classList.remove('watermark-reveal');
    void watermark.offsetWidth;
    watermark.classList.add('watermark-reveal');
  }
  $('#stopProgress').textContent = `${String(currentStop + 1).padStart(2, '0')} of ${String(CONFIG.stops.length).padStart(2, '0')}`;
  $$('.route-stop').forEach((stopEl, i) => {
    const button = $('.stop-button', stopEl);
    button.classList.toggle('current', i === currentStop);
    button.classList.toggle('visited', visitedStops.has(i));
    button.setAttribute('aria-current', i === currentStop ? 'step' : 'false');
    if (visitedStops.has(i)) button.setAttribute('aria-label', `Visit stop ${i + 1}: ${CONFIG.stops[i].title}. Visited`);
    else button.setAttribute('aria-label', `Visit stop ${i + 1}: ${CONFIG.stops[i].title}`);
  });
  const bus = $('#movingBus');
  const positions = [
    { left: '8%', top: '20%' },
    { left: '69%', top: '31%' },
    { left: '20%', top: '57%' },
    { left: '69%', top: '79%' }
  ];
  Object.assign(bus.style, positions[currentStop]);
  // Restart small playful animations on every stop change without timers or audio resets.
  bus.classList.remove('hop');
  const activeStopButton = $('.stop-button', $$('.route-stop')[currentStop]);
  activeStopButton.classList.remove('pop');
  const stopCard = $('.stop-card');
  stopCard.classList.remove('card-arrive');
  void bus.offsetWidth;
  bus.classList.add('hop');
  bus.classList.remove('bus-chatter');
  void bus.offsetWidth;
  bus.classList.add('bus-chatter');
  $('#busSpeech').textContent = ['beep beep!', 'next stop: good vibes', 'scenic route engaged!', 'friendship express!'][currentStop];
  activeStopButton.classList.add('pop');
  if (playful) popConfetti(5);
  stopCard.classList.add('card-arrive');
  $('#nextStop').textContent = currentStop === CONFIG.stops.length - 1 ? 'Visit the note →' : 'Next stop →';
  $('#viewPhotos').hidden = currentStop < 1;
}

function fillContent() {
  $$('[data-content="herName"]').forEach(el => el.textContent = CONFIG.herName);
  $('[data-content="openingText"]').textContent = CONFIG.openingText;
  $('[data-content="ticketRoute"]').textContent = CONFIG.ticket.route;
  $('[data-content="ticketMessage"]').textContent = CONFIG.ticket.message;
  $('[data-content="ticketSupport"]').textContent = CONFIG.ticket.support;
  $('[data-content="ticketFooter"]').textContent = CONFIG.ticket.footer.toUpperCase();
  $('#noteGreeting').textContent = replaceName(CONFIG.note.greeting);
  $('#noteSignoff').innerHTML = replaceName(CONFIG.note.signoff).split('\n').map(escapeHtml).join('<br>');
  $('#noteBody').replaceChildren(...CONFIG.note.paragraphs.map(paragraph => {
    const p = document.createElement('p'); p.textContent = replaceName(paragraph); return p;
  }));
  $$('.photo-frame').forEach((frame, i) => {
    const img = $('img', frame);
    // Register listeners before changing src; cached images may finish immediately.
    img.addEventListener('load', () => frame.classList.add('has-image'), { once: true });
    img.addEventListener('error', () => {
      frame.classList.remove('has-image');
      img.removeAttribute('src');
    }, { once: true });
    img.alt = CONFIG.photos[i].alt;
    img.loading = 'eager';
    img.src = CONFIG.photos[i].path;
    // Cached/local images can already be complete before the load handler runs.
    if (img.complete && img.naturalWidth > 0) frame.classList.add('has-image');
  });
  $('#journeyAudio').src = CONFIG.audioPath;
}
function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

// One persistent audio element keeps its playback position when the route changes.
const audio = $('#journeyAudio');
const playPause = $('#playPause');
const playIcon = $('#playIcon');
const musicStatus = $('#musicStatus');
const seekBar = $('#seekBar');
const muteButton = $('#muteButton');
let audioAttempted = false;
function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}
function syncAudioUI() {
  const duration = audio.duration;
  $('#currentTime').textContent = formatTime(audio.currentTime || 0);
  $('#totalTime').textContent = formatTime(duration);
  seekBar.max = Number.isFinite(duration) && duration > 0 ? duration : 100;
  seekBar.value = Number.isFinite(duration) && duration > 0 ? audio.currentTime : 0;
  playIcon.textContent = audio.paused ? '▶' : 'Ⅱ';
  playPause.setAttribute('aria-label', audio.paused ? 'Play music' : 'Pause music');
  muteButton.setAttribute('aria-pressed', String(audio.muted));
  muteButton.setAttribute('aria-label', audio.muted ? 'Unmute music' : 'Mute music');
  muteButton.textContent = audio.muted ? '×' : '♪';
}
async function attemptPlay() {
  audioAttempted = true;
  try {
    await audio.play();
    musicStatus.textContent = 'Now playing';
  } catch (error) {
    audio.pause();
    if (audio.error || error?.name === 'NotSupportedError') musicStatus.textContent = 'Add song.mp3 to enable music';
    else musicStatus.textContent = 'Tap play to try again';
    showToast('Music could not start. The journey is still ready.');
  }
  syncAudioUI();
}
playPause.addEventListener('click', () => {
  if (audio.paused) attemptPlay();
  else { audio.pause(); musicStatus.textContent = 'Paused'; syncAudioUI(); }
});
muteButton.addEventListener('click', () => { audio.muted = !audio.muted; syncAudioUI(); });
seekBar.addEventListener('input', () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime = Math.min(audio.duration, Math.max(0, Number(seekBar.value)));
    $('#currentTime').textContent = formatTime(audio.currentTime);
  }
});
audio.addEventListener('timeupdate', syncAudioUI);
audio.addEventListener('durationchange', syncAudioUI);
audio.addEventListener('loadedmetadata', () => { musicStatus.textContent = 'Ready to play'; syncAudioUI(); });
audio.addEventListener('playing', () => { musicStatus.textContent = 'Now playing'; syncAudioUI(); });
audio.addEventListener('pause', syncAudioUI);
audio.addEventListener('ended', () => { musicStatus.textContent = 'That was the song'; syncAudioUI(); });
audio.addEventListener('error', () => {
  musicStatus.textContent = 'Add song.mp3 to enable music';
  playPause.setAttribute('aria-label', 'Try playing music');
  syncAudioUI();
});

// Tiny optional easter egg: the sun shares a different cheerful thought each tap.
const sunSurprises = [
  'Official forecast: 100% chance of a tiny smile ☀',
  'The bus says you have excellent passenger energy. Beep beep!',
  'A little reminder: you make ordinary days less ordinary.',
  'Achievement unlocked: found the secret sunshine button ✨',
  'The driver has added one extra scenic loop. Just because. 🚌'
];
let surpriseIndex = 0;
$('#sunSurprise').addEventListener('click', () => {
  const sun = $('#sunSurprise');
  const message = $('#sunMessage');
  message.textContent = sunSurprises[surpriseIndex % sunSurprises.length];
  surpriseIndex += 1;
  message.hidden = false;
  sun.classList.remove('sun-clicked');
  void sun.offsetWidth;
  sun.classList.add('sun-clicked');
  popConfetti(8);
});

function popConfetti(count = 8) {
  const burst = $('#playfulBurst');
  const symbols = ['✳', '✦', '•', '✧', '☼'];
  const colors = ['#647c63', '#ebcb78', '#bd8068', '#a9c6d0'];
  burst.replaceChildren();
  for (let i = 0; i < count; i += 1) {
    const bit = document.createElement('span');
    bit.textContent = symbols[i % symbols.length];
    bit.style.setProperty('--angle', `${(360 / count) * i}deg`);
    bit.style.setProperty('--distance', `${28 + (i % 3) * 13}px`);
    bit.style.setProperty('--bit-color', colors[i % colors.length]);
    burst.append(bit);
  }
  burst.classList.remove('burst-active');
  void burst.offsetWidth;
  burst.classList.add('burst-active');
  window.setTimeout(() => burst.classList.remove('burst-active'), 900);
}

// The "convince me" path reveals one gentle reason at a time.
let reasonStep = 0;
const reasons = [
  'There might be a smile waiting for you. ☀',
  'A tiny surprise, made with you in mind. ✨',
  'Some people make ordinary days feel a little brighter… and you might be one of them. 👀'
];
function answerOpening(choice) {
  const prompt = $('#questionPrompt');
  const subtitle = $('#questionSubtitle');
  const options = $('#questionOptions');
  const reveal = $('#answerReveal');
  const next = $('#questionContinue');
  if (!prompt || !subtitle || !options || !reveal || !next) return;
  if (choice === 'yes') {
    prompt.textContent = 'Okay, this made me smile. ✨';
    subtitle.textContent = 'Let me show you what I made for you.';
    reveal.innerHTML = '<span class="answer-reveal-icon" aria-hidden="true">♡</span><strong>One little story, just for you.</strong><span>No pressure. Just something honest and from the heart.</span>';
    options.hidden = true;
    next.hidden = false;
    next.textContent = 'Okay, show me →';
  } else {
    // Each click reveals exactly one reason. On the last reason, stop looping
    // and offer a clear way forward instead of repeating the same message.
    if (reasonStep >= reasons.length) {
      prompt.textContent = 'Okay, I tried my best 😅';
      subtitle.textContent = 'No pressure at all. You can see the little story whenever you like.';
      reveal.innerHTML = '<span class="answer-reveal-icon" aria-hidden="true">♡</span><strong>That was my last little reason.</strong><span>Whether you are convinced or not, I wanted to share something honest with you.</span>';
      options.hidden = true;
      next.hidden = false;
      next.textContent = 'Okay, show me the little story →';
    } else {
      reasonStep += 1;
      prompt.textContent = reasonStep === 1 ? 'Just one little reason…' : reasonStep === 2 ? 'Okay, one more then…' : 'Last one. Promise. 👀';
      subtitle.textContent = 'You can say yes whenever you feel ready — or not. It is completely okay.';
      reveal.innerHTML = `<span class="answer-reveal-icon" aria-hidden="true">♡</span><strong>Reason ${reasonStep}:</strong><span>${reasons[reasonStep - 1]}</span>`;
      options.hidden = false;
      $('#readyYes').textContent = 'Okay, show me ✨';
      $('#readyMaybe').textContent = 'Still not convinced 👀';
      next.hidden = true;
    }
  }
  reveal.hidden = false;
  $('#questionCard').classList.remove('question-answered');
  void $('#questionCard').offsetWidth;
  $('#questionCard').classList.add('question-answered');
  reveal.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
}
$('#readyYes')?.addEventListener('click', () => {
  // Start the soundtrack on the visitor's first intentional click; browsers block audible autoplay on page load.
  if (audio.paused && !audioAttempted) attemptPlay();
  // Once a reason has been shown, this is the explicit consent to continue.
  if (reasonStep > 0) { setStage('opening'); return; }
  answerOpening('yes');
});
$('#readyMaybe')?.addEventListener('click', () => {
  // Even choosing the playful "convince me" option starts the soundtrack.
  if (audio.paused && !audioAttempted) attemptPlay();
  answerOpening('maybe');
});
$('#questionContinue')?.addEventListener('click', () => {
  reasonStep = 0;
  setStage('opening');
});
$('.wordmark')?.addEventListener('click', event => {
  event.preventDefault();
  reasonStep = 0;
  $('#questionPrompt').textContent = 'So, are you ready to play?';
  $('#questionSubtitle').textContent = 'There are no wrong answers. Well… maybe one or two silly ones.';
  $('#questionOptions').hidden = false;
  $('#readyYes').textContent = "Obviously, let's go! ✨";
  $('#readyMaybe').textContent = 'Hmm… convince me 👀';
  $('#answerReveal').hidden = true;
  $('#questionContinue').hidden = true;
  setStage('readyQuestion');
});

$('#startRide').addEventListener('click', async () => {
  setStage('journey');
  updateStop(0);
  await attemptPlay(); // Explicit click is the first permitted playback attempt.
});
$$('.route-stop').forEach(el => {
  const button = $('.stop-button', el);
  const visit = () => updateStop(Number(el.dataset.stop));
  button.addEventListener('click', visit);
  button.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); visit(); } });
});
$('#nextStop').addEventListener('click', () => {
  if (currentStop < CONFIG.stops.length - 1) updateStop(currentStop + 1);
  else setStage('memories');
});
$('#viewPhotos').addEventListener('click', () => setStage('memories'));
$('#gamesBack').addEventListener('click', () => setStage('journey'));
$('#gamesContinue').addEventListener('click', () => setStage('journey'));

// Tiny playable games: catch 10 stars, then try the friendly memory match.
let starsCaught = 0;
let starRound = 0;
let starTimer = null;
const starArea = $('#starPlayArea');
const starScore = $('#starScore');
const starSymbols = ['✦', '✧', '✳', '★'];
$('#startStars').addEventListener('click', () => {
  clearInterval(starTimer); starArea.replaceChildren(); starsCaught = 0; starRound = 0;
  starScore.textContent = 'Stars caught: 0 / 10';
  $('#startStars').textContent = 'Restart';
  spawnStar();
  starTimer = window.setInterval(() => {
    if (starsCaught >= 10 || starRound >= 22) { clearInterval(starTimer); starTimer = null; finishStars(); return; }
    spawnStar();
  }, 1050);
});
function spawnStar() {
  starRound += 1;
  const star = document.createElement('button'); star.type = 'button'; star.className = 'catch-star';
  star.textContent = starSymbols[Math.floor(Math.random() * starSymbols.length)];
  star.style.left = `${8 + Math.random() * 78}%`; star.style.top = `${8 + Math.random() * 68}%`;
  star.setAttribute('aria-label', 'Catch this star');
  star.addEventListener('click', () => {
    if (star.disabled || starsCaught >= 10) return;
    starsCaught += 1; star.disabled = true; star.classList.add('star-caught');
    starScore.textContent = `Stars caught: ${starsCaught} / 10`;
    window.setTimeout(() => star.remove(), 220);
    if (starsCaught >= 10) { clearInterval(starTimer); starTimer = null; finishStars(); }
  });
  starArea.append(star);
  window.setTimeout(() => { if (star.isConnected && !star.disabled) star.remove(); }, 1900);
}
function finishStars() {
  const note = document.createElement('p'); note.className = 'star-result';
  note.textContent = starsCaught >= 10 ? 'All 10! Certified star catcher ✨' : `Lovely try — ${starsCaught} stars caught. Have another go?`;
  starArea.append(note); $('#startStars').textContent = 'Play again';
}
const memoryFaces = ['☀', '♡', '✿', '🚌'];
let memoryCards = []; let memoryChosen = []; let memoryMatched = new Set(); let memoryLocked = false;
function setupMemory() {
  memoryCards = [...memoryFaces, ...memoryFaces].map((face, id) => ({ face, id })).sort(() => Math.random() - .5);
  memoryChosen = []; memoryMatched = new Set(); memoryLocked = false; renderMemory();
  $('#memoryScore').textContent = 'Pairs: 0 / 4';
}
function renderMemory() {
  const board = $('#memoryBoard'); board.replaceChildren();
  memoryCards.forEach(card => {
    const btn = document.createElement('button'); btn.type = 'button';
    const revealed = memoryChosen.includes(card.id) || memoryMatched.has(card.face);
    btn.className = `memory-card${revealed ? ' revealed' : ''}${memoryMatched.has(card.face) ? ' matched' : ''}`;
    btn.textContent = revealed ? card.face : '?'; btn.setAttribute('aria-label', revealed ? `Card ${card.face}` : 'Flip a hidden card');
    btn.disabled = revealed || memoryLocked;
    btn.addEventListener('click', () => flipMemory(card)); board.append(btn);
  });
}
function flipMemory(card) {
  if (memoryLocked || memoryChosen.includes(card.id) || memoryMatched.has(card.face)) return;
  memoryChosen.push(card.id); renderMemory();
  if (memoryChosen.length === 2) {
    const pair = memoryChosen.map(id => memoryCards.find(item => item.id === id));
    if (pair[0].face === pair[1].face) {
      memoryMatched.add(card.face); memoryChosen = [];
      $('#memoryScore').textContent = `Pairs: ${memoryMatched.size} / 4`; renderMemory();
      if (memoryMatched.size === 4) $('#memoryScore').textContent = 'All pairs found! Lovely memory ✨';
    } else {
      memoryLocked = true; window.setTimeout(() => { memoryChosen = []; memoryLocked = false; renderMemory(); }, 750);
    }
  }
}
$('#resetMemory').addEventListener('click', setupMemory);
setupMemory();
$('#goTicket').addEventListener('click', () => setStage('keepsake'));
$('#toKeepsake').addEventListener('click', () => setStage('keepsake'));
$('#backToRoute').addEventListener('click', () => setStage('journey'));
$('#backToPhotos').addEventListener('click', () => setStage('memories'));

function toggleNote(open) {
  noteOpen = open;
  $('#personalNote').hidden = !open;
  $('#envelopeButton').classList.toggle('open', open);
  $('#envelopeButton').setAttribute('aria-expanded', String(open));
  $('#envelopeButton').setAttribute('aria-label', open ? 'Close the personal note' : 'Open the personal note');
  if (open) $('#personalNote').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
}
$('#envelopeButton').addEventListener('click', () => toggleNote(!noteOpen));
$('#closeNote').addEventListener('click', () => toggleNote(false));
$('#replayJourney').addEventListener('click', () => {
  // Keep audio playing/paused exactly as it currently is; only reset visual progress.
  currentStop = 0;
  visitedStops.clear();
  toggleNote(false);
  updateStop(0);
  setStage('opening');
  showToast('Ready for another little detour.');
});

fillContent();
updateStop(0, false);
syncAudioUI();


// GAME 03: Little Bus Run — slow, forgiving obstacle-dodging mini-game.
(() => {
  const area = $('#busRunArea');
  if (!area) return;
  const road = $('.bus-run-road', area), bus = $('#runBus');
  const scoreLabel = $('#busRunScore'), message = $('#busRunMessage'), start = $('#startBusRun');
  let lane = 1, distance = 0, best = 0, active = false, spawnTimer = null, scoreTimer = null;
  const lanes = [28, 50, 72];
  function move(direction) {
    if (!active) return;
    lane = Math.max(0, Math.min(2, lane + direction));
    bus.style.left = lanes[lane] + '%';
  }
  $('#busLeft').addEventListener('click', () => move(-1));
  $('#busRight').addEventListener('click', () => move(1));
  area.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') {e.preventDefault(); move(-1);} if (e.key === 'ArrowRight') {e.preventDefault(); move(1);} });
  function stopRun(hit = false) {
    active = false; clearInterval(spawnTimer); clearInterval(scoreTimer); area.classList.remove('running');
    road.querySelectorAll('.run-obstacle').forEach(el => el.remove());
    start.textContent = 'Play again';
    message.textContent = hit ? `Oops, scenic detour! Distance: ${distance}. Try again?` : `Lovely drive! Distance: ${distance}.`;
    best = Math.max(best, distance); scoreLabel.textContent = `Distance: ${distance} · Best: ${best}`;
  }
  function spawnObstacle() {
    if (!active) return;
    const obstacle = document.createElement('span'); obstacle.className = 'run-obstacle'; obstacle.textContent = ['🚧','🌳','🪨'][Math.floor(Math.random()*3)];
    const obstacleLane = Math.floor(Math.random()*3); obstacle.dataset.lane = obstacleLane; obstacle.style.left = lanes[obstacleLane] + '%'; obstacle.style.transform = 'translateX(-50%)'; road.append(obstacle);
    const duration = 2800;
    window.setTimeout(() => {
      if (!obstacle.isConnected || !active) return;
      if (Number(obstacle.dataset.lane) === lane) { stopRun(true); return; }
      obstacle.remove(); distance += 1; scoreLabel.textContent = `Distance: ${distance} · Best: ${Math.max(best,distance)}`;
      if (distance >= 12) stopRun(false);
    }, duration - 100);
    window.setTimeout(() => obstacle.remove(), duration + 100);
  }
  start.addEventListener('click', () => {
    clearInterval(spawnTimer); clearInterval(scoreTimer); road.querySelectorAll('.run-obstacle').forEach(el => el.remove());
    lane = 1; distance = 0; active = true; bus.style.left = lanes[lane] + '%'; area.classList.add('running');
    message.textContent = 'Easy does it — dodge the obstacles!'; start.textContent = 'Restart run'; scoreLabel.textContent = `Distance: 0 · Best: ${best}`;
    spawnObstacle(); spawnTimer = window.setInterval(spawnObstacle, 1750);
  });
})();
