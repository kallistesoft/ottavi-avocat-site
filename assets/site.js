// Embedded view and mobile menu.
(function () {
  // Legal pages open in a dialog on the payment pages: show only their content there.
  if (window.self !== window.top) document.documentElement.classList.add('embed');

  var header = document.querySelector('.site-header');
  var button = header && header.querySelector('.menu-btn');
  if (button) {
    var label = button.querySelector('.menu-label');
    var setOpen = function (open) {
      header.classList.toggle('open', open);
      button.setAttribute('aria-expanded', String(open));
      if (label) label.textContent = open ? button.dataset.close : button.dataset.open;
    };
    button.addEventListener('click', function () {
      setOpen(button.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('open')) {
        setOpen(false);
        button.focus();
      }
    });
    header.querySelectorAll('.header-panel a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
  }

  // Services page: show which section the chips are on, when clicked and while scrolling.
  var chips = document.querySelectorAll('.chips a');
  if (chips.length) {
    var bar = document.querySelector('.chips');
    var setActive = function (id) {
      chips.forEach(function (chip) {
        var on = chip.getAttribute('href') === '#' + id;
        if (on) {
          chip.setAttribute('aria-current', 'true');
          bar.scrollTo({ left: chip.offsetLeft - bar.offsetLeft - 16, behavior: 'smooth' });
        } else {
          chip.removeAttribute('aria-current');
        }
      });
    };
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () { setActive(chip.getAttribute('href').slice(1)); });
    });
    if ('IntersectionObserver' in window) {
      var seen = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      }, { rootMargin: '-30% 0px -65% 0px' });
      chips.forEach(function (chip) {
        var target = document.querySelector(chip.getAttribute('href'));
        if (target) seen.observe(target);
      });
    }
    setActive(location.hash ? location.hash.slice(1) : chips[0].getAttribute('href').slice(1));
  }
})();
