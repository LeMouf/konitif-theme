import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { compile } from 'svelte/compiler';

const root = new URL('../', import.meta.url);
const sourceRoot = fileURLToPath(new URL('src/', root));

function collect(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? collect(path) : [path];
  });
}

test('all distributed Svelte components parse after TypeScript preprocessing', () => {
  const files = collect(sourceRoot).filter(path => extname(path) === '.svelte');
  assert.ok(files.length > 0);
  for (const path of files) {
    const source = readFileSync(path, 'utf8').replace(
      /<script\s+lang=["']ts["']>([\s\S]*?)<\/script>/g,
      (_match, script) => `<script>${ts.transpileModule(script, {
        compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
        fileName: path,
      }).outputText}</script>`,
    );
    assert.doesNotThrow(
      () => compile(source, { filename: path, generate: false }),
      relative(sourceRoot, path),
    );
  }
});
