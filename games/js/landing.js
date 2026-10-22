/* Landing page: live numbers from the data files, rotating subject word, reveal-on-scroll, demo question card + floating particles. */
(function () {
  'use strict';

  var CAT = window.UG_CAT,
      BANK = window.UG_BANK,
      ACT = window.UG_ACT,
      RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(s) { return document.querySelector(s); }

  function slug(s) {
    return s.toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function playable(id) {
    return BANK.some(function (q) { return q.c === id; }) ||
           !!(ACT.PAIRS[id] || ACT.TF[id] || ACT.ORDER[id] || ACT.SORT[id]);
  }

  /* ---------- Subject tiles ---------- */
  var chapters = 0, live = 0;
  var tiles = $('#subjTiles') || $('#tiles');   // support both ids

  if (CAT && CAT.SUBJ) {
    CAT.SUBJ.forEach(function (s) {
      var n = s.ch.length;
      var p = s.ch.filter(function (t) { return playable(slug(t)); }).length;
      chapters += n;
      live += p;

      if (tiles) {
        var a = document.createElement('a');
        a.className = 'tile rv';
        a.href = '#/s/' + s.id;
        a.innerHTML = '<b></b><span></span><i></i>';
        a.querySelector('b').textContent = s.t;
        a.querySelector('span').textContent = p + ' of ' + n + ' chapters playable';
        a.querySelector('i').style.width = Math.round(100 * p / n) + '%';
        tiles.appendChild(a);
      }
    });
  }

  var nums = {
    subjects: CAT && CAT.SUBJ ? CAT.SUBJ.length : 0,
    chapters: live,
    questions: BANK ? BANK.length : 0,
    modes: 11
  };

  /* ---------- Count-up animation ---------- */
  function count(el) {
    var to = +el.dataset.to;
    if (RM) {
      el.textContent = to;
      return;
    }
    var t0 = performance.now();
    (function f(t) {
      var k = Math.min(1, (t - t0) / 900);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(f);
    })(t0);
  }

  Object.keys(nums).forEach(function (k) {
    var e = $('[data-n="' + k + '"]');
    if (e) e.dataset.to = nums[k];
  });

  /* ---------- Reveal on scroll ---------- */
  var items = document.querySelectorAll('.rv, [data-to]');
  if ('IntersectionObserver' in window && !RM) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        if (e.target.dataset.to) count(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.15 });

    items.forEach(function (e) { io.observe(e); });
  } else {
    items.forEach(function (e) {
      e.classList.add('in');
      if (e.dataset.to) count(e);
    });
  }

  /* ---------- Rotating subject word ---------- */
  var w = $('#word');
  if (w && CAT && CAT.SUBJ && !RM) {
    var words = CAT.SUBJ.map(function (s) {
      return s.t.replace('Indian ', '');
    });
    var wi = 0;

    setInterval(function () {
      w.classList.add('out');
      setTimeout(function () {
        wi = (wi + 1) % words.length;
        w.textContent = words[wi];
        w.classList.remove('out');
      }, 300);
    }, 2400);
  }

  /* ---------- Demo card (cycling questions) ---------- */
  var DEMO = [
    ['Which Article gives the right to constitutional remedies?',
     ['Article 14', 'Article 21', 'Article 32', 'Article 44'], 2, 0],
    ['Which river drains into the Arabian Sea?',
     ['Krishna', 'Godavari', 'Narmada', 'Mahanadi'], 2, 1],
    ['The Quit India Movement began in:',
     ['1930', '1942', '1919', '1946'], 1, 2]
  ];

  var di = 0, streak = 0;
  var dq = $('#demoQ');
  var dopts = $('#demoOpts');
  var ds = $('#demoStreak');

  function showDemo() {
    if (!dq) return;

    var d = DEMO[di % DEMO.length];
    dq.textContent = d[0];
    dopts.innerHTML = '';

    d[1].forEach(function (o, i) {
      var b = document.createElement('div');
      b.className = 'dopt';
      b.textContent = (i + 1) + '. ' + o;
      dopts.appendChild(b);
    });

    if (RM) {
      dopts.children[d[2]].classList.add('ok');
      return;
    }

    var wrong = (d[2] + 1) % 4;

    setTimeout(function () {
      dopts.children[wrong].classList.add('no');
    }, 900);

    setTimeout(function () {
      dopts.children[wrong].classList.remove('no');
      dopts.children[d[2]].classList.add('ok');
      streak++;
      if (ds) ds.textContent = 'Streak ' + streak;
    }, 1900);

    setTimeout(function () {
      di++;
      if (di % 3 === 0) streak = 0;
      showDemo();
    }, 3700);
  }

  showDemo();

  /* ---------- Theme toggle ---------- */
  var thBtn = $('#th');
  if (thBtn) {
    thBtn.addEventListener('click', function () {
      var html = document.documentElement;
      var current = html.getAttribute('data-theme') || 'dark';
      var next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      try { localStorage.setItem('ug-theme', next); } catch (e) {}
    });
  }

  /* ---------- Floating particles ---------- */
  (function createParticles() {
    var container = document.getElementById('particles');
    if (!container || RM) return;

    var count = window.innerWidth < 700 ? 16 : 28;

    for (var i = 0; i < count; i++) {
      var p = document.createElement('div');
      p.className = 'particle';
      p.style.left = (Math.random() * 100) + '%';
      p.style.animationDuration = (11 + Math.random() * 16) + 's';
      p.style.animationDelay = (Math.random() * 12) + 's';
      var size = (2 + Math.random() * 3.5);
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      container.appendChild(p);
    }
  })();

})();
