/**
 * Proxy-Engine Configuration
 *
 * @see {@link http://
 */
module.exports = {
  /**
   * If transactions are production
   */
  live_mode: process.ENV.LIVE_MODE || true,

  /**
   * If every event should be saved automatically in the database
   */
  auto_save: process.ENV.AUTO_SAVE || false,

  /**
   * Set profile to subscribe to crons, events, or tasks in the matching profile (proxyEngine.<type>.profiles).
   * If process.env.PROFILE does not match a profile, the application will not subscribe to any crons, events, or tasks
   */
  profile: process.env.PROXY_PROFILE,

  /**
   * The config for cron workers
   */
  crons_config: {
    /**
     * Delay when crons will start running.
     */
    uptime_delay: process.env.PROXY_CRON_UPTIME_DELAY || 0,
    /**
     * Define worker profiles. Each profile of a given type listens for the
     * "crons" defined in its profile below. The cron names represent a Cron
     * defined in api.crons.
     * You can set these per environment in config/env
     * proxyEngine: { crons_config: { profiles: ... } }
     */
    profiles: {}
  },

  /**
   * The config for event workers
   */
  events_config: {
    /**
     * Define worker profiles. Each profile of a given type listens for the
     * "events" defined in its profile below. The event names represent an Event
     * defined in api.events.
     * You can set these per environment in config/env
     * proxyEngine: { events_config: { profiles: ... } }
     */
    profiles: {}
  },

  /**
   * The config for task workers
   */
  tasks_config: {
    /**
     * Define worker profiles. Each profile of a given type listens for the
     * "tasks" defined in its profile below. The task names represent a Task
     * defined in api.tasks.
     * You can set these per environment in config/env
     * proxyEngine: { tasks_config: { profiles: ... } }
     */
    profiles: {}
  }
}
