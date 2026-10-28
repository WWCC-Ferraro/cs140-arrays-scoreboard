// Used by the tests. You do not need to change this file, but you may read it.
//
// A loop that never stops would freeze the tests, and you would see nothing.
// So each test runs your function on its own, in a separate worker, and stops
// it after a second. If your loop never ends, the test says so instead.
//
// Some of the functions change the array they are given, and some must not.
// So the worker sends back two things: what the function returned, and the
// arrays it was given, as they are after the call.
//
// This file also writes the messages for three mistakes that every function
// here can make: a loop that never stops, a function that calls itself, and a
// path with no `return`.
//
// It lives in support/, not test/, and holds no tests of its own: the test
// files import it.

import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import { inspect } from 'node:util';
import assert from 'node:assert/strict';

const LIMIT_MS = 1000;

/** A value as it appears in a message. In strings, a space shows as ·. */
export function show(value) {
  if (typeof value === 'string') return `"${value.replaceAll(' ', '·')}"`;
  return inspect(value, { depth: 4, breakLength: Infinity });
}

export const LEGEND = '(In this message, · is a space.)';

const NEVER_STOPS = 'A loop stops when its condition becomes false: check that the condition uses ' +
  'something that changes on every iteration, in the right direction.';

/**
 * Call `name(...args)` from the file at `url`.
 * Returns { value, args }: what it returned, and the arguments as they are
 * after the call. If the call never finishes, throws, or gives undefined, the
 * test fails with a message that says why.
 *
 * `whenUndefined` explains which path had no return. `whenNeverStops`, if
 * given, replaces the general advice for a loop that never stops.
 */
export async function call(url, name, args, whenUndefined, whenNeverStops = NEVER_STOPS) {
  const shown = `${name}(${args.map(show).join(', ')})`;
  const result = await runInWorker(url, name, args);

  if (result.timedOut) {
    assert.fail(`${shown} did not finish within a second, so a loop in it never stops. ${whenNeverStops}`);
  }
  if (result.error?.name === 'RangeError' && result.error.message.includes('call stack')) {
    assert.fail(`${shown} stopped with RangeError: ${result.error.message}. That happens when a function ` +
      `calls itself: writing ${name}(...) inside ${name} starts the whole function again, which calls it ` +
      'again, and it never finishes. Build the answer with a loop and the values handed in. ' +
      'See "Writing a function\'s answer".');
  }
  if (result.error) {
    assert.fail(`${shown} stopped with an error — ${result.error.name}: ${result.error.message}`);
  }
  if (result.value === undefined) {
    assert.fail(`${shown} returned undefined, which means the function ended without a \`return\`. ` +
      `${whenUndefined} See "Writing a function's answer".`);
  }
  return result;
}

/** The same as `call`, for a test that needs only the returned value. */
export async function answer(url, name, args, whenUndefined, whenNeverStops) {
  return (await call(url, name, args, whenUndefined, whenNeverStops)).value;
}

function runInWorker(url, name, args) {
  return new Promise((resolve) => {
    const worker = new Worker(new URL(import.meta.url), { workerData: { url: String(url), name, args } });
    const timer = setTimeout(() => {
      worker.terminate();
      resolve({ timedOut: true });
    }, LIMIT_MS);
    worker.once('message', (result) => {
      clearTimeout(timer);
      worker.terminate();
      resolve(result);
    });
    worker.once('error', (e) => {
      clearTimeout(timer);
      resolve({ error: { name: e.name, message: e.message } });
    });
  });
}

/* Inside the worker: import the file, call the function, and post back the
   result together with the arguments, so that the test can see whether they
   changed, and whether the result is one of them. */
if (!isMainThread) {
  const { url, name, args } = workerData;
  try {
    const mod = await import(url);
    const value = mod[name](...args);
    parentPort.postMessage({ value, args });
  } catch (e) {
    parentPort.postMessage({ error: { name: e.name, message: e.message } });
  }
}
