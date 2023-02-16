#!/usr/bin/env node
/* eslint-disable no-console */

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

import {MongoMemoryServer} from 'mongodb-memory-server';
import {spawn} from 'cross-spawn';

let instance;

(async () => {
  instance = await MongoMemoryServer.create();

  if (instance.state === 'running') {
    const child = spawn('yarn', ['es-node-runner'], {
      stdio: 'inherit',
      // Environment variables are injected into child process
      // for any code that need it for test environment.
      env: {
        ...process.env,
        TEST_DB_URI: instance.getUri(), // URI returned by mongodb-memory-server
        DB_NAME: 'testdb',
        NODE_ENV: 'test',
        DEBUG: 'mongodb:*', // Turn debug for mongodb only
      },
    });

    if (child.signalCode) {
      if (child.signal === 'SIGKILL') {
        console.log(
          'The build failed because the process exited too early. ' +
            'This probably means the system ran out of memory or someone called ' +
            '`kill -9` on the process.'
        );
      } else if (child.signal === 'SIGTERM') {
        console.log(
          'The build failed because the process exited too early. ' +
            'Someone might have called `kill` or `killall`, or the system could ' +
            'be shutting down.'
        );
      }
      process.exit(1);
    }

    child.on('error', (error) => console.log(error));
  } else {
    console.log('\nFailed to start the mongodb memory server.\n');
  }
})();

// only works when the process normally exits
// on windows, ctrl-c will not trigger this handler (it is unnormal)
// unless you listen on 'SIGINT'
process.on('exit', (code) => {
  instance.stop();
  console.log(`Server process (${process.pid}) exited with code: ${code}`);
});

process.on('SIGTERM', () => {
  process.exit(0);
});

// catch ctrl-c, so that event 'exit' always works
process.on('SIGINT', () => {
  process.emit('SIGTERM');
});
