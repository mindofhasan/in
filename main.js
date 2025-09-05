const themeToggle = document.getElementById('themeToggle');
const animToggle  = document.getElementById('animToggle');
const qrImage     = document.getElementById('qrImage');

function setThemeInitial() {
  if (!document.body.classList.contains('dark') && !document.body.classList.contains('light')) {
    document.body.classList.add('dark');
  }
}
setThemeInitial();

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');

  if (document.getElementById("sharePopup").classList.contains('active')) {
    qrImage.src = document.body.classList.contains("dark") ? "dark.png" : "dark.png";
  }
});

/* Sidebar Menu */
const menuToggle   = document.getElementById('menuToggle');
const sidebar      = document.getElementById('sidebar');
const menuOverlay  = document.getElementById('menuOverlay');
const closeMenu    = document.getElementById('closeMenu');

function openMenu() {
  sidebar.classList.add('active');
  menuOverlay.classList.add('active');
}
function closeMenuFn() {
  sidebar.classList.remove('active');
  menuOverlay.classList.remove('active');
}
menuToggle.addEventListener('click', openMenu);
closeMenu.addEventListener('click', closeMenuFn);
menuOverlay.addEventListener('click', closeMenuFn);

/* Share Popup + QR + Copy */
const shareBtns = document.querySelectorAll(".shareBtn");
const sharePopup = document.getElementById("sharePopup");
const shareOverlay = document.getElementById("shareOverlay");
const closeSharePopup = document.getElementById("closeSharePopup");
const shareLinkInput = document.getElementById("shareLink");
const copyShareBtn = document.getElementById("copyShareBtn");

shareBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const url = window.location.href;
    shareLinkInput.value = url;
    qrImage.src = document.body.classList.contains("dark") ? "dark.png" : "dark.png";
    sharePopup.classList.add("active");
    shareOverlay.classList.add("active");
    closeMenuFn();
  });
});

closeSharePopup.onclick = () => { 
  sharePopup.classList.remove("active"); 
  shareOverlay.classList.remove("active"); 
};
shareOverlay.addEventListener('click', () => { 
  sharePopup.classList.remove("active"); 
  shareOverlay.classList.remove("active"); 
});

copyShareBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(shareLinkInput.value).then(() => {
    showToast("Link copied success");
  }).catch(() => {
    showToast("Failed to copy.");
  });
});

/* Toast */
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.display = "block";
  setTimeout(() => { toast.style.display = "none"; }, 3000);
}

/* Canvas Animations */
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let animMode = 'particles';
animToggle.addEventListener('click', () => {
  animMode = (animMode === 'particles') ? 'fireworks' : 'particles';
  particles = [];
  fwArray = [];
  fwParticles = [];
});

/* Particles */
const colors = ["#ff3b3b", "#3bff3b", "#3b3bff", "#ffff3b", "#ff3bff"];
const sizes = [5, 6, 7, 8, 10];
const mouse = { x: undefined, y: undefined, radius: 80 };
window.addEventListener("mousemove", e => { mouse.x = e.x; mouse.y = e.y; });

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = sizes[Math.floor(Math.random() * sizes.length)];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.weight = Math.random() * 1 + 1;
    this.directionX = Math.random() * 4 - 2;
  }
  update() {
    if (this.y > canvas.height) {
      this.y = 0 - this.size;
      this.x = Math.random() * canvas.width;
      this.weight = Math.random() * 1 + 2;
    }
    this.weight += 0.05;
    this.y += this.weight;
    this.x += this.directionX;
    const dx = this.x - (mouse.x ?? -9999);
    const dy = this.y - (mouse.y ?? -9999);
    const distance = Math.sqrt(dx*dx + dy*dy);
    if (distance < mouse.radius + this.size) {
      this.y -= 2;
      this.weight *= -0.5;
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}
let particles = [];
function initParticles() {
  particles = [];
  for (let i = 0; i < 200; i++) particles.push(new Particle());
}

/* Fireworks */
let fwArray = [];
let fwParticles = [];

function rand(min, max) { return Math.random() * (max - min) + min; }

class Firework {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height;
    this.targetX = rand(100, canvas.width - 100);
    this.targetY = rand(100, canvas.height / 2);
    this.speed = 5;
    this.angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
    this.distanceToTarget = Math.hypot(this.targetX - this.x, this.targetY - this.y);
    this.traveled = 0;
    this.color = `hsl(${rand(0,360)},100%,50%)`;
  }
  update(index) {
    const vx = Math.cos(this.angle) * this.speed;
    const vy = Math.sin(this.angle) * this.speed;
    this.x += vx; this.y += vy;
    this.traveled += this.speed;
    if (this.traveled >= this.distanceToTarget) {
      fwArray.splice(index, 1);
      createFWParticles(this.targetX, this.targetY, this.color);
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class FWParticle {
  constructor(x, y, color) {
    this.x = x; this.y = y; this.color = color;
    this.angle = rand(0, Math.PI * 2); this.speed = rand(2, 8);
    this.friction = 0.95; this.gravity = 0.05;
    this.alpha = 1; this.decay = rand(0.01, 0.02);
  }
  update(index) {
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;
    if (this.alpha <= 0) fwParticles.splice(index, 1);
  }
  draw() {
    ctx.save(); ctx.globalAlpha = this.alpha;
    ctx.beginPath(); ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = this.color; 
    ctx.fill(); 
    ctx.restore();
  }
}
function createFWParticles(x, y, color) {
  let count = 100;
  while (count--) fwParticles.push(new FWParticle(x, y, color));
}

/* Animate Loop */
function animate() {
  requestAnimationFrame(animate);
  const isDark = document.body.classList.contains("dark");
  ctx.fillStyle = (isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)");
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (animMode === 'particles') {
    if (particles.length === 0) initParticles();
    particles.forEach(p => { p.update(); p.draw(); });
  } else {
    if (Math.random() < 0.05) fwArray.push(new Firework());
    fwArray.forEach((fw, i) => { fw.update(i); fw.draw(); });
    fwParticles.forEach((p, i) => { p.update(i); p.draw(); });
  }
}
initParticles();
animate();

/* ------------------------------
   Tab Switching for Sidebar Menu
--------------------------------*/
const tabItems = document.querySelectorAll(".menu-item[data-target]");
const tabContents = document.querySelectorAll(".tab-content");

// Hide all initially
tabContents.forEach(tc => tc.style.display = "none");

// Show first tab by default
if(tabContents[0]) tabContents[0].style.display = "block";

tabItems.forEach(item => {
  item.addEventListener("click", () => {
    const targetId = item.getAttribute("data-target");
    if(!targetId) return;

    // hide all tabs
    tabContents.forEach(tc => tc.style.display = "none");

    // show target tab
    const targetTab = document.getElementById(targetId);
    if(targetTab) targetTab.style.display = "block";

    // close sidebar
    closeMenuFn();
  });
});