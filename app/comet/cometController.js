const PARTICLE_NUM = 400;
const PARTICLE_BASE_RADIUS = 0.5;
const FL = 500;
const DEFAULT_SPEED = 2;
const BOOST_SPEED = 25;
const BLACKOUT_TIME = 3000;

const COMET_RADIUS = 10;
const COMET_Z = 800;
const COMET_RATIO = 1.2;
const COMET_COLOR = '#81c1e7';
const COMET_SHADOW_COLOR = '#fff8f8';

const backgroundParticles = new Array(PARTICLE_NUM);
const cometParticles = new Array(PARTICLE_NUM * COMET_RATIO);
const blurRad = 2;
const blurArr = [
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
];

const pi = Math.PI;
const atan2 = Math.atan2;
const cos = Math.cos;
const sin = Math.sin;

let canvasWidth, canvasHeight;
let context;
let centerX, centerY;
let mouseX, mouseY;
let speed = DEFAULT_SPEED;
let targetSpeed = DEFAULT_SPEED;
let startTime = undefined;
let blackoutProgress = 2;
let animationID;

class Particle {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.pastZ = 0;
  }
  randomize() {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.z = Math.random() * 1500 + 500;
  }
}

class CometParticle extends Particle {
  constructor() {
    super();
    this.dx = 0;
    this.dy = 0;
  }
  randomize() {
    let r = 0.75 + Math.random() * 0.25;
    let theta = Math.random() * 2 * pi;
    this.dx = r * cos(theta);
    this.dy = r * sin(theta);

    this.x = this.dx * COMET_RADIUS + canvasWidth / 2;
    this.y = this.dy * COMET_RADIUS + canvasHeight / 2;
    this.z = (Math.random() - 1) * 100 + COMET_Z;
  }
}

export function initCometCanvas() {
  const canvas = document.getElementById('canvas_comet');

  // event handling
  window.addEventListener('resize', () => {
    resize(canvas);
  });

  document.addEventListener(
    'mousemove',
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    },
    false
  );

  document.addEventListener(
    'mousedown',
    (e) => {
      if (e.button !== 0) return; // treat only left button
      targetSpeed = BOOST_SPEED;
      startTime = new Date();
    },
    false
  );

  document.addEventListener(
    'mouseup',
    () => {
      targetSpeed = DEFAULT_SPEED;
      startTime = undefined;
    },
    false
  );

  resize(canvas);
  mouseX = centerX;
  mouseY = centerY;

  // create particles
  let particle;
  for (let i = 0; i < PARTICLE_NUM; i++) {
    particle = new Particle();
    particle.randomize();
    particle.z -= 500 * Math.random();
    backgroundParticles[i] = particle;
  }
  for (let i = 0; i < PARTICLE_NUM * COMET_RATIO; i++) {
    particle = new CometParticle();
    particle.randomize();
    particle.z -= COMET_Z * Math.random();
    cometParticles[i] = particle;
  }
}

export function startCometCanvas() {
  (function loop() {
    draw();
    animationID = requestAnimationFrame(loop);
  })();
}

export function stopCometCanvas() {
  if (animationID) cancelAnimationFrame(animationID);
}

function resize(canvas) {
  canvasWidth = canvas.width = window.innerWidth;
  canvasHeight = canvas.height = window.innerHeight;
  centerX = canvasWidth * 0.5;
  centerY = canvasHeight * 0.5;
  context = canvas.getContext('2d');
  context.fillStyle = 'rgb(255, 255, 255)';
}

function draw() {
  speed += (targetSpeed - speed) * 0.05;
  let cx = centerX - (mouseX - centerX) * 1.25;
  let cy = centerY - (mouseY - centerY) * 1.25;

  context.clearRect(0, 0, canvasWidth, canvasHeight);
  drawBackgroundParticles(speed, cx, cy);
  drawComet(speed, cx, cy);
  drawCometParticles(speed, cx, cy);

  drawBlackout(cx, cy);
}

function drawComet(speed, cx, cy) {
  context.save();

  let rx, ry;
  let f, x, y;
  let pf, px, py, pr;
  let a, a1, a2;

  // draw comet body
  rx = canvasWidth / 2 - cx;
  ry = canvasHeight / 2 - cy;
  pf = FL / COMET_Z;
  px = cx + rx * pf;
  py = cy + ry * pf;
  pr = COMET_RADIUS * pf;

  context.fillStyle = COMET_COLOR;
  context.shadowColor = COMET_SHADOW_COLOR;
  context.shadowBlur = 25;
  context.beginPath();
  context.arc(px, py, pr, 0, 2 * pi);
  context.closePath();
  context.fill();

  // draw comet tail
  f = FL / (COMET_Z - speed * 100);
  x = cx + rx * f;
  y = cy + ry * f;
  a = atan2(py - y, px - x);
  a1 = a + pi / 2;
  a2 = a - pi / 2;
  pr *= 1.025;

  context.shadowBlur = 40;
  context.beginPath();
  context.moveTo(px + pr * cos(a1), py + pr * sin(a1));
  context.lineTo(mouseX, mouseY);
  context.lineTo(px + pr * cos(a2), py + pr * sin(a2));
  context.closePath();
  context.fill();

  // blur effect
  context.beginPath();
  context.globalAlpha = 0.25;
  context.arc(px, py, pr + blurRad, 0, 2 * pi);
  context.closePath();
  for (let i = 0; i < 8; i += 1) {
    let [dx, dy] = blurArr[i];
    dx *= blurRad;
    dy *= blurRad;
    context.moveTo(px + dx + pr * cos(a1), py + dy + pr * sin(a1));
    context.lineTo(mouseX + dx, mouseY + dy);
    context.lineTo(px + dx + pr * cos(a2), py + dy + pr * sin(a2));
    context.closePath();
  }
  context.fill();
  context.globalAlpha = 1;

  context.restore();
}

function drawCometParticles(speed, cx, cy) {
  context.save();

  let p;
  let rx, ry;
  let f, x, y, r;
  let pf, px, py, pr;
  let a, a1, a2;

  context.fillStyle = COMET_COLOR;
  context.shadowColor = COMET_SHADOW_COLOR;
  context.shadowBlur = 20;
  context.beginPath();

  // draw particles
  for (let i = 0; i < PARTICLE_NUM * COMET_RATIO; i++) {
    p = cometParticles[i];

    p.pastZ = p.z;
    p.z -= speed * 2;

    if (p.z <= 0) {
      p.randomize();
      continue;
    }

    rx = p.x - cx;
    ry = p.y - cy;

    f = FL / p.z;
    x = cx + rx * f;
    y = cy + ry * f;
    r = PARTICLE_BASE_RADIUS * 1.5 * f;

    pf = FL / p.pastZ;
    px = cx + rx * pf;
    py = cy + ry * pf;
    pr = PARTICLE_BASE_RADIUS * 1.5 * pf;

    a = atan2(py - y, px - x);
    a1 = a + pi / 2;
    a2 = a - pi / 2;

    context.moveTo(px + pr * cos(a1), py + pr * sin(a1));
    context.arc(px, py, pr, a1, a2, true);
    context.lineTo(x + r * cos(a2), y + r * sin(a2));
    context.arc(x, y, r, a2, a1, true);
    context.closePath();

    p.x += (p.dx * Math.pow(p.z, 2)) / Math.pow(2, 20);
    p.y += (p.dy * Math.pow(p.z, 2)) / Math.pow(2, 20);
  }
  context.fill();
  context.restore();
}

function drawBackgroundParticles(speed, cx, cy) {
  let p;
  let rx, ry;
  let f, x, y, r;
  let pf, px, py, pr;
  let a, a1, a2;

  context.beginPath();
  context.fillStyle = 'rgb(255, 255, 255)';
  for (let i = 0; i < PARTICLE_NUM; i++) {
    p = backgroundParticles[i];

    p.pastZ = p.z;
    p.z -= speed;

    if (p.z <= 0) {
      p.randomize();
      continue;
    }

    rx = p.x - cx;
    ry = p.y - cy;

    f = FL / p.z;
    x = cx + rx * f;
    y = cy + ry * f;
    r = PARTICLE_BASE_RADIUS * f;

    pf = FL / p.pastZ;
    px = cx + rx * pf;
    py = cy + ry * pf;
    pr = PARTICLE_BASE_RADIUS * pf;

    a = atan2(py - y, px - x);
    a1 = a + pi / 2;
    a2 = a - pi / 2;

    context.moveTo(px + pr * cos(a1), py + pr * sin(a1));
    context.arc(px, py, pr, a1, a2, true);
    context.lineTo(x + r * cos(a2), y + r * sin(a2));
    context.arc(x, y, r, a2, a1, true);
    context.closePath();
  }
  context.fill();
}

function drawBlackout(cx, cy) {
  if (!startTime) {
    blackoutProgress = Math.max(0, blackoutProgress - 0.02);
  } else {
    blackoutProgress = Math.min(
      1,
      (new Date() - startTime - BLACKOUT_TIME) / 500
    );
  }
  if (blackoutProgress <= 0) return;

  context.save();

  let rx, ry;
  let pf, px, py;
  let radius =
    Math.sqrt(canvasWidth * canvasWidth + canvasHeight * canvasHeight) *
    blackoutProgress;

  rx = canvasWidth / 2 - cx;
  ry = canvasHeight / 2 - cy;
  pf = FL / COMET_Z;
  px = cx + rx * pf;
  py = cy + ry * pf;

  context.fillStyle = 'rgb(0, 0, 0)';
  context.beginPath();
  context.moveTo(px, py);
  context.arc(px, py, radius, 0, 2 * pi);
  context.closePath();
  context.fill();

  context.restore();
}
