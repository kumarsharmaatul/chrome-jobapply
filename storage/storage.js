export const StorageKeys = {
  PROFILES: "profiles",
  ACTIVE_PROFILE_ID: "activeProfileId",
  ACTIVITY_LOGS: "activityLogs"
};

export async function getProfiles() {
  const { profiles = [] } = await chrome.storage.local.get(StorageKeys.PROFILES);
  return profiles;
}

export async function saveProfiles(profiles) {
  await chrome.storage.local.set({ [StorageKeys.PROFILES]: profiles });
}

export async function getActiveProfile() {
  const { activeProfileId } = await chrome.storage.local.get(StorageKeys.ACTIVE_PROFILE_ID);
  const profiles = await getProfiles();
  return profiles.find((p) => p.id === activeProfileId) || profiles[0] || null;
}

export async function setActiveProfile(id) {
  await chrome.storage.local.set({ [StorageKeys.ACTIVE_PROFILE_ID]: id });
}

export function pseudoEncrypt(value) {
  if (!value) return value;
  return btoa(unescape(encodeURIComponent(value)));
}

export function pseudoDecrypt(value) {
  if (!value) return value;
  try {
    return decodeURIComponent(escape(atob(value)));
  } catch {
    return value;
  }
}
