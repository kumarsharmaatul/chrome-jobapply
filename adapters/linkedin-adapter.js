(() => {
  class LinkedinAdapter {
    matches(url = location.hostname) { return url.includes("linkedin"); }
    getFormRoot() { return document; }
  }
  window.AIAFAdapters = window.AIAFAdapters || [];
  window.AIAFAdapters.unshift(new LinkedinAdapter());
})();
