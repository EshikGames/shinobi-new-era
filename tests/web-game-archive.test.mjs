import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { assembleGameArchive } from '../scripts/prepare-web-game.mjs';

test('web archive reconstructs exact bytes and rejects corruption without replacing the working file', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'sne-web-archive-'));
  try {
    const source = Buffer.from('test archive bytes\x00\xff', 'latin1');
    const parts = ['game.zip.part000', 'game.zip.part001'];
    await writeFile(join(directory, parts[0]), source.subarray(0, 8));
    await writeFile(join(directory, parts[1]), source.subarray(8));
    await writeFile(join(directory, 'manifest.json'), JSON.stringify({ bytes: source.length, sha256: createHash('sha256').update(source).digest('hex'), parts }));
    const output = join(directory, 'game.zip');
    await assembleGameArchive(directory, output);
    assert.deepEqual(await readFile(output), source);
    await writeFile(output, 'previous version');
    await writeFile(join(directory, parts[1]), 'corrupt');
    await assert.rejects(assembleGameArchive(directory, output), /integrity/);
    assert.equal(await readFile(output, 'utf8'), 'previous version');
    assert.equal((await readdir(directory)).some(name => name.endsWith('.tmp')), false);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
