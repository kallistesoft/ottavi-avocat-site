// Mobile menu, and a notice on the newsletter form until it links to systeme.io.
(function () {
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

  // This form has no backend yet: say so instead of reloading the page.
  document.querySelectorAll('form[data-pending]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = form.querySelector('.form-msg');
      if (msg) msg.hidden = false;
    });
  });
})();
