/**
 * Proxy-Engine Configuration
 *
 * @see {@link http://
 */
module.exports = {
  live_mode: true,
  auto_save: false,
  crons_config: {
    type: 'cron'
  },
  events_config: {
    type: 'event'
  },
  tasks_config: {
    type: 'task'
  },
  worker: ''
}
