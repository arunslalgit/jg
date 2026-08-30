/* Count "Order via WhatsApp" clicks as GoatCounter events.
   Any <a data-track="..."> reports itself when clicked. The order links open
   in a new tab, so the page stays alive long enough to send the request. */
document.addEventListener('click', e => {
  const a = e.target.closest('a[data-track]');
  if (!a) return;
  if (!window.goatcounter || !window.goatcounter.count) return;
  window.goatcounter.count({
    path: a.dataset.track,
    title: a.dataset.trackTitle || a.dataset.track,
    event: true,
  });
});
