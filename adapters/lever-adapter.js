(() => {
  class LeverAdapter {
    matches(url = location.hostname) { return url.includes("lever"); }
    getFormRoot() { return document; }
  }
  window.AIAFAdapters = window.AIAFAdapters || [];
  window.AIAFAdapters.unshift(new LeverAdapter());
})();
