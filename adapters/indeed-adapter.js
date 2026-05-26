(() => {
  class IndeedAdapter {
    matches(url = location.hostname) { return url.includes("indeed"); }
    getFormRoot() { return document; }
  }
  window.AIAFAdapters = window.AIAFAdapters || [];
  window.AIAFAdapters.unshift(new IndeedAdapter());
})();
