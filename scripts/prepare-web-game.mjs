import { createHash, randomUUID } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { mkdir, open, readFile, rename, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

async function digest(file) {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  return hash.digest('hex');
}

export async function assembleGameArchive(archiveDirectory, outputFile) {
  const manifest = JSON.parse(await readFile(join(archiveDirectory, 'manifest.json'), 'utf8'));
  if (!/^[a-f0-9]{64}$/.test(manifest.sha256) || !Number.isSafeInteger(manifest.bytes) || manifest.bytes <= 0 || !Array.isArray(manifest.parts) || !manifest.parts.length || manifest.parts.some(name => !/^game\.zip\.part\d{3}$/.test(name))) {
    throw new Error('Invalid web game archive manifest');
  }
  try {
    if (await digest(outputFile) === manifest.sha256) return;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  await mkdir(dirname(outputFile), { recursive: true });
  const temporary = `${outputFile}.${randomUUID()}.tmp`;
  const handle = await open(temporary, 'wx');
  const hash = createHash('sha256');
  let bytes = 0;
  try {
    for (const part of manifest.parts) {
      for await (const chunk of createReadStream(join(archiveDirectory, part))) {
        hash.update(chunk);
        bytes += chunk.length;
        await handle.writeFile(chunk);
      }
    }
    await handle.close();
    if (bytes !== manifest.bytes || hash.digest('hex') !== manifest.sha256) throw new Error('Web game archive integrity check failed');
    await rename(temporary, outputFile);
  } catch (error) {
    await handle.close().catch(() => {});
    await rm(temporary, { force: true });
    throw error;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  await assembleGameArchive(join(root, 'web-build/archive'), join(root, 'public/game/game.zip'));
  console.log('Web game archive verified.');
}
