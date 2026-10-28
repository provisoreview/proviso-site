// Google Analytics 4 for provisoreview.com. Loaded from both the hand-written
// homepage (index.html) and every Eleventy page (_includes/base.njk).
// Set GA_ID to the real Measurement ID; until then nothing loads or is sent.
(function () {
  var GA_ID = 'G-SVNMTXD70S';
  if (!/^G-[A-Z0-9]+$/.test(GA_ID) || GA_ID === 'G-XXXXXXXXXX') return;

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  // Same property as app.provisoreview.com; the default cookie_domain ('auto')
  // sets the cookie on .provisoreview.com so a visit that moves from a
  // Learning Center article into the app stays one session.
  window.gtag('config', GA_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
})();
