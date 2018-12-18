#!/usr/bin/env node

const http = require('http');
const httpProxy = require('http-proxy');
const config = require('./config');
const Logger = require('./lib/logger');

// Create the proxy with the default target.
const proxy = httpProxy.createProxyServer({ target: config.target });

const logger = new Logger(config.logFile);

// The map used to hold the keys:
const keys = {};

// A few quick functions used to manipulate 
// the keys map:
const entryExpired = (timestamp, expiryTime) => 
  ((Date.now() - timestamp) > expiryTime) ? true : false;

const resetKey = (entry) => {
  entry.counter = 1;
  entry.timestamp = Date.now();
  entry.blocked = false;
};

const isUserBlocked = (key, ip) => {
  // Check if a user is blocked,
  // Also maintain the keys map.
  if (config.debug) console.log(keys);
  if (!config.keyWhitelist.includes(key)) {
    if (keys[key]) {
      // Ignore errors at this point
      // unless in debug mode.
      try {
        if (keys[key].blocked === true) {
          // Key blocked. Check if expired.
          if (entryExpired(keys[key].timestamp, config.blockDurationMs)) {
            // Block expired. Reset everything.
            logger.log(
              `EXPIRED blocked key ${key} - ${keys[key].counter} requests blocked`
            );
            resetKey(keys[key]);
          } else {
            // Key is still blocked.
            keys[key].counter++;
            return true;
          }
        } else {
          // Key currently not blocked.
          if (entryExpired(keys[key].timestamp, config.timeframeMs)) {
            // Request rate timeframe exceeded, reset:
            resetKey(keys[key]);
          } else {
            // Increment counters, check if we need to block:
            if (++keys[key].counter >= config.maxRequests) {
              // Block this key.
              keys[key].counter = 1;
              keys[key].timestamp = Date.now();
              keys[key].blocked = true;
              logger.log(
                `BLOCKED key ${key} for ${config.blockDurationMs} ms - Last IP address ${ip}`
              );
              return true;
            }
          }
        }
      } catch (e) {
        if (config.debug) throw e;
        else logger.log('ERROR when lookup up the key map: ', e);
      }
    } else {
      keys[key] = {};
      resetKey(keys[key]);
    }
  }
  return false;
};

const blockedResponse = (res) => {
  if (config.noActionMode === false) {
    res.writeHead(config.blockedHttpStatus, {
      'Content-Type': 'text/plain'
    });
    res.end(config.blockedMessage);
  }
};

// Register the server handler.
const server = http.createServer((req, res) => {

  // If using a reverse proxy before this one, 
  // make sure to have it filling out the 
  // X-Forwarded-For header.
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (!config.ipWhitelist.includes(ip)) {
    // Determine the "key" using the request object.
    // const key = ...
    // To make an IP blocking proxy as an exemple, 
    // we're using the IP address as key:
    const key = ip;
    if (isUserBlocked(key, ip)) {
      blockedResponse(res);
    }
  }

  proxy.web(req, res);
});

if (process.argv.length > 2) {
  // Set config.port to the argument provided
  config.port = process.argv[2];
}

console.log('listening on port ', config.port);
server.listen(config.port);