"use strict";

const size = 500;
const app = document.getElementById("app");
const ringing = document.getElementById("ringing");
let lastHitStart = null;
let audioElements = document.getElementsByTagName("audio")[0].children;
audioElements = Array.from(audioElements);
const soundUrls = audioElements.map((e) => e.src);

// record mousedown information so that we can compare with mouseup
app.onmousedown = (event) => {
  lastHitStart = {
    x: event.clientX,
    y: event.clientY,
    time: new Date().getTime()
  };
};

const limitedFraction = (v, max) => Math.min(v / max, 1);

const cartesianDistance = (x1, x2, y1, y2) => {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

// returns a fraction between 0.4 and 1
const getTime = () => {
  const max = 700
  const min = 0.4
  const fractionOfMax = limitedFraction(new Date().getTime() - start.time, max)
  return Math.max(1 - fractionOfMax + min, 1);
}

const getAxisDistanceFromCenter = (v) => 1 - Math.abs(v / (size / 2) - 1);

const getAccuracy = (e) => {
  const xDistance = getAxisDistanceFromCenter(e.clientX);
  const yDistance = getAxisDistanceFromCenter(e.clientY)
  return xDistance * yDistance;
}

const getDistance = (e) => {
  const hitDistance = cartesianDistance(start.x, e.clientX, start.y, e.clientY)
  return limitedFraction(Math.round(hitDistance), 200);
}

const getSwing = (e) => getTime() * getAccuracy(e) * getDistance(e) * 100;

const getHitpoint = (e) => {
  const distance = cartesianDistance(e.clientX, 250, e.clientY, 240)
  const fractionOfMax = limitedFraction(distance, 250)
  return (1 - fractionOfMax) * 100;
}

const getLoudness = (e) => Math.round((getSwing(e) + getHitpoint(e)) / 2);

const playAudio = (loudness) => {
  const audioFile = soundUrls[Math.floor(loudness / (100 / soundUrls.length))];
  new Audio(audioFile).play();
  start = null;
}

window.onmouseup = (e) => {
  if (!lastHitStart) return;
  const loudness = getLoudness(e);
  if (loudness === 0) return;
  ringing.className = "enabled";
  ringing.style.transition = `opacity ${loudness / 8}s ease-out`;
  window.setTimeout(() => { ringing.className = ""; }, 10);
  playAudio(loudness)
};

const soundsDoneLoading = () => {
  return soundUrls.every((a) => new Audio(a).networkState === 3)
}

const imagesDoneLoading = () => {
  let imageElements = document.getElementsByClassName("preloadimage")
  imageElements = Array.from(imageElements)
  return imageElements.every((image) => image.complete)
}

let pollInterval

const initialize = () => {
  document.getElementById("content").style.display = "block";
  document.getElementById("loader").style.display = "none";
  window.clearInterval(pollInterval);
}

pollInterval = window.setInterval(() => {
  if (soundsDoneLoading() && imagesDoneLoading()) initialize()
}, 300);
