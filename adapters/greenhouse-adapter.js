(() => {
  class GreenhouseAdapter {
    matches(url = location.hostname) { return url.includes("greenhouse"); }
    getFormRoot() { return document; }
  }
  window.AIAFAdapters = window.AIAFAdapters || [];
  window.AIAFAdapters.unshift(new GreenhouseAdapter());
})();
