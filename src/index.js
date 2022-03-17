const size = 500;
const a = document.getElementById("app");
const ringing = document.getElementById("ringing");
let start = null;

const sounds = Array.from(
  document.getElementsByTagName("audio")[0].children
).map((a) => a.src);

console.log("sounds", sounds);

a.onmousedown = (e) => {
  start = { x: e.clientX, y: e.clientY, time: new Date().getTime() };
};

const linearAccuracy = (v) => 1 - Math.abs(v / (size / 2) - 1);
const limit = (max) => (v) => Math.min(v / max, 1);

const cartesianDistance = (x1, x2, y1, y2) =>
  Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

const getTime = () =>
  Math.max(1 - limit(700)(new Date().getTime() - start.time) + 0.4, 1);

const getAccuracy = (e) =>
  linearAccuracy(e.clientX) * linearAccuracy(e.clientY);

const getDistance = (e) =>
  limit(200)(
    Math.round(cartesianDistance(start.x, e.clientX, start.y, e.clientY))
  );

const getSwing = (e) => getTime() * getAccuracy(e) * getDistance(e) * 100;

const getHitpoint = (e) =>
  (1 - limit(250)(cartesianDistance(e.clientX, 250, e.clientY, 240))) * 100;

const getLoudness = (e) => Math.round((getSwing(e) + getHitpoint(e)) / 2);

window.onmouseup = (e) => {
  if (!start) return;
  const loudness = getLoudness(e);
  if (loudness === 0) return;
  ringing.className = "enabled";
  ringing.style.transition = `opacity ${loudness / 20}s ease-out`;

  window.setTimeout(() => {
    ringing.className = "";
  }, 10);

  const file = sounds[Math.floor(loudness / (100 / sounds.length))];
  new Audio(file).play();
  start = null;
};
