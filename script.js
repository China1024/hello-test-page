// 点击按钮，页面背景随机变色（两层背景交叉淡入淡出），
// 并在按钮旁实时显示当前基准色的 HEX 代码
const btn = document.getElementById("color-btn");
const hexCode = document.getElementById("hex-code");
const hexSwatch = document.getElementById("hex-swatch");
let lastHue = null;
let onLayerB = false; // 当前可见的是 A 层还是 B 层

// hsl(h, s%, l%) → "#RRGGBB"
function hslToHex(h, s, l) {
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const v = l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * v).toString(16).padStart(2, "0");
  };
  return ("#" + f(0) + f(8) + f(4)).toUpperCase();
}

btn.addEventListener("click", () => {
  // 随机基准色相；与上一次至少偏移 40°，避免连点撞色
  let h = Math.floor(Math.random() * 360);
  if (lastHue !== null) {
    h = (lastHue + 40 + Math.floor(Math.random() * 280)) % 360;
  }
  lastHue = h;

  // 由基准色相生成三个相邻色相，组成一套协调的渐变
  const h2 = (h + 40) % 360;
  const h3 = (h + 80) % 360;
  const gradient = `linear-gradient(135deg,
    hsl(${h}, 70%, 22%),
    hsl(${h2}, 70%, 45%) 55%,
    hsl(${h3}, 75%, 55%))`;

  // 更新 HEX 实时显示（显示基准色）
  const hex = hslToHex(h, 70, 22);
  hexCode.textContent = hex;
  hexSwatch.style.background = hex;

  // 新渐变写到「隐藏的那一层」，再交换两层透明度 → 平滑交叉淡入
  if (onLayerB) {
    document.body.style.setProperty("--bg-a", gradient);
    document.body.classList.remove("fade-b");
    onLayerB = false;
  } else {
    document.body.style.setProperty("--bg-b", gradient);
    document.body.classList.add("fade-b");
    onLayerB = true;
  }
});
