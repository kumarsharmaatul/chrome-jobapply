(() => {
  class NaukriAdapter {
    matches(url = location.hostname) { return url.includes("naukri"); }
    getFormRoot() { return document; }
  }
  window.AIAFAdapters = window.AIAFAdapters || [];
  window.AIAFAdapters.unshift(new NaukriAdapter());
})();
