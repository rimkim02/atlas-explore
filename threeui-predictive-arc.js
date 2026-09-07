/*
 * ThreeUI — PredictiveArcCanvas, "Data Pixel Arc" variant (variant="data-pixel").
 *
 * Ported to a framework-agnostic mount function from the registered source bundle
 *   https://threeui.com/source-code/predictive-arc.json  (revision fa86582fc870)
 *     - src/shaders/data-pixel-arc/dataPixelArcRenderer.ts  — Canvas 2D renderer (logic kept verbatim)
 *     - src/shaders/data-pixel-arc/DataPixelArcCanvas.tsx    — mount harness (RAF loop +
 *       ResizeObserver + IntersectionObserver + visibilitychange), reproduced 1:1
 * @designcodeio/threeui is MIT licensed (Copyright Design+Code). This project uses it as
 * an installed dependency; the React component is unusable here because index.html /
 * extension pages ship no bundler, so the imperative renderer + harness are inlined.
 *
 * Project customisations for the hero-section background usage:
 *   - dark-mode palette: emerald core remapped to the Atlas primary lime #DAFF48 (218,255,72),
 *     keeping the source's "base term + core^3 boost" shape
 *   - dark-mode canvas composites over the hero (transparent, via clearRect + { alpha: true })
 *     instead of the opaque #030308 fill
 *   - dark-mode peak pixel alpha capped at 0.60 ("제일 밝은 부분이 Opacity 60%")
 *   Arc geometry, breathing waves, edge taper, pixel grid, DPR handling and timing: unchanged.
 */
(function (global) {
  "use strict";

  /* ----- src/shaders/data-pixel-arc/dataPixelArcRenderer.ts ----- */

  var DATA_PIXEL_ARC_DEFAULTS = {
    mode: "dark",
    speed: 1,
    pixelSize: 8,
    arcCenter: 0.4,
    arcDrop: 0.9,
    thickness: 0.35,
    brightness: 1,
    hue: 0,
    saturation: 1,
  };

  function resolveMode(mode) {
    if (mode === "light" || mode === 1 || mode === "1") return "light";
    return "dark";
  }

  function createDataPixelArcRenderer(canvas, getOptions) {
    var context = canvas.getContext("2d", { alpha: true }); // source: { alpha: false }
    if (!context) return null;
    var width = 1;
    var height = 1;
    var time = 0;
    var lightBackground = null;

    var resize = function (nextWidth, nextHeight) {
      width = Math.max(1, nextWidth);
      height = Math.max(1, nextHeight);
      var pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      lightBackground = context.createLinearGradient(0, 0, 0, height);
      lightBackground.addColorStop(0, "#f8faf6");
      lightBackground.addColorStop(0.58, "#f3f6f1");
      lightBackground.addColorStop(1, "#edf1ec");
    };

    var render = function () {
      var options = getOptions();
      var isLight = resolveMode(options.mode) === "light";

      if (isLight && lightBackground) {
        context.fillStyle = lightBackground;
        context.fillRect(0, 0, width, height);
      } else {
        context.clearRect(0, 0, width, height); // source: fill "#030308"
      }

      var cols = Math.ceil(width / options.pixelSize);
      var rows = Math.ceil(height / options.pixelSize);
      var arcCenterY = height * options.arcCenter;
      var arcDrop = height * options.arcDrop;
      var thickness = height * options.thickness;

      for (var x = 0; x < cols; x += 1) {
        for (var y = 0; y < rows; y += 1) {
          var px = x * options.pixelSize;
          var py = y * options.pixelSize;
          var nx = (px / width) * 2 - 1;
          var curveY = arcCenterY + Math.pow(Math.abs(nx), 1.8) * arcDrop;
          var intensity = Math.max(0, 1 - Math.abs(py - curveY) / thickness);
          if (intensity <= 0.01) continue;
          var wave1 = Math.sin(nx * 4 - time * 1.5) * 0.1;
          var wave2 = Math.cos(py * 0.01 + time) * 0.1;
          intensity = Math.max(0, Math.min(1, intensity + wave1 + wave2));
          intensity *= Math.max(0, 1 - Math.pow(Math.abs(nx), 2.5));
          if (intensity <= 0.02) continue;

          var coreStrength = Math.pow(intensity, 3);
          var middleStrength = Math.pow(intensity, 1.5); // source term (unused after the lime remap)
          void middleStrength;
          var r;
          var g;
          var b;

          if (isLight) {
            var pigment = Math.pow(intensity, 0.78);
            var inkStrength = Math.max(0.45, Math.min(1.35, options.brightness));
            var paper = [238, 242, 237];
            var ink = [
              192 - 172 * pigment - 10 * coreStrength,
              204 - 88 * pigment + 18 * coreStrength,
              193 - 132 * pigment + 4 * coreStrength,
            ];
            r = Math.max(0, Math.min(255, Math.round(paper[0] + (ink[0] - paper[0]) * inkStrength)));
            g = Math.max(0, Math.min(255, Math.round(paper[1] + (ink[1] - paper[1]) * inkStrength)));
            b = Math.max(0, Math.min(255, Math.round(paper[2] + (ink[2] - paper[2]) * inkStrength)));
          } else {
            // Atlas primary lime #DAFF48 (218,255,72); core^3 lifts it to the exact swatch.
            r = Math.floor((196 + 22 * coreStrength) * options.brightness);
            g = Math.floor((246 + 9 * coreStrength) * options.brightness);
            b = Math.floor((58 + 14 * coreStrength) * options.brightness);
          }

          context.fillStyle = "rgb(" + r + ", " + g + ", " + b + ")";
          context.globalAlpha = isLight
            ? Math.min(1, 0.22 + Math.pow(intensity, 0.68) * 0.78)
            : intensity * 0.6; // source: intensity  -> peak alpha 0.60
          context.fillRect(px, py, options.pixelSize - 1, options.pixelSize - 1);
        }
      }

      context.globalAlpha = 1;
      time += 0.02 * options.speed;
    };

    return { resize: resize, render: render };
  }

  /* ----- src/shaders/data-pixel-arc/DataPixelArcCanvas.tsx (mount harness) ----- */

  function mountDataPixelArcCanvas(host, props) {
    if (!host) return function () {};
    var options = Object.assign({}, DATA_PIXEL_ARC_DEFAULTS, props || {});
    var optionsRef = { current: options };
    var mode = resolveMode(options.mode);

    host.classList.add("threeui-background", "data-pixel-arc", "data-pixel-arc--" + mode);
    host.setAttribute("data-mode", mode);

    var canvas = document.createElement("canvas");
    canvas.style.filter = "hue-rotate(" + options.hue + "deg) saturate(" + options.saturation + ")";
    host.appendChild(canvas);

    var renderer = createDataPixelArcRenderer(canvas, function () { return optionsRef.current; });
    if (!renderer) return function () {};

    var frame = 0;
    var visible = true;
    var reduceMotion = typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var resize = function () {
      var bounds = host.getBoundingClientRect();
      renderer.resize(bounds.width, bounds.height);
      renderer.render();
    };
    var tick = function () {
      renderer.render();
      frame = visible && !document.hidden ? requestAnimationFrame(tick) : 0;
    };
    var start = function () {
      if (!frame && !reduceMotion && visible && !document.hidden) frame = requestAnimationFrame(tick);
    };
    var stop = function () {
      if (frame) { cancelAnimationFrame(frame); frame = 0; }
    };

    var observer = new ResizeObserver(resize);
    var intersection = new IntersectionObserver(function (entries) {
      var entry = entries[0];
      visible = entry ? entry.isIntersecting : true;
      if (visible) start(); else stop();
    });
    var visibility = function () {
      if (document.hidden) stop();
      else start();
    };

    observer.observe(host);
    intersection.observe(host);
    document.addEventListener("visibilitychange", visibility);
    resize();
    start();

    return function destroy() {
      stop();
      observer.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }

  global.ThreeUIDataPixelArc = {
    mount: mountDataPixelArcCanvas,
    createRenderer: createDataPixelArcRenderer,
    DEFAULTS: DATA_PIXEL_ARC_DEFAULTS,
  };
})(typeof window !== "undefined" ? window : this);
