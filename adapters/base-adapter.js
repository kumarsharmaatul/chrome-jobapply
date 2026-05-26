(() => {
  class BaseAdapter {
    matches() { return true; }
    getFormRoot() { return document; }
    beforeFill() {}
    afterFill() {}
  }
  window.AIAFAdapters = window.AIAFAdapters || [];
  window.AIAFAdapters.push(new BaseAdapter());
})();
