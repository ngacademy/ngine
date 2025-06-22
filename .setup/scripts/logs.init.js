const { appendFileSync } = require('fs');
const { resolve, join } = require('path');

const LOG_DIR = resolve(__dirname, '../../.init');
const LOG_FILE = join(LOG_DIR, 'init.log');

function appendLog(message) {
  const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Europe/Sofia', hour12: false });
  appendFileSync(LOG_FILE, `[${timestamp}] ${message}\n`);
}

const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

console.log = function (...args) {
  const msg = args.map(String).join(' ');
  appendLog('[LOG] ' + msg);
  originalLog.apply(console, args);
};

console.error = function (...args) {
  const msg = args.map(String).join(' ');
  appendLog('[ERROR] ' + msg);
  originalError.apply(console, args);
};

console.warn = function (...args) {
  const msg = args.map(String).join(' ');
  appendLog('[WARN] ' + msg);
  originalWarn.apply(console, args);
}; 