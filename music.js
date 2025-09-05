document.addEventListener("DOMContentLoaded", () => {
  // কার্ড toggle (খালি জায়গায়)
  document.querySelectorAll(".music-card").forEach(card => {
    card.addEventListener("click", e => {
      if (!e.target.closest(".controls")) {
        toggleCard(card);
      }
    });
  });

  // Play button
  document.querySelectorAll(".play-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
      playPause(btn);
    });
  });

  // Download button
  document.querySelectorAll(".download-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
      const src = btn.dataset.src || "music1.mp3";
      downloadMusic(src);
    });
  });
});

// কার্ড খোলা/বন্ধ নিয়ন্ত্রণ
function toggleCard(card) {
  if (!card.classList.contains("active")) {
    document.querySelectorAll(".music-card").forEach(c => {
      c.classList.remove("active");
      const player = c.querySelector(".player");
      player.pause();
      const icon = c.querySelector(".play-btn i");
      if(icon){
        icon.classList.remove("fa-pause");
        icon.classList.add("fa-play");
      }
    });
    card.classList.add("active");
  } else {
    card.classList.remove("active");
    const player = card.querySelector(".player");
    player.pause();
    const icon = card.querySelector(".play-btn i");
    if(icon){
      icon.classList.remove("fa-pause");
      icon.classList.add("fa-play");
    }
  }
}

// Play / Pause Function
function playPause(btn) {
  const card = btn.closest(".music-card");
  const player = card.querySelector(".player");
  const icon = btn.querySelector("i");

  if (player.paused) {
    player.play();
    icon.classList.remove("fa-play");
    icon.classList.add("fa-pause");
  } else {
    player.pause();
    icon.classList.remove("fa-pause");
    icon.classList.add("fa-play");
  }
}

// Download Function
function downloadMusic(src) {
  const a = document.createElement("a");
  a.href = src;
  a.download = src.split("/").pop();
  a.click();
}