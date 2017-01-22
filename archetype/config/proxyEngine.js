/**
 * Proxy-Engine Configuration
 *
 * @see {@link http://
 */
module.exports = {
  // If transactions are production
  live_mode: process.ENV.LIVE_MODE || true,
  // If every event should be saved automatically
  auto_save: process.ENV.AUTO_SAVE || false
}
