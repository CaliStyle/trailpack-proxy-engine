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
   * Define worker profiles. Each worker of a given type listens for the
   * "tasks" defined in its profile below. The task names represent a Task
   * defined in api.services.tasks. Note that 'memoryBound' and 'cpuBound' are
   * arbitrary names.
   * You can set these per environment in config/env proxyEngine: { { profiles: ... } }
   */
  profiles: {
    // memoryBound: {
    //   tasks: [ 'hiMemoryTask1' ]
    // },
    // cpuBound: {
    //   tasks: [ 'VideoEncoder', 'hiCpuTask2' ]
    // }
  },

  /**
   * The config for cron workers
   */
  crons_config: {},

  /**
   * The config for event workers
   */
  events_config: {},

  /**
   * The config for task workers
   */
  tasks_config: {},
  /**
   * Set worker to subscribe to crons, events, or tasks in the matching profile (proxyEngine.profiles).
   * If process.env.WORKER does not match a profile, the application will not subscribe to any crons, events, or tasks
   */
  worker: process.env.WORKER
}
