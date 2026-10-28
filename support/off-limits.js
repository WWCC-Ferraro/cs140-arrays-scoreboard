// Used by the tests for Parts 4 and 5. You do not need to change this file,
// but you may read it.
//
// insertAt and removeAt rebuild what `splice` does, so the methods that
// would do the moving for you are off limits in them. This reads the
// function's own code, comments left out, and lists any of them it uses.

import fs from 'node:fs';

export const OFF_LIMITS = ['splice', 'unshift', 'shift', 'slice', 'concat'];

export function offLimitsIn(url, name) {
  const source = fs.readFileSync(url, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
  const start = source.indexOf(`function ${name}(`);
  if (start === -1) return [];
  const next = source.indexOf('export function', start + 1);
  const code = next === -1 ? source.slice(start) : source.slice(start, next);
  return OFF_LIMITS.filter(method => new RegExp(`\\.\\s*${method}\\s*\\(`).test(code));
}
