import {
  basename, join, resolve, dirname,
} from 'path';
import { mkdir, readFile, writeFile } from 'fs/promises';

const htmlPlugin = (options = {}) => {
  const { targets = [], replacements = {}, hook = 'buildEnd' } = options;

  const regex = new RegExp(`{{(${Object.keys(replacements).join('|')})}}`, 'g');

  return {
    name: 'htmlPlugin',
    load() {
      targets.forEach((target) => {
        this.addWatchFile(resolve(target.src));
      });
    },
    [hook]: () => {
      targets.forEach(async (target) => {
        const destDir = dirname(target.dest);
        const destPath = join(destDir, basename(target.src));

        try {
          await mkdir(destDir, { recursive: true });
        } catch (_) {
          console.error('Failed to do something');
        }

        const data = await readFile(target.src, 'utf8');

        // replacements
        const result = data.replace(regex, (match, key) => replacements[key] || match);

        const start = new Date();
        console.log(target.src, '→', target.dest, '...');

        await writeFile(destPath, result, {
          encoding: 'utf8',
          flag: 'w',
        });

        const diff = new Date() - start;
        console.log(`created ${target.dest} in ${diff}ms`);
      });
    },
  };
};

export default htmlPlugin;
