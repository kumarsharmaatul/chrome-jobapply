(async function init() {
  const profileSelect = document.getElementById('profileSelect');
  const preview = document.getElementById('preview');
  const result = document.getElementById('result');

  const { profiles = [], activeProfileId } = await chrome.storage.local.get(['profiles', 'activeProfileId']);
  profiles.forEach((p) => {
    const o = document.createElement('option');
    o.value = p.id;
    o.textContent = p.label || p.fullName || 'Unnamed';
    if (p.id === activeProfileId) o.selected = true;
    profileSelect.appendChild(o);
  });

  profileSelect.addEventListener('change', () => chrome.storage.local.set({ activeProfileId: profileSelect.value }));

  document.getElementById('autofillBtn').onclick = async () => {
    result.textContent = 'Autofill running...';
    await chrome.runtime.sendMessage({ type: 'RUN_AUTOFILL_ACTIVE_TAB' });
    setTimeout(async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_AUTOFILL_PREVIEW' }).catch(() => ({ preview: [] }));
      const rows = response?.preview || [];
      preview.innerHTML = '';
      rows.slice(0, 15).forEach((r) => {
        const li = document.createElement('li');
        li.textContent = `${r.key} (${r.confidence}%)`;
        preview.appendChild(li);
      });
      result.textContent = `Autofill complete: ${rows.length} fields filled.`;
      if (rows.length > 0) {
        document.getElementById('confirmationBox').style.display = 'block';
      }
    }, 500);
  };

  document.getElementById('confirmBtn').onclick = () => {
    document.getElementById('confirmationBox').style.display = 'none';
    result.textContent = 'Ready for manual submission. Please click Apply on the job site.';
  };

  document.getElementById('openOptionsBtn').onclick = () => chrome.runtime.openOptionsPage();
})();
