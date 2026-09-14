import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('manifest exposes only the generic physical theme surface', () => {
  const manifest = JSON.parse(read('package.json'));
  assert.equal(manifest.name, '@konitif/theme');
  assert.equal(manifest.version, '0.284.3');
  assert.equal(manifest.dependencies['@konitif/workbench'], '0.284.2');
  assert.equal(manifest.dependencies.svelte, '4.2.20');
  assert.deepEqual(manifest.devDependencies, { typescript: '5.9.3' });
  assert.ok(manifest.files.includes('src/components'));
  assert.ok(manifest.files.includes('src/ambient'));
  assert.ok(!manifest.files.includes('src'));
  assert.ok(!manifest.files.some(path => /showcase|layout/i.test(path)));
  assert.match(manifest.scripts.prepublishOnly, /verified \.release\/package\.tgz/);
});

test('CI is standalone and direct publication remains guarded', () => {
  const config = JSON.parse(read('tsconfig.json'));
  assert.equal(config.extends, undefined);
  assert.equal(config.compilerOptions.paths, undefined);
  const workflow = read('.github/workflows/ci.yml');
  assert.match(workflow, /contents: read/);
  assert.match(workflow, /npm ci --ignore-scripts/);
  assert.doesNotMatch(workflow, /id-token|npm publish|secrets\./);
  assert.match(read('scripts/select-ci-runtime.sh'), /24\.20\.0/);
  assert.doesNotMatch(read('scripts/select-ci-runtime.sh'), /curl|wget|npx/);
});
