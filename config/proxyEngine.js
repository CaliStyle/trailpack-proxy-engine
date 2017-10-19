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
    connection: {
      exchange: process.env.PROXY_TASK_EXCHANGE, // optional, defaults to `tasks-work-x`
      work_queue_name: process.env.PROXY_TASK_WORK_QUEUE, // optional, defaults to `tasks-work-q`
      interrupt_queue_name: process.env.PROXY_TASK_INTERRUPT_QUEUE, // optional, defaults to `tasks-interrupt-q`

      /**
       * The RabbitMQ connection information.
       * See: https://www.rabbitmq.com/uri-spec.html
       */
      host: process.env.PROXY_TASK_RMQ_HOST,
      user: process.env.PROXY_TASK_RMQ_USER,
      pass: process.env.PROXY_TASK_RMQ_PASS,
      port: process.env.PROXY_TASK_RMQ_PORT,
      vhost: process.env.PROXY_TASK_RMQ_VHOST,

      /**
       * Connection information could also be passed via uri
       */
      uri: process.env.PROXY_RMQ_URI,

      /**
       * Additional, optional connection options (default values shown)
       */
      heartbeat: 30,
      timeout: null, // this is the connection timeout (in milliseconds, per connection attempt), and there is no default
      failAfter: 60, // limits how long rabbot will attempt to connect (in seconds, across all connection attempts). Defaults to 60
      retryLimit: 3, // limits number of consecutive failed attempts
    }
  }
}
