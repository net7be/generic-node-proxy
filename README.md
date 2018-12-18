# Node Limiter Proxy
Rate limiting proxy looking for a specific to-be-decided identifying trait in requests (the "key").

As an example, the script is setup to use the client IP address as the identifying trait.

Based on: https://github.com/nodejitsu/node-http-proxy

## Setup
The only requirement for this project is NodeJS version 8+.

Clone this repository then install the dependencies:
```
npm install
```

## Configuration
Make sure debug is set to false before using it in a production environment.

See `config.js` for the configuration parameters.

**Make sure the logFile path is writable by the user running the script**.

## Running the service
Start `limiter-proxy.js` either using forever start or just node.

In development you can just use `npm start`.

Configuration will be loaded from config.js, but it's possible to override the port using the first command line argument, as in:
```
node limiter-proxy.js 8080
```

**While the service is running, always check the log for errors**, it's possible that the key map checking function errors and that gets ignored unless the proxy is in debug mode (all keys are allowed all the time).

This can happen if a configuration option is incorrect, for instance.
