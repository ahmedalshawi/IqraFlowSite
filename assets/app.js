/* IqraFlow landing page - mobile nav, waitlist forms, FAQ accordion,
   scroll reveals and the WebGL "iqra" hero. No frameworks. */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Mobile nav ── */
  var nav = document.querySelector('.iq-nav');
  var burger = document.getElementById('nav-burger');
  if (nav && burger) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('.iq-nav-menu a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Waitlist forms (saved locally; wire to a real backend before launch) ── */
  var VALID = /.+@.+\..+/;
  function setupForm(emailId, sendId, hintId, errText) {
    var email = document.getElementById(emailId);
    var send = document.getElementById(sendId);
    var hint = document.getElementById(hintId);
    if (!email || !send) return;
    function submit() {
      var v = email.value.trim();
      if (!VALID.test(v)) {
        if (hint) hint.textContent = errText;
        return;
      }
      try { localStorage.setItem('iqraflow_waitlist', v); } catch (e) {}
      ['hero', 'cta'].forEach(function (p) {
        var form = document.getElementById(p + '-form');
        var done = document.getElementById(p + '-done');
        if (form) form.hidden = true;
        if (done) done.hidden = false;
      });
    }
    send.addEventListener('click', submit);
    email.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
  }
  var ERR = 'Hmm - that email doesn’t look right. Try again?';
  setupForm('hero-email', 'hero-send', 'hero-hint', ERR);
  setupForm('cta-email', 'cta-send', 'cta-hint', ERR);

  /* ── FAQ accordion (one open at a time) ── */
  var faqItems = Array.prototype.slice.call(document.querySelectorAll('.iq-faq-item'));
  faqItems.forEach(function (item) {
    var head = item.querySelector('.iq-faq-head');
    if (!head) return;
    function toggle() {
      var wasOpen = item.classList.contains('open');
      faqItems.forEach(function (it) {
        it.classList.remove('open');
        var h = it.querySelector('.iq-faq-head');
        if (h) h.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('open');
        head.setAttribute('aria-expanded', 'true');
      }
    }
    head.addEventListener('click', toggle);
    head.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });

  /* ── Scroll reveals ── */
  (function () {
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
    if (!els.length || reducedMotion || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('iq-revealed');
          en.target.classList.remove('iq-hidden');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.9) return; // already visible; don't hide
      el.classList.add('iq-hidden');
      io.observe(el);
    });
  })();

  /* ── WebGL hero: particles forming اقرأ ("read") ── */
  function softCircleTexture(THREE, colorStops) {
    var c = document.createElement('canvas');
    c.width = c.height = 64;
    var g = c.getContext('2d');
    var grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    colorStops.forEach(function (s) { grad.addColorStop(s[0], s[1]); });
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }

  function sampleIqraTargets() {
    var ready = document.fonts && document.fonts.load ? document.fonts.load('200px UthmanicHafs', 'اقرأ') : Promise.resolve();
    return Promise.resolve(ready).catch(function () {}).then(function () {
      var off = document.createElement('canvas');
      off.width = 720; off.height = 300;
      var g = off.getContext('2d');
      g.fillStyle = '#000';
      g.font = '210px UthmanicHafs, serif';
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText('اقرأ', 360, 158);
      var img = g.getImageData(0, 0, 720, 300).data;
      var targets = [];
      for (var y = 0; y < 300; y += 3) {
        for (var x = 0; x < 720; x += 3) {
          if (img[(y * 720 + x) * 4 + 3] > 140) targets.push([(x - 360) / 24, (150 - y) / 24]);
        }
      }
      return targets;
    });
  }

  function initIqra() {
    var THREE = window.THREE;
    var canvas = document.getElementById('gl_iqra');
    if (!canvas || !THREE) return;

    sampleIqraTargets().then(function (targets) {
      if (!targets.length) return;
      var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      function size() {
        var w = canvas.clientWidth || canvas.parentElement.clientWidth;
        var h = canvas.clientHeight || canvas.parentElement.clientHeight;
        renderer.setSize(w, h, false);
        return [w, h];
      }
      size();

      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
      camera.position.z = 26;

      var N = targets.length;
      var geo = new THREE.BufferGeometry();
      var cur = new Float32Array(N * 3);
      var col = new Float32Array(N * 3);
      var seeds = new Float32Array(N);
      var palette = [[0.94, 0.75, 0.31], [0.34, 0.72, 0.51], [0.90, 0.88, 0.70]];
      for (var i = 0; i < N; i++) {
        cur[i * 3] = (Math.random() - 0.5) * 50;
        cur[i * 3 + 1] = (Math.random() - 0.5) * 34;
        cur[i * 3 + 2] = (Math.random() - 0.5) * 20;
        var r = Math.random();
        var pc = palette[r < 0.55 ? 0 : (r < 0.9 ? 1 : 2)];
        col[i * 3] = pc[0]; col[i * 3 + 1] = pc[1]; col[i * 3 + 2] = pc[2];
        seeds[i] = Math.random() * 100;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(cur, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
      scene.add(new THREE.Points(geo, new THREE.PointsMaterial({
        size: 0.42, vertexColors: true,
        map: softCircleTexture(THREE, [[0, 'rgba(255,255,255,1)'], [0.4, 'rgba(255,255,255,0.6)'], [1, 'rgba(255,255,255,0)']]),
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.55
      })));

      // ambient rising dust
      var DN = 160;
      var dustGeo = new THREE.BufferGeometry();
      var dustPos = new Float32Array(DN * 3);
      var dustSeed = new Float32Array(DN);
      for (var d = 0; d < DN; d++) {
        dustPos[d * 3] = (Math.random() - 0.5) * 24;
        dustPos[d * 3 + 1] = Math.random() * 20 - 7;
        dustPos[d * 3 + 2] = (Math.random() - 0.5) * 10;
        dustSeed[d] = Math.random() * 100;
      }
      dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
      scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({
        size: 0.045, map: softCircleTexture(THREE, [[0, 'rgba(255,214,120,1)'], [0.4, 'rgba(255,196,80,0.55)'], [1, 'rgba(255,196,80,0)']]),
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xf0c050, opacity: 0.9
      })));

      var t0 = performance.now() / 1000;
      function tick(t) {
        var wh = size();
        camera.aspect = wh[0] / wh[1];
        camera.updateProjectionMatrix();
        var age = t - t0;
        var pos = geo.attributes.position;
        var k = reducedMotion ? 1 : Math.min(0.06, 0.012 + age * 0.01);
        for (var i = 0; i < N; i++) {
          var tx = targets[i][0] + (reducedMotion ? 0 : Math.sin(t * 0.8 + seeds[i]) * 0.09);
          var ty = targets[i][1] + 1.2 + (reducedMotion ? 0 : Math.cos(t * 0.7 + seeds[i] * 1.3) * 0.09);
          pos.array[i * 3] += (tx - pos.array[i * 3]) * k;
          pos.array[i * 3 + 1] += (ty - pos.array[i * 3 + 1]) * k;
          pos.array[i * 3 + 2] += (0 - pos.array[i * 3 + 2]) * k;
        }
        pos.needsUpdate = true;
        var dp = dustGeo.attributes.position;
        if (!reducedMotion) {
          for (var j = 0; j < DN; j++) {
            dp.array[j * 3 + 1] += 0.0035 + Math.sin(dustSeed[j]) * 0.0012;
            dp.array[j * 3] += Math.sin(t * 0.6 + dustSeed[j]) * 0.0012;
            if (dp.array[j * 3 + 1] > 13) dp.array[j * 3 + 1] = -7;
          }
          dp.needsUpdate = true;
        }
        renderer.render(scene, camera);
      }

      if (reducedMotion) {
        tick(performance.now() / 1000); // settle instantly, render once
        return;
      }

      // animate only while the canvas is near the viewport
      var visible = true;
      var raf = 0;
      function loop() {
        cancelAnimationFrame(raf);
        if (!visible) return;
        tick(performance.now() / 1000);
        raf = requestAnimationFrame(loop);
      }
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          visible = entries[0].isIntersecting;
          if (visible) loop();
        }, { rootMargin: '120px' }).observe(canvas);
      }
      loop();
    }).catch(function (e) { console.error('iqra hero', e); });
  }

  initIqra();
})();
