const config = {
  /**
   * noActionMode set to true means we do not actually 
   * block any request but bans are still being logged.
   */
  noActionMode: false,
  /**
   * Proxy target + port.
   * The proxy will forward requests there.
   * The port is mandatory.
   */
  target: 'http://localhost:80',
  /**
   * Port for the proxy to listen on.
   * Will bind it on all the IP addresses.
   */
  port: 8888,
  /**
   * Log file path. Must be writable by the user
   * running the proxy.
   * Any path relative to current directory requires './'.
   */
  logFile: './limiter.log',
  /**
   * IP addresses that can bypass the whole checking.
   */
  ipWhitelist: [
    //'::ffff:127.0.0.1',
    //'127.0.0.1'
  ],
  /**
   * Keys to ignore (will never get blocked).
   */
  keyWhitelist: [   ],
  /**
   * Time sample used to calculate the request rate.
   * Request rate being the amount of requests 
   * divided by this time in milliseconds.
   */
  timeframeMs: 60000,
  /**
   * Max amount of requests to allow in a timeframe
   * that is timeframeMs.
   * Will block the key afterwards for a duration
   * specified by blockDuration.
   */
  maxRequests: 10,
  /**
   * Duration in milliseconds for which to block
   * a key that went past the allowed request rate.
   */
  blockDurationMs: 60*5*1000,
  /**
   * HTTP response code to send to blocked requests.
   * 429 is "Too many requests".
   */
  blockedHttpStatus: 429,
  /**
   * Plain text message to send along the response when
   * a request is blocked.
   */
  blockedMessage: 'Your account is temporarily suspended from making additional requests',
  /**
   * Debug mode, leave it to false.
   */
  debug: false
};

module.exports = config;