// Current game version
export const CURRENT_VERSION = "1.0.0";

// Key for storing the last seen version in localStorage
const LAST_SEEN_VERSION_KEY = "arturo-game-version";

/**
 * Checks if there's a new version of the game available
 * @returns {boolean} True if a new version is available
 */
export function checkForNewVersion(): boolean {
  // Get the last seen version from localStorage
  const lastSeenVersion = localStorage.getItem(LAST_SEEN_VERSION_KEY);

  // If there's no last seen version, this is the first time the user is playing
  if (!lastSeenVersion) {
    // Store the current version
    localStorage.setItem(LAST_SEEN_VERSION_KEY, CURRENT_VERSION);
    return false;
  }

  // Check if the current version is different from the last seen version
  const hasNewVersion = lastSeenVersion !== CURRENT_VERSION;

  // If there's a new version, update the last seen version
  if (hasNewVersion) {
    localStorage.setItem(LAST_SEEN_VERSION_KEY, CURRENT_VERSION);
  }

  return hasNewVersion;
}

/**
 * Gets the version message to display to the user
 * @returns {string} The version message
 */
export function getVersionMessage(): string {
  return `Game updated to version ${CURRENT_VERSION}! Refresh to see new features.`;
}
