import chalk from 'chalk';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url), '..');
const msgPath = path.resolve(dirname, '../.git/COMMIT_EDITMSG');
const msg = readFileSync(msgPath, 'utf-8').trim();
const log = console.log;

const commitRE =
  /^(revert: )?(feat|fix|docs|dx|style|refactor|perf|test|workflow|build|ci|chore|types|wip|release)(\(.+\))?: .{1,50}/;

if (!commitRE.test(msg)) {
  log(
    `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(`invalid commit message format.`)}\n\n` +
      chalk.red(`  Proper commit message format is required for automated changelog generation. Examples:\n\n`) +
      `    ${chalk.green(`<type>(<scope>): <subject>`)}\n`,
  );
  process.exit(1);
}
