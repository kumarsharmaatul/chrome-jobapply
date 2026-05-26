(() => {
  let observer;
  let lastPreview = [];

  async function runAutofill() {
    const { profiles = [], activeProfileId } = await chrome.storage.local.get(["profiles", "activeProfileId"]);
    const profile = profiles.find((p) => p.id === activeProfileId) || profiles[0];
    if (!profile) {
      chrome.runtime.sendMessage({ type: "AUTOFILL_RESULT", payload: { filled: [], summary: { filledCount: 0, avgConfidence: 0 } } });
      return;
    }

    const adapter = (window.AIAFAdapters || []).find((a) => a.matches()) || window.AIAFAdapters[0];
    const root = adapter?.getFormRoot?.() || document;
    adapter?.beforeFill?.();

    const fields = collectAllFields(root);
    const filled = [];

    for (const field of fields) {
      if (!isFillable(field)) continue;
      const match = window.AIAFMatcher.matchProfileKey(field);
      if (!match.key || !profile[match.key]) continue;
      const ok = fillField(field, profile[match.key]);
      if (!ok) continue;
      filled.push({
        key: match.key,
        confidence: toConfidence(match.score),
        tag: field.tagName.toLowerCase(),
        label: window.AIAFMatcher.describeField(field)
      });
    }

    adapter?.afterFill?.();

    const summary = {
      filledCount: filled.length,
      avgConfidence: filled.length ? Math.round(filled.reduce((a, b) => a + b.confidence, 0) / filled.length) : 0
    };

    lastPreview = filled;
    chrome.runtime.sendMessage({ type: "AUTOFILL_RESULT", payload: { filled, summary } });
    window.AIAFLogger?.info("Autofill completed", { host: location.hostname, ...summary });
  }

  function collectAllFields(root) {
    const base = [...root.querySelectorAll("input, textarea, select")];
    const shadowHosts = [...root.querySelectorAll("*")].filter((el) => el.shadowRoot);
    for (const host of shadowHosts) {
      base.push(...host.shadowRoot.querySelectorAll("input, textarea, select"));
    }
    return base;
  }

  function isFillable(field) {
    if (field.disabled || field.readOnly || field.type === "hidden") return false;
    if (["submit", "button", "file", "password"].includes((field.type || "").toLowerCase())) return false;
    return true;
  }

  function toConfidence(score) {
    return Math.max(1, Math.min(100, Math.round((score / 25) * 100)));
  }

  function fillField(el, value) {
    try {
      if (el.type === "checkbox" || el.type === "radio") {
        el.checked = /yes|true|1/i.test(String(value));
      } else if (el.tagName === "SELECT") {
        const option = [...el.options].find((o) => o.text.toLowerCase().includes(String(value).toLowerCase()));
        if (option) {
          el.value = option.value;
        } else {
          return false;
        }
      } else {
        el.focus();
        el.value = value;
      }
      el.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
      el.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
      return true;
    } catch (error) {
      window.AIAFLogger?.warn("Field fill failed", { error: String(error) });
      return false;
    }
  }

  function monitorDynamicForms() {
    observer = new MutationObserver(() => {
      // intentionally passive; extension only fills when user explicitly triggers action
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg?.type === "RUN_AUTOFILL") {
      runAutofill();
      sendResponse?.({ ok: true });
    }
    if (msg?.type === "GET_AUTOFILL_PREVIEW") {
      sendResponse?.({ preview: lastPreview });
    }
  });

  window.addEventListener("beforeunload", () => observer?.disconnect());
  monitorDynamicForms();
})();
