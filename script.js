const concertDay = new Date("2027-01-15T00:00:00");
const today = new Date();
const daysUntilConcert = Math.ceil((concertDay - today) / (1000 * 60 * 60 * 24));
const countdown = document.getElementById("day");

countdown.textContent = daysUntilConcert > 0
  ? `距離首爾首場演出還有 ${daysUntilConcert} 天`
  : daysUntilConcert === 0
    ? "首爾演唱會，就是今天。"
    : "首爾演唱會，期待下一次相見。";

const player = document.querySelector(".player");
const audio = document.getElementById("audio-track");
const playButton = document.getElementById("play-toggle");
const seek = document.getElementById("seek");
const currentTimeLabel = document.getElementById("current-time");
const waveformBars = [...document.querySelectorAll(".waveform span")];
const previewMessage = document.querySelector(".audio-disclaimer");

function formatTime(seconds) {
  const wholeSeconds = Math.floor(seconds);
  return `${Math.floor(wholeSeconds / 60)}:${String(wholeSeconds % 60).padStart(2, "0")}`;
}

function updateProgress() {
  const duration = audio.duration;
  const progress = Number.isFinite(duration) ? audio.currentTime : 0;
  const percentage = Number.isFinite(duration) && duration > 0 ? (progress / duration) * 100 : 0;
  seek.value = String(progress);
  seek.max = Number.isFinite(duration) ? String(duration) : "0";
  seek.style.background = `linear-gradient(to right, #b7f4df 0%, #b7f4df ${percentage}%, rgb(255 255 255 / 24%) ${percentage}%, rgb(255 255 255 / 24%) 100%)`;
  currentTimeLabel.textContent = formatTime(progress);
  const activeBars = Math.floor((percentage / 100) * waveformBars.length);
  waveformBars.forEach((bar, index) => bar.classList.toggle("is-played", index < activeBars));
}

audio.addEventListener("play", () => {
  player.classList.add("is-playing");
  playButton.setAttribute("aria-pressed", "true");
  playButton.setAttribute("aria-label", "暫停試聽");
  playButton.querySelector(".play-icon").textContent = "Ⅱ";
  playButton.querySelector(".button-text").textContent = "暫停試聽";
});

audio.addEventListener("pause", () => {
  player.classList.remove("is-playing");
  playButton.setAttribute("aria-pressed", "false");
  playButton.setAttribute("aria-label", "播放試聽");
  playButton.querySelector(".play-icon").textContent = "▶";
  playButton.querySelector(".button-text").textContent = "播放試聽";
});

audio.addEventListener("loadedmetadata", () => {
  document.getElementById("duration").textContent = formatTime(audio.duration);
  seek.max = String(audio.duration);
  updateProgress();
});

audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("ended", updateProgress);
audio.addEventListener("error", () => {
  previewMessage.textContent = "音樂載入失敗，請確認 music 資料夾內的音檔存在。";
});

playButton.addEventListener("click", () => {
  if (!audio.paused) {
    audio.pause();
  } else {
    audio.play().catch((error) => {
      previewMessage.textContent = `無法播放音樂：${error.message}`;
    });
  }
});

seek.addEventListener("input", () => {
  audio.currentTime = Number(seek.value);
  updateProgress();
});

updateProgress();
