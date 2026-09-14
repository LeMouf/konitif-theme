import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const temp = mkdtempSync(join(tmpdir(), 'konitif-theme-package-'));
const run = (command, args, cwd = root) => execFileSync(command, args, {
  cwd,
  encoding: 'utf8',
  env: { ...process.env, npm_config_offline: 'true', npm_config_cache: join(temp, 'cache') },
});
const packArgs = ['pack', '--offline', '--ignore-scripts', '--json', '--pack-destination', temp];
const npmCli = join(dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js');
if (process.platform === 'win32') assert.ok(existsSync(npmCli), 'Installed npm CLI required');
const [packed] = JSON.parse(process.platform === 'win32'
  ? run(process.execPath, [npmCli, ...packArgs])
  : run('npm', packArgs));
const paths = packed.files.map(file => file.path);
const allowed = /^(src\/(?:ambient|components|depth|focus|runtime)\/|src\/(?:index|konitifRuntimePhaseTokens|konitifTheme|konitifThemeAdapter|konitifWorkbenchThemeRuntime)\.ts$|src\/(?:konitifTokens|depth\/spatialDepthTokens)\.css$|reference\/|README\.md$|LICENSE\.md$|package\.json$)/;
for (const path of paths) assert.match(path, allowed, `Unexpected archive path: ${path}`);
for (const path of [
  'src/index.ts',
  'src/konitifTokens.css',
  'src/depth/spatialDepthTokens.css',
  'src/ambient/SpatialAmbientRuntime.svelte',
  'src/components/KonitifGlassSurface.svelte',
  'LICENSE.md',
  'reference/catalog.json',
]) assert.ok(paths.includes(path), path);
assert.ok(paths.every(path => !path.startsWith('src/showcase/') && !path.startsWith('src/layout/')));

const consumer = join(temp, 'consumer');
const packageRoot = join(consumer, 'node_modules/@konitif/theme');
mkdirSync(packageRoot, { recursive: true });
run('tar', ['-xzf', join(temp, packed.filename), '-C', packageRoot, '--strip-components=1']);
const manifest = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8'));
assert.equal(manifest.name, '@konitif/theme');
assert.equal(manifest.version, '0.284.2');
assert.deepEqual(manifest.dependencies, {
  '@konitif/workbench': '0.284.2',
  svelte: '4.2.20',
});
for (const target of [manifest.svelte, manifest.exports['.'].svelte, manifest.exports['./styles.css'], manifest.exports['./depth/styles.css']]) {
  assert.ok(existsSync(join(packageRoot, target)), `Missing exported target: ${target}`);
}
console.log(JSON.stringify({
  consumer: 'passed (manifest, entry points and physical boundary)',
  integrity: packed.integrity,
  files: paths.length,
  bytes: packed.size,
  evidence: temp,
}));
