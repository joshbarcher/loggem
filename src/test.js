import { logger } from './index.js';

// Log a basic message (with timestamp and file info)
logger.log("Hello from the app!");

// Print a blank line (clean, unformatted)
console.log("");

// Log another message — still full format
logger.warn("Something might be off...");

// Disable timestamp
logger.config({ includeTimestamp: false });
logger.log("Now without timestamp");

// Disable file info
logger.config({ includeFileInfo: false });
logger.error("Now without file info or timestamp");

// Re-enable both
logger.config({ includeTimestamp: true, includeFileInfo: true });
logger.debug("We're back to full format!");

// Print a blank line again
console.log("");

// Use console.log() as usual — monkey-patched to use logger
console.log("Even this gets styled!");

// Use console.config() to make changes as well
console.config({ includeTimestamp: false });
console.log("Now without timestamp");

// Disable file info
console.config({ includeFileInfo: false });
console.error("Now without file info or timestamp");

console.config({ includeTimestamp: true, includeFileInfo: true });
console.debug("We're back to full format!");