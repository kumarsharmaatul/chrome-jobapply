(() => {
  class WellfoundAdapter {
    matches(url = location.hostname) { return url.includes("wellfound"); }
    getFormRoot() { return document; }
  }
  window.AIAFAdapters = window.AIAFAdapters || [];
  window.AIAFAdapters.unshift(new WellfoundAdapter());
})();
