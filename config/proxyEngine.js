/**
 * Proxy-Engine Configuration
 *
 * @see {@link http://
 */
module.exports = {
  live_mode: true,
  auto_save: false,
  profile: process.env.PROXY_PROFILE || null,
  crons_config: {
    uptime_delay: process.env.PROXY_CRON_UPTIME_DELAY || 0
  },
  events_config: {

  },
  tasks_config: {

  }
}
